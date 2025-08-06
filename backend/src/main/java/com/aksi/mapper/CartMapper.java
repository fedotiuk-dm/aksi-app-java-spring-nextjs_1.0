package com.aksi.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.aksi.api.cart.dto.CartInfo;
import com.aksi.api.cart.dto.CartItemInfo;
import com.aksi.api.cart.dto.ItemCharacteristics;
import com.aksi.api.cart.dto.ItemModifier;
import com.aksi.api.cart.dto.PriceListItemSummary;
import com.aksi.domain.cart.CartEntity;
import com.aksi.domain.cart.CartItem;
import com.aksi.domain.cart.CartItemCharacteristicsEntity;
import com.aksi.domain.cart.CartItemModifierEntity;
import com.aksi.domain.catalog.PriceListItemEntity;

/** MapStruct mapper for Cart entities and DTOs */
@Mapper(
    componentModel = "spring",
    uses = {PriceListItemMapper.class})
public interface CartMapper {

  // Cart to CartInfo
  @Mapping(source = "customerEntity.id", target = "customerId")
  @Mapping(source = "urgencyType", target = "globalModifiers.urgencyType", defaultValue = "NORMAL")
  @Mapping(source = "discountType", target = "globalModifiers.discountType", defaultValue = "NONE")
  @Mapping(source = "discountPercentage", target = "globalModifiers.discountPercentage")
  @Mapping(source = "expectedCompletionDate", target = "globalModifiers.expectedCompletionDate")
  @Mapping(target = "pricing", ignore = true) // Will be calculated separately
  CartInfo toCartInfo(CartEntity cartEntity);

  // CartItem to CartItemInfo
  @Mapping(source = "priceListItemEntity.id", target = "priceListItemId")
  @Mapping(source = "priceListItemEntity", target = "priceListItem")
  @Mapping(target = "pricing", ignore = true) // Will be calculated separately
  CartItemInfo toCartItemInfo(CartItem cartItem);

  List<CartItemInfo> toCartItemInfoList(List<CartItem> cartItems);

  // PriceListItem to PriceListItemSummary
  @Mapping(source = "categoryCode", target = "categoryCode")
  @Mapping(source = "unitOfMeasure", target = "unitOfMeasure")
  PriceListItemSummary toPriceListItemSummary(PriceListItemEntity priceListItemEntity);

  // CartItemCharacteristics to ItemCharacteristics
  @Mapping(source = "fillerCondition", target = "fillerCondition", defaultValue = "NORMAL")
  ItemCharacteristics toItemCharacteristics(CartItemCharacteristicsEntity characteristics);

  // CartItemModifier to ItemModifier
  ItemModifier toItemModifier(CartItemModifierEntity modifier);

  List<ItemModifier> toItemModifierList(List<CartItemModifierEntity> modifiers);
}
