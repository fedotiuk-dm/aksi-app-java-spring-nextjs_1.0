package com.aksi.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

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
  @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  @Mapping(target = "cartEntity", ignore = true)
  @Mapping(target = "priceListItemEntity", ignore = true)
  @Mapping(target = "characteristics", ignore = true)
  @Mapping(target = "modifiers", ignore = true)
  void updateEntityFromRequest(UpdateCartItemRequest request, @MappingTarget CartItem entity);

  // Update characteristics separately
  @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
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
