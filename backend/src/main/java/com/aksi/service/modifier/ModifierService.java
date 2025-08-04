package com.aksi.service.modifier;

import com.aksi.domain.cart.CartItemModifier;

/**
 * Service for managing item modifiers
 */
public interface ModifierService {

  /**
   * Get modifier by code
   *
   * @param modifierCode Modifier code
   * @return Modifier entity or null if not found
   */
  CartItemModifier getModifierByCode(String modifierCode);

  /**
   * Check if modifier exists
   *
   * @param modifierCode Modifier code
   * @return true if exists
   */
  boolean modifierExists(String modifierCode);
}