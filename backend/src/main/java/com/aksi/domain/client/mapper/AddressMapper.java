package com.aksi.domain.client.mapper;

import java.util.StringJoiner;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import com.aksi.domain.client.dto.AddressDTO;
import com.aksi.domain.client.entity.AddressEntity;

/**
 * Маппер для конвертації між DTO та Entity адреси.
 */
@Mapper(componentModel = "spring")
public interface AddressMapper {

    /**
     * Конвертує AddressEntity в AddressDTO.
     *
     * @param entity сутність адреси
     * @return DTO адреси
     */
    AddressDTO toDto(AddressEntity entity);

    /**
     * Конвертує AddressDTO в AddressEntity.
     *
     * @param dto DTO адреси
     * @return сутність адреси
     */
    @Mapping(target = "id", ignore = true)
    AddressEntity toEntity(AddressDTO dto);

    /**
     * Конвертує рядкову адресу в об'єкт AddressDTO.
     *
     * @param addressString рядкова адреса
     * @return об'єкт AddressDTO
     */
    @Named("stringToAddressDTO")
    default AddressDTO stringToAddressDTO(String addressString) {
        if (addressString == null || addressString.isEmpty()) {
            return null;
        }

        return AddressDTO.builder()
                .fullAddress(addressString)
                .build();
    }

    /**
     * Конвертує об'єкт AddressDTO в рядкову адресу.
     *
     * @param addressDTO об'єкт структурованої адреси
     * @return рядкова адреса
     */
    @Named("addressDTOToString")
    default String addressDTOToString(AddressDTO addressDTO) {
        if (addressDTO == null) {
            return null;
        }

        return addressDTO.toAddressString();
    }

    /**
     * Конвертує рядкову адресу в AddressEntity.
     *
     * @param addressString рядкова адреса
     * @return сутність адреси
     */
    @Named("stringToAddressEntity")
    default AddressEntity stringToAddressEntity(String addressString) {
        if (addressString == null || addressString.isEmpty()) {
            return null;
        }

        return AddressEntity.builder()
                .fullAddress(addressString)
                .build();
    }

    /**
     * Конвертує AddressEntity в рядок.
     *
     * @param entity сутність адреси
     * @return рядкова адреса
     */
    @Named("addressEntityToString")
    default String entityToString(AddressEntity entity) {
        if (entity == null) {
            return null;
        }

        if (entity.getFullAddress() != null && !entity.getFullAddress().isEmpty()) {
            return entity.getFullAddress();
        }

        StringJoiner joiner = new StringJoiner(", ");

        addIfNotEmpty(joiner, entity.getCity());
        addIfNotEmpty(joiner, entity.getStreet());
        addIfNotEmpty(joiner, entity.getBuilding(), "буд. ");
        addIfNotEmpty(joiner, entity.getApartment(), "кв. ");
        addIfNotEmpty(joiner, entity.getPostalCode());

        String result = joiner.toString();
        return result.isEmpty() ? null : result;
    }

    private void addIfNotEmpty(StringJoiner joiner, String value) {
        if (value != null && !value.isEmpty()) {
            joiner.add(value);
        }
    }

    private void addIfNotEmpty(StringJoiner joiner, String value, String prefix) {
        if (value != null && !value.isEmpty()) {
            joiner.add(prefix + value);
        }
    }
}
