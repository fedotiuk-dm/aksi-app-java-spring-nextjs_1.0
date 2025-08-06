package com.aksi.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.aksi.api.pricing.dto.DiscountDto;
import com.aksi.api.pricing.dto.PriceModifierDto;
import com.aksi.domain.pricing.Discount;
import com.aksi.domain.pricing.PriceModifier;

/** MapStruct mapper for Pricing domain */
@Mapper(componentModel = "spring")
public interface PricingMapper {

  // PriceModifier mappings

  PriceModifierDto toPriceModifierDto(PriceModifier entity);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  @Mapping(target = "jexlFormula", ignore = true)
  @Mapping(target = "sortOrder", constant = "0")
  PriceModifier toPriceModifierEntity(PriceModifierDto dto);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  @Mapping(target = "jexlFormula", ignore = true)
  @Mapping(target = "sortOrder", ignore = true)
  void updatePriceModifierFromDto(PriceModifierDto dto, @MappingTarget PriceModifier entity);

  List<PriceModifierDto> toPriceModifierDtoList(List<PriceModifier> entities);

  // Discount mappings

  DiscountDto toDiscountDto(Discount entity);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  @Mapping(target = "sortOrder", constant = "0")
  Discount toDiscountEntity(DiscountDto dto);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  @Mapping(target = "sortOrder", ignore = true)
  void updateDiscountFromDto(DiscountDto dto, @MappingTarget Discount entity);

  List<DiscountDto> toDiscountDtoList(List<Discount> entities);
}
