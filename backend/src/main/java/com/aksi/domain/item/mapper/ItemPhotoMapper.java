package com.aksi.domain.item.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.aksi.api.item.dto.ItemPhotoResponse;
import com.aksi.domain.item.entity.ItemPhotoEntity;

/** Mapper for ItemPhoto entities and DTOs */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface ItemPhotoMapper {

  ItemPhotoResponse toResponse(ItemPhotoEntity entity);

  List<ItemPhotoResponse> toResponseList(List<ItemPhotoEntity> entities);
}
