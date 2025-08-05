package com.aksi.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import com.aksi.api.order.dto.CustomerSummary;
import com.aksi.api.order.dto.ItemCharacteristics;
import com.aksi.api.order.dto.ItemDefect;
import com.aksi.api.order.dto.ItemModifier;
import com.aksi.api.order.dto.ItemPhotoInfo;
import com.aksi.api.order.dto.ItemRisk;
import com.aksi.api.order.dto.ItemStain;
import com.aksi.api.order.dto.ModifierDetail;
import com.aksi.api.order.dto.OrderInfo;
import com.aksi.api.order.dto.OrderItemInfo;
import com.aksi.api.order.dto.OrderItemPricingInfo;
import com.aksi.api.order.dto.OrderPricingInfo;
import com.aksi.api.order.dto.PaymentInfo;
import com.aksi.api.order.dto.PriceListItemSummary;
import com.aksi.domain.customer.Customer;
import com.aksi.domain.order.ItemPhoto;
import com.aksi.domain.order.Order;
import com.aksi.domain.order.OrderItem;
import com.aksi.domain.order.OrderPayment;

/** MapStruct mapper for Order domain entities and DTOs */
@Mapper(componentModel = "spring")
public interface OrderMapper {

  /** Map Order entity to OrderInfo DTO */
  @Mapping(target = "customer", source = "customer", qualifiedByName = "toCustomerSummary")
  @Mapping(target = "customerId", source = "customer.id")
  @Mapping(target = "branchId", source = "branch.id")
  @Mapping(target = "items", source = "items")
  @Mapping(target = "pricing", source = ".", qualifiedByName = "toOrderPricingInfo")
  @Mapping(target = "payments", source = "payments")
  @Mapping(target = "createdBy", source = "createdBy.id")
  @Mapping(
      target = "status",
      expression = "java(com.aksi.api.order.dto.OrderStatus.fromValue(order.getStatus().name()))")
  OrderInfo toOrderInfo(Order order);

  /** Map OrderItem entity to OrderItemInfo DTO */
  @Mapping(
      target = "priceListItem",
      source = "priceListItem",
      qualifiedByName = "toPriceListItemSummary")
  @Mapping(target = "priceListItemId", source = "priceListItem.id")
  @Mapping(target = "characteristics", source = "characteristics")
  @Mapping(target = "stains", source = "stains")
  @Mapping(target = "defects", source = "defects")
  @Mapping(target = "risks", source = "risks")
  @Mapping(target = "photos", source = "photos")
  @Mapping(target = "modifiers", source = "modifiers")
  @Mapping(target = "pricing", source = ".", qualifiedByName = "toOrderItemPricingInfo")
  OrderItemInfo toOrderItemInfo(OrderItem orderItem);

  /** Map Customer entity to CustomerSummary DTO */
  @Named("toCustomerSummary")
  @Mapping(target = "phone", source = "phonePrimary")
  CustomerSummary toCustomerSummary(Customer customer);

  /** Map Order entity to OrderPricingInfo DTO */
  @Named("toOrderPricingInfo")
  @Mapping(target = "paidAmount", expression = "java(order.getPaidAmount())")
  @Mapping(target = "balanceDue", expression = "java(order.getBalanceDue())")
  @Mapping(target = "total", source = "totalAmount")
  OrderPricingInfo toOrderPricingInfo(Order order);

  /** Map OrderItem entity to OrderItemPricingInfo DTO */
  @Named("toOrderItemPricingInfo")
  @Mapping(target = "modifierDetails", source = "modifiers", qualifiedByName = "toModifierDetails")
  @Mapping(target = "total", source = "totalAmount")
  OrderItemPricingInfo toOrderItemPricingInfo(OrderItem orderItem);

  /** Map PriceListItem entity to PriceListItemSummary DTO */
  @Named("toPriceListItemSummary")
  @Mapping(target = "categoryCode", source = "categoryCode.value")
  @Mapping(
      target = "unitOfMeasure",
      expression =
          "java(com.aksi.api.order.dto.PriceListItemSummary.UnitOfMeasureEnum.fromValue(priceListItem.getUnitOfMeasure().name()))")
  PriceListItemSummary toPriceListItemSummary(com.aksi.domain.catalog.PriceListItem priceListItem);

  /** Map ItemCharacteristics entity to DTO */
  @Mapping(
      target = "fillerCondition",
      expression =
          "java(characteristics.getFillerCondition() != null ? com.aksi.api.order.dto.ItemCharacteristics.FillerConditionEnum.fromValue(characteristics.getFillerCondition().name()) : null)")
  ItemCharacteristics toItemCharacteristics(
      com.aksi.domain.order.ItemCharacteristics characteristics);

  /** Map ItemStain entity to DTO */
  @Mapping(
      target = "type",
      expression =
          "java(com.aksi.api.order.dto.ItemStain.TypeEnum.fromValue(stain.getType().name()))")
  ItemStain toItemStain(com.aksi.domain.order.ItemStain stain);

  /** Map ItemDefect entity to DTO */
  @Mapping(
      target = "type",
      expression =
          "java(com.aksi.api.order.dto.ItemDefect.TypeEnum.fromValue(defect.getType().name()))")
  ItemDefect toItemDefect(com.aksi.domain.order.ItemDefect defect);

  /** Map ItemRisk entity to DTO */
  @Mapping(
      target = "type",
      expression =
          "java(com.aksi.api.order.dto.ItemRisk.TypeEnum.fromValue(risk.getType().name()))")
  ItemRisk toItemRisk(com.aksi.domain.order.ItemRisk risk);

  /** Map ItemPhoto entity to ItemPhotoInfo DTO */
  @Mapping(
      target = "type",
      expression = "java(com.aksi.api.order.dto.PhotoType.fromValue(photo.getType().name()))")
  @Mapping(target = "uploadedBy", source = "uploadedBy.id")
  ItemPhotoInfo toItemPhotoInfo(ItemPhoto photo);

  /** Map ItemModifier entity to ItemModifier DTO */
  @Mapping(
      target = "type",
      expression =
          "java(com.aksi.api.order.dto.ItemModifier.TypeEnum.fromValue(modifier.getType().name()))")
  ItemModifier toItemModifier(com.aksi.domain.order.ItemModifier modifier);

  /** Map ItemModifier entities to ModifierDetail DTOs */
  @Named("toModifierDetails")
  default List<ModifierDetail> toModifierDetails(
      List<com.aksi.domain.order.ItemModifier> modifiers) {
    if (modifiers == null) return null;

    return modifiers.stream()
        .map(
            modifier -> {
              ModifierDetail detail = new ModifierDetail();
              detail.setCode(modifier.getCode());
              detail.setName(modifier.getName());
              detail.setAmount(modifier.getAppliedAmount());
              return detail;
            })
        .toList();
  }

  /** Map OrderPayment entity to PaymentInfo DTO */
  @Mapping(
      target = "method",
      expression =
          "java(com.aksi.api.order.dto.PaymentMethod.fromValue(payment.getMethod().name()))")
  @Mapping(target = "paidBy", source = "paidBy.id")
  PaymentInfo toPaymentInfo(OrderPayment payment);

  /** List mapping for OrderInfo */
  List<OrderInfo> toOrderInfoList(List<Order> orders);

  /** List mapping for OrderItemInfo */
  List<OrderItemInfo> toOrderItemInfoList(List<OrderItem> orderItems);

  /** List mapping for PaymentInfo */
  List<PaymentInfo> toPaymentInfoList(List<OrderPayment> payments);
}
