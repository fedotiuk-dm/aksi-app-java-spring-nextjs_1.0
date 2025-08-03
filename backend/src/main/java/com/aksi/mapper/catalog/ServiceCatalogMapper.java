package com.aksi.mapper.catalog;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.aksi.api.service.dto.CreateServiceInfoRequest;
import com.aksi.api.service.dto.ListServicesResponse;
import com.aksi.api.service.dto.ServiceInfo;
import com.aksi.api.service.dto.UpdateServiceInfoRequest;
import com.aksi.domain.catalog.ServiceCatalog;

/** MapStruct mapper for Service Catalog DTOs. */
@Mapper(componentModel = "spring")
public interface ServiceCatalogMapper {

  @Mapping(target = "categoryCode", expression = "java(service.getCategory().name())")
  @Mapping(target = "icon", ignore = true)
  @Mapping(target = "color", ignore = true)
  @Mapping(target = "nameUa", ignore = true)
  @Mapping(target = "allowedProcessingTimes", ignore = true) // Handled in service layer
  @Mapping(target = "requiresSpecialHandling", constant = "false")
  @Mapping(target = "tags", ignore = true)
  @Mapping(target = "category", ignore = true) // Handle in service
  ServiceInfo toServiceResponse(ServiceCatalog service);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "processingTimeDays", constant = "1")
  @Mapping(target = "expressTimeHours", ignore = true)
  @Mapping(target = "sortOrder", ignore = true)
  @Mapping(target = "serviceItems", ignore = true)
  @Mapping(target = "version", ignore = true)
  @Mapping(target = "expressAvailable", ignore = true)
  @Mapping(target = "active", ignore = true)
  @Mapping(target = "category", ignore = true) // Handle in service
  ServiceCatalog toEntity(CreateServiceInfoRequest request);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "code", ignore = true) // Code cannot be changed
  @Mapping(target = "processingTimeDays", ignore = true)
  @Mapping(target = "expressTimeHours", ignore = true)
  @Mapping(target = "sortOrder", ignore = true)
  @Mapping(target = "serviceItems", ignore = true)
  @Mapping(target = "version", ignore = true)
  @Mapping(target = "category", ignore = true)
  @Mapping(target = "expressAvailable", ignore = true)
  void updateEntityFromDto(UpdateServiceInfoRequest request, @MappingTarget ServiceCatalog service);

  List<ServiceInfo> toServiceList(List<ServiceCatalog> services);

  default ListServicesResponse toServiceListResponse(List<ServiceCatalog> services) {
    ListServicesResponse response = new ListServicesResponse();
    response.setServices(toServiceList(services));
    return response;
  }
}
