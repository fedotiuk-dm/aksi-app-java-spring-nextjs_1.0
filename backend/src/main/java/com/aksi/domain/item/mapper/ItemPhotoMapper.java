package com.aksi.domain.item.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.aksi.api.item.dto.PhotoResponse;
import com.aksi.api.item.dto.UpdatePhotoMetadataRequest;
import com.aksi.domain.item.entity.ItemPhotoEntity;

/** MapStruct mapper для ItemPhoto - Entity ↔ DTO конвертація. */
@Mapper(componentModel = "spring")
public interface ItemPhotoMapper {

  // Entity → DTO (для response)
  @Mapping(source = "originalName", target = "filename")
  @Mapping(source = "originalName", target = "originalFilename")
  @Mapping(source = "contentType", target = "mimeType")
  @Mapping(source = "createdAt", target = "uploadedAt")
  @Mapping(target = "url", ignore = true) // Буде заповнено в Service
  @Mapping(target = "thumbnailUrl", ignore = true) // Буде заповнено в Service
  PhotoResponse toResponse(ItemPhotoEntity entity);

  // List mappings
  List<PhotoResponse> toResponseList(List<ItemPhotoEntity> entities);

  // Update entity з DTO (для metadata)
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  @Mapping(target = "itemId", ignore = true)
  @Mapping(target = "originalName", ignore = true)
  @Mapping(target = "fileName", ignore = true)
  @Mapping(target = "filePath", ignore = true)
  @Mapping(target = "contentType", ignore = true)
  @Mapping(target = "fileSize", ignore = true)
  @Mapping(target = "displayOrder", ignore = true)
  @Mapping(target = "imageWidth", ignore = true)
  @Mapping(target = "imageHeight", ignore = true)
  @Mapping(target = "thumbnailPath", ignore = true)
  @Mapping(source = "isMain", target = "isPrimary")
  void updateEntityFromRequest(
      UpdatePhotoMetadataRequest request, @org.mapstruct.MappingTarget ItemPhotoEntity entity);

  // З Instant типами - конвертери дат не потрібні (OpenAPI-first)
}
