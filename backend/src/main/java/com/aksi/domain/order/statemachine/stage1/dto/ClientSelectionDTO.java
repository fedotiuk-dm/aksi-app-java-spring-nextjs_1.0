package com.aksi.domain.order.statemachine.stage1.dto;

import java.util.UUID;

import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.client.dto.CreateClientRequest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для управління процесом вибору або створення клієнта в Stage1.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientSelectionDTO {

    @NotBlank(message = "Режим вибору клієнта обов'язковий")
    @Pattern(regexp = "SELECT_EXISTING|CREATE_NEW", message = "Режим повинен бути SELECT_EXISTING або CREATE_NEW")
    private String mode;

    private UUID selectedClientId;

    private ClientResponse selectedClient;

    @Valid // Каскадна валідація для створення нового клієнта
    private CreateClientRequest newClientData;

    private ClientResponse createdClient;
}
