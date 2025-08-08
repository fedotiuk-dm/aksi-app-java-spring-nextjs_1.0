package com.aksi.service.order;

import java.util.UUID;

import com.aksi.api.order.dto.OrderItemInfo;
import com.aksi.api.order.dto.UpdateItemCharacteristicsRequest;
import com.aksi.domain.order.ItemCharacteristicsEntity;
import com.aksi.domain.order.ItemDefectEntity;
import com.aksi.domain.order.ItemPhotoEntity;
import com.aksi.domain.order.ItemRiskEntity;
import com.aksi.domain.order.ItemStainEntity;
import com.aksi.domain.order.OrderItemEntity;

/**
 * Service for order item management Handles updates to order item characteristics, stains, defects,
 * and risks
 */
public interface OrderItemService {

  /**
   * Update order item characteristics
   *
   * @param orderId order ID
   * @param itemId item ID
   * @param request update request with characteristics, stains, defects, risks
   * @return updated order item information
   */
  OrderItemInfo updateCharacteristics(
      UUID orderId, UUID itemId, UpdateItemCharacteristicsRequest request);

  /**
   * Add stain to order item
   *
   * @param orderItem order item entity
   * @param stain stain entity
   */
  void addStain(OrderItemEntity orderItem, ItemStainEntity stain);

  /**
   * Add defect to order item
   *
   * @param orderItem order item entity
   * @param defect defect entity
   */
  void addDefect(OrderItemEntity orderItem, ItemDefectEntity defect);

  /**
   * Add risk to order item
   *
   * @param orderItem order item entity
   * @param risk risk entity
   */
  void addRisk(OrderItemEntity orderItem, ItemRiskEntity risk);

  /**
   * Add photo to order item
   *
   * @param orderItem order item entity
   * @param photo photo entity
   */
  void addPhoto(OrderItemEntity orderItem, ItemPhotoEntity photo);

  /**
   * Remove photo from order item
   *
   * @param orderItem order item entity
   * @param photo photo entity
   */
  void removePhoto(OrderItemEntity orderItem, ItemPhotoEntity photo);

  /**
   * Set characteristics for order item
   *
   * @param orderItem order item entity
   * @param characteristics characteristics entity
   */
  void setCharacteristics(OrderItemEntity orderItem, ItemCharacteristicsEntity characteristics);
}
