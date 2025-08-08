package com.aksi.service.order;

import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.aksi.api.file.dto.FileUploadResponse;
import com.aksi.api.order.dto.ItemPhotoInfo;
import com.aksi.api.order.dto.PhotoType;
import com.aksi.domain.order.ItemPhotoEntity;
import com.aksi.domain.order.OrderEntity;
import com.aksi.domain.order.OrderItemEntity;
import com.aksi.exception.BadRequestException;
import com.aksi.mapper.OrderMapper;
import com.aksi.repository.OrderRepository;
import com.aksi.service.auth.UserContextService;
import com.aksi.service.order.factory.OrderFactory;
import com.aksi.service.order.guard.OrderGuard;
import com.aksi.service.storage.FilePathResolver;
import com.aksi.service.storage.FileStorageService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Implementation of OrderPhotoService Manages photo uploads and deletions for order items */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class OrderPhotoServiceImpl implements OrderPhotoService {

  private final OrderRepository orderRepository;

  private final OrderGuard orderGuard;
  private final OrderFactory orderFactory;
  private final OrderMapper orderMapper;
  private final FileStorageService fileStorageService;
  private final FilePathResolver filePathResolver;
  private final UserContextService userContextService;

  private static final long MAX_FILE_SIZE_BYTES = 10L * 1024 * 1024;
  private static final String ORDER_ITEM_PHOTOS_DIR = "orders/%s/items/%s/photos";

  // Public URL prefix is handled by FilePathResolver; kept for readability in logs if needed

  @Override
  public ItemPhotoInfo uploadPhoto(
      UUID orderId, UUID itemId, MultipartFile file, PhotoType photoType, String photoDescription) {

    log.info("Uploading photo for item {} in order {}", itemId, orderId);

    // Step 1: Validate input
    validatePhotoFile(file);

    // Step 2: Load entities
    OrderEntity order = orderGuard.ensureExists(orderId);
    OrderItemEntity orderItem = orderGuard.ensureItemExists(order, itemId);

    // Step 3: Store file
    FileUploadResponse uploadResponse = storePhotoFile(orderItem, file);

    // Step 4: Create photo entity
    var currentUser = userContextService.getCurrentUser();
    ItemPhotoEntity photo =
        orderFactory.createPhoto(
            orderItem, file, uploadResponse, photoType, photoDescription, currentUser);
    orderItem.addPhoto(photo);

    // Step 5: Persist
    orderRepository.save(order);

    log.info("Uploaded photo for order item {} in order {}", itemId, order.getOrderNumber());
    return orderMapper.toItemPhotoInfo(photo);
  }

  @Override
  public void deletePhoto(UUID orderId, UUID itemId, UUID photoId) {
    log.info("Deleting photo {} from item {} in order {}", photoId, itemId, orderId);

    // Step 1: Load entities
    OrderEntity order = orderGuard.ensureExists(orderId);
    OrderItemEntity orderItem = orderGuard.ensureItemExists(order, itemId);
    ItemPhotoEntity photo = orderGuard.ensurePhotoExists(orderItem, photoId);

    // Step 2: Delete physical file
    deletePhysicalFile(photo);

    // Step 3: Remove from entity
    orderItem.removePhoto(photo);

    // Step 4: Persist
    orderRepository.save(order);

    log.info(
        "Deleted photo {} from order item {} in order {}", photoId, itemId, order.getOrderNumber());
  }

  private void validatePhotoFile(MultipartFile file) {
    if (file == null) {
      throw new BadRequestException("Photo file is required");
    }
    require(!file.isEmpty(), "Photo file is required");
    require(file.getSize() <= MAX_FILE_SIZE_BYTES, "Photo file size must be less than 10MB");
    String contentType = file.getContentType();
    require(
        contentType != null && contentType.startsWith("image/"), "Only image files are allowed");
  }

  private FileUploadResponse storePhotoFile(OrderItemEntity orderItem, MultipartFile file) {
    String directory =
        String.format(ORDER_ITEM_PHOTOS_DIR, orderItem.getOrderEntity().getId(), orderItem.getId());

    return fileStorageService.storeFile(file, directory);
  }

  private void deletePhysicalFile(ItemPhotoEntity photo) {
    Optional.ofNullable(photo.getUrl())
        .map(filePathResolver::extractRelativePathFromUrl)
        .ifPresent(this::tryDeleteFile);
  }

  private void tryDeleteFile(String filePath) {
    try {
      fileStorageService.deleteFile(filePath);
    } catch (Exception e) {
      log.warn("Failed to delete physical file: {}", filePath, e);
    }
  }

  private void require(boolean condition, String message) {
    if (!condition) {
      throw new BadRequestException(message);
    }
  }
}
