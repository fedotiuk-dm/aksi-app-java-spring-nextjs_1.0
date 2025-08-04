package com.aksi.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.aksi.api.cart.dto.CartGlobalModifiers;
import com.aksi.api.cart.dto.CartInfo;
import com.aksi.api.cart.dto.CartItemInfo;
import com.aksi.api.cart.dto.ItemCharacteristics;
import com.aksi.api.cart.dto.ItemModifier;
import com.aksi.api.cart.dto.PriceListItemSummary;
import com.aksi.domain.cart.Cart;
import com.aksi.domain.cart.CartItem;
import com.aksi.domain.cart.CartItemCharacteristics;
import com.aksi.domain.cart.CartItemModifier;
import com.aksi.domain.catalog.PriceListItem;

/**
 * MapStruct mapper for Cart entities and DTOs
 */
@Mapper(componentModel = "spring", uses = {PriceListItemMapper.class})
public interface CartMapper {

  // Cart to CartInfo
  @Mapping(source = "customer.id", target = "customerId")
  @Mapping(source = "urgencyType", target = "globalModifiers.urgencyType")
  @Mapping(source = "discountType", target = "globalModifiers.discountType")
  @Mapping(source = "discountPercentage", target = "globalModifiers.discountPercentage")
  @Mapping(source = "expectedCompletionDate", target = "globalModifiers.expectedCompletionDate")
  @Mapping(target = "pricing", ignore = true) // Will be calculated separately
  CartInfo toCartInfo(Cart cart);

  // CartItem to CartItemInfo
  @Mapping(source = "priceListItem.id", target = "priceListItemId")
  @Mapping(source = "priceListItem", target = "priceListItem")
  @Mapping(target = "pricing", ignore = true) // Will be calculated separately
  CartItemInfo toCartItemInfo(CartItem cartItem);

  List<CartItemInfo> toCartItemInfoList(List<CartItem> cartItems);

  // PriceListItem to PriceListItemSummary
  @Mapping(source = "categoryCode", target = "categoryCode")
  @Mapping(source = "unitOfMeasure", target = "unitOfMeasure")
  PriceListItemSummary toPriceListItemSummary(PriceListItem priceListItem);

  // CartItemCharacteristics to ItemCharacteristics
  @Mapping(source = "fillerCondition", target = "fillerCondition")
  ItemCharacteristics toItemCharacteristics(CartItemCharacteristics characteristics);

  // CartItemModifier to ItemModifier
  ItemModifier toItemModifier(CartItemModifier modifier);

  List<ItemModifier> toItemModifierList(List<CartItemModifier> modifiers);

  // Custom mapping methods for enums
  default CartGlobalModifiers.UrgencyTypeEnum mapUrgencyType(String urgencyType) {
    if (urgencyType == null) {
      return CartGlobalModifiers.UrgencyTypeEnum.NORMAL;
    }
    return CartGlobalModifiers.UrgencyTypeEnum.fromValue(urgencyType);
  }

  default CartGlobalModifiers.DiscountTypeEnum mapDiscountType(String discountType) {
    if (discountType == null) {
      return CartGlobalModifiers.DiscountTypeEnum.NONE;
    }
    return CartGlobalModifiers.DiscountTypeEnum.fromValue(discountType);
  }

  default ItemCharacteristics.FillerConditionEnum mapFillerCondition(String fillerCondition) {
    if (fillerCondition == null) {
      return null;
    }
    return ItemCharacteristics.FillerConditionEnum.fromValue(fillerCondition);
  }

  default ItemModifier.TypeEnum mapModifierType(String type) {
    if (type == null) {
      return null;
    }
    return ItemModifier.TypeEnum.fromValue(type);
  }
}