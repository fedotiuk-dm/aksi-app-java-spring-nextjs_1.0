package com.aksi.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.aksi.api.pricing.dto.Discount;
import com.aksi.api.pricing.dto.PriceModifier;

/** MapStruct mapper for Pricing domain */
@Mapper(componentModel = "spring")
public interface PricingMapper {

  /**
   * Map PriceModifier entity to DTO
   *
   * @param modifier PriceModifier entity
   * @return PriceModifier DTO
   */
  @Mapping(target = "type", expression = "java(PriceModifier.TypeEnum.fromValue(modifier.getType().name()))")
  PriceModifier toPriceModifierDto(com.aksi.domain.pricing.PriceModifier modifier);

  /**
   * Map Discount entity to DTO
   *
   * @param discount Discount entity
   * @return Discount DTO
   */
  Discount toDiscountDto(com.aksi.domain.pricing.Discount discount);
}