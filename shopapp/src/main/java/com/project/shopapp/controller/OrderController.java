package com.project.shopapp.controller;

import com.project.shopapp.dto.OrderResponseDTO;
import com.project.shopapp.dto.OrderStatusUpdateDTO;
import com.project.shopapp.dto.PlaceOrderRequestDTO;
import com.project.shopapp.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    static class StatusUpdateRequest {
        public String status;
        public String reason;
    }

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponseDTO> placeOrder(@RequestBody PlaceOrderRequestDTO request) {
        OrderResponseDTO newOrder = orderService.placeOrder(request);
        return ResponseEntity.ok(newOrder);
    }

    @GetMapping("/{userId}")
    @PreAuthorize("#userId == principal.id or hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponseDTO>> viewOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getOrdersByUser(userId));
    }

    @PutMapping("/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderResponseDTO> updateOrderStatus(@PathVariable Long orderId,
            @RequestBody OrderStatusUpdateDTO request) {
        return ResponseEntity.ok(orderService.updateStatus(orderId, request.getStatus(), request.getReason()));
    }

    @PostMapping("/{orderId}/resend-confirmation")
    public ResponseEntity<?> resendConfirmationEmail(@PathVariable Long orderId) {
        try {
            orderService.resendConfirmationEmail(orderId);
            return ResponseEntity.ok(Map.of("message", "Confirmation email has been resent successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponseDTO>> getAllOrders() {
        List<OrderResponseDTO> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/details/{orderId}")
    @PreAuthorize("hasRole('ADMIN') or @orderRepository.findById(#orderId).get().user.id == principal.id")
    public ResponseEntity<OrderResponseDTO> getOrderDetails(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrderDetailsById(orderId));
    }

    @DeleteMapping("/{orderId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteOrder(@PathVariable Long orderId) {
        orderService.deleteOrder(orderId);
        return ResponseEntity.ok(Map.of("message", "Order deleted successfully."));
    }
}