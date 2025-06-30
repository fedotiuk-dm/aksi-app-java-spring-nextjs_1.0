package com.aksi.domain.item.exception;

import java.util.UUID;

/** Exception що викидається коли фотографія предмета не знайдена. */
public class ItemPhotoNotFoundException extends RuntimeException {

  public ItemPhotoNotFoundException(String message) {
    super(message);
  }

  public ItemPhotoNotFoundException(UUID uuid) {
    super("Фотографія предмета з UUID " + uuid + " не знайдена");
  }

  public static ItemPhotoNotFoundException byFilePath(String filePath) {
    return new ItemPhotoNotFoundException("Фотографія з шляхом '" + filePath + "' не знайдена");
  }

  public static ItemPhotoNotFoundException byItemId(UUID itemId) {
    return new ItemPhotoNotFoundException(
        "Фотографії для предмета з ID " + itemId + " не знайдені");
  }

  public ItemPhotoNotFoundException(Long id) {
    super("Фотографія предмета з ID " + id + " не знайдена");
  }

  public ItemPhotoNotFoundException(String message, Throwable cause) {
    super(message, cause);
  }
}
