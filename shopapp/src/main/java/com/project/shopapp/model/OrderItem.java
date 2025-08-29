package com.project.shopapp.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // THIS IS THE FINAL, CRITICAL FIX
    @ManyToOne(fetch = FetchType.LAZY) // Using LAZY fetch is also a good practice here
    @JoinColumn(name = "order_id", nullable = false) // ⬅️ ADD THIS ANNOTATION
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    private int quantity;

    private double price;
}