package com.project.shopapp.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductImageDTO {
    private Long id;
    private String imageUrl;
}