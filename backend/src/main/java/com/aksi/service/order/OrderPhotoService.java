package com.aksi.service.order;

import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import com.aksi.api.order.dto.ItemPhotoInfo;
import com.aksi.api.order.dto.PhotoType;

/** Service for order item photo management Handles photo upload and deletion for order items */
public interface OrderPhotoService {

  /**
   * Upload photo for order item
   *
   * @param orderId order ID
   * @param itemId item ID
   * @param file photo file
   * @param photoType type of photo
   * @param photoDescription photo description
   * @return uploaded photo information
   */
  ItemPhotoInfo uploadPhoto(
      UUID orderId, UUID itemId, MultipartFile file, PhotoType photoType, String photoDescription);

  /**
   * Delete photo from order item
   *
   * @param orderId order ID
   * @param itemId item ID
   * @param photoId photo ID
   */
  void deletePhoto(UUID orderId, UUID itemId, UUID photoId);
}
