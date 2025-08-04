package com.aksi.service.catalog;

import java.util.List;

import com.aksi.api.service.dto.ServiceCategoryType;

/** Service for managing categories in the price list */
public interface CategoryManagementService {

  /**
   * Get all categories with their item counts
   *
   * @return List of category information
   */
  List<CategoryInfo> getAllCategories();

  /**
   * Get only active categories
   *
   * @return List of active category types
   */
  List<ServiceCategoryType> getActiveCategories();

  /**
   * Check if category exists (has at least one item)
   *
   * @param categoryCode Category to check
   * @return true if category exists
   */
  boolean categoryExists(ServiceCategoryType categoryCode);

  /**
   * Get count of items in category
   *
   * @param categoryCode Category to count
   * @return Number of items
   */
  long getItemCount(ServiceCategoryType categoryCode);

  /**
   * "Delete" category by deactivating all its items
   *
   * @param categoryCode Category to deactivate
   * @return Number of deactivated items
   */
  int deactivateCategory(ServiceCategoryType categoryCode);

  /**
   * Activate all items in category
   *
   * @param categoryCode Category to activate
   * @return Number of activated items
   */
  int activateCategory(ServiceCategoryType categoryCode);

  /** DTO for category information */
  record CategoryInfo(
      ServiceCategoryType code,
      String name,
      long totalItems,
      long activeItems,
      boolean hasActiveItems) {}
}
