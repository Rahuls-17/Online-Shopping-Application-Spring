package com.project.shopapp.service;

import com.project.shopapp.repository.OrderRepository;
import com.project.shopapp.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.List;

@Service
public class ReportService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

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
}