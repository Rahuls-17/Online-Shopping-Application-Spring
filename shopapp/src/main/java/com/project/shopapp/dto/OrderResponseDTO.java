package com.project.shopapp.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponseDTO {
    private Long id;
    private UserResponseDTO user;
    private double totalAmount;
    private String status;
    private LocalDateTime createdAt;
    private List<OrderItemResponseDTO> items;
    private String address;
    private String cancellationReason;
    private boolean refunded;
}