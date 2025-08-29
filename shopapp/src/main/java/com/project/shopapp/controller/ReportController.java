package com.project.shopapp.controller;

import com.project.shopapp.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/sales-summary")
    public ResponseEntity<?> getSalesSummary() {
        return ResponseEntity.ok(reportService.getSalesSummary());
    }

    @GetMapping("/popular-products")
    public ResponseEntity<?> getPopularProducts() {
        return ResponseEntity.ok(reportService.getPopularProducts());
    }

    @GetMapping("/recent-reviews")
    public ResponseEntity<?> getRecentReviews() {
        return ResponseEntity.ok(reportService.getRecentReviews());
    }
}