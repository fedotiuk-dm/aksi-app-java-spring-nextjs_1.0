package com.aksi.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.aksi.api.cart.dto.ItemCharacteristics;
import com.aksi.api.cart.dto.UpdateCartItemRequest;
import com.aksi.api.pricing.dto.PricingItemCharacteristics;
import com.aksi.domain.cart.CartItem;
import com.aksi.domain.cart.CartItemCharacteristicsEntity;

/** MapStruct mapper for CartItem related conversions */
@Mapper(componentModel = "spring")
public interface CartItemMapper {

  // PricingItemCharacteristics DTO to Entity
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  @Mapping(target = "cartItem", ignore = true)
  @Mapping(source = "material", target = "material")
  CartItemCharacteristicsEntity toEntity(PricingItemCharacteristics dto);

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
      PricingItemCharacteristics dto, @MappingTarget CartItemCharacteristicsEntity entity);

  // Convert cart ItemCharacteristics to pricing PricingItemCharacteristics
  @Mapping(target = "material", source = "material")
  @Mapping(target = "color", source = "color")
  @Mapping(target = "filler", source = "filler")
  @Mapping(target = "fillerCondition", source = "fillerCondition")
  @Mapping(target = "wearLevel", source = "wearLevel")
  PricingItemCharacteristics toPricingCharacteristics(ItemCharacteristics cartCharacteristics);
}
