package com.project.shopapp.controller;

import com.project.shopapp.model.ContentBanner;
import com.project.shopapp.repository.ContentBannerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.project.shopapp.model.HomepageSection;
import com.project.shopapp.repository.HomepageSectionRepository;

import java.util.List;

@RestController
@RequestMapping("/api/content")
public class PublicContentController {

    @Autowired
    private ContentBannerRepository contentBannerRepository;

    @Autowired
    private HomepageSectionRepository homepageSectionRepository;

    @GetMapping("/banners")
    public ResponseEntity<List<ContentBanner>> getActiveBanners(@RequestParam String position) {
        return ResponseEntity.ok(contentBannerRepository.findByIsActiveTrueAndPosition(position));
    }

    @GetMapping("/homepage-sections")
    public ResponseEntity<List<HomepageSection>> getHomepageSections() {
        return ResponseEntity.ok(homepageSectionRepository.findAllByOrderBySectionOrderAsc());
    }
}