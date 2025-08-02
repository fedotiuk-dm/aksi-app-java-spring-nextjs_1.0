package com.aksi.mapper.service;

import java.util.List;

import org.mapstruct.Mapper;

import com.aksi.domain.service.PriceListItem;
import com.aksi.dto.service.PriceListItemDTO;

/** Mapper for PriceListItem entity and DTO */
@Mapper(componentModel = "spring")
public interface PriceListItemMapper {

  PriceListItemDTO toDto(PriceListItem entity);

  PriceListItem toEntity(PriceListItemDTO dto);

  List<PriceListItemDTO> toDtoList(List<PriceListItem> entities);

  List<PriceListItem> toEntityList(List<PriceListItemDTO> dtos);
}
