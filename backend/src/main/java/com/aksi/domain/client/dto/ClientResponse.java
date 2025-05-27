package com.aksi.domain.client.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import com.aksi.domain.client.entity.CommunicationChannelEntity;
import com.aksi.domain.client.enums.ClientSource;
import com.aksi.domain.order.dto.OrderSummaryDTO;
import com.fasterxml.jackson.annotation.JsonInclude;

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
@JsonInclude(JsonInclude.Include.NON_NULL)
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
     * Адреса клієнта в рядковому форматі.
     */
    private String address;

    /**
     * Структурована адреса клієнта для фронтенду.
     * Заповнюється на основі рядкової адреси при маппінгу.
     */
    private AddressDTO structuredAddress;

    /**
     * Канали комунікації з клієнтом.
     */
    private Set<CommunicationChannelEntity> communicationChannels;

    /**
     * Джерело, з якого клієнт дізнався про хімчистку.
     */
    private ClientSource source;

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

    /**
     * Категорія клієнта (Стандарт, Постійний, VIP, Корпоративний).
     */
    private ClientCategoryDTO category;

    /**
     * Переваги клієнта.
     */
    @Builder.Default
    private Set<ClientPreferenceDTO> preferences = new HashSet<>();

    /**
     * Коротка історія замовлень (останні 5 замовлень).
     */
    @Builder.Default
    private List<OrderSummaryDTO> recentOrders = new ArrayList<>();

    /**
     * Загальна кількість замовлень клієнта.
     */
    private Integer orderCount;
}
