package com.aksi.domain.client.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.aksi.domain.client.dto.AddressDTO;
import com.aksi.domain.client.dto.BaseClientRequest;
import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.client.dto.CreateClientRequest;
import com.aksi.domain.client.dto.UpdateClientRequest;
import com.aksi.domain.client.entity.AddressEntity;
import com.aksi.domain.client.entity.ClientEntity;

/**
 * Маппер для перетворення між ClientEntity і ClientResponse.
 */
@Mapper(componentModel = "spring", uses = {AddressMapper.class})
public interface ClientMapper {

    /**
     * Перетворити ClientEntity у ClientResponse.
     * @param client параметр client
     * @return об'єкт ClientResponse, створений на основі даних клієнта
     */
    @Mapping(target = "fullName", expression = "java(client.getLastName() + \" \" + client.getFirstName())")
    @Mapping(target = "structuredAddress", source = "address")
    @Mapping(target = "address", source = "address", qualifiedByName = "addressEntityToString")
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
}
