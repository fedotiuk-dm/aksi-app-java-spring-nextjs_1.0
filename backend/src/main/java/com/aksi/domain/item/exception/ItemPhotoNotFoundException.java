package com.aksi.domain.item.exception;

import java.util.UUID;

/** Виняток коли фото предмета не знайдене Domain-specific RuntimeException для Item domain. */
public class ItemPhotoNotFoundException extends RuntimeException {

  public ItemPhotoNotFoundException(String message) {
    super(message);
  }

  public ItemPhotoNotFoundException(UUID id) {
    super("Фото предмета не знайдене з ID: " + id);
  }

  public ItemPhotoNotFoundException(String field, String value) {
    super("Фото предмета не знайдене з " + field + ": " + value);
  }

  public ItemPhotoNotFoundException(String message, Throwable cause) {
    super(message, cause);
  }

  // Static factory methods для різних сценаріїв

  public static ItemPhotoNotFoundException byItemIdAndType(UUID itemId, String type) {
    return new ItemPhotoNotFoundException(
        "Фото предмета не знайдене з itemId: " + itemId + " та типом: " + type);
  }

  public static ItemPhotoNotFoundException byFilename(String filename) {
    return new ItemPhotoNotFoundException("Фото предмета не знайдене з filename: " + filename);
  }
}
