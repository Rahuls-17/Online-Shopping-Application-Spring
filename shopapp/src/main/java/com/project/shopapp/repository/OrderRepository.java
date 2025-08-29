package com.project.shopapp.repository;

import com.project.shopapp.model.Order;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @Override
    @EntityGraph(attributePaths = { "user", "orderItems", "orderItems.product" })
    Optional<Order> findById(Long id);

    @EntityGraph(attributePaths = { "user", "orderItems", "orderItems.product" })
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    @EntityGraph(attributePaths = { "user" })
    List<Order> findAllByOrderByCreatedAtDesc();

    // FIX: Added a WHERE clause to exclude cancelled orders
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status <> 'CANCELLED'")
    Optional<Double> findTotalSales();

    // FIX: Added a WHERE clause to exclude cancelled orders
    @Query("SELECT COUNT(o) FROM Order o WHERE o.status <> 'CANCELLED'")
    Long countTotalOrders();
}