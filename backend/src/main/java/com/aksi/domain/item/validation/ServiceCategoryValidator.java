package com.aksi.domain.item.validation;

import java.util.UUID;

import org.springframework.stereotype.Component;

import com.aksi.domain.item.entity.ServiceCategoryEntity;
import com.aksi.domain.item.exception.ItemValidationException;
import com.aksi.domain.item.repository.ServiceCategoryRepository;
import com.aksi.shared.validation.ValidationResult;

import lombok.RequiredArgsConstructor;

/**
 * Спрощений validator для категорій послуг з функціональним підходом. Замінює безкінечні if-и на
 * композиційні валідаційні правила.
 */
@Component
@RequiredArgsConstructor
public class ServiceCategoryValidator {

  private final ServiceCategoryRepository serviceCategoryRepository;

  /** Валідація для створення нової категорії. Функціональна композиція замість if-нагромаджень. */
  public void validateForCreate(ServiceCategoryEntity category) {
    var result =
        ItemValidationRules.uniqueCode(serviceCategoryRepository)
            .and(ItemValidationRules.validParentCategory(serviceCategoryRepository))
            .and(ItemValidationRules.categoryBusinessRules())
            .validate(category);

    throwIfInvalid(result);
  }

  /**
   * Валідація для оновлення існуючої категорії. Композиція правил включає перевірку циклічних
   * посилань.
   */
  public void validateForUpdate(ServiceCategoryEntity category) {
    var result =
        ItemValidationRules.uniqueCodeForUpdate(serviceCategoryRepository)
            .and(ItemValidationRules.validParentCategory(serviceCategoryRepository))
            .and(ItemValidationRules.categoryBusinessRules())
            .and(ItemValidationRules.noCircularReference(serviceCategoryRepository))
            .validate(category);

    throwIfInvalid(result);
  }

  /** Валідація для видалення категорії. Перевіряє чи немає дочірніх категорій. */
  public void validateForDelete(UUID categoryUuid) {
    var result =
        ItemValidationRules.categoryCanBeDeleted(serviceCategoryRepository).validate(categoryUuid);

    throwIfInvalid(result);
  }

  /** Конвертує ValidationResult в exception якщо валідація не пройшла. */
  private void throwIfInvalid(ValidationResult result) {
    if (!result.isValid()) {
      throw ItemValidationException.businessRuleViolation(
          "validation_failed", result.getErrorMessage());
    }
  }
}
