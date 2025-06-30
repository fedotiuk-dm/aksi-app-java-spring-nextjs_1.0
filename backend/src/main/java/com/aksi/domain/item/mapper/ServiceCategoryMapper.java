package com.aksi.domain.item.mapper;

import java.util.List;
import java.util.UUID;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import com.aksi.api.item.dto.CreateServiceCategoryRequest;
import com.aksi.api.item.dto.ServiceCategoryResponse;
import com.aksi.api.item.dto.UpdateServiceCategoryRequest;
import com.aksi.domain.item.entity.ServiceCategoryEntity;

/** MapStruct mapper для ServiceCategory - Entity ↔ DTO конвертація. */
@Mapper(componentModel = "spring")
public interface ServiceCategoryMapper {

  // DTO → Entity (для create)
  @Mapping(target = "uuid", ignore = true)
  @Mapping(target = "items", ignore = true)
  @Mapping(target = "availableMaterials", ignore = true)
  @Mapping(target = "availableModifiers", ignore = true)
  ServiceCategoryEntity toEntity(CreateServiceCategoryRequest request);

  // Entity → DTO (для response)
  @Mapping(source = "uuid", target = "id")
  @Mapping(source = "items", target = "itemsCount", qualifiedByName = "itemsToCount")
  ServiceCategoryResponse toResponse(ServiceCategoryEntity entity);

  // List mappings
  List<ServiceCategoryResponse> toResponseList(List<ServiceCategoryEntity> entities);

  // Update entity з DTO
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  @Mapping(target = "uuid", ignore = true)
  @Mapping(target = "code", ignore = true) // Код не змінюється при оновленні
  @Mapping(target = "items", ignore = true)
  @Mapping(target = "availableMaterials", ignore = true)
  @Mapping(target = "availableModifiers", ignore = true)
  @Mapping(target = "parentId", ignore = true)
  void updateEntityFromRequest(
      UpdateServiceCategoryRequest request,
      @org.mapstruct.MappingTarget ServiceCategoryEntity entity);

  // Helper methods
  @Named("itemsToCount")
  default Integer itemsToCount(List<?> items) {
    return items != null ? items.size() : 0;
  }

  // UUID → Long conversion (для внутрішньої логіки якщо потрібно)
  default Long uuidToLong(UUID uuid) {
    return uuid != null ? uuid.getMostSignificantBits() : null;
  }

  default UUID longToUuid(Long id) {
    return id != null ? new UUID(id, 0L) : null;
  }
}
