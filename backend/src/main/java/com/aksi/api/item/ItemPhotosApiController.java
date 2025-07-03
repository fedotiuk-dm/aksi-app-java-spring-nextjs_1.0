package com.aksi.api.item;

import java.util.List;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.multipart.MultipartFile;

import com.aksi.api.item.dto.PhotoResponse;
import com.aksi.api.item.dto.PhotoType;
import com.aksi.api.item.dto.UpdatePhotoMetadataRequest;
import com.aksi.domain.item.service.ItemPhotoService;

import lombok.RequiredArgsConstructor;

/** HTTP контролер для управління фотографіями предметів. */
@Controller
@RequiredArgsConstructor
public class ItemPhotosApiController implements ItemPhotosApi {

  private final ItemPhotoService itemPhotoService;

  @Override
  public ResponseEntity<Void> deletePhoto(UUID photoId) {
    itemPhotoService.deletePhoto(photoId);
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<Resource> downloadPhotoFile(UUID photoId, Boolean thumbnail) {
    // TODO: Додати file download логіку
    return ResponseEntity.ok().build();
  }

  @Override
  public ResponseEntity<List<PhotoResponse>> getItemPhotos(UUID itemId) {
    var response = itemPhotoService.getPhotosForItem(itemId);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<PhotoResponse> getPhotoById(UUID photoId) {
    var response = itemPhotoService.getPhotoById(photoId);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<PhotoResponse> updatePhotoMetadata(
      UUID photoId, UpdatePhotoMetadataRequest request) {
    var response = itemPhotoService.updatePhotoMetadata(photoId, request);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<PhotoResponse> uploadItemPhoto(
      UUID itemId,
      UUID itemId2,
      MultipartFile file,
      String description,
      PhotoType photoType,
      Boolean isMain) {
    // TODO: Додати file upload логіку
    return ResponseEntity.status(HttpStatus.CREATED).build();
  }
}
