package com.aksi.domain.client.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Value Object для адреси клієнта.
 * Immutable об'єкт, що представляє адресну інформацію.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class Address {

    @Column(name = "street", length = 200)
    @Size(max = 200, message = "Назва вулиці не може перевищувати 200 символів")
    private String street;

    @Column(name = "city", length = 100)
    @Size(max = 100, message = "Назва міста не може перевищувати 100 символів")
    private String city;

    @Column(name = "region", length = 100)
    @Size(max = 100, message = "Назва регіону не може перевищувати 100 символів")
    private String region;

    @Column(name = "postal_code", length = 10)
    @Size(max = 10, message = "Поштовий індекс не може перевищувати 10 символів")
    private String postalCode;

    @Column(name = "country", length = 100)
    @Size(max = 100, message = "Назва країни не може перевищувати 100 символів")
    private String country;



    public static Address empty() {
        return Address.builder()
                .country("Україна")
                .build();
    }

    public static Address ukrainian(String street, String city, String region, String postalCode) {
        return Address.builder()
                .street(street)
                .city(city)
                .region(region)
                .postalCode(postalCode)
                .country("Україна")
                .build();
    }



    /**
     * Перевірка чи адреса порожня
     */
    public boolean isEmpty() {
        return street == null && city == null && region == null && postalCode == null;
    }

    /**
     * Повна адреса у вигляді рядка
     */
    public String getFullAddress() {
        if (isEmpty()) {
            return "";
        }

        StringBuilder sb = new StringBuilder();
        if (street != null) sb.append(street);
        if (city != null) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(city);
        }
        if (region != null) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(region);
        }
        if (postalCode != null) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(postalCode);
        }
        if (country != null && !country.equals("Україна")) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(country);
        }

        return sb.toString();
    }

    @Override
    public String toString() {
        return getFullAddress();
    }
}
