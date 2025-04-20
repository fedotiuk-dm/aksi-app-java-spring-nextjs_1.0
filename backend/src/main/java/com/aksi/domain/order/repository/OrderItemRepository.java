package com.aksi.domain.order.repository;

import com.aksi.domain.order.entity.Order;
import com.aksi.domain.order.entity.OrderItem;
import com.aksi.domain.pricing.entity.ServiceCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for the OrderItem entity.
 */
@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {
    
    /**
     * Find all items for a specific order.
     *
     * @param order The order
     * @return A list of order items
     */
    List<OrderItem> findByOrder(Order order);
    
    /**
     * Find all items for a specific order, ordered by ID.
     *
     * @param order The order
     * @return A list of order items ordered by ID
     */
    List<OrderItem> findByOrderOrderById(Order order);
    
    /**
     * Find all items of a specific service category in an order.
     *
     * @param order The order
     * @param serviceCategory The service category
     * @return A list of order items
     */
    List<OrderItem> findByOrderAndServiceCategory(Order order, ServiceCategory serviceCategory);
    
    /**
     * Count items by service category in a specific order.
     *
     * @param order The order
     * @param serviceCategory The service category
     * @return The count of items
     */
    long countByOrderAndServiceCategory(Order order, ServiceCategory serviceCategory);
    
    /**
     * Calculate the total price of all items in an order.
     *
     * @param orderId The order ID
     * @return The total price
     */
    @Query("SELECT SUM(oi.finalPrice) FROM OrderItem oi WHERE oi.order.id = :orderId")
    Double calculateTotalPrice(@Param("orderId") Long orderId);
    
    /**
     * Find items with no warranty.
     *
     * @param order The order
     * @return A list of order items with no warranty
     */
    List<OrderItem> findByOrderAndNoWarrantyIsTrue(Order order);
    
    /**
     * Find items that require manual cleaning.
     *
     * @param order The order
     * @return A list of order items requiring manual cleaning
     */
    List<OrderItem> findByOrderAndManualCleaningIsTrue(Order order);
    
    /**
     * Find items that are heavily soiled.
     *
     * @param order The order
     * @return A list of heavily soiled order items
     */
    List<OrderItem> findByOrderAndHeavilySoiledIsTrue(Order order);
}
