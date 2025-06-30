package com.aksi.domain.branch.mapper;

import java.net.URI;

import org.mapstruct.Mapper;

import com.aksi.api.branch.dto.CoordinatesRequest;
import com.aksi.api.branch.dto.CoordinatesResponse;
import com.aksi.domain.branch.entity.Coordinates;

/** Mapper для Coordinates ↔ DTO конвертації Відповідальність: тільки Coordinates embedded object */
@Mapper(componentModel = "spring")
public interface CoordinatesMapper {

  // DTO → Entity mappings

  /** CoordinatesRequest → Coordinates */
  Coordinates toEntity(CoordinatesRequest request);

  // Entity → DTO mappings

  /** Coordinates → CoordinatesResponse */
  CoordinatesResponse toResponse(Coordinates entity);

  // Utility mappings

  /** String → URI */
  default URI stringToUri(String url) {
    return url != null ? URI.create(url) : null;
  }

  /** URI → String */
  default String uriToString(URI uri) {
    return uri != null ? uri.toString() : null;
  }
}
