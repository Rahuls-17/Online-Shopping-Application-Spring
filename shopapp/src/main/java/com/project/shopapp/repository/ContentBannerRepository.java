package com.project.shopapp.repository;

import com.project.shopapp.model.ContentBanner;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ContentBannerRepository extends JpaRepository<ContentBanner, Long> {
    List<ContentBanner> findByIsActiveTrueAndPosition(String position);

    Optional<ContentBanner> findByTitle(String title);
}