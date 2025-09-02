package com.aksi.mapper;

import java.util.List;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.aksi.api.pricing.dto.Discount;
import com.aksi.api.pricing.dto.PriceModifier;
import com.aksi.domain.pricing.DiscountEntity;
import com.aksi.domain.pricing.PriceModifierEntity;

/** MapStruct mapper for Pricing domain */
@Mapper(componentModel = "spring")
public interface PricingMapper {

  // PriceModifier mappings

  PriceModifier toPriceModifier(PriceModifierEntity entity);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  @Mapping(target = "jexlFormula", ignore = true)
  @Mapping(target = "sortOrder", constant = "0")
  PriceModifierEntity toPriceModifierEntity(PriceModifier dto);

  @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  @Mapping(target = "jexlFormula", ignore = true)
  @Mapping(target = "sortOrder", ignore = true)
  void updatePriceModifierFromDto(PriceModifier dto, @MappingTarget PriceModifierEntity entity);

  List<PriceModifier> toPriceModifierList(List<PriceModifierEntity> entities);

  // Discount mappings

  Discount toDiscount(DiscountEntity entity);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  @Mapping(target = "sortOrder", constant = "0")
  DiscountEntity toDiscountEntity(Discount dto);

  @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  @Mapping(target = "sortOrder", ignore = true)
  void updateDiscountFromDto(Discount dto, @MappingTarget DiscountEntity entity);

  List<Discount> toDiscountList(List<DiscountEntity> entities);
}
