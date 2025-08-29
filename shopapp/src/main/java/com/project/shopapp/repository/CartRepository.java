package com.project.shopapp.repository;

import com.project.shopapp.model.CartItem;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<CartItem, Long> {
    @EntityGraph(attributePaths = { "product", "user" })
    List<CartItem> findByUserId(Long userId);

    @EntityGraph(attributePaths = { "product", "user" })
    Optional<CartItem> findByUserIdAndProductId(Long userId, Long productId);

    void deleteByUserIdAndProductId(Long userId, Long productId);

    void deleteByProductId(Long productId);

    void deleteByUserId(Long userId);
}