package com.aksi.service.catalog;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.service.dto.ServiceCategoryType;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Facade implementation of CategoryManagementService. Provides a unified API while delegating to
 * specialized Query and Command services.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class CategoryManagementServiceImpl implements CategoryManagementService {

  private final CategoryQueryService queryService;
  private final CategoryCommandService commandService;

  // Query methods - delegate to CategoryQueryService

  @Override
  @Transactional(readOnly = true)
  public List<CategoryInfo> getAllCategories() {
    return queryService.getAllCategories();
  }

  // Command methods - delegate to CategoryCommandService

  @Override
  public int deactivateCategory(ServiceCategoryType categoryCode) {
    return commandService.deactivateCategory(categoryCode);
  }

  @Override
  public int activateCategory(ServiceCategoryType categoryCode) {
    return commandService.activateCategory(categoryCode);
  }
}
