package com.aksi.service.receipt.converter;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.aksi.api.receipt.dto.PaymentMethod;
import com.aksi.api.receipt.dto.ReceiptItem;
import com.aksi.api.receipt.dto.ReceiptOrderData;
import com.aksi.config.ReceiptConfiguration;
import com.aksi.domain.order.ItemModifierEntity;
import com.aksi.domain.order.OrderEntity;
import com.aksi.domain.order.OrderItemEntity;
import com.aksi.domain.order.OrderPaymentEntity;
import com.aksi.service.order.util.OrderQueryUtils;

import lombok.RequiredArgsConstructor;

/** Implementation of ReceiptDataConverter Converts OrderEntity to ReceiptOrderData following SRP */
@Component
@RequiredArgsConstructor
public class ReceiptDataConverterImpl implements ReceiptDataConverter {

  private final ReceiptConfiguration config;
  private final OrderQueryUtils orderQueryUtils;

  @Override
  public ReceiptOrderData convert(OrderEntity order) {
    if (order == null) {
      throw new IllegalArgumentException("Order cannot be null");
    }

    ReceiptOrderData data = new ReceiptOrderData();

    // Order information
    data.setOrderNumber(order.getOrderNumber());
    data.setCreatedAt(order.getCreatedAt());
    data.setCompletionDate(order.getExpectedCompletionDate());
    data.setNotes(order.getNotes());

    // Branch information
    setBranchInfo(data, order);

    // Customer information
    setCustomerInfo(data, order);

    // Items
    data.setItems(convertItems(order.getItems()));

    // Financial information
    setFinancialInfo(data, order);

    // Payment information
    setPaymentInfo(data, order);

    return data;
  }

  private void setBranchInfo(ReceiptOrderData data, OrderEntity order) {
    if (order.getBranchEntity() != null) {
      data.setBranchName(order.getBranchEntity().getName());
      data.setBranchAddress(order.getBranchEntity().getAddress());
      data.setBranchPhone(order.getBranchEntity().getPhone());
    } else {
      data.setBranchName(config.getDefaultBranchName());
    }
  }

  private void setCustomerInfo(ReceiptOrderData data, OrderEntity order) {
    if (order.getCustomerEntity() != null) {
      data.setCustomerName(
          order.getCustomerEntity().getFirstName() + " " + order.getCustomerEntity().getLastName());
      data.setCustomerPhone(order.getCustomerEntity().getPhonePrimary());
    }
  }

  private List<ReceiptItem> convertItems(List<OrderItemEntity> orderItems) {
    if (orderItems == null || orderItems.isEmpty()) {
      return new ArrayList<>();
    }

    List<ReceiptItem> items = new ArrayList<>();
    int position = 1;

    for (OrderItemEntity orderItem : orderItems) {
      items.add(convertItem(orderItem, position++));
    }

    return items;
  }

  private ReceiptItem convertItem(OrderItemEntity orderItem, int position) {
    ReceiptItem item = new ReceiptItem();

    item.setPosition(position);
    item.setQuantity(orderItem.getQuantity());
    item.setUnitPrice(orderItem.getBasePrice());
    item.setTotalPrice(orderItem.getTotalAmount());

    // Price list item info
    if (orderItem.getPriceListItemEntity() != null) {
      item.setName(orderItem.getPriceListItemEntity().getName());
      item.setCatalogNumber(String.valueOf(orderItem.getPriceListItemEntity().getCatalogNumber()));
    }

    // Modifiers
    item.setModifiers(extractModifierNames(orderItem));

    return item;
  }

  private List<String> extractModifierNames(OrderItemEntity orderItem) {
    if (orderItem.getModifiers() == null || orderItem.getModifiers().isEmpty()) {
      return new ArrayList<>();
    }

    return orderItem.getModifiers().stream()
        .map(ItemModifierEntity::getName)
        .filter(name -> name != null && !name.isEmpty())
        .collect(Collectors.toList());
  }

  private void setFinancialInfo(ReceiptOrderData data, OrderEntity order) {
    data.setSubtotal(order.getItemsSubtotal());
    data.setDiscount(order.getDiscountAmount());
    data.setTotalAmount(order.getTotalAmount());
    data.setPrepaidAmount(orderQueryUtils.calculatePaidAmount(order));
    data.setDueAmount(orderQueryUtils.calculateBalanceDue(order));
  }

  private void setPaymentInfo(ReceiptOrderData data, OrderEntity order) {
    if (!order.getPayments().isEmpty()) {
      OrderPaymentEntity firstPayment = order.getPayments().getFirst();
      if (firstPayment.getMethod() != null) {
        data.setPaymentMethod(PaymentMethod.fromValue(firstPayment.getMethod().toString()));
      } else {
        data.setPaymentMethod(PaymentMethod.fromValue(config.getDefaultPaymentMethod()));
      }
    } else {
      data.setPaymentMethod(PaymentMethod.fromValue(config.getDefaultPaymentMethod()));
    }
  }
}
