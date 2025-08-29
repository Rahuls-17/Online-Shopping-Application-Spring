package com.project.shopapp.service;

import org.springframework.stereotype.Service;

@Service
public class MockPaymentService {

    public boolean processPayment(Long userId, double amount) {
        System.out.println("Processing payment for user " + userId + " of amount " + amount);
        System.out.println("Payment successful!");
        return true;
    }

    public boolean processRefund(Long userId, double amount) {
        System.out.println("Processing REFUND for user " + userId + " of amount " + amount);
        System.out.println("Refund processed successfully!");
        return true;
    }
}