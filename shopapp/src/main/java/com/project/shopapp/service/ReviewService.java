package com.project.shopapp.service;

import com.project.shopapp.dto.ProductReviewAdminDTO;
import com.project.shopapp.dto.RatingSummaryDTO;
import com.project.shopapp.model.Product;
import com.project.shopapp.model.ProductReview;
import com.project.shopapp.repository.ProductReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ProductReviewRepository reviewRepository;

    @Autowired
    private ProductService productService;

    @Transactional
    public void deleteReview(Long reviewId) {
        // 1. Find the review and its parent product
        ProductReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + reviewId));

        Product product = review.getProduct();

        // 2. IMPORTANT: Remove the review from the product's collection in memory.
        // This keeps the Java object model consistent.
        if (product != null) {
            product.getReviews().remove(review);
        }

        // 3. Explicitly delete the review entity
        reviewRepository.delete(review);

        // 4. Flush the deletion to the database immediately
        reviewRepository.flush();

        // 5. Now, with a consistent state, update the rating
        if (product != null) {
            productService.updateAverageRating(product.getId());
        }
    }

    public List<ProductReviewAdminDTO> getAllReviewsForAdmin() {
        List<ProductReview> reviews = reviewRepository.findAll();
        return reviews.stream()
                .map(this::convertToAdminDto)
                .collect(Collectors.toList());
    }

    public RatingSummaryDTO getRatingSummary(Long productId) {
        Map<String, Object> summaryMap = reviewRepository.getRatingSummary(productId);
        return new RatingSummaryDTO(
                (Double) summaryMap.getOrDefault("averageRating", 0.0),
                (Long) summaryMap.getOrDefault("totalRatingCount", 0L),
                (Long) summaryMap.getOrDefault("totalReviewCount", 0L),
                (Long) summaryMap.getOrDefault("fiveStarCount", 0L),
                (Long) summaryMap.getOrDefault("fourStarCount", 0L),
                (Long) summaryMap.getOrDefault("threeStarCount", 0L),
                (Long) summaryMap.getOrDefault("twoStarCount", 0L),
                (Long) summaryMap.getOrDefault("oneStarCount", 0L));
    }

    public ProductReviewAdminDTO convertToAdminDto(ProductReview review) {
        return ProductReviewAdminDTO.builder()
                .id(review.getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .user(ProductReviewAdminDTO.UserInfo.builder()
                        .name(review.getUser().getName())
                        .build())
                .product(ProductReviewAdminDTO.ProductInfo.builder()
                        .name(review.getProduct().getName())
                        .build())
                .build();
    }
}
