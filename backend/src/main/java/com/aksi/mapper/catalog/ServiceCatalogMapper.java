package com.aksi.mapper.catalog;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.aksi.api.service.dto.CreateServiceInfoRequest;
import com.aksi.api.service.dto.ListServicesResponse;
import com.aksi.api.service.dto.ProcessingTime;
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
  @Mapping(
      target = "allowedProcessingTimes",
      expression = "java(mapProcessingTimesToList(service.getProcessingTimeDays()))")
  @Mapping(target = "requiresSpecialHandling", constant = "false")
  @Mapping(target = "tags", ignore = true)
  ServiceInfo toServiceResponse(ServiceCatalog service);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "processingTimeDays", constant = "1")
  @Mapping(target = "expressTimeHours", ignore = true)
  @Mapping(target = "sortOrder", ignore = true)
  @Mapping(target = "serviceItems", ignore = true)
  ServiceCatalog toEntity(CreateServiceInfoRequest request);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "code", ignore = true) // Code cannot be changed
  @Mapping(target = "processingTimeDays", ignore = true)
  @Mapping(target = "expressTimeHours", ignore = true)
  @Mapping(target = "sortOrder", ignore = true)
  @Mapping(target = "serviceItems", ignore = true)
  void updateEntityFromDto(UpdateServiceInfoRequest request, @MappingTarget ServiceCatalog service);

  List<ServiceInfo> toServiceList(List<ServiceCatalog> services);

  default ListServicesResponse toServiceListResponse(List<ServiceCatalog> services) {
    ListServicesResponse response = new ListServicesResponse();
    response.setServices(toServiceList(services));
    return response;
  }

  default List<ProcessingTime> mapProcessingTimesToList(Integer processingTimeDays) {
    if (processingTimeDays == null) {
      return List.of(ProcessingTime.STANDARD_2_D);
    }
    return switch (processingTimeDays) {
      case 0 ->
          List.of(ProcessingTime.EXPRESS_1_H, ProcessingTime.EXPRESS_4_H, ProcessingTime.SAME_DAY);
      case 1 -> List.of(ProcessingTime.NEXT_DAY);
      case 2 -> List.of(ProcessingTime.STANDARD_2_D);
      case 3 -> List.of(ProcessingTime.STANDARD_3_D);
      default -> List.of(ProcessingTime.EXTENDED);
    };
  }
}
