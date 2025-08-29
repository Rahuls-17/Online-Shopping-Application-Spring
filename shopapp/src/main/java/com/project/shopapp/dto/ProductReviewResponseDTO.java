package com.project.shopapp.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ProductReviewResponseDTO {
    private Long id;
    private UserResponseDTO user;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;
}