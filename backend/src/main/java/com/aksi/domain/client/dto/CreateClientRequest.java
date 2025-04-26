package com.aksi.domain.client.dto;

import java.util.Set;

import com.aksi.domain.client.entity.ClientSourceEntity;
import com.aksi.domain.client.entity.CommunicationChannelEntity;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для запиту на створення нового клієнта.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateClientRequest {

    /**
     * Прізвище клієнта.
     */
    @NotBlank(message = "Прізвище не може бути пустим")
    private String lastName;

    /**
     * Ім'я клієнта.
     */
    @NotBlank(message = "Ім'я не може бути пустим")
    private String firstName;

    /**
     * Номер телефону клієнта.
     */
    @NotBlank(message = "Телефон не може бути пустим")
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Некоректний формат телефону")
    private String phone;

    /**
     * Email клієнта.
     */
    @Email(message = "Некоректний формат email")
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
}
