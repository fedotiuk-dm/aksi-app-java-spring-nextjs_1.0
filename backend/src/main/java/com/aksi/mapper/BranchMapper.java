package com.aksi.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.aksi.api.branch.dto.BranchInfo;
import com.aksi.api.branch.dto.CreateBranchRequest;
import com.aksi.api.branch.dto.UpdateBranchRequest;
import com.aksi.domain.branch.BranchEntity;

/** MapStruct mapper for Branch domain */
@Mapper(componentModel = "spring")
public interface BranchMapper {

  /**
   * Map Branch entity to BranchInfo DTO
   *
   * @param branchEntity Branch entity
   * @return BranchInfo DTO
   */
  BranchInfo toBranchInfo(BranchEntity branchEntity);

  /**
   * Map CreateBranchRequest to Branch entity
   *
   * @param request CreateBranchRequest
   * @return Branch entity
   */
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  BranchEntity toEntity(CreateBranchRequest request);

  /**
   * Update Branch entity from UpdateBranchRequest (only non-null values)
   *
   * @param request UpdateBranchRequest
   * @param branchEntity Target Branch entity to update
   */
  @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  void updateEntityFromRequest(
      UpdateBranchRequest request, @MappingTarget BranchEntity branchEntity);
}
