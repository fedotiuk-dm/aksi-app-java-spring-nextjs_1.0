package com.aksi.repository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.cart.CartEntity;

/** Repository for Cart entity */
@Repository
public interface CartRepository
    extends JpaRepository<CartEntity, UUID>, JpaSpecificationExecutor<CartEntity> {

  /** Find active cart by customer ID */
  @Query(
      "SELECT c FROM CartEntity c WHERE c.customerEntity.id = :customerId AND c.expiresAt > :now")
  Optional<CartEntity> findActiveByCustomerId(
      @Param("customerId") UUID customerId, @Param("now") Instant now);

  /** Delete all expired carts */
  @Modifying
  @Query("DELETE FROM CartEntity c WHERE c.expiresAt < :now")
  int deleteExpiredCarts(@Param("now") Instant now);
}
