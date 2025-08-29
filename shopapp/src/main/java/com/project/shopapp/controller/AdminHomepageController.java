package com.project.shopapp.controller;

import com.project.shopapp.model.HomepageSection;
import com.project.shopapp.service.HomepageSectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/homepage-sections")
@PreAuthorize("hasRole('ADMIN')")
public class AdminHomepageController {

    @Autowired
    private HomepageSectionService homepageSectionService;

    @PostMapping
    public ResponseEntity<HomepageSection> createSection(@RequestBody HomepageSection section) {
        return ResponseEntity.ok(homepageSectionService.createSection(section));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HomepageSection> updateSection(@PathVariable Long id,
            @RequestBody HomepageSection sectionDetails) {
        return ResponseEntity.ok(homepageSectionService.updateSection(id, sectionDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSection(@PathVariable Long id) {
        homepageSectionService.deleteSection(id);
        return ResponseEntity.ok(Map.of("message", "Section deleted successfully"));
    }
}