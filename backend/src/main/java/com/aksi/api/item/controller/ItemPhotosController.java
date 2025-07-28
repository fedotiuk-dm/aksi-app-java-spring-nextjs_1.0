package com.aksi.api.item.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.aksi.api.item.ItemPhotosApi;
import com.aksi.api.item.dto.ItemPhotoResponse;
import com.aksi.api.item.dto.UpdatePhotoMetadataRequest;
import com.aksi.domain.item.service.ItemPhotoService;

import lombok.RequiredArgsConstructor;

/** Controller for item photos endpoints. */
@RestController
@RequiredArgsConstructor
public class ItemPhotosController implements ItemPhotosApi {

  private final ItemPhotoService itemPhotoService;

  @Override
  public ResponseEntity<ItemPhotoResponse> uploadItemPhoto(
      UUID itemId,
      MultipartFile file,
      String description,
      String photoType,
      Map<String, String> metadata) {
    ItemPhotoResponse response =
        itemPhotoService.uploadPhoto(itemId, file, description, photoType, metadata);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @Override
  public ResponseEntity<List<ItemPhotoResponse>> getItemPhotos(UUID itemId) {
    List<ItemPhotoResponse> photos = itemPhotoService.getPhotosForItem(itemId);
    return ResponseEntity.ok(photos);
  }

  @Override
  public ResponseEntity<Void> deletePhoto(UUID photoId) {
    itemPhotoService.deletePhoto(photoId);
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<ItemPhotoResponse> getPhotoById(UUID photoId) {
    ItemPhotoResponse photo = itemPhotoService.getPhotoResponseById(photoId);
    return ResponseEntity.ok(photo);
  }

  @Override
  public ResponseEntity<ItemPhotoResponse> updatePhotoMetadata(
      UUID photoId, UpdatePhotoMetadataRequest request) {
    ItemPhotoResponse photo = itemPhotoService.updatePhotoMetadata(photoId, request);
    return ResponseEntity.ok(photo);
  }

  @Override
  public ResponseEntity<org.springframework.core.io.Resource> downloadPhotoFile(
      UUID photoId, Boolean thumbnail) {
    org.springframework.core.io.Resource file =
        itemPhotoService.downloadPhotoFile(photoId, thumbnail);
    return ResponseEntity.ok(file);
  }
}
