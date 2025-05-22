package com.aksi.domain.client.dto;

import java.util.stream.Collectors;
import java.util.stream.Stream;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для передачі інформації про адресу клієнта.
 * Містить як структуровану інформацію (місто, вулиця тощо),
 * так і можливість використання повної адреси як єдиного рядка.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressDTO {

    /**
     * Місто.
     */
    private String city;

    /**
     * Вулиця.
     */
    private String street;

    /**
     * Будинок.
     */
    private String building;

    /**
     * Квартира або офіс.
     */
    private String apartment;

    /**
     * Поштовий індекс.
     */
    private String postalCode;

    /**
     * Повна адреса як єдиний рядок.
     * Використовується, якщо структурована інформація не вказана або для зворотної сумісності.
     */
    private String fullAddress;

    /**
     * Конвертує об'єкт AddressDTO в рядок для збереження в базі даних.
     * Якщо є fullAddress, повертає його, інакше формує рядок з окремих компонентів.
     *
     * @return рядковий формат адреси
     */
    public String toAddressString() {
        if (fullAddress != null && !fullAddress.isEmpty()) {
            return fullAddress;
        }

        // Використовуємо Stream API для формування адреси
        return Stream.of(
                city,
                street,
                building != null ? "буд. " + building : null,
                apartment != null ? "кв. " + apartment : null,
                postalCode
            )
            .filter(part -> part != null && !part.isEmpty())
            .collect(Collectors.joining(", "));
    }

    /**
     * Створює об'єкт AddressDTO з рядка адреси.
     * Використовується для зворотної сумісності.
     *
     * @param addressString рядковий формат адреси
     * @return об'єкт AddressDTO з заповненим полем fullAddress
     */
    public static AddressDTO fromAddressString(String addressString) {
        if (addressString == null || addressString.isEmpty()) {
            return null;
        }

        return AddressDTO.builder()
                .fullAddress(addressString)
                .build();
    }
}
