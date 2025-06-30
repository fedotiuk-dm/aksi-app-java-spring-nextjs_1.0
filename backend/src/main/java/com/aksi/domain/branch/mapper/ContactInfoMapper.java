package com.aksi.domain.branch.mapper;

import org.mapstruct.Mapper;

import com.aksi.api.branch.dto.ContactInfoRequest;
import com.aksi.api.branch.dto.ContactInfoResponse;
import com.aksi.domain.branch.entity.ContactInfo;

/**
 * Mapper для ContactInfo ↔ DTO конвертації Відповідальність: тільки ContactInfo embedded object.
 */
@Mapper(componentModel = "spring")
public interface ContactInfoMapper {

  // DTO → Entity mappings

  /** ContactInfoRequest → ContactInfo. */
  ContactInfo toEntity(ContactInfoRequest request);

  // Entity → DTO mappings

  /** ContactInfo → ContactInfoResponse. */
  ContactInfoResponse toResponse(ContactInfo entity);
}
