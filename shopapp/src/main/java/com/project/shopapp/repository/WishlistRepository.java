package com.project.shopapp.repository;

import com.project.shopapp.model.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<WishlistItem, Long> {
    List<WishlistItem> findByUserId(Long userId);

    void deleteByUserIdAndProductId(Long userId, Long productId);

    void deleteByProductId(Long productId);

    void deleteByUserId(Long userId);

    Optional<WishlistItem> findByUserIdAndProductId(Long userId, Long productId);
}