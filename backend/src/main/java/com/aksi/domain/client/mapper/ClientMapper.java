package com.aksi.domain.client.mapper;

import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.client.enums.ClientSourceType;
import com.aksi.domain.client.enums.CommunicationMethodType;
import com.aksi.domain.client.service.ClientContactService;
import com.aksi.domain.client.service.ClientAnalyticsService;
import com.aksi.api.client.dto.*;
import org.mapstruct.*;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * MapStruct mapper для конверсії між Entity та API DTO
 * Покриває всі згенеровані DTO класи з OpenAPI
 */
@Mapper(componentModel = "spring")
public interface ClientMapper {

    // === CREATE/UPDATE REQUEST → ENTITY ===

    /**
     * Конверсія CreateClientRequest до Entity
     */
    @Mapping(target = "uuid", ignore = true)
    @Mapping(target = "isActive", constant = "true")
    @Mapping(target = "address", source = "address", qualifiedByName = "createAddressToString")
    @Mapping(target = "communicationMethods", source = "communicationMethods", qualifiedByName = "apiCommunicationMethodsToDomain")
    @Mapping(target = "sourceType", source = "sourceType", qualifiedByName = "apiSourceTypeToDomain")
    ClientEntity toEntity(CreateClientRequest request);

    /**
     * Оновлення Entity з UpdateClientRequest
     */
    @Mapping(target = "uuid", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "address", source = "address", qualifiedByName = "updateAddressToString")
    @Mapping(target = "communicationMethods", source = "communicationMethods", qualifiedByName = "apiCommunicationMethodsToDomain")
    @Mapping(target = "sourceType", source = "sourceType", qualifiedByName = "apiSourceTypeToDomain")
    void updateEntityFromRequest(UpdateClientRequest request, @MappingTarget ClientEntity entity);

    /**
     * Конверсія UpdateClientContactsRequest до Service DTO
     */
    @Mapping(target = "address", source = "address", qualifiedByName = "updateAddressToString")
    @Mapping(target = "communicationMethods", source = "communicationMethods", qualifiedByName = "apiCommunicationMethodsToDomain")
    ClientContactService.ContactUpdateRequest toContactUpdateRequest(UpdateClientContactsRequest request);

    // === ENTITY → RESPONSE DTO ===

    /**
     * Конверсія Entity до ClientResponse
     */
    @Mapping(target = "id", source = "uuid")
    @Mapping(target = "fullName", expression = "java(entity.getFullName())")
    @Mapping(target = "address", source = "address", qualifiedByName = "stringToAddressDto")
    @Mapping(target = "communicationMethods", source = "communicationMethods", qualifiedByName = "domainCommunicationMethodsToApi")
    @Mapping(target = "sourceType", source = "sourceType", qualifiedByName = "domainSourceTypeToApi")
    @Mapping(target = "createdAt", source = "createdAt", qualifiedByName = "localDateTimeToOffsetDateTime")
    @Mapping(target = "updatedAt", source = "updatedAt", qualifiedByName = "localDateTimeToOffsetDateTime")
    @Mapping(target = "statistics", ignore = true) // Буде встановлено окремо через delegate
    ClientResponse toClientResponse(ClientEntity entity);

    /**
     * Конверсія Entity до ClientSearchResult
     */
    @Mapping(target = "id", source = "uuid")
    @Mapping(target = "fullName", expression = "java(entity.getFullName())")
    @Mapping(target = "lastOrderDate", ignore = true) // TODO: Інтеграція з Order domain
    @Mapping(target = "orderCount", constant = "0") // TODO: Інтеграція з Order domain
    @Mapping(target = "highlightedFields", ignore = true) // Встановлюється окремо
    ClientSearchResult toSearchResult(ClientEntity entity);

    /**
     * Конверсія списку Entity до списку ClientResponse
     */
    List<ClientResponse> toClientResponseList(List<ClientEntity> entities);

    /**
     * Конверсія списку Entity до списку ClientSearchResult
     */
    List<ClientSearchResult> toSearchResultList(List<ClientEntity> entities);

    // === SERVICE DTO → API DTO ===

    /**
     * Конверсія ContactInfo до ClientContactsResponse
     */
    @Mapping(target = "id", source = "clientUuid")
    @Mapping(target = "address", source = "address", qualifiedByName = "stringToAddressDto")
    @Mapping(target = "communicationMethods", source = "communicationMethods", qualifiedByName = "domainCommunicationMethodsToApi")
    ClientContactsResponse toContactsResponse(ClientContactService.ClientContactInfo contactInfo);

    /**
     * Конверсія ClientStatistics до API DTO
     */
    @Mapping(target = "isVip", source = "vip")
    @Mapping(target = "registrationDate", source = "registrationDate")
    ClientStatistics toClientStatisticsDto(ClientAnalyticsService.ClientStatistics statistics);

    // === SEARCH REQUEST CONVERSIONS ===

    /**
     * Конверсія ClientSearchRequest до service criteria
     */
    @Mapping(target = "communicationMethod", ignore = true) // Має обробляти тільки перший елемент
    @Mapping(target = "sourceType", source = "sourceType", qualifiedByName = "apiSourceTypeToDomain")
    com.aksi.domain.client.service.ClientSearchService.AdvancedSearchCriteria toSearchCriteria(ClientSearchRequest request);

    // === CUSTOM MAPPING METHODS ===

    /**
     * Конверсія CreateAddressRequest до String
     */
    @Named("createAddressToString")
    default String mapCreateAddress(CreateAddressRequest address) {
        if (address == null) {
            return null;
        }

        StringBuilder sb = new StringBuilder();
        if (address.getStreet() != null) sb.append(address.getStreet());
        if (address.getCity() != null) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(address.getCity());
        }
        if (address.getRegion() != null) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(address.getRegion());
        }
        if (address.getPostalCode() != null) {
            if (sb.length() > 0) sb.append(" ");
            sb.append(address.getPostalCode());
        }
        if (address.getCountry() != null) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(address.getCountry());
        }

        return sb.length() > 0 ? sb.toString().trim() : null;
    }

    /**
     * Конверсія UpdateAddressRequest до String
     */
    @Named("updateAddressToString")
    default String mapUpdateAddress(UpdateAddressRequest address) {
        if (address == null) {
            return null;
        }

        StringBuilder sb = new StringBuilder();
        if (address.getStreet() != null) sb.append(address.getStreet());
        if (address.getCity() != null) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(address.getCity());
        }
        if (address.getRegion() != null) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(address.getRegion());
        }
        if (address.getPostalCode() != null) {
            if (sb.length() > 0) sb.append(" ");
            sb.append(address.getPostalCode());
        }
        if (address.getCountry() != null) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(address.getCountry());
        }

        return sb.length() > 0 ? sb.toString().trim() : null;
    }

    /**
     * Конверсія String до AddressDto
     */
    @Named("stringToAddressDto")
    default AddressDto mapStringToAddress(String address) {
        if (address == null || address.trim().isEmpty()) {
            return null;
        }

        AddressDto dto = new AddressDto();
        dto.setStreet(address); // Простий парсинг - повна адреса як street
        return dto;
    }

    /**
     * Конверсія API CommunicationMethod до Domain enum
     */
    @Named("apiCommunicationMethodsToDomain")
    default Set<CommunicationMethodType> mapApiCommunicationMethodsToDomain(List<CommunicationMethod> methods) {
        if (methods == null) {
            return Set.of();
        }

        return methods.stream()
            .map(method -> CommunicationMethodType.valueOf(method.name()))
            .collect(Collectors.toSet());
    }

    /**
     * Конверсія Domain enum до API CommunicationMethod
     */
    @Named("domainCommunicationMethodsToApi")
    default List<CommunicationMethod> mapDomainCommunicationMethodsToApi(Set<CommunicationMethodType> methods) {
        if (methods == null) {
            return List.of();
        }

        return methods.stream()
            .map(method -> CommunicationMethod.valueOf(method.name()))
            .collect(Collectors.toList());
    }

    /**
     * Конверсія API ClientSourceType до Domain enum
     */
    @Named("apiSourceTypeToDomain")
    default ClientSourceType mapApiSourceTypeToDomain(com.aksi.api.client.dto.ClientSourceType sourceType) {
        if (sourceType == null) {
            return null;
        }
        return ClientSourceType.valueOf(sourceType.name());
    }

    /**
     * Конверсія Domain enum до API ClientSourceType
     */
    @Named("domainSourceTypeToApi")
    default com.aksi.api.client.dto.ClientSourceType mapDomainSourceTypeToApi(ClientSourceType sourceType) {
        if (sourceType == null) {
            return null;
        }
        return com.aksi.api.client.dto.ClientSourceType.valueOf(sourceType.name());
    }

    /**
     * Конверсія LocalDateTime до OffsetDateTime
     */
    @Named("localDateTimeToOffsetDateTime")
    default OffsetDateTime toOffsetDateTime(LocalDateTime localDateTime) {
        return localDateTime != null ? localDateTime.atOffset(ZoneOffset.UTC) : null;
    }

    /**
     * Конверсія OffsetDateTime до LocalDateTime
     */
    @Named("offsetDateTimeToLocalDateTime")
    default LocalDateTime toLocalDateTime(OffsetDateTime offsetDateTime) {
        return offsetDateTime != null ? offsetDateTime.toLocalDateTime() : null;
    }
}
