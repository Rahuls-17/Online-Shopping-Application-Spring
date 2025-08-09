package com.project.shopapp.service;

import com.project.shopapp.model.Order;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    public void sendOrderConfirmation(Order order) {
        String userEmail = order.getUser().getEmail();
        Long orderId = order.getId();
        double total = order.getTotalAmount();

        System.out.println("--- SIMULATING ORDER CONFIRMATION EMAIL ---");
        System.out.println("To: " + userEmail);
        System.out.println("Subject: Your Order #" + orderId + " has been placed!");
        System.out.println("Body: Thank you for your order. Your total amount is $" + total + ".");
        System.out.println("-------------------------------------------");
    }
}