package com.project.shopapp.controller;

import com.project.shopapp.model.ProductReview;
import com.project.shopapp.repository.ProductReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ProductReviewController {

    @Autowired
    private ProductReviewRepository productReviewRepository;

    @PostMapping
    public ResponseEntity<ProductReview> addReview(@RequestBody ProductReview review) {
        // In a real app, you would add more validation here
        return ResponseEntity.ok(productReviewRepository.save(review));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductReview>> getReviewsForProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(productReviewRepository.findByProductId(productId));
    }
}