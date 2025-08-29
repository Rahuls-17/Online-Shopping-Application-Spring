// src/main/java/com/project/shopapp/repository/OrderItemRepository.java
package com.project.shopapp.repository;

import com.project.shopapp.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrderId(Long orderId);

    void deleteByProductId(Long productId);

    boolean existsByOrder_UserIdAndProduct_Id(Long userId, Long productId);

    boolean existsByProductId(Long productId);

    // This method is ESSENTIAL for this solution to work.
    void deleteByOrderId(Long orderId);
}