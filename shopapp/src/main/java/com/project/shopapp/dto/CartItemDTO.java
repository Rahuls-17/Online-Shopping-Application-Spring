package com.project.shopapp.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CartItemDTO {
    private Long id;
    private ProductResponseDTO product;
    private int quantity;
}