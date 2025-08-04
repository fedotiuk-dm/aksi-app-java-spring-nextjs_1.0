package com.aksi.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.aksi.api.cart.dto.ItemCharacteristics;
import com.aksi.api.cart.dto.UpdateCartItemRequest;
import com.aksi.domain.cart.CartItem;
import com.aksi.domain.cart.CartItemCharacteristics;

/**
 * MapStruct mapper for CartItem related conversions
 */
@Mapper(componentModel = "spring")
public interface CartItemMapper {

  // ItemCharacteristics DTO to Entity
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  @Mapping(target = "cartItem", ignore = true)
  @Mapping(source = "fillerCondition", target = "fillerCondition")
  CartItemCharacteristics toEntity(ItemCharacteristics dto);

  // Update CartItem from request
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  @Mapping(target = "cart", ignore = true)
  @Mapping(target = "priceListItem", ignore = true)
  @Mapping(target = "characteristics", ignore = true)
  @Mapping(target = "modifiers", ignore = true)
  void updateEntityFromRequest(UpdateCartItemRequest request, @MappingTarget CartItem entity);

  // Map enum value
  default String mapFillerConditionEnum(ItemCharacteristics.FillerConditionEnum fillerCondition) {
    if (fillerCondition == null) {
      return null;
    }
    return fillerCondition.getValue();
  }
}