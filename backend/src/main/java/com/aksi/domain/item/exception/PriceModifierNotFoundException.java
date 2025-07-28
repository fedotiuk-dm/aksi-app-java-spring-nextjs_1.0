package com.aksi.domain.item.exception;

import com.aksi.domain.item.constant.ItemConstants;

/** Exception thrown when price modifier is not found. */
public class PriceModifierNotFoundException extends RuntimeException {

  public PriceModifierNotFoundException(String code) {
    super(String.format(ItemConstants.ERROR_MODIFIER_NOT_FOUND, code));
  }
}
