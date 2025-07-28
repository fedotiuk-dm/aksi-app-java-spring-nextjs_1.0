package com.aksi.domain.item.mapper;

import java.math.BigDecimal;
import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

import com.aksi.api.item.dto.AppliedModifierResponse;
import com.aksi.api.item.dto.CalculationDetailsResponse;
import com.aksi.api.item.dto.ItemCalculationResponse;
import com.aksi.api.item.dto.ItemColor;
import com.aksi.api.item.dto.ModifierCalculation;
import com.aksi.api.item.dto.ModifierType;
import com.aksi.domain.item.entity.PriceListItemEntity;
import com.aksi.domain.item.entity.PriceModifierEntity;

/** Mapper for item calculation DTOs */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface ItemCalculationMapper {

  /** Create ItemCalculationResponse from entity and calculation data */
  @Mapping(target = "itemId", source = "itemId")
  @Mapping(target = "priceListItemId", source = "entity.id")
  @Mapping(target = "itemName", source = "entity.name")
  @Mapping(target = "categoryCode", source = "entity.category.code")
  @Mapping(target = "categoryName", source = "entity.category.name")
  @Mapping(target = "quantity", source = "quantity")
  @Mapping(target = "unitOfMeasure", source = "entity.unitOfMeasure")
  @Mapping(target = "color", source = "color")
  @Mapping(target = "basePrice", source = "basePrice")
  @Mapping(target = "colorPrice", source = "colorPrice")
  @Mapping(target = "finalPrice", source = "finalPrice")
  @Mapping(target = "appliedModifiers", source = "appliedModifiers")
  @Mapping(target = "calculationDetails", source = "calculationDetails")
  @Mapping(target = "warnings", ignore = true)
  ItemCalculationResponse toCalculationResponse(
      java.util.UUID itemId,
      PriceListItemEntity entity,
      BigDecimal quantity,
      ItemColor color,
      BigDecimal basePrice,
      BigDecimal colorPrice,
      BigDecimal finalPrice,
      List<AppliedModifierResponse> appliedModifiers,
      CalculationDetailsResponse calculationDetails);

  /** Create ModifierCalculation from modifier entity and calculated amount */
  @Mapping(target = "modifierCode", source = "entity.code")
  @Mapping(target = "modifierName", source = "entity.name")
  @Mapping(target = "type", source = "entity.type", qualifiedByName = "mapEnumToModifierType")
  @Mapping(target = "value", source = "entity.value")
  @Mapping(target = "calculatedAmount", source = "calculatedAmount")
  @Mapping(target = "priceAfterModifier", ignore = true)
  ModifierCalculation toModifierCalculation(
      PriceModifierEntity entity, BigDecimal calculatedAmount);

  /** Create AppliedModifierResponse from modifier entity and impact data */
  @Mapping(target = "code", source = "entity.code")
  @Mapping(target = "name", source = "entity.name")
  @Mapping(target = "type", source = "entity.type", qualifiedByName = "mapEnumToModifierType")
  @Mapping(target = "value", source = "entity.value")
  @Mapping(target = "impact", source = "impact")
  @Mapping(target = "priceAfter", source = "priceAfter")
  AppliedModifierResponse toAppliedModifier(
      PriceModifierEntity entity, BigDecimal impact, BigDecimal priceAfter);

  @Named("mapEnumToModifierType")
  default ModifierType mapEnumToModifierType(com.aksi.domain.item.enums.ModifierType type) {
    if (type == null) {
      return null;
    }
    return ModifierType.valueOf(type.name());
  }

  @Named("mapDomainColorToApiColor")
  default ItemColor mapDomainColorToApiColor(com.aksi.domain.item.enums.ItemColor domainColor) {
    if (domainColor == null) {
      return null;
    }
    return ItemColor.valueOf(domainColor.name());
  }
}
