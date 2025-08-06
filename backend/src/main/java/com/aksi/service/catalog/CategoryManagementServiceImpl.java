package com.aksi.service.catalog;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.service.dto.ServiceCategoryType;
import com.aksi.domain.catalog.PriceListItemEntity;
import com.aksi.repository.PriceListItemRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Implementation of CategoryManagementService */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class CategoryManagementServiceImpl implements CategoryManagementService {

  private final PriceListItemRepository priceListItemRepository;

  @Override
  @Transactional(readOnly = true)
  public List<CategoryInfo> getAllCategories() {
    log.debug("Getting all categories with statistics");

    // Get all enum values
    List<ServiceCategoryType> allCategories = Arrays.asList(ServiceCategoryType.values());

    // Build category info list with optimized queries
    return allCategories.stream()
        .map(
            category -> {
              long totalCount = priceListItemRepository.countByCategoryCode(category);
              long activeCount = priceListItemRepository.countByCategoryCodeAndActiveTrue(category);

              return new CategoryInfo(
                  category, getCategoryName(category), totalCount, activeCount, activeCount > 0);
            })
        .filter(info -> info.totalItems() > 0) // Only show categories that have items
        .collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public List<ServiceCategoryType> getActiveCategories() {
    return priceListItemRepository.findDistinctActiveCategories();
  }

  @Override
  @Transactional(readOnly = true)
  public boolean categoryExists(ServiceCategoryType categoryCode) {
    return priceListItemRepository.countByCategoryCode(categoryCode) > 0;
  }

  @Override
  @Transactional(readOnly = true)
  public long getItemCount(ServiceCategoryType categoryCode) {
    return priceListItemRepository.countByCategoryCode(categoryCode);
  }

  @Override
  public int deactivateCategory(ServiceCategoryType categoryCode) {
    log.info("Deactivating all items in category: {}", categoryCode);

    var items =
        priceListItemRepository.findByCategoryCode(categoryCode).stream()
            .filter(PriceListItemEntity::isActive)
            .toList();

    items.forEach(item -> item.setActive(false));
    priceListItemRepository.saveAll(items);

    log.info("Deactivated {} items in category: {}", items.size(), categoryCode);
    return items.size();
  }

  @Override
  public int activateCategory(ServiceCategoryType categoryCode) {
    log.info("Activating all items in category: {}", categoryCode);

    var items =
        priceListItemRepository.findByCategoryCode(categoryCode).stream()
            .filter(item -> !item.isActive())
            .toList();

    items.forEach(item -> item.setActive(true));
    priceListItemRepository.saveAll(items);

    log.info("Activated {} items in category: {}", items.size(), categoryCode);
    return items.size();
  }

  private String getCategoryName(ServiceCategoryType category) {
    return switch (category) {
      case CLOTHING -> "Одяг та текстиль";
      case LAUNDRY -> "Прання";
      case IRONING -> "Прасування";
      case LEATHER -> "Шкіряні вироби";
      case PADDING -> "Утеплені речі";
      case FUR -> "Хутряні вироби";
      case DYEING -> "Фарбування";
      case ADDITIONAL_SERVICES -> "Додаткові послуги";
    };
  }
}
