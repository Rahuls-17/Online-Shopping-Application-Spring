package com.project.shopapp.controller;

import com.project.shopapp.model.ContentBanner;
import com.project.shopapp.repository.ContentBannerRepository;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/content")
public class AdminContentController {

    @Autowired
    private ContentBannerRepository contentBannerRepository;

    @PostMapping("/banners")
    public ResponseEntity<?> createBanner(@RequestBody ContentBanner banner) {
        Optional<ContentBanner> existingBanner = contentBannerRepository.findByTitle(banner.getTitle());
        if (existingBanner.isPresent()) {
            return ResponseEntity.badRequest().body("Banner with this title already exists.");
        }
        return ResponseEntity.ok(contentBannerRepository.save(banner));
    }

    @PutMapping("/banners/{id}")
    public ResponseEntity<ContentBanner> updateBanner(@PathVariable Long id, @RequestBody ContentBanner bannerDetails) {
        ContentBanner banner = contentBannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Banner not found"));
        banner.setTitle(bannerDetails.getTitle());
        banner.setImageUrl(bannerDetails.getImageUrl());
        banner.setLinkUrl(bannerDetails.getLinkUrl());
        banner.setActive(bannerDetails.isActive());
        banner.setPosition(bannerDetails.getPosition());
        return ResponseEntity.ok(contentBannerRepository.save(banner));
    }

    @GetMapping("/banners")
    public ResponseEntity<List<ContentBanner>> getAllBanners() {
        return ResponseEntity.ok(contentBannerRepository.findAll());
    }

    @DeleteMapping("/banners/{id}")
    public ResponseEntity<?> deleteBanner(@PathVariable Long id) {
        // First, check if the banner exists to provide a better error message
        if (!contentBannerRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Banner with ID " + id + " not found."));
        }
        contentBannerRepository.deleteById(id);
        // Return a consistent success message
        return ResponseEntity.ok(Map.of("message", "Banner deleted successfully."));
    }
}