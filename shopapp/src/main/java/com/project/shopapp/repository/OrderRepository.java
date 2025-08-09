package com.project.shopapp.repository;

import com.project.shopapp.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);

    @Query("SELECT SUM(o.totalAmount) FROM Order o")
    Optional<Double> findTotalSales();

    @Query("SELECT COUNT(o) FROM Order o")
    Long countTotalOrders();
}
