package com.project.shopapp.repository;

import com.project.shopapp.model.ProductReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Map;

public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {

    List<ProductReview> findByProductId(Long productId);

    void deleteByProductId(Long productId);

    void deleteByUserId(Long userId);

    List<ProductReview> findTop5ByOrderByCreatedAtDesc();

    @Query("SELECT COALESCE(AVG(r.rating), 0.0) FROM ProductReview r WHERE r.product.id = :productId")
    Double calculateAverageRating(@Param("productId") Long productId);

    @Query("SELECT new map(" +
            "COALESCE(AVG(r.rating), 0.0) as averageRating, " +
            "COUNT(r.id) as totalRatingCount, " +
            "COALESCE(SUM(CASE WHEN r.comment IS NOT NULL AND r.comment != '' THEN 1 ELSE 0 END), 0L) as totalReviewCount, "
            +
            "COALESCE(SUM(CASE WHEN r.rating = 5 THEN 1 ELSE 0 END), 0L) as fiveStarCount, " +
            "COALESCE(SUM(CASE WHEN r.rating = 4 THEN 1 ELSE 0 END), 0L) as fourStarCount, " +
            "COALESCE(SUM(CASE WHEN r.rating = 3 THEN 1 ELSE 0 END), 0L) as threeStarCount, " +
            "COALESCE(SUM(CASE WHEN r.rating = 2 THEN 1 ELSE 0 END), 0L) as twoStarCount, " +
            "COALESCE(SUM(CASE WHEN r.rating = 1 THEN 1 ELSE 0 END), 0L) as oneStarCount) " +
            "FROM ProductReview r WHERE r.product.id = :productId")
    Map<String, Object> getRatingSummary(@Param("productId") Long productId);
}
