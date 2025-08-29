package com.project.shopapp.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ProductReviewAdminDTO {
    private Long id;
    private UserInfo user;
    private ProductInfo product;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;

    @Data
    @Builder
    public static class UserInfo {
        private String name;
    }

    @Data
    @Builder
    public static class ProductInfo {
        private String name;
    }
}