package com.aksi.domain.item.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

import com.aksi.api.item.dto.ServiceCategory;
import com.aksi.api.item.dto.ServiceCategoryResponse;
import com.aksi.domain.item.entity.ServiceCategoryEntity;

/** Mapper for ServiceCategory entities and DTOs */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface ServiceCategoryMapper {

  @Mapping(target = "code", source = "code", qualifiedByName = "mapEntityEnumToApiEnum")
  ServiceCategoryResponse toResponse(ServiceCategoryEntity entity);

  List<ServiceCategoryResponse> toResponseList(List<ServiceCategoryEntity> entities);

  /** Map from String code to API enum */
  @Named("mapEntityEnumToApiEnum")
  default ServiceCategory mapEntityEnumToApiEnum(String code) {
    if (code == null) {
      return null;
    }
    try {
      return ServiceCategory.valueOf(code);
    } catch (IllegalArgumentException e) {
      return null;
    }
  }

  /** Map from API enum to String code */
  @Named("mapApiEnumToEntityEnum")
  default String mapApiEnumToEntityEnum(ServiceCategory apiEnum) {
    if (apiEnum == null) {
      return null;
    }
    return apiEnum.name();
  }
}
