package com.aksi.domain.item.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.aksi.api.item.dto.ItemPhotoResponse;
import com.aksi.api.item.dto.UpdatePhotoMetadataRequest;
import com.aksi.domain.item.config.StorageProperties;
import com.aksi.domain.item.constant.ItemConstants;
import com.aksi.domain.item.entity.ItemPhotoEntity;
import com.aksi.domain.item.exception.ItemPhotoNotFoundException;
import com.aksi.domain.item.mapper.ItemPhotoMapper;
import com.aksi.domain.item.repository.ItemPhotoRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Service for managing item photos. */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ItemPhotoService {

  private final ItemPhotoRepository itemPhotoRepository;
  private final ItemPhotoMapper itemPhotoMapper;
  private final StorageProperties storageProperties;
  private final ObjectMapper objectMapper;

  /**
   * Upload photo for price list item.
   *
   * @param itemId price list item ID
   * @param file multipart file
   * @param description photo description
   * @param photoType photo type
   * @param metadata additional metadata
   * @return photo response
   */
  public ItemPhotoResponse uploadPhoto(
      UUID itemId,
      MultipartFile file,
      String description,
      String photoType,
      Map<String, String> metadata) {
    log.debug("Uploading photo for item: {}, type: {}, metadata: {}", itemId, photoType, metadata);

    // Validate file
    validateMultipartFile(file);

    try {
      // Extract orderId from metadata if available, otherwise use a placeholder
      String orderId = metadata != null ? metadata.getOrDefault("orderId", "temp") : "temp";

      // Generate storage path
      String filename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "photo";
      String storagePath = generateStoragePath(orderId, itemId, filename);

      // Save file to storage
      saveMultipartFileToStorage(file, storagePath);

      // Create photo entity using builder
      ItemPhotoEntity photo =
          ItemPhotoEntity.builder()
              .orderItemId(itemId)
              .fileName(file.getOriginalFilename())
              .fileType(file.getContentType())
              .fileSize(file.getSize())
              .storagePath(storagePath)
              .description(description)
              .photoType(photoType)
              .metadata(convertMetadataToJson(metadata))
              .uploadedBy(getCurrentUserId())
              .build();

      // Save photo
      photo = itemPhotoRepository.save(photo);

      // Build response using mapper
      ItemPhotoResponse response = itemPhotoMapper.toResponse(photo);

      log.debug("Photo uploaded successfully with ID: {}", photo.getId());
      return response;
    } catch (IOException e) {
      log.error("Error uploading photo", e);
      throw new IllegalArgumentException("Error processing file upload", e);
    }
  }

  /**
   * Get photos for price list item.
   *
   * @param itemId price list item ID
   * @return list of photos
   */
  @Transactional(readOnly = true)
  public List<ItemPhotoResponse> getPhotosForItem(UUID itemId) {
    log.debug("Getting photos for item: {}", itemId);

    // Get photos for item
    List<ItemPhotoEntity> photos =
        itemPhotoRepository.findByOrderItemId(itemId, Sort.by(Sort.Direction.DESC, "createdAt"));

    // Use mapper to create response list
    List<ItemPhotoResponse> response = itemPhotoMapper.toResponseList(photos);

    log.debug("Found {} photos for item", response.size());
    return response;
  }

  /**
   * Delete photo by ID.
   *
   * @param photoId photo ID
   */
  public void deletePhoto(UUID photoId) {
    log.debug("Deleting photo: {}", photoId);

    // Get photo entity first to get file paths
    ItemPhotoEntity photo = getPhotoById(photoId);

    // Delete physical files
    deletePhotoFiles(photo);

    // Delete from database
    itemPhotoRepository.deleteById(photoId);
    log.debug("Photo deleted successfully");
  }

  /**
   * Get photo entity by ID.
   *
   * @param photoId photo ID
   * @return photo entity
   */
  @Transactional(readOnly = true)
  public ItemPhotoEntity getPhotoById(UUID photoId) {
    return itemPhotoRepository
        .findById(photoId)
        .orElseThrow(() -> new ItemPhotoNotFoundException(photoId));
  }

  /**
   * Get photo response by ID.
   *
   * @param photoId photo ID
   * @return photo response
   */
  @Transactional(readOnly = true)
  public ItemPhotoResponse getPhotoResponseById(UUID photoId) {
    ItemPhotoEntity photo = getPhotoById(photoId);
    return itemPhotoMapper.toResponse(photo);
  }

  /**
   * Update photo metadata.
   *
   * @param photoId photo ID
   * @param request update request
   * @return updated photo response
   */
  public ItemPhotoResponse updatePhotoMetadata(UUID photoId, UpdatePhotoMetadataRequest request) {
    log.debug("Updating photo metadata for ID: {}", photoId);

    ItemPhotoEntity photo = getPhotoById(photoId);

    if (request.getDescription() != null) {
      photo.setDescription(request.getDescription());
    }

    photo = itemPhotoRepository.save(photo);
    return itemPhotoMapper.toResponse(photo);
  }

  /**
   * Download photo file.
   *
   * @param photoId photo ID
   * @param thumbnail whether to get thumbnail
   * @return file resource
   */
  @Transactional(readOnly = true)
  public Resource downloadPhotoFile(UUID photoId, Boolean thumbnail) {
    log.debug("Downloading photo file for ID: {}, thumbnail: {}", photoId, thumbnail);

    ItemPhotoEntity photo = getPhotoById(photoId);
    String path =
        Boolean.TRUE.equals(thumbnail) && photo.getThumbnailPath() != null
            ? photo.getThumbnailPath()
            : photo.getStoragePath();

    try {
      Path filePath = Paths.get(path);
      if (!Files.exists(filePath)) {
        // For development, return empty resource
        log.warn("File not found at path: {}", path);
        throw new ItemPhotoNotFoundException(photoId);
      }
      return new FileSystemResource(filePath);
    } catch (Exception e) {
      log.error("Error reading photo file", e);
      throw new IllegalArgumentException("Error reading photo file", e);
    }
  }

  /** Validate multipart file. */
  private void validateMultipartFile(MultipartFile file) {
    if (file == null || file.isEmpty()) {
      throw new IllegalArgumentException("File is required");
    }

    if (file.getSize() > ItemConstants.MAX_PHOTO_SIZE_BYTES) {
      throw new IllegalArgumentException(
          String.format(
              "Photo size exceeds maximum allowed size of %d MB",
              ItemConstants.MAX_PHOTO_SIZE_BYTES / (1024 * 1024)));
    }

    // Validate file type
    String contentType = file.getContentType();
    if (contentType == null || !ItemConstants.ALLOWED_PHOTO_TYPES.contains(contentType)) {
      throw new IllegalArgumentException(
          "Invalid file type. Allowed types: " + ItemConstants.ALLOWED_PHOTO_TYPES);
    }
  }

  /** Save multipart file to storage. */
  private void saveMultipartFileToStorage(MultipartFile file, String storagePath)
      throws IOException {
    log.debug("Saving multipart file to storage path: {}", storagePath);

    // Create directory structure
    Path targetPath = Paths.get(storagePath);
    Files.createDirectories(targetPath.getParent());

    // Transfer file to target location
    file.transferTo(targetPath);

    log.debug("File saved successfully to: {}", storagePath);
  }

  /** Generate storage path for photo. */
  private String generateStoragePath(String orderId, UUID itemId, String filename) {
    // Use configured path pattern from StorageProperties
    String pathPattern = storageProperties.getPhotos().getItems();
    String basePath = String.format(pathPattern, orderId, itemId.toString());

    // Add timestamp and unique ID to filename
    String timestamp = String.valueOf(System.currentTimeMillis());
    String uniqueId = UUID.randomUUID().toString().substring(0, 8);
    String sanitizedFilename = filename.replaceAll("[^a-zA-Z0-9._-]", "_");

    // Combine media root with the path
    Path fullPath =
        Paths.get(
            storageProperties.getMediaRoot(),
            basePath,
            String.format("%s_%s_%s", timestamp, uniqueId, sanitizedFilename));

    return fullPath.toString();
  }

  /** Get current user ID from security context. */
  private UUID getCurrentUserId() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null && authentication.getPrincipal() != null) {
      // Assuming the principal contains user ID as UUID
      // This will need to be adjusted based on your actual security implementation
      try {
        return UUID.fromString(authentication.getName());
      } catch (IllegalArgumentException e) {
        log.warn("Could not parse user ID from authentication: {}", authentication.getName());
      }
    }
    // Fallback for development/testing
    log.warn("No authenticated user found, using anonymous ID");
    return UUID.fromString("00000000-0000-0000-0000-000000000000");
  }

  /** Delete physical photo files from storage. */
  private void deletePhotoFiles(ItemPhotoEntity photo) {
    // Delete main photo file
    if (photo.getStoragePath() != null) {
      try {
        Path filePath = Paths.get(photo.getStoragePath());
        if (Files.exists(filePath)) {
          Files.delete(filePath);
          log.debug("Deleted photo file: {}", photo.getStoragePath());
        }
      } catch (IOException e) {
        log.error("Error deleting photo file: {}", photo.getStoragePath(), e);
      }
    }

    // Delete thumbnail if exists
    if (photo.getThumbnailPath() != null) {
      try {
        Path thumbnailPath = Paths.get(photo.getThumbnailPath());
        if (Files.exists(thumbnailPath)) {
          Files.delete(thumbnailPath);
          log.debug("Deleted thumbnail file: {}", photo.getThumbnailPath());
        }
      } catch (IOException e) {
        log.error("Error deleting thumbnail file: {}", photo.getThumbnailPath(), e);
      }
    }
  }

  /** Convert metadata map to JSON string. */
  private String convertMetadataToJson(Map<String, String> metadata) {
    if (metadata == null || metadata.isEmpty()) {
      return null;
    }

    try {
      return objectMapper.writeValueAsString(metadata);
    } catch (JsonProcessingException e) {
      log.error("Error converting metadata to JSON", e);
      return null;
    }
  }
}
