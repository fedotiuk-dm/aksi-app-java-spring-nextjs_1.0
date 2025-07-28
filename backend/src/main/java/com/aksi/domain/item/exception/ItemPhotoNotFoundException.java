package com.aksi.domain.item.exception;

import java.util.UUID;

import com.aksi.domain.item.constant.ItemConstants;

/** Exception thrown when item photo is not found. */
public class ItemPhotoNotFoundException extends RuntimeException {

  public ItemPhotoNotFoundException(UUID id) {
    super(String.format(ItemConstants.ERROR_PHOTO_NOT_FOUND, id));
  }

  public ItemPhotoNotFoundException(String photoKey) {
    super(String.format("Item photo not found with key: %s", photoKey));
  }
}
