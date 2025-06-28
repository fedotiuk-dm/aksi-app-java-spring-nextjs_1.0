package com.aksi.domain.client.mapper;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import com.aksi.api.client.dto.ClientResponse;
import com.aksi.api.client.dto.ClientSearchResult;
import com.aksi.api.client.dto.ClientStatistics;
import com.aksi.api.client.dto.CreateClientRequest;
import com.aksi.api.client.dto.UpdateClientRequest;
import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.client.enums.ClientSourceType;
import com.aksi.domain.client.enums.CommunicationMethodType;

/**
 * MapStruct mapper для конвертації між Entity та API DTO.
 * Обробляє всі перетворення типів включно з enum'ами.
 */
@Mapper(componentModel = "spring")
public interface ClientMapper {

    // Default mapping methods for automatic type conversion
    default OffsetDateTime map(LocalDateTime localDateTime) {
        return localDateTime != null ? localDateTime.atOffset(ZoneOffset.UTC) : null;
    }

    default LocalDate mapToLocalDate(LocalDateTime localDateTime) {
        return localDateTime != null ? localDateTime.toLocalDate() : null;
    }

    // === Entity to API DTO ===

    @Mapping(target = "id", source = "id", qualifiedByName = "longToUuid")
    @Mapping(target = "fullName", expression = "java(client.getFullName())")
    @Mapping(target = "sourceType", source = "sourceType", qualifiedByName = "clientSourceTypeToApi")
    @Mapping(target = "communicationMethods", source = "communicationMethods", qualifiedByName = "communicationMethodsToApi")
    @Mapping(target = "statistics", expression = "java(createClientStatistics(client))")
    @Mapping(target = "createdAt", source = "createdAt")
    @Mapping(target = "updatedAt", source = "updatedAt")
    ClientResponse toClientResponse(ClientEntity client);

    @Mapping(target = "id", source = "id", qualifiedByName = "longToUuid")
    @Mapping(target = "fullName", expression = "java(client.getFullName())")
    @Mapping(target = "orderCount", source = "totalOrders")
    @Mapping(target = "lastOrderDate", expression = "java(mapToLocalDate(client.getLastOrderDate()))")
    @Mapping(target = "highlightedFields", ignore = true)
    ClientSearchResult toClientSearchResult(ClientEntity client);

    // === Helper methods ===

    @Named("longToUuid")
    default UUID longToUuid(Long id) {
        return id != null ? UUID.nameUUIDFromBytes(id.toString().getBytes()) : null;
    }

    default ClientStatistics createClientStatistics(ClientEntity client) {
        ClientStatistics statistics = new ClientStatistics();
        statistics.setTotalOrders(Optional.ofNullable(client.getTotalOrders()).orElse(0));
        statistics.setTotalSpent(Optional.ofNullable(client.getTotalSpent()).orElse(0.0));
        statistics.setAverageOrderValue(Optional.ofNullable(client.getAverageOrderValue()).orElse(0.0));
        statistics.setIsVip(client.isVip());

        if (client.getLastOrderDate() != null) {
            statistics.setLastOrderDate(client.getLastOrderDate().toLocalDate());
        }
        if (client.getCreatedAt() != null) {
            statistics.setRegistrationDate(client.getCreatedAt().toLocalDate());
        }

        return statistics;
    }

    // === API DTO to Domain types ===

    @Named("clientSourceTypeToApi")
    default com.aksi.api.client.dto.ClientSourceType clientSourceTypeToApi(ClientSourceType domainType) {
        if (domainType == null) {
            return null;
        }
        return com.aksi.api.client.dto.ClientSourceType.fromValue(domainType.toApiValue());
    }

    @Named("clientSourceTypeFromApi")
    default ClientSourceType clientSourceTypeFromApi(com.aksi.api.client.dto.ClientSourceType apiType) {
        if (apiType == null) {
            return null;
        }
        return ClientSourceType.fromApiValue(apiType.getValue());
    }

    @Named("communicationMethodsToApi")
    default List<com.aksi.api.client.dto.CommunicationMethod> communicationMethodsToApi(
            List<CommunicationMethodType> domainMethods) {
        if (domainMethods == null) {
            return null;
        }
        return domainMethods.stream()
                .map(this::communicationMethodToApi)
                .collect(Collectors.toList());
    }

    @Named("communicationMethodsFromApi")
    default List<CommunicationMethodType> communicationMethodsFromApi(
            List<com.aksi.api.client.dto.CommunicationMethod> apiMethods) {
        if (apiMethods == null) {
            return null;
        }
        return apiMethods.stream()
                .map(this::communicationMethodFromApi)
                .collect(Collectors.toList());
    }

    @Named("communicationMethodToApi")
    default com.aksi.api.client.dto.CommunicationMethod communicationMethodToApi(CommunicationMethodType domainMethod) {
        if (domainMethod == null) {
            return null;
        }
        return com.aksi.api.client.dto.CommunicationMethod.fromValue(domainMethod.toApiValue());
    }

    @Named("communicationMethodFromApi")
    default CommunicationMethodType communicationMethodFromApi(com.aksi.api.client.dto.CommunicationMethod apiMethod) {
        if (apiMethod == null) {
            return null;
        }
        return CommunicationMethodType.fromApiValue(apiMethod.getValue());
    }

    // === Request mappings (for Service calls) ===

    default ClientSourceType extractSourceType(CreateClientRequest request) {
        return clientSourceTypeFromApi(request.getSourceType());
    }

    default List<CommunicationMethodType> extractCommunicationMethods(CreateClientRequest request) {
        return communicationMethodsFromApi(request.getCommunicationMethods());
    }

    default ClientSourceType extractSourceType(UpdateClientRequest request) {
        return clientSourceTypeFromApi(request.getSourceType());
    }

    default List<CommunicationMethodType> extractCommunicationMethods(UpdateClientRequest request) {
        return communicationMethodsFromApi(request.getCommunicationMethods());
    }

    // === List mappings ===

    default List<ClientResponse> toClientResponseList(List<ClientEntity> clients) {
        if (clients == null) {
            return null;
        }
        return clients.stream()
                .map(this::toClientResponse)
                .collect(Collectors.toList());
    }

    default List<ClientSearchResult> toClientSearchResultList(List<ClientEntity> clients) {
        if (clients == null) {
            return null;
        }
        return clients.stream()
                .map(this::toClientSearchResult)
                .collect(Collectors.toList());
    }
}
