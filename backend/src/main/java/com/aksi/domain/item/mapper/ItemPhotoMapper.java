package com.aksi.domain.item.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.aksi.api.item.dto.ItemPhoto;
import com.aksi.api.item.dto.ItemPhotoListResponse;
import com.aksi.api.item.dto.ItemPhotoResponse;
import com.aksi.domain.item.entity.ItemPhotoEntity;

/** Mapper for ItemPhoto entities and DTOs */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface ItemPhotoMapper {

  // Map to response - required fields mapping
  @Mapping(target = "photoType", ignore = true)
  @Mapping(target = "metadata", ignore = true)
  @Mapping(target = "downloadUrl", ignore = true)
  @Mapping(target = "thumbnailUrl", ignore = true)
  ItemPhotoResponse toResponse(ItemPhotoEntity entity);

  List<ItemPhotoResponse> toResponseList(List<ItemPhotoEntity> entities);

  // Map entity to DTO for list responses
  @Mapping(target = "orderItemId", source = "orderItemId")
  @Mapping(target = "uploadedAt", source = "createdAt")
  @Mapping(target = "photoType", constant = "GENERAL")
  @Mapping(target = "thumbnailUrl", source = "thumbnailPath")
  @Mapping(target = "downloadUrl", source = "storagePath")
  ItemPhoto toDto(ItemPhotoEntity entity);

  List<ItemPhoto> toDtoList(List<ItemPhotoEntity> entities);

  // Create list response from entities
  default ItemPhotoListResponse toListResponse(List<ItemPhotoEntity> entities) {
    List<ItemPhoto> photos = toDtoList(entities);
    ItemPhotoListResponse response = new ItemPhotoListResponse();
    response.setPhotos(photos);
    response.setTotal(photos.size());
    return response;
  }
}
