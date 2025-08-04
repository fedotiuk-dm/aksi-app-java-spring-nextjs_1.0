package com.aksi.repository.cart;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.cart.CartItem;

/** Repository for CartItem entity */
@Repository
public interface CartItemRepository extends JpaRepository<CartItem, UUID> {

  /** Find all items by cart ID */
  @Query("SELECT ci FROM CartItem ci WHERE ci.cart.id = :cartId")
  List<CartItem> findByCartId(@Param("cartId") UUID cartId);

  /** Find cart item by cart ID and price list item ID */
  @Query(
      "SELECT ci FROM CartItem ci WHERE ci.cart.id = :cartId AND ci.priceListItem.id = :priceListItemId")
  Optional<CartItem> findByCartIdAndPriceListItemId(
      @Param("cartId") UUID cartId, @Param("priceListItemId") UUID priceListItemId);

  /** Count items in cart */
  @Query("SELECT COUNT(ci) FROM CartItem ci WHERE ci.cart.id = :cartId")
  long countByCartId(@Param("cartId") UUID cartId);

  /** Calculate total quantity in cart */
  @Query("SELECT SUM(ci.quantity) FROM CartItem ci WHERE ci.cart.id = :cartId")
  Long getTotalQuantityByCartId(@Param("cartId") UUID cartId);
}
