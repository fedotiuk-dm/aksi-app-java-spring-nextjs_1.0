package com.aksi.domain.item.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.data.domain.Page;

import com.aksi.api.item.dto.CreatePriceListItemRequest;
import com.aksi.api.item.dto.PageableInfo;
import com.aksi.api.item.dto.PriceListItemResponse;
import com.aksi.api.item.dto.PriceListPageResponse;
import com.aksi.api.item.dto.UpdatePriceListItemRequest;
import com.aksi.domain.item.entity.PriceListItemEntity;

/** MapStruct mapper для PriceListItem - Entity ↔ DTO конвертація */
@Mapper(componentModel = "spring")
public interface PriceListItemMapper {

  // DTO → Entity (для create)
  @Mapping(target = "uuid", ignore = true)
  PriceListItemEntity toEntity(CreatePriceListItemRequest request);

  // Entity → DTO (для response)
  @Mapping(source = "uuid", target = "id")
  @Mapping(target = "categoryInfo", ignore = true) // Буде заповнено в Service
  PriceListItemResponse toResponse(PriceListItemEntity entity);

  // List mappings
  List<PriceListItemResponse> toResponseList(List<PriceListItemEntity> entities);

  // Page mapping (це правильне місце для HTTP mapping логіки)
  @Mapping(source = "content", target = "content")
  @Mapping(source = ".", target = "pageable")
  PriceListPageResponse toPageResponse(Page<PriceListItemResponse> page);

  // Page → PageableInfo конвертація
  default PageableInfo mapPageableInfo(Page<?> page) {
    if (page == null) return null;

    var pageableInfo = new PageableInfo();
    pageableInfo.setPage(page.getNumber());
    pageableInfo.setSize(page.getSize());
    pageableInfo.setTotalElements(page.getTotalElements());
    pageableInfo.setTotalPages(page.getTotalPages());
    pageableInfo.setLast(page.isLast());
    pageableInfo.setFirst(page.isFirst());
    pageableInfo.setNumberOfElements(page.getNumberOfElements());
    return pageableInfo;
  }

  // Update entity з DTO
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  @Mapping(target = "uuid", ignore = true)
  @Mapping(target = "categoryId", ignore = true) // Категорію не змінюємо при оновленні
  @Mapping(target = "catalogNumber", ignore = true) // Каталоговий номер не змінюємо
  void updateEntityFromRequest(
      UpdatePriceListItemRequest request, @org.mapstruct.MappingTarget PriceListItemEntity entity);

  // DateTime конвертація
  default java.time.OffsetDateTime map(java.time.LocalDateTime localDateTime) {
    return localDateTime != null ? localDateTime.atOffset(java.time.ZoneOffset.UTC) : null;
  }

  default java.time.LocalDateTime map(java.time.OffsetDateTime offsetDateTime) {
    return offsetDateTime != null ? offsetDateTime.toLocalDateTime() : null;
  }
}
