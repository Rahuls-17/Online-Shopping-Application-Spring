package com.project.shopapp.service;

import com.project.shopapp.repository.OrderRepository;
import com.project.shopapp.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.project.shopapp.dto.ProductReviewAdminDTO;
import com.project.shopapp.model.ProductReview;
import com.project.shopapp.repository.ProductReviewRepository;

import java.util.stream.Collectors;
import java.util.Map;
import java.util.List;

@Service
public class ReportService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductReviewRepository productReviewRepository;

    @Autowired
    private ReviewService reviewService;

    public Map<String, Object> getSalesSummary() {
        Double totalSales = orderRepository.findTotalSales().orElse(0.0);
        Long totalOrders = orderRepository.countTotalOrders();

        return Map.of(
                "totalSales", totalSales,
                "totalOrders", totalOrders);
    }

    public List<Map<String, Object>> getPopularProducts() {
        return productRepository.findPopularProducts();
    }

    public List<ProductReviewAdminDTO> getRecentReviews() {
        List<ProductReview> recentReviews = productReviewRepository.findTop5ByOrderByCreatedAtDesc();
        return recentReviews.stream()
                .map(reviewService::convertToAdminDto)
                .collect(Collectors.toList());
    }
}