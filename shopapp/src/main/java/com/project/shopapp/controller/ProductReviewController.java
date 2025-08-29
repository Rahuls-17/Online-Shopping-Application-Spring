package com.project.shopapp.controller;

import com.project.shopapp.dto.ProductReviewAdminDTO;
import com.project.shopapp.dto.RatingSummaryDTO;
//import com.project.shopapp.model.Product;
import com.project.shopapp.model.ProductReview;
import com.project.shopapp.model.User;
import com.project.shopapp.repository.OrderItemRepository;
//import com.project.shopapp.repository.ProductRepository;
import com.project.shopapp.repository.ProductReviewRepository;
import com.project.shopapp.security.CustomUserDetails;
import com.project.shopapp.service.ProductService;
import com.project.shopapp.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ProductReviewController {

    @Autowired
    private ProductReviewRepository productReviewRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private ProductService productService;

    // @Autowired
    // private ProductRepository productRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ProductReviewAdminDTO>> getAllReviews() {
        List<ProductReviewAdminDTO> reviewDTOs = reviewService.getAllReviewsForAdmin();
        return ResponseEntity.ok(reviewDTOs);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> addReview(@RequestBody ProductReview review) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Long userId = userDetails.getId();
        Long productId = review.getProduct().getId();

        boolean hasPurchased = orderItemRepository.existsByOrder_UserIdAndProduct_Id(userId, productId);
        if (!hasPurchased) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "You can only review products you have purchased."));
        }

        User user = new User();
        user.setId(userId);
        review.setUser(user);

        ProductReview savedReview = productReviewRepository.save(review);
        productService.updateAverageRating(productId);

        return ResponseEntity.ok(savedReview);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductReview>> getReviewsForProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(productReviewRepository.findByProductId(productId));
    }

    @GetMapping("/can-review")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Boolean>> canUserReview(@RequestParam Long productId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Long userId = userDetails.getId();

        boolean hasPurchased = orderItemRepository.existsByOrder_UserIdAndProduct_Id(userId, productId);
        return ResponseEntity.ok(Map.of("canReview", hasPurchased));
    }

    @DeleteMapping("/{reviewId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok(Map.of("message", "Review deleted successfully."));
    }

    @GetMapping("/summary/{productId}")
    public ResponseEntity<RatingSummaryDTO> getRatingSummary(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getRatingSummary(productId));
    }
}
