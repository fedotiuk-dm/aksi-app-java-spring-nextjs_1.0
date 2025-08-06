package com.aksi.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.aksi.api.pricing.dto.DiscountDto;
import com.aksi.api.pricing.dto.PriceModifierDto;
import com.aksi.domain.pricing.DiscountEntity;
import com.aksi.domain.pricing.PriceModifierEntity;

/** MapStruct mapper for Pricing domain */
@Mapper(componentModel = "spring")
public interface PricingMapper {

  // PriceModifier mappings

  PriceModifierDto toPriceModifierDto(PriceModifierEntity entity);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  @Mapping(target = "jexlFormula", ignore = true)
  @Mapping(target = "sortOrder", constant = "0")
  PriceModifierEntity toPriceModifierEntity(PriceModifierDto dto);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  @Mapping(target = "jexlFormula", ignore = true)
  @Mapping(target = "sortOrder", ignore = true)
  void updatePriceModifierFromDto(PriceModifierDto dto, @MappingTarget PriceModifierEntity entity);

  List<PriceModifierDto> toPriceModifierDtoList(List<PriceModifierEntity> entities);

  // Discount mappings

  DiscountDto toDiscountDto(DiscountEntity entity);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  @Mapping(target = "sortOrder", constant = "0")
  DiscountEntity toDiscountEntity(DiscountDto dto);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  @Mapping(target = "sortOrder", ignore = true)
  void updateDiscountFromDto(DiscountDto dto, @MappingTarget DiscountEntity entity);

  List<DiscountDto> toDiscountDtoList(List<DiscountEntity> entities);
}
