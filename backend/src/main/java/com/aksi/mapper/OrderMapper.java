package com.aksi.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.aksi.api.order.dto.CreateOrderRequest;
import com.aksi.api.order.dto.CustomerSummary;
import com.aksi.api.order.dto.ItemCharacteristics;
import com.aksi.api.order.dto.ItemDefect;
import com.aksi.api.order.dto.ItemPhotoInfo;
import com.aksi.api.order.dto.ItemRisk;
import com.aksi.api.order.dto.ItemStain;
import com.aksi.api.order.dto.OrderInfo;
import com.aksi.api.order.dto.OrderItemInfo;
import com.aksi.api.order.dto.OrderItemModifier;
import com.aksi.api.order.dto.OrderItemPricingInfo;
import com.aksi.api.order.dto.OrderModifierDetail;
import com.aksi.api.order.dto.OrderPricingInfo;
import com.aksi.api.order.dto.PaymentInfo;
import com.aksi.api.order.dto.PriceListItemSummary;
import com.aksi.api.order.dto.UpdateOrderStatusRequest;
import com.aksi.api.pricing.dto.CalculatedItemPrice;
import com.aksi.api.pricing.dto.PriceCalculationResponse;
import com.aksi.api.pricing.dto.PricingItemCharacteristics;
import com.aksi.domain.cart.CartItem;
import com.aksi.domain.catalog.PriceListItemEntity;
import com.aksi.domain.customer.CustomerEntity;
import com.aksi.domain.order.ItemCharacteristicsEntity;
import com.aksi.domain.order.ItemDefectEntity;
import com.aksi.domain.order.ItemModifierEntity;
import com.aksi.domain.order.ItemPhotoEntity;
import com.aksi.domain.order.ItemRiskEntity;
import com.aksi.domain.order.ItemStainEntity;
import com.aksi.domain.order.OrderEntity;
import com.aksi.domain.order.OrderItemEntity;
import com.aksi.domain.order.OrderPaymentEntity;

/** MapStruct mapper for Order domain entities and DTOs */
@Mapper(componentModel = "spring")
public abstract class OrderMapper {

  /** Map Order entity to OrderInfo DTO */
  @Mapping(target = "customer", source = "customerEntity")
  @Mapping(target = "customerId", source = "customerEntity.id")
  @Mapping(target = "branchId", source = "branchEntity.id")
  @Mapping(target = "items", source = "items")
  @Mapping(target = "pricing", source = ".")
  @Mapping(target = "payments", source = "payments")
  @Mapping(target = "createdBy", source = "createdBy.id")
  @Mapping(target = "status", source = "status", defaultValue = "PENDING")
  public abstract OrderInfo toOrderInfo(OrderEntity orderEntity);

  /** Map OrderItem entity to OrderItemInfo DTO */
  @Mapping(target = "priceListItem", source = "priceListItemEntity")
  @Mapping(target = "priceListItemId", source = "priceListItemEntity.id")
  @Mapping(target = "characteristics", source = "characteristics")
  @Mapping(target = "stains", source = "stains")
  @Mapping(target = "defects", source = "defects")
  @Mapping(target = "risks", source = "risks")
  @Mapping(target = "photos", source = "photos")
  @Mapping(target = "modifiers", source = "modifiers")
  @Mapping(target = "pricing", source = ".")
  public abstract OrderItemInfo toOrderItemInfo(OrderItemEntity orderItemEntity);

  /** Map Customer entity to CustomerSummary DTO */
  @Mapping(target = "phone", source = "phonePrimary")
  public abstract CustomerSummary toCustomerSummary(CustomerEntity customerEntity);

  /** Map Order entity to OrderPricingInfo DTO */
  @Mapping(target = "paidAmount", ignore = true)
  @Mapping(target = "balanceDue", ignore = true)
  @Mapping(target = "total", source = "totalAmount")
  public abstract OrderPricingInfo mapPricing(OrderEntity orderEntity);

  /** Map OrderItem entity to OrderItemPricingInfo DTO */
  @Mapping(target = "modifierDetails", source = "modifiers")
  @Mapping(target = "total", source = "totalAmount")
  public abstract OrderItemPricingInfo mapItemPricing(OrderItemEntity orderItemEntity);

  /** Map PriceListItem entity to PriceListItemSummary DTO */
  @Mapping(target = "categoryCode", source = "categoryCode.value")
  @Mapping(target = "unitOfMeasure", source = "unitOfMeasure", defaultValue = "PIECE")
  public abstract PriceListItemSummary toPriceListItemSummary(
      PriceListItemEntity priceListItemEntity);

  /** Map PricingItemCharacteristics entity to DTO */
  @Mapping(target = "material", source = "material")
  public abstract PricingItemCharacteristics toItemCharacteristics(
      ItemCharacteristicsEntity characteristics);

  /** Map ItemStain entity to DTO */
  @Mapping(target = "type", source = "type")
  public abstract ItemStain toItemStain(ItemStainEntity stain);

  /** Map ItemDefect entity to DTO */
  @Mapping(target = "type", source = "type")
  public abstract ItemDefect toItemDefect(ItemDefectEntity defect);

  /** Map ItemRisk entity to DTO */
  @Mapping(target = "type", source = "type")
  public abstract ItemRisk toItemRisk(ItemRiskEntity risk);

  /** Map ItemPhoto entity to ItemPhotoInfo DTO */
  @Mapping(target = "type", source = "type", defaultValue = "GENERAL")
  @Mapping(target = "uploadedBy", source = "uploadedBy.id")
  public abstract ItemPhotoInfo toItemPhotoInfo(ItemPhotoEntity photo);

  // Back-references проставляються у доменних add*() методах, after-mapping не потрібен

  /** Map OrderItemModifier entity to OrderItemModifier DTO */
  @Mapping(target = "type", source = "type")
  public abstract OrderItemModifier toItemModifier(ItemModifierEntity modifier);

  /** Map OrderItemModifier entity to OrderModifierDetail DTO */
  @Mapping(target = "amount", source = "appliedAmount")
  public abstract OrderModifierDetail toModifierDetail(ItemModifierEntity modifier);

  /** Map OrderPayment entity to PaymentInfo DTO */
  @Mapping(target = "method", source = "method", defaultValue = "CASH")
  @Mapping(target = "paidBy", source = "paidBy.id")
  public abstract PaymentInfo toPaymentInfo(OrderPaymentEntity payment);

  /**
   * Apply CreateOrderRequest fields to existing OrderEntity Only request-related fields are set;
   * defaults and null-safety handled here to keep services clean.
   */
  @BeanMapping(ignoreByDefault = true)
  @Mapping(target = "uniqueLabel", source = "uniqueLabel")
  @Mapping(target = "notes", source = "notes")
  @Mapping(target = "customerSignature", source = "customerSignature")
  @Mapping(target = "termsAccepted", source = "termsAccepted", defaultValue = "false")
  public abstract void applyCreateRequest(
      CreateOrderRequest request, @MappingTarget OrderEntity orderEntity);

  /** Apply calculated pricing snapshot to existing OrderItemEntity */
  @BeanMapping(ignoreByDefault = true)
  @Mapping(target = "basePrice", source = "basePrice", defaultValue = "0")
  @Mapping(
      target = "modifiersTotalAmount",
      source = "calculations.modifiersTotal",
      defaultValue = "0")
  @Mapping(target = "subtotal", source = "calculations.subtotal", defaultValue = "0")
  @Mapping(
      target = "urgencyAmount",
      source = "calculations.urgencyModifier.amount",
      defaultValue = "0")
  @Mapping(
      target = "discountAmount",
      source = "calculations.discountModifier.amount",
      defaultValue = "0")
  @Mapping(target = "totalAmount", source = "total", defaultValue = "0")
  @Mapping(
      target = "discountEligible",
      source = "calculations.discountEligible",
      defaultValue = "true")
  public abstract void applyCalculatedPrice(
      CalculatedItemPrice price, @MappingTarget OrderItemEntity orderItem);

  /** Map cart-item characteristics to order-item characteristics entity */
  @Mapping(target = "orderItemEntity", ignore = true)
  @Mapping(target = "material", source = "characteristics.material")
  @Mapping(target = "color", source = "characteristics.color")
  @Mapping(target = "filler", source = "characteristics.filler")
  @Mapping(target = "fillerCondition", source = "characteristics.fillerCondition")
  @Mapping(target = "wearLevel", source = "characteristics.wearLevel")
  public abstract ItemCharacteristicsEntity toItemCharacteristicsEntity(CartItem cartItem);

  // --- Lists mapping for item attributes ---
  @BeanMapping(ignoreByDefault = true)
  @Mapping(target = "type", source = "type")
  @Mapping(target = "description", source = "description")
  public abstract ItemStainEntity toItemStainEntity(ItemStain dto);

  @BeanMapping(ignoreByDefault = true)
  @Mapping(target = "type", source = "type")
  @Mapping(target = "description", source = "description")
  public abstract ItemDefectEntity toItemDefectEntity(ItemDefect dto);

  @BeanMapping(ignoreByDefault = true)
  @Mapping(target = "type", source = "type")
  @Mapping(target = "description", source = "description")
  public abstract ItemRiskEntity toItemRiskEntity(ItemRisk dto);

  /** Apply API OrderItemCharacteristics DTO to existing entity */
  @BeanMapping(ignoreByDefault = true)
  @Mapping(target = "material", source = "material")
  @Mapping(target = "color", source = "color")
  @Mapping(target = "wearLevel", source = "wearLevel")
  public abstract void applyItemCharacteristics(
      ItemCharacteristics dto, @MappingTarget ItemCharacteristicsEntity entity);

  // Update status mapping (DTO → Entity)
  @BeanMapping(ignoreByDefault = true)
  @Mapping(target = "status", source = "status")
  public abstract void applyUpdateStatus(
      UpdateOrderStatusRequest request, @MappingTarget OrderEntity orderEntity);

  /** Apply pricing snapshot to existing OrderEntity */
  @BeanMapping(ignoreByDefault = true)
  @Mapping(target = "itemsSubtotal", source = "totals.itemsSubtotal")
  @Mapping(target = "urgencyAmount", source = "totals.urgencyAmount")
  @Mapping(target = "discountAmount", source = "totals.discountAmount")
  @Mapping(target = "discountApplicableAmount", source = "totals.discountApplicableAmount")
  @Mapping(target = "totalAmount", source = "totals.total")
  public abstract void applyPricingSnapshot(
      PriceCalculationResponse pricing, @MappingTarget OrderEntity orderEntity);

  /** Convert CartItem to OrderItemEntity */
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "orderEntity", ignore = true)
  @Mapping(target = "priceListItemEntity", source = "priceListItemEntity")
  @Mapping(target = "quantity", source = "quantity")
  @Mapping(target = "characteristics", ignore = true) // Will be set separately
  @Mapping(target = "stains", ignore = true)
  @Mapping(target = "defects", ignore = true)
  @Mapping(target = "risks", ignore = true)
  @Mapping(target = "photos", ignore = true)
  @Mapping(target = "modifiers", ignore = true)
  @Mapping(target = "basePrice", ignore = true) // Will be set from pricing
  @Mapping(target = "subtotal", ignore = true)
  @Mapping(target = "modifiersTotalAmount", ignore = true)
  @Mapping(target = "urgencyAmount", ignore = true)
  @Mapping(target = "discountAmount", ignore = true)
  @Mapping(target = "totalAmount", ignore = true)
  @Mapping(target = "discountEligible", ignore = true)
  public abstract OrderItemEntity toOrderItemEntity(CartItem cartItem);
}
