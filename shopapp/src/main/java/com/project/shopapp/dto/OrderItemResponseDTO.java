package com.project.shopapp.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderItemResponseDTO {
    private String productName;
    private int quantity;
    private double price;
}
