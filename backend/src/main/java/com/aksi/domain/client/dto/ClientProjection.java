package com.aksi.domain.client.dto;

import java.util.UUID;

/**
 * Проекція для клієнтів, що містить тільки основні поля.
 * Використовується для запитів, щоб уникнути проблем з lazy loading колекцій.
 */
public interface ClientProjection {
    UUID getId();
    String getFirstName();
    String getLastName();
    String getPhone();
    String getEmail();

    /**
     * Допоміжний метод для отримання повного імені.
     */
    default String getFullName() {
        return getLastName() + " " + getFirstName();
    }
}
