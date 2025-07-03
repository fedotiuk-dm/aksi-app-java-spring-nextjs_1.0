package com.aksi.domain.item.validation;

import java.util.UUID;

import org.springframework.stereotype.Component;

import com.aksi.domain.item.entity.ItemPhotoEntity;
import com.aksi.domain.item.exception.ItemValidationException;
import com.aksi.domain.item.repository.ItemPhotoRepository;
import com.aksi.shared.validation.ValidationResult;

import lombok.RequiredArgsConstructor;

/**
 * Спрощений validator для фотографій предметів з функціональним підходом. Замінює безкінечні if-и
 * на композиційні валідаційні правила.
 */
@Component
@RequiredArgsConstructor
public class ItemPhotoValidator {

  private final ItemPhotoRepository itemPhotoRepository;

  /** Валідація для завантаження нового фото. Функціональна композиція замість if-нагромаджень. */
  public void validateForCreate(ItemPhotoEntity photo) {
    var result =
        ItemValidationRules.validFileSize()
            .and(ItemValidationRules.validImageFormat())
            .and(ItemValidationRules.uniquePrimaryPhoto(itemPhotoRepository))
            .and(ItemValidationRules.maxPhotosPerItem(itemPhotoRepository))
            .validate(photo);

    throwIfInvalid(result);
  }

  /** Валідація для оновлення існуючого фото. Композиція правил з перевіркою метаданих. */
  public void validateForUpdate(ItemPhotoEntity photo) {
    var result =
        ItemValidationRules.validFileSize()
            .and(ItemValidationRules.validImageFormat())
            .and(ItemValidationRules.uniquePrimaryPhoto(itemPhotoRepository))
            .validate(photo);

    throwIfInvalid(result);
  }

  /** Валідація для видалення фото. Перевіряє чи не останнє фото для предмета. */
  public void validateForDelete(UUID photoUuid) {
    var photo =
        itemPhotoRepository
            .findById(photoUuid)
            .orElseThrow(
                () ->
                    ItemValidationException.businessRuleViolation(
                        "photo_not_found", "Фото з UUID " + photoUuid + " не знайдено"));

    // Простий підрахунок фото для предмета
    var remainingPhotos = itemPhotoRepository.findByItemId(photo.getItemId()).size();
    if (remainingPhotos <= 1) {
      throw ItemValidationException.businessRuleViolation(
          "cannot_delete_last_photo", "Неможливо видалити останнє фото предмета");
    }
  }

  /** Конвертує ValidationResult в exception якщо валідація не пройшла. */
  private void throwIfInvalid(ValidationResult result) {
    if (!result.isValid()) {
      throw ItemValidationException.businessRuleViolation(
          "validation_failed", result.getErrorMessage());
    }
  }
}
