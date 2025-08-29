package com.project.shopapp.dto;

import lombok.Data;

@Data
public class OrderStatusUpdateDTO {
    private String status;
    private String reason;
}