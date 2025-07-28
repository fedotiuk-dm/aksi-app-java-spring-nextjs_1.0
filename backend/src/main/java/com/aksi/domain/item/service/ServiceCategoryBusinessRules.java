package com.aksi.domain.item.service;

import org.springframework.stereotype.Component;

import com.aksi.domain.item.entity.ServiceCategoryEntity;
import com.aksi.domain.item.exception.ServiceCategoryNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Business rules for service categories. */
@Slf4j
@Component
@RequiredArgsConstructor
public class ServiceCategoryBusinessRules {

  private final ServiceCategoryService serviceCategoryService;

  /**
   * Check if discount can be applied to this category. According to business rules, discounts are
   * not applicable to: - IRONING (Прасування) - LAUNDRY (Прання білизни) - DYEING (Фарбування
   * текстильних виробів)
   *
   * @param code category code
   * @return true if discount can be applied
   */
  public boolean isDiscountApplicable(String code) {
    if (code == null) {
      return false;
    }

    // Categories that don't allow discounts according to OrderWizard logic
    return !("IRONING".equals(code) || "LAUNDRY".equals(code) || "DYEING".equals(code));
  }

  /**
   * Get standard execution days for category from database. Uses the standardDays field stored in
   * the category entity.
   *
   * @param code category code
   * @return standard execution days
   */
  public int getStandardExecutionDays(String code) {
    if (code == null) {
      return 2; // default
    }

    // Check if category exists first using efficient exists check
    if (!serviceCategoryService.existsByCode(code)) {
      log.warn("Category not found for code: {}, returning default 2 days", code);
      return 2; // default if category not found
    }

    try {
      ServiceCategoryEntity category = serviceCategoryService.getCategoryEntityByCode(code);
      return category.getStandardDays() != null ? category.getStandardDays() : 2;
    } catch (ServiceCategoryNotFoundException e) {
      log.warn("Category not found for code: {}, returning default 2 days", code);
      return 2; // default if category not found
    }
  }

}
