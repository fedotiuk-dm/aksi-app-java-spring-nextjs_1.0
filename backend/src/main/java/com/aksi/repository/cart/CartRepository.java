package com.aksi.repository.cart;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.cart.Cart;
import com.aksi.domain.customer.Customer;

/** Repository for Cart entity */
@Repository
public interface CartRepository extends JpaRepository<Cart, UUID>, JpaSpecificationExecutor<Cart> {

  /** Find active (non-expired) cart by customer */
  @Query("SELECT c FROM Cart c WHERE c.customer = :customer AND c.expiresAt > :now")
  Optional<Cart> findActiveByCustomer(
      @Param("customer") Customer customer, @Param("now") Instant now);

  /** Find active cart by customer ID */
  @Query("SELECT c FROM Cart c WHERE c.customer.id = :customerId AND c.expiresAt > :now")
  Optional<Cart> findActiveByCustomerId(
      @Param("customerId") UUID customerId, @Param("now") Instant now);

  /** Delete all expired carts */
  @Modifying
  @Query("DELETE FROM Cart c WHERE c.expiresAt < :now")
  int deleteExpiredCarts(@Param("now") Instant now);

  /** Count expired carts */
  @Query("SELECT COUNT(c) FROM Cart c WHERE c.expiresAt < :now")
  long countExpiredCarts(@Param("now") Instant now);

  /** Find all active carts */
  @Query("SELECT c FROM Cart c WHERE c.expiresAt > :now")
  List<Cart> findAllActive(@Param("now") Instant now);
}
