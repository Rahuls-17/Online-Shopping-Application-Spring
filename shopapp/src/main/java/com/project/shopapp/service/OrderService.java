package com.project.shopapp.service;

import com.project.shopapp.dto.OrderItemResponseDTO;
import com.project.shopapp.dto.OrderResponseDTO;
import com.project.shopapp.dto.PlaceOrderRequestDTO;
import com.project.shopapp.dto.UserResponseDTO;
import com.project.shopapp.model.*;
import com.project.shopapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private MockPaymentService mockPaymentService;
    @Autowired
    private NotificationService notificationService;

    @Transactional
    public OrderResponseDTO placeOrder(PlaceOrderRequestDTO request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + request.getUserId()));

        List<CartItem> cartItems = cartRepository.findByUserId(request.getUserId());
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty. Cannot place order.");
        }

        for (CartItem item : cartItems) {
            Product product = productRepository.findByIdForUpdate(item.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProduct().getName()));

            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException("Not enough stock for product: " + product.getName());
            }
        }

        double totalAmount = cartItems.stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();

        boolean paymentSuccessful = mockPaymentService.processPayment(request.getUserId(), totalAmount);
        if (!paymentSuccessful) {
            throw new RuntimeException("Payment failed. Order not placed.");
        }

        Order order = new Order();
        order.setUser(user);
        order.setStatus("PROCESSING");
        order.setTotalAmount(totalAmount);
        order.setAddress(request.getAddress());
        Order savedOrder = orderRepository.save(order);

        List<OrderItem> orderItemsList = new ArrayList<>();
        for (CartItem item : cartItems) {
            Product product = item.getProduct();
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(product);
            orderItem.setQuantity(item.getQuantity());
            orderItem.setPrice(product.getPrice());
            orderItemRepository.save(orderItem);
            orderItemsList.add(orderItem);

            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);
        }

        savedOrder.setOrderItems(orderItemsList);
        notificationService.sendOrderConfirmation(savedOrder);
        cartRepository.deleteByUserId(user.getId());

        return convertToDto(savedOrder);
    }

    public List<OrderResponseDTO> getOrdersByUser(Long userId) {
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return orders.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public List<OrderResponseDTO> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream().map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponseDTO updateStatus(Long orderId, String newStatus, String reason) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));
        String oldStatus = order.getStatus();

        if ("DELIVERED".equalsIgnoreCase(oldStatus) || "CANCELLED".equalsIgnoreCase(oldStatus)) {
            throw new RuntimeException("Cannot change the status of an order that is already delivered or cancelled.");
        }

        if (!oldStatus.equalsIgnoreCase(newStatus)) {
            order.setStatus(newStatus);

            if ("CANCELLED".equalsIgnoreCase(newStatus)) {
                order.setCancellationReason(reason);
                for (OrderItem item : order.getOrderItems()) {
                    Product product = item.getProduct();
                    if (product != null) {
                        product.setStock(product.getStock() + item.getQuantity());
                        productRepository.save(product);
                    }
                }
                boolean refundSuccessful = mockPaymentService.processRefund(order.getUser().getId(),
                        order.getTotalAmount());

                if (refundSuccessful) {
                    order.setRefunded(true);
                }
            }

            Order updatedOrder = orderRepository.save(order);
            notificationService.sendOrderStatusUpdate(updatedOrder, oldStatus);
            return convertToDto(updatedOrder);
        }

        return convertToDto(order);
    }

    @Transactional(readOnly = true)
    public void resendConfirmationEmail(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));
        notificationService.sendOrderConfirmation(order);
    }

    private OrderResponseDTO convertToDto(Order order) {
        UserResponseDTO userDto = new UserResponseDTO();
        userDto.setId(order.getUser().getId());
        userDto.setName(order.getUser().getName());
        userDto.setEmail(order.getUser().getEmail());

        List<OrderItemResponseDTO> itemDtos = order.getOrderItems().stream()
                .map(item -> OrderItemResponseDTO.builder()
                        .productName(item.getProduct().getName())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .build())
                .collect(Collectors.toList());

        OrderResponseDTO orderDto = new OrderResponseDTO();
        orderDto.setId(order.getId());
        orderDto.setUser(userDto);
        orderDto.setTotalAmount(order.getTotalAmount());
        orderDto.setStatus(order.getStatus());
        orderDto.setAddress(order.getAddress());
        orderDto.setCreatedAt(order.getCreatedAt());
        orderDto.setCancellationReason(order.getCancellationReason());
        orderDto.setRefunded(order.isRefunded());
        orderDto.setItems(itemDtos);

        return orderDto;
    }

    public OrderResponseDTO getOrderDetailsById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));
        return convertToDto(order);
    }

    public boolean isOrderOwner(Long userId, Long orderId) {
        return orderRepository.findById(orderId)
                .map(order -> order.getUser().getId().equals(userId))
                .orElse(false);
    }

    @Transactional
    public void deleteOrder(Long orderId) {
        if (!orderRepository.existsById(orderId)) {
            throw new RuntimeException("Cannot find order with id: " + orderId);
        }
        orderItemRepository.deleteByOrderId(orderId);
        orderRepository.deleteById(orderId);
    }
}
