package com.aksi.domain.client.entity;

import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Сутність адреси клієнта.
 */
@Entity
@Table(name = "addresses")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressEntity {

    /**
     * Унікальний ідентифікатор адреси.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * Місто.
     */
    @Column(name = "city")
    private String city;

    /**
     * Вулиця.
     */
    @Column(name = "street")
    private String street;

    /**
     * Будинок.
     */
    @Column(name = "building")
    private String building;

    /**
     * Квартира або офіс.
     */
    @Column(name = "apartment")
    private String apartment;

    /**
     * Поштовий індекс.
     */
    @Column(name = "postal_code")
    private String postalCode;

    /**
     * Повна адреса як єдиний рядок.
     * Використовується, якщо структурована інформація не вказана або для зворотної сумісності.
     */
    @Column(name = "full_address", length = 500)
    private String fullAddress;

    /**
     * Форматує повну адресу на основі структурованих полів.
     * Відповідає за бізнес-логіку форматування адреси.
     *
     * @return форматована адреса як рядок
     */
    public String formatFullAddress() {
        // Перевіряємо наявність fullAddress, якщо є - використовуємо його
        if (fullAddress != null && !fullAddress.isEmpty()) {
            return fullAddress;
        }

        // Функціональний підхід: використовуємо Stream для обробки полів адреси
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
}
