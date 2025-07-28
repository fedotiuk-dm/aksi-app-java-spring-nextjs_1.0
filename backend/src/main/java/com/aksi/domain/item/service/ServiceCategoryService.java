package com.aksi.domain.item.service;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.item.dto.ServiceCategoryListResponse;
import com.aksi.api.item.dto.ServiceCategoryResponse;
import com.aksi.domain.item.entity.ServiceCategoryEntity;
import com.aksi.domain.item.exception.ServiceCategoryNotFoundException;
import com.aksi.domain.item.mapper.ServiceCategoryMapper;
import com.aksi.domain.item.repository.ServiceCategoryRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Service for managing service categories. */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ServiceCategoryService {

  private final ServiceCategoryRepository serviceCategoryRepository;
  private final ServiceCategoryMapper serviceCategoryMapper;

  /**
   * Get all service categories.
   *
   * @param includeInactive whether to include inactive categories
   * @return list of service categories
   */
  public ServiceCategoryListResponse getAllCategories(Boolean includeInactive) {
    log.debug("Getting all service categories, includeInactive: {}", includeInactive);

    List<ServiceCategoryEntity> categories;
    if (Boolean.TRUE.equals(includeInactive)) {
      categories = serviceCategoryRepository.findAll(Sort.by("displayOrder"));
    } else {
      categories = serviceCategoryRepository.findByActiveTrue(Sort.by("displayOrder"));
    }

    // Map entities to response using mapper
    ServiceCategoryListResponse response = serviceCategoryMapper.toListResponse(categories);

    log.debug("Found {} service categories", response.getTotal());
    return response;
  }

  /**
   * Get service category by code.
   *
   * @param code category code
   * @return service category
   */
  public ServiceCategoryResponse getCategoryByCode(String code) {
    log.debug("Getting service category by code: {}", code);

    ServiceCategoryEntity category =
        serviceCategoryRepository
            .findByCode(code)
            .orElseThrow(() -> new ServiceCategoryNotFoundException(code));

    ServiceCategoryResponse response = serviceCategoryMapper.toResponse(category);

    log.debug("Found service category: {}", category.getName());
    return response;
  }

  /**
   * Get service category entity by code. For internal use by other services.
   *
   * @param code category code
   * @return service category entity
   */
  public ServiceCategoryEntity getCategoryEntityByCode(String code) {
    return serviceCategoryRepository
        .findByCode(code)
        .orElseThrow(() -> new ServiceCategoryNotFoundException(code));
  }

  /**
   * Check if service category exists by code.
   *
   * @param code category code
   * @return true if exists
   */
  public boolean existsByCode(String code) {
    return serviceCategoryRepository.existsByCode(code);
  }
}
