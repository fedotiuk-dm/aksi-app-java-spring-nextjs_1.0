package com.aksi.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.aksi.api.customer.dto.CreateCustomerRequest;
import com.aksi.api.customer.dto.CustomerInfo;
import com.aksi.api.customer.dto.UpdateCustomerRequest;
import com.aksi.domain.customer.CustomerEntity;

/** MapStruct mapper for Customer entity and DTOs */
@Mapper(componentModel = "spring")
public interface CustomerMapper {

  // Customer entity to CustomerInfo DTO
  CustomerInfo toCustomerInfo(CustomerEntity customerEntity);

  // CreateCustomerRequest to Customer entity
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  @Mapping(target = "active", constant = "true")
  CustomerEntity toEntity(CreateCustomerRequest request);

  // Update Customer entity from UpdateCustomerRequest
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  void updateEntityFromRequest(
      UpdateCustomerRequest request, @MappingTarget CustomerEntity customerEntity);
}
