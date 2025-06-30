package com.aksi.api.item;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import com.aksi.api.item.dto.CreateServiceCategoryRequest;
import com.aksi.api.item.dto.PriceListItemResponse;
import com.aksi.api.item.dto.ServiceCategoryResponse;
import com.aksi.api.item.dto.UpdateServiceCategoryRequest;
import com.aksi.domain.item.service.PriceListItemService;
import com.aksi.domain.item.service.ServiceCategoryService;

import lombok.RequiredArgsConstructor;

/**
 * HTTP контролер для управління категоріями послуг
 */
@Controller
@RequiredArgsConstructor
public class ServiceCategoriesApiController implements ServiceCategoriesApi {

    private final ServiceCategoryService serviceCategoryService;
    private final PriceListItemService priceListItemService;

    @Override
    public ResponseEntity<ServiceCategoryResponse> createServiceCategory(CreateServiceCategoryRequest request) {
        var response = serviceCategoryService.createServiceCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Override
    public ResponseEntity<Void> deleteServiceCategory(UUID id) {
        serviceCategoryService.deleteServiceCategory(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<List<PriceListItemResponse>> getCategoryItems(UUID id, Boolean active) {
        var response = priceListItemService.getPriceListItemsByCategory(id);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<List<ServiceCategoryResponse>> getServiceCategories(Boolean active, UUID parentId) {
        List<ServiceCategoryResponse> response;
        if (parentId != null) {
            response = serviceCategoryService.getChildCategories(parentId);
        } else if (Boolean.TRUE.equals(active)) {
            response = serviceCategoryService.getActiveServiceCategories();
        } else {
            response = serviceCategoryService.getServiceCategories(org.springframework.data.domain.Pageable.unpaged()).getContent();
        }
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<ServiceCategoryResponse> getServiceCategoryById(UUID id) {
        var response = serviceCategoryService.getServiceCategoryById(id);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<ServiceCategoryResponse> updateServiceCategory(UUID id, UpdateServiceCategoryRequest request) {
        var response = serviceCategoryService.updateServiceCategory(id, request);
        return ResponseEntity.ok(response);
    }
}
