package com.project.shopapp.repository;

import com.project.shopapp.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
        @Query("SELECT p FROM Product p WHERE " +
                        "(:keyword IS NULL OR p.name LIKE %:keyword% OR p.description LIKE %:keyword%) AND " +
                        "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
                        "(:brand IS NULL OR p.brand = :brand) AND " +
                        "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
                        "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
                        "(:minRating IS NULL OR p.rating >= :minRating)")
        List<Product> searchAndFilterProducts(
                        @Param("keyword") String keyword,
                        @Param("categoryId") Long categoryId,
                        @Param("brand") String brand,
                        @Param("minPrice") Double minPrice,
                        @Param("maxPrice") Double maxPrice,
                        @Param("minRating") Double minRating);

        @Query("SELECT new map(p.id as productId, p.name as productName, SUM(oi.quantity) as totalQuantitySold) " +
                        "FROM OrderItem oi JOIN oi.product p " +
                        "GROUP BY p.id, p.name ORDER BY totalQuantitySold DESC")
        List<Map<String, Object>> findPopularProducts();

        List<Product> findByCategoryId(Long categoryId);

        Optional<Product> findByName(String name);
}