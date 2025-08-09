package com.project.shopapp.dto;

import com.project.shopapp.model.User;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class OrderResponseDTO {
    private Long id;
    private UserResponseDTO user;
    private double totalAmount;
    private String status;
    private LocalDateTime createdAt;
}