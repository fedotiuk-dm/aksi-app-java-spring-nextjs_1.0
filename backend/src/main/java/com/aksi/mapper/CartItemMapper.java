package com.aksi.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.aksi.api.cart.dto.ItemCharacteristics;
import com.aksi.api.cart.dto.UpdateCartItemRequest;
import com.aksi.domain.cart.CartItem;
import com.aksi.domain.cart.CartItemCharacteristicsEntity;

/** MapStruct mapper for CartItem related conversions */
@Mapper(componentModel = "spring")
public interface CartItemMapper {

  // ItemCharacteristics DTO to Entity
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  @Mapping(target = "cartItem", ignore = true)
  @Mapping(source = "fillerCondition", target = "fillerCondition")
  CartItemCharacteristicsEntity toEntity(ItemCharacteristics dto);

  // Update CartItem from request
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  @Mapping(target = "cartEntityEntity", ignore = true)
  @Mapping(target = "priceListItemEntityEntity", ignore = true)
  @Mapping(target = "characteristics", ignore = true)
  @Mapping(target = "modifiers", ignore = true)
  void updateEntityFromRequest(UpdateCartItemRequest request, @MappingTarget CartItem entity);

  // Update characteristics separately
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  @Mapping(target = "cartItem", ignore = true)
  void updateCharacteristicsFromRequest(
      ItemCharacteristics dto, @MappingTarget CartItemCharacteristicsEntity entity);

  // Map enum value
  default String mapFillerConditionEnum(ItemCharacteristics.FillerConditionEnum fillerCondition) {
    if (fillerCondition == null) {
      return null;
    }
    return fillerCondition.getValue();
  }
}
