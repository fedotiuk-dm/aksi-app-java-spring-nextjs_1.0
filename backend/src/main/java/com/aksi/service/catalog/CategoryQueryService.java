package com.aksi.service.catalog;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.service.dto.ServiceCategoryType;
import com.aksi.repository.PriceListItemRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Query service for category read operations. All methods are read-only and optimized for queries.
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class CategoryQueryService {

  private final PriceListItemRepository priceListItemRepository;

  /**
   * Get all categories with statistics.
   *
   * @return List of category information
   */
  public List<CategoryManagementService.CategoryInfo> getAllCategories() {
    log.debug("Getting all categories with statistics");

    // Get all enum values
    List<ServiceCategoryType> allCategories = Arrays.asList(ServiceCategoryType.values());

    // Build category info list
    return allCategories.stream()
        .map(this::buildCategoryInfo)
        .filter(info -> info.totalItems() > 0) // Only show categories that have items
        .collect(Collectors.toList());
  }

  /**
   * Get count of items in category.
   *
   * @param categoryCode Category to count
   * @return Number of items
   */
  public long getItemCount(ServiceCategoryType categoryCode) {
    return priceListItemRepository.countByCategoryCode(categoryCode);
  }

  /**
   * Get count of active items in category.
   *
   * @param categoryCode Category to count
   * @return Number of active items
   */
  public long getActiveItemCount(ServiceCategoryType categoryCode) {
    return priceListItemRepository.countByCategoryCodeAndActiveTrue(categoryCode);
  }

  /**
   * Build category info for a specific category.
   *
   * @param category Category type
   * @return Category information
   */
  private CategoryManagementService.CategoryInfo buildCategoryInfo(ServiceCategoryType category) {
    long totalCount = getItemCount(category);
    long activeCount = getActiveItemCount(category);

    // Use category code as name - localization should be handled on frontend
    // This follows API-first approach without hardcoding translations in backend
    return new CategoryManagementService.CategoryInfo(
        category, category.getValue(), totalCount, activeCount, activeCount > 0);
  }
}
