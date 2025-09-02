package com.aksi.service.catalog;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.pricelist.dto.ServiceCategoryType;
import com.aksi.domain.catalog.PriceListItemEntity;
import com.aksi.repository.PriceListItemRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Command service for category write operations. Handles activation and deactivation of categories.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class CategoryCommandService {

  private final PriceListItemRepository priceListItemRepository;

  /**
   * Deactivate all items in a category.
   *
   * @param categoryCode Category to deactivate
   * @return Number of deactivated items
   */
  public int deactivateCategory(ServiceCategoryType categoryCode) {
    log.info("Deactivating all items in category: {}", categoryCode);

    List<PriceListItemEntity> itemsToDeactivate = getActiveItemsByCategory(categoryCode);

    updateItemsActiveStatus(itemsToDeactivate, false);

    log.info("Deactivated {} items in category: {}", itemsToDeactivate.size(), categoryCode);
    return itemsToDeactivate.size();
  }

  /**
   * Activate all items in a category.
   *
   * @param categoryCode Category to activate
   * @return Number of activated items
   */
  public int activateCategory(ServiceCategoryType categoryCode) {
    log.info("Activating all items in category: {}", categoryCode);

    List<PriceListItemEntity> itemsToActivate = getInactiveItemsByCategory(categoryCode);

    updateItemsActiveStatus(itemsToActivate, true);

    log.info("Activated {} items in category: {}", itemsToActivate.size(), categoryCode);
    return itemsToActivate.size();
  }

  /**
   * Get active items by category.
   *
   * @param categoryCode Category code
   * @return List of active items
   */
  private List<PriceListItemEntity> getActiveItemsByCategory(ServiceCategoryType categoryCode) {
    return priceListItemRepository.findByCategoryCode(categoryCode).stream()
        .filter(PriceListItemEntity::isActive)
        .collect(Collectors.toList());
  }

  /**
   * Get inactive items by category.
   *
   * @param categoryCode Category code
   * @return List of inactive items
   */
  private List<PriceListItemEntity> getInactiveItemsByCategory(ServiceCategoryType categoryCode) {
    return priceListItemRepository.findByCategoryCode(categoryCode).stream()
        .filter(item -> !item.isActive())
        .collect(Collectors.toList());
  }

  /**
   * Update active status for list of items.
   *
   * @param items Items to update
   * @param active New active status
   */
  private void updateItemsActiveStatus(List<PriceListItemEntity> items, boolean active) {
    items.forEach(item -> item.setActive(active));
    priceListItemRepository.saveAll(items);
  }
}
