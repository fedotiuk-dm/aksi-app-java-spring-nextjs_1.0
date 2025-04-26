package com.aksi.domain.client.dto;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

import com.aksi.domain.client.entity.ClientSourceEntity;
import com.aksi.domain.client.entity.CommunicationChannelEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для відповіді з даними клієнта.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientResponse {

    /**
     * Ідентифікатор клієнта.
     */
    private UUID id;

    /**
     * Прізвище клієнта.
     */
    private String lastName;

    /**
     * Ім'я клієнта.
     */
    private String firstName;

    /**
     * Повне ім'я клієнта (прізвище + ім'я).
     */
    private String fullName;

    /**
     * Номер телефону клієнта.
     */
    private String phone;

    /**
     * Email клієнта.
     */
    private String email;

    /**
     * Адреса клієнта.
     */
    private String address;

    /**
     * Канали комунікації з клієнтом.
     */
    private Set<CommunicationChannelEntity> communicationChannels;

    /**
     * Джерело, з якого клієнт дізнався про хімчистку.
     */
    private ClientSourceEntity source;

    /**
     * Деталі джерела, якщо вибрано "Інше".
     */
    private String sourceDetails;

    /**
     * Дата створення запису.
     */
    private LocalDateTime createdAt;

    /**
     * Дата останнього оновлення запису.
     */
    private LocalDateTime updatedAt;
}
