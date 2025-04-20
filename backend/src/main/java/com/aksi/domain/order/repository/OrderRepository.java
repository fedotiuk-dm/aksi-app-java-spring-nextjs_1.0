package com.aksi.domain.order.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.client.entity.Client;
import com.aksi.domain.order.entity.Order;
import com.aksi.domain.order.entity.OrderStatus;

/**
 * Repository for the Order entity.
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    
    /**
     * Find an order by its receipt number.
     *
     * @param receiptNumber The receipt number
     * @return An optional containing the order if found
     */
    Optional<Order> findByReceiptNumber(String receiptNumber);
    
    /**
     * Find an order by its unique tag.
     *
     * @param uniqueTag The unique tag
     * @return An optional containing the order if found
     */
    Optional<Order> findByUniqueTag(String uniqueTag);
    
    /**
     * Find all orders for a client.
     *
     * @param client The client
     * @param pageable Pagination information
     * @return A page of orders
     */
    Page<Order> findByClient(Client client, Pageable pageable);
    
    /**
     * Find all orders with a specific status.
     *
     * @param status The status
     * @param pageable Pagination information
     * @return A page of orders
     */
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);
    
    /**
     * Find all orders expected to be completed on a specific date.
     *
     * @param date The expected completion date
     * @param pageable Pagination information
     * @return A page of orders
     */
    Page<Order> findByExpectedCompletionDate(LocalDate date, Pageable pageable);
    
    /**
     * Find orders created between two dates.
     *
     * @param startDate The start date and time
     * @param endDate The end date and time
     * @param pageable Pagination information
     * @return A page of orders
     */
    Page<Order> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
    
    /**
     * Search for orders by client name or receipt number.
     *
     * @param searchTerm The search term
     * @param pageable Pagination information
     * @return A page of orders
     */
    @Query("SELECT o FROM Order o WHERE " +
           "LOWER(o.client.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(o.client.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(o.receiptNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Order> searchByClientNameOrReceiptNumber(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    /**
     * Find orders by client and status.
     *
     * @param client The client
     * @param status The status
     * @param pageable Pagination information
     * @return A page of orders
     */
    Page<Order> findByClientAndStatus(Client client, OrderStatus status, Pageable pageable);
    
    /**
     * Generate the next receipt number based on the current date and sequence.
     * This query returns the highest receipt number for the current year and month.
     *
     * @param yearMonth The year and month prefix (format: YYYYMM)
     * @return The current highest receipt number with the given prefix, or null if none exists
     */
    @Query("SELECT o.receiptNumber FROM Order o WHERE o.receiptNumber LIKE :yearMonth% ORDER BY o.receiptNumber DESC")
    List<String> findHighestReceiptNumberForYearMonth(@Param("yearMonth") String yearMonth);
}
