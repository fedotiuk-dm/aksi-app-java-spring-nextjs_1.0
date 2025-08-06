package com.aksi.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.aksi.domain.order.OrderEntity;

/** Repository interface for Order entity using Spring Data and Specifications */
@Repository
public interface OrderRepository
    extends JpaRepository<OrderEntity, UUID>, JpaSpecificationExecutor<OrderEntity> {

  // Spring Data auto-generated finder methods

  /** Find order by order number */
  Optional<OrderEntity> findByOrderNumber(String orderNumber);

  /** Find orders by customer ID */
  Page<OrderEntity> findByCustomerEntityIdOrderByCreatedAtDesc(UUID customerId, Pageable pageable);

  /** Check if order number exists */
  boolean existsByOrderNumber(String orderNumber);

  // All complex queries are now handled through OrderSpecification
  // Use: orderRepository.findAll(OrderSpecification.method(), pageable)
}
