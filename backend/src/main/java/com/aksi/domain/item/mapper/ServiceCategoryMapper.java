package com.aksi.domain.item.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.aksi.api.item.dto.ServiceCategory;
import com.aksi.api.item.dto.ServiceCategoryListResponse;
import com.aksi.api.item.dto.ServiceCategoryResponse;
import com.aksi.domain.item.entity.ServiceCategoryEntity;

/** Mapper for ServiceCategory entities and DTOs */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface ServiceCategoryMapper {

  // Map entity to DTO for list responses
  ServiceCategory toDto(ServiceCategoryEntity entity);

  List<ServiceCategory> toDtoList(List<ServiceCategoryEntity> entities);

  // Create single category response
  default ServiceCategoryResponse toResponse(ServiceCategoryEntity entity) {
    ServiceCategoryResponse response = new ServiceCategoryResponse();
    response.setCategory(toDto(entity));
    return response;
  }

  // Create list response from entities
  default ServiceCategoryListResponse toListResponse(List<ServiceCategoryEntity> entities) {
    List<ServiceCategory> categories = toDtoList(entities);
    ServiceCategoryListResponse response = new ServiceCategoryListResponse();
    response.setCategories(categories);
    response.setTotal(categories.size());
    return response;
  }
}
