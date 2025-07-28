package com.aksi.api.item.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.item.ServiceCategoriesApi;
import com.aksi.api.item.dto.ServiceCategoryListResponse;
import com.aksi.api.item.dto.ServiceCategoryResponse;
import com.aksi.domain.item.service.ServiceCategoryService;

import lombok.RequiredArgsConstructor;

/** Controller for service categories endpoints. */
@RestController
@RequiredArgsConstructor
public class ServiceCategoriesController implements ServiceCategoriesApi {

  private final ServiceCategoryService serviceCategoryService;

  @Override
  public ResponseEntity<ServiceCategoryListResponse> getServiceCategories(Boolean includeInactive) {
    ServiceCategoryListResponse response = serviceCategoryService.getAllCategories(includeInactive);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<ServiceCategoryResponse> getServiceCategory(String code) {
    ServiceCategoryResponse response = serviceCategoryService.getCategoryByCode(code);
    return ResponseEntity.ok(response);
  }
}
