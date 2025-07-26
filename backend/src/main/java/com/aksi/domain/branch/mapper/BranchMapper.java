package com.aksi.domain.branch.mapper;

import java.util.List;
import java.util.UUID;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.aksi.api.branch.dto.BranchResponse;
import com.aksi.api.branch.dto.CreateBranchRequest;
import com.aksi.api.branch.dto.UpdateBranchRequest;
import com.aksi.domain.branch.entity.BranchEntity;

/** MapStruct mapper for converting between BranchEntity and DTOs */
@Mapper(
    componentModel = "spring",
    imports = {UUID.class},
    unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface BranchMapper {

  /** Convert BranchEntity to BranchResponse */
  @Mapping(target = "isActive", source = "active")
  @Mapping(target = "workingSchedule", ignore = true) // Will be handled by WorkingScheduleMapper
  @Mapping(target = "phone", source = "contactInfo.phone")
  @Mapping(target = "email", source = "contactInfo.email")
  BranchResponse toResponse(BranchEntity entity);

  /** Convert CreateBranchRequest to BranchEntity */
  @Mapping(target = "active", constant = "true")
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  @Mapping(target = "workingSchedules", ignore = true) // Will be handled separately
  @Mapping(target = "contactInfo.phone", source = "phone")
  @Mapping(target = "contactInfo.email", source = "email")
  BranchEntity toEntity(CreateBranchRequest request);

  /** Update BranchEntity from UpdateBranchRequest */
  @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
  @Mapping(target = "id", ignore = true)
  @Mapping(
      target = "receiptPrefix",
      ignore = true) // Receipt prefix cannot be changed after creation
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  @Mapping(target = "workingSchedules", ignore = true) // Will be handled separately
  @Mapping(target = "active", source = "isActive")
  @Mapping(target = "contactInfo.phone", source = "phone")
  @Mapping(target = "contactInfo.email", source = "email")
  void updateEntityFromRequest(@MappingTarget BranchEntity entity, UpdateBranchRequest request);

  /** Convert list of BranchEntity to list of BranchResponse */
  List<BranchResponse> toResponseList(List<BranchEntity> entities);
}
