package com.aksi.domain.client.dto;

import java.util.stream.Collectors;
import java.util.stream.Stream;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

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
    @Size(min = 2, max = 100, message = "Назва міста повинна містити від 2 до 100 символів")
    @Pattern(regexp = "^[\\p{L}\\s.,\\-']+$", message = "Некоректний формат назви міста")
    private String city;

    /**
     * Вулиця.
     */
    @Size(min = 2, max = 150, message = "Назва вулиці повинна містити від 2 до 150 символів")
    @Pattern(regexp = "^[\\p{L}\\s0-9.,\\-']+$", message = "Некоректний формат назви вулиці")
    private String street;

    /**
     * Будинок.
     */
    @Size(max = 20, message = "Номер будинку не може перевищувати 20 символів")
    @Pattern(regexp = "^[\\p{L}\\s0-9.,\\-'/]+$", message = "Некоректний формат номера будинку")
    private String building;

    /**
     * Квартира або офіс.
     */
    @Size(max = 20, message = "Номер квартири не може перевищувати 20 символів")
    @Pattern(regexp = "^[\\p{L}\\s0-9.,\\-'/]+$", message = "Некоректний формат номера квартири")
    private String apartment;

    /**
     * Поштовий індекс.
     */
    @Size(max = 10, message = "Поштовий індекс не може перевищувати 10 символів")
    @Pattern(regexp = "^[0-9\\-]+$", message = "Поштовий індекс повинен містити лише цифри та тире")
    private String postalCode;

    /**
     * Повна адреса як єдиний рядок.
     * Використовується, якщо структурована інформація не вказана або для зворотної сумісності.
     */
    @Size(min = 5, max = 500, message = "Адреса повинна містити від 5 до 500 символів")
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
