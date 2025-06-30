package com.aksi.domain.branch.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

import com.aksi.api.branch.dto.Address;
import com.aksi.api.branch.dto.AddressResponse;
import com.aksi.api.branch.dto.CreateAddressRequest;
import com.aksi.api.branch.dto.UpdateAddressRequest;
import com.aksi.domain.branch.entity.BranchEntity;
import com.aksi.shared.mapper.BaseMapperConfig;

/**
 * Mapper для Address ↔ BranchEntity адресних полів Відповідальність: конвертація між розширеними
 * Entity полями та спрощеними API полями.
 */
@Mapper(
    componentModel = "spring",
    uses = {BaseMapperConfig.class},
    unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AddressMapper {

  // DTO → Entity mappings

  /** CreateAddressRequest → BranchEntity (тільки адресні поля). */
  @Mapping(target = "street", source = "street", qualifiedByName = "parseStreetFromAddress")
  @Mapping(
      target = "buildingNumber",
      source = "street",
      qualifiedByName = "parseBuildingFromAddress")
  @Mapping(target = "apartmentOffice", ignore = true) // не можна спарсити з street
  @Mapping(target = "district", ignore = true) // немає в API
  BranchEntity toEntityFields(CreateAddressRequest request);

  /** UpdateAddressRequest → BranchEntity (тільки адресні поля). */
  @Mapping(target = "street", source = "street", qualifiedByName = "parseStreetFromAddress")
  @Mapping(
      target = "buildingNumber",
      source = "street",
      qualifiedByName = "parseBuildingFromAddress")
  @Mapping(target = "apartmentOffice", ignore = true)
  @Mapping(target = "district", ignore = true)
  BranchEntity toEntityFieldsForUpdate(UpdateAddressRequest request);

  /** Address → BranchEntity (тільки адресні поля). */
  @Mapping(target = "street", source = "street", qualifiedByName = "parseStreetFromAddress")
  @Mapping(
      target = "buildingNumber",
      source = "street",
      qualifiedByName = "parseBuildingFromAddress")
  @Mapping(target = "apartmentOffice", ignore = true)
  @Mapping(target = "district", ignore = true)
  BranchEntity toEntityFields(Address address);

  // Entity → DTO mappings

  /** BranchEntity → AddressResponse. */
  @Mapping(target = "street", source = ".", qualifiedByName = "buildFullStreet")
  AddressResponse toAddressResponse(BranchEntity entity);

  /** BranchEntity → Address. */
  @Mapping(target = "street", source = ".", qualifiedByName = "buildFullStreet")
  Address toAddress(BranchEntity entity);

  // Address parsing utility methods

  /**
   * Парсить вулицю з повної адреси (вилучає номери будинків) Приклад: "вул. Хрещатик, 1" → "вул.
   * Хрещатик"
   */
  @Named("parseStreetFromAddress")
  default String parseStreetFromAddress(String fullAddress) {
    if (fullAddress == null || fullAddress.trim().isEmpty()) {
      return null;
    }

    // Простий parsing: все до першої коми або цифри
    String[] parts = fullAddress.split(",");
    if (parts.length > 0) {
      String streetPart = parts[0].trim();
      // Видаляємо номери в кінці
      return streetPart.replaceAll("\\s+\\d+.*$", "").trim();
    }

    return fullAddress.trim();
  }

  /** Парсить номер будинку з повної адреси Приклад: "вул. Хрещатик, 1" → "1". */
  @Named("parseBuildingFromAddress")
  default String parseBuildingFromAddress(String fullAddress) {
    if (fullAddress == null || fullAddress.trim().isEmpty()) {
      return null;
    }

    // Простий parsing: шукаємо числа після коми або в кінці
    String[] parts = fullAddress.split(",");
    for (String part : parts) {
      String trimmed = part.trim();
      if (trimmed.matches("^\\d+.*")) {
        return trimmed.replaceAll("[^\\d\\w/-]", "").trim();
      }
    }

    // Якщо немає коми, шукаємо числа в кінці
    if (fullAddress.matches(".*\\s+\\d+.*$")) {
      return fullAddress.replaceAll("^.*\\s+(\\d+.*)$", "$1").trim();
    }

    return null;
  }

  /**
   * Будує повну адресу для API з окремих полів Entity Приклад: street="вул. Хрещатик",
   * buildingNumber="1" → "вул. Хрещатик, 1"
   */
  @Named("buildFullStreet")
  default String buildFullStreet(BranchEntity entity) {
    if (entity == null) {
      return null;
    }

    StringBuilder address = new StringBuilder();

    if (entity.getStreet() != null && !entity.getStreet().trim().isEmpty()) {
      address.append(entity.getStreet().trim());
    }

    if (entity.getBuildingNumber() != null && !entity.getBuildingNumber().trim().isEmpty()) {
      if (address.length() > 0) {
        address.append(", ");
      }
      address.append(entity.getBuildingNumber().trim());
    }

    if (entity.getApartmentOffice() != null && !entity.getApartmentOffice().trim().isEmpty()) {
      if (address.length() > 0) {
        address.append(", оф. ");
      }
      address.append(entity.getApartmentOffice().trim());
    }

    return address.length() > 0 ? address.toString() : null;
  }
}
