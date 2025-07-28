package com.aksi.domain.item.exception;

import com.aksi.domain.item.constant.ItemConstants;

/** Exception thrown when service category is not found. */
public class ServiceCategoryNotFoundException extends RuntimeException {

  public ServiceCategoryNotFoundException(String code) {
    super(String.format(ItemConstants.ERROR_CATEGORY_NOT_FOUND, code));
  }
}
