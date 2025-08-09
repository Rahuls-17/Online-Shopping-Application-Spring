package com.project.shopapp.controller;

import com.project.shopapp.model.ContentBanner;
import com.project.shopapp.repository.ContentBannerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/content")
@CrossOrigin(origins = "*")
public class PublicContentController {

    @Autowired
    private ContentBannerRepository contentBannerRepository;

    @GetMapping("/banners")
    public ResponseEntity<List<ContentBanner>> getActiveBanners(@RequestParam String position) {
        return ResponseEntity.ok(contentBannerRepository.findByIsActiveTrueAndPosition(position));
    }
}