package com.project.shopapp.dto;

// import com.project.shopapp.dto.CategoryDTO;
// import com.project.shopapp.dto.ProductImageDTO;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class ProductResponseDTO {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Double originalPrice;
    private String imageUrl;
    private Integer stock;
    private String brand;
    private Double rating;
    private String specifications;
    private CategoryDTO category;
    private List<ProductImageDTO> images;
    private List<ProductReviewResponseDTO> reviews;
}