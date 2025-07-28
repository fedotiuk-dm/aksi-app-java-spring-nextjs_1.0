package com.aksi.domain.item.exception;

import java.util.UUID;

import com.aksi.domain.item.constant.ItemConstants;

/** Exception thrown when price list item is not found. */
public class PriceListItemNotFoundException extends RuntimeException {

  public PriceListItemNotFoundException(UUID id) {
    super(String.format(ItemConstants.ERROR_PRICE_LIST_ITEM_NOT_FOUND, id));
  }
}
