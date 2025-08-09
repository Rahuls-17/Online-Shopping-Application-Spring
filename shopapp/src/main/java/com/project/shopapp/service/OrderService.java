package com.project.shopapp.service;

import com.project.shopapp.dto.OrderResponseDTO;
import com.project.shopapp.dto.UserResponseDTO;
import com.project.shopapp.model.*;
import com.project.shopapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    public String placeOrder(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        List<CartItem> cartItems = cartRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty. Cannot place order.");
        }

        double totalAmount = 0.0;
        for (CartItem item : cartItems) {
            Product product = item.getProduct();
            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException("Not enough stock for product: " + product.getName());
            }
            totalAmount += product.getPrice() * item.getQuantity();
        }

        boolean paymentSuccessful = mockPaymentService.processPayment(userId, totalAmount);
        if (!paymentSuccessful) {
            throw new RuntimeException("Payment failed. Order not placed.");
        }

        Order order = new Order();
        order.setUser(user);
        order.setStatus("PROCESSING");
        order.setTotalAmount(totalAmount);
        Order savedOrder = orderRepository.save(order);

        for (CartItem item : cartItems) {
            Product product = item.getProduct();
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(product);
            orderItem.setQuantity(item.getQuantity());
            orderItem.setPrice(product.getPrice());
            orderItemRepository.save(orderItem);

            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);
        }

        cartRepository.deleteAll(cartItems);
        notificationService.sendOrderConfirmation(savedOrder);

        return "Order placed successfully with ID: " + savedOrder.getId();
    }

    public List<OrderResponseDTO> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponseDTO updateStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));
        order.setStatus(status);
        Order updatedOrder = orderRepository.save(order);
        return convertToDto(updatedOrder);
    }

    private OrderResponseDTO convertToDto(Order order) {
        UserResponseDTO userDto = new UserResponseDTO();
        userDto.setId(order.getUser().getId());
        userDto.setName(order.getUser().getName());
        userDto.setEmail(order.getUser().getEmail());

        OrderResponseDTO orderDto = new OrderResponseDTO();
        orderDto.setId(order.getId());
        orderDto.setUser(userDto);
        orderDto.setTotalAmount(order.getTotalAmount());
        orderDto.setStatus(order.getStatus());
        orderDto.setCreatedAt(order.getCreatedAt());

        return orderDto;
    }
}