package com.aksi.domain.client.mapper;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.aksi.domain.client.dto.AddressDTO;
import com.aksi.domain.client.dto.BaseClientRequest;
import com.aksi.domain.client.dto.ClientCategoryDTO;
import com.aksi.domain.client.dto.ClientPreferenceDTO;
import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.client.dto.CreateClientRequest;
import com.aksi.domain.client.dto.UpdateClientRequest;
import com.aksi.domain.client.entity.AddressEntity;
import com.aksi.domain.client.entity.ClientCategoryEntity;
import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.client.entity.ClientPreferenceEntity;
import com.aksi.domain.order.dto.OrderSummaryDTO;
import com.aksi.domain.order.entity.OrderEntity;

/**
 * Маппер для перетворення між ClientEntity і ClientResponse.
 */
@Mapper(componentModel = "spring", uses = {AddressMapper.class}, imports = {ArrayList.class, HashSet.class})
public interface ClientMapper {

    /**
     * Перетворити ClientEntity у ClientResponse.
     * @param client параметр client
     * @return об'єкт ClientResponse, створений на основі даних клієнта
     */
    @Mapping(target = "fullName", expression = "java(client.getLastName() + \" \" + client.getFirstName())")
    @Mapping(target = "structuredAddress", source = "address")
    @Mapping(target = "address", source = "address", qualifiedByName = "addressEntityToString")
    @Mapping(target = "category", expression = "java(mapClientCategory(client.getCategory()))")
    @Mapping(target = "preferences", expression = "java(mapClientPreferences(client.getPreferences()))")
    @Mapping(target = "recentOrders", expression = "java(mapRecentOrders(client.getOrders()))")
    @Mapping(target = "orderCount", expression = "java(client.getOrders() != null ? client.getOrders().size() : 0)")
    ClientResponse toClientResponse(ClientEntity client);

    /**
     * Створити нову сутність клієнта з запиту на створення.
     *
     * @param request запит на створення клієнта
     * @return нова сутність клієнта
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "address", source = "structuredAddress")
    @Mapping(target = "category", constant = "STANDARD")
    @Mapping(target = "preferences", expression = "java(new HashSet<>())")
    @Mapping(target = "orders", expression = "java(new ArrayList<>())")
    ClientEntity toEntity(CreateClientRequest request);

    /**
     * Застосувати дані з запиту на створення клієнта до сутності.
     *
     * @param request запит з даними клієнта
     * @param entity сутність клієнта для оновлення
     */
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "address", source = "structuredAddress")
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "preferences", ignore = true)
    @Mapping(target = "orders", ignore = true)
    void updateFromCreateRequest(CreateClientRequest request, @MappingTarget ClientEntity entity);

    /**
     * Оновити існуючу сутність клієнта з даних запиту.
     * Ігнорує null значення, зберігаючи існуючі дані.
     *
     * @param request запит на оновлення
     * @param entity сутність для оновлення
     */
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "address", source = "structuredAddress")
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "preferences", ignore = true)
    @Mapping(target = "orders", ignore = true)
    void updateFromUpdateRequest(UpdateClientRequest request, @MappingTarget ClientEntity entity);

    /**
     * Обробка рядкової адреси.
     * Конвертує рядкову адресу в сутність, якщо структурована не вказана.
     *
     * @param request запит з даними клієнта
     * @param addressMapper маппер для адрес
     * @return сутність адреси
     */
    @Named("processStringAddress")
    default AddressEntity processStringAddress(BaseClientRequest request, AddressMapper addressMapper) {
        if (request.getStructuredAddress() != null) {
            return addressMapper.toEntity(request.getStructuredAddress());
        } else if (request.getAddress() != null && !request.getAddress().isEmpty()) {
            return addressMapper.stringToAddressEntity(request.getAddress());
        }
        return null;
    }

    /**
     * Створює об'єкт клієнта з CreateClientRequest.
     * Використовує структуровану або рядкову адресу.
     *
     * @param request дані для створення клієнта
     * @param addressMapper маппер для адрес
     * @return нова сутність клієнта
     */
    default ClientEntity createEntityFromRequest(CreateClientRequest request, AddressMapper addressMapper) {
        if (request == null) {
            return null;
        }

        ClientEntity entity = toEntity(request);

        // Якщо структурована адреса null, але є рядкова, використовуємо її
        if (entity.getAddress() == null && request.getAddress() != null && !request.getAddress().isEmpty()) {
            entity.setAddress(addressMapper.stringToAddressEntity(request.getAddress()));
        }

        return entity;
    }

    /**
     * Оновлює сутність клієнта з UpdateClientRequest.
     * Обробляє як структуровану, так і рядкову адресу.
     *
     * @param request дані для оновлення
     * @param entity існуюча сутність
     * @param addressMapper маппер для адрес
     * @return оновлена сутність
     */
    default ClientEntity updateEntityFromUpdateRequest(UpdateClientRequest request, ClientEntity entity, AddressMapper addressMapper) {
        if (entity == null || request == null) {
            return entity;
        }

        updateFromUpdateRequest(request, entity);

        // Якщо структурована адреса не оновлена, але є рядкова
        if (request.getStructuredAddress() == null && request.getAddress() != null && !request.getAddress().isEmpty()) {
            if (entity.getAddress() != null) {
                entity.getAddress().setFullAddress(request.getAddress());
                // Скидаємо структуровані поля, оскільки тепер використовуємо рядкову адресу
                entity.getAddress().setCity(null);
                entity.getAddress().setStreet(null);
                entity.getAddress().setBuilding(null);
                entity.getAddress().setApartment(null);
                entity.getAddress().setPostalCode(null);
            } else {
                entity.setAddress(addressMapper.stringToAddressEntity(request.getAddress()));
            }
        }

        return entity;
    }

    /**
     * Конвертує AddressDTO в AddressEntity.
     *
     * @param dto об'єкт AddressDTO
     * @return об'єкт AddressEntity
     */
    default AddressEntity addressDtoToEntity(AddressDTO dto, AddressMapper addressMapper) {
        if (dto == null) {
            return null;
        }
        return addressMapper.toEntity(dto);
    }

    /**
     * Конвертує AddressEntity в AddressDTO.
     *
     * @param entity об'єкт AddressEntity
     * @return об'єкт AddressDTO
     */
    default AddressDTO addressEntityToDto(AddressEntity entity, AddressMapper addressMapper) {
        if (entity == null) {
            return null;
        }
        return addressMapper.toDto(entity);
    }

    /**
     * Мапить категорію клієнта в DTO.
     *
     * @param category категорія клієнта
     * @return DTO категорії клієнта
     */
    default ClientCategoryDTO mapClientCategory(ClientCategoryEntity category) {
        return ClientCategoryDTO.fromEntity(category);
    }

    /**
     * Мапить переваги клієнта в DTO.
     *
     * @param preferences набір переваг клієнта
     * @return набір DTO переваг клієнта
     */
    default Set<ClientPreferenceDTO> mapClientPreferences(Set<ClientPreferenceEntity> preferences) {
        if (preferences == null || preferences.isEmpty()) {
            return new HashSet<>();
        }

        return preferences.stream()
                .map(pref -> ClientPreferenceDTO.builder()
                        .id(pref.getId())
                        .key(pref.getKey())
                        .value(pref.getValue())
                        .build())
                .collect(Collectors.toSet());
    }

    /**
     * Отримує останні 5 замовлень клієнта та перетворює їх у короткий формат DTO.
     *
     * @param orders список замовлень клієнта
     * @return список коротких DTO замовлень
     */
    default List<OrderSummaryDTO> mapRecentOrders(List<OrderEntity> orders) {
        if (orders == null || orders.isEmpty()) {
            return new ArrayList<>();
        }

        return orders.stream()
                .sorted(Comparator.comparing(OrderEntity::getCreatedDate).reversed())
                .limit(5)
                .map(order -> OrderSummaryDTO.builder()
                        .id(order.getId())
                        .receiptNumber(order.getReceiptNumber())
                        .status(order.getStatus())
                        .totalAmount(order.getTotalAmount())
                        .createdAt(order.getCreatedDate())
                        .completionDate(order.getCompletedDate())
                        .itemCount(order.getItems() != null ? order.getItems().size() : 0)
                        .build())
                .collect(Collectors.toList());
    }
}
