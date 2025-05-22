package com.aksi.domain.client.dto;

import java.util.Set;

import com.aksi.domain.client.entity.ClientSourceEntity;
import com.aksi.domain.client.entity.CommunicationChannelEntity;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * Базовий абстрактний клас для запитів, пов'язаних з клієнтами.
 * Містить спільні поля для запитів на створення та оновлення клієнтів.
 */
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public abstract class BaseClientRequest {

    /**
     * Прізвище клієнта.
     */
    @NotBlank(message = "Прізвище не може бути порожнім")
    @Size(min = 2, max = 50, message = "Прізвище повинно містити від 2 до 50 символів")
    @Pattern(regexp = "^[\\p{L}\\s\\-']+$", message = "Прізвище може містити лише літери, пробіли, дефіси та апострофи")
    private String lastName;

    /**
     * Ім'я клієнта.
     */
    @NotBlank(message = "Ім'я не може бути порожнім")
    @Size(min = 2, max = 50, message = "Ім'я повинно містити від 2 до 50 символів")
    @Pattern(regexp = "^[\\p{L}\\s\\-']+$", message = "Ім'я може містити лише літери, пробіли, дефіси та апострофи")
    private String firstName;

    /**
     * Номер телефону клієнта.
     */
    @NotBlank(message = "Номер телефону не може бути порожнім")
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Некоректний формат телефону")
    private String phone;

    /**
     * Email клієнта.
     */
    @Email(message = "Некоректний формат email")
    private String email;

    /**
     * Адреса клієнта в рядковому форматі (для зворотної сумісності).
     */
    private String address;

    /**
     * Структурована адреса клієнта.
     * Якщо надано structuredAddress, пріоритет надається її даним над рядковим address.
     */
    private AddressDTO structuredAddress;

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
}
