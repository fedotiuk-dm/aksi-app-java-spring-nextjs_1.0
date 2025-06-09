package com.aksi.domain.order.statemachine.stage1.mapper;

import java.util.Set;

import org.springframework.stereotype.Component;

import com.aksi.domain.client.dto.CreateClientRequest;
import com.aksi.domain.client.entity.CommunicationChannelEntity;
import com.aksi.domain.client.enums.ClientSource;
import com.aksi.domain.order.statemachine.stage1.dto.NewClientFormDTO;

/**
 * Mapper для роботи з формою створення нового клієнта.
 * Забезпечує трансформації між UI формою та доменними DTO.
 */
@Component
public class NewClientFormMapper {

    /**
     * Створює запит на створення клієнта з мінімальними обов'язковими даними.
     */
    public CreateClientRequest createMinimalClientRequest(String firstName, String lastName, String phone) {
        return CreateClientRequest.builder()
                .firstName(firstName)
                .lastName(lastName)
                .phone(phone)
                .build();
    }

    /**
     * Створює повний запит на створення клієнта з усіма даними форми.
     */
    public CreateClientRequest createFullClientRequest(
            String firstName,
            String lastName,
            String phone,
            String email,
            String address,
            Set<CommunicationChannelEntity> communicationChannels,
            ClientSource source,
            String sourceDetails) {

        return CreateClientRequest.builder()
                .firstName(firstName)
                .lastName(lastName)
                .phone(phone)
                .email(email)
                .address(address)
                .communicationChannels(communicationChannels)
                .source(source)
                .sourceDetails(sourceDetails)
                .build();
    }

    /**
     * Перевіряє, чи містить CreateClientRequest усі обов'язкові поля.
     */
    public boolean hasRequiredFields(CreateClientRequest request) {
        return request != null &&
               request.getFirstName() != null && !request.getFirstName().trim().isEmpty() &&
               request.getLastName() != null && !request.getLastName().trim().isEmpty() &&
               request.getPhone() != null && !request.getPhone().trim().isEmpty();
    }

    /**
     * Формує повне ім'я клієнта.
     */
    public String formatFullName(CreateClientRequest request) {
        if (request == null) {
            return "";
        }
        return (request.getLastName() != null ? request.getLastName() : "") +
               " " +
               (request.getFirstName() != null ? request.getFirstName() : "");
    }

    /**
     * Перевіряє, чи вказано "Інше" як джерело інформації.
     */
    public boolean isOtherSource(CreateClientRequest request) {
        return request != null &&
               request.getSource() == ClientSource.OTHER;
    }

    /**
     * Перевіряє, чи потребує джерело інформації додаткові деталі.
     */
    public boolean requiresSourceDetails(CreateClientRequest request) {
        return isOtherSource(request) &&
               (request.getSourceDetails() == null || request.getSourceDetails().trim().isEmpty());
    }

    /**
     * Отримує відображувані назви каналів комунікації.
     */
    public String formatCommunicationChannels(Set<CommunicationChannelEntity> channels) {
        if (channels == null || channels.isEmpty()) {
            return "Не вказано";
        }

        return channels.stream()
                .map(this::getChannelDisplayName)
                .reduce((a, b) -> a + ", " + b)
                .orElse("Не вказано");
    }

    /**
     * Отримує відображувану назву каналу комунікації.
     */
    private String getChannelDisplayName(CommunicationChannelEntity channel) {
        return switch (channel) {
            case PHONE -> "Телефон";
            case SMS -> "SMS";
            case VIBER -> "Viber";
            default -> channel.name();
        };
    }

    /**
     * Отримує відображувану назву джерела інформації.
     */
    public String formatSourceDisplayName(CreateClientRequest request) {
        if (request == null || request.getSource() == null) {
            return "Не вказано";
        }

        if (request.getSource() == ClientSource.OTHER &&
            request.getSourceDetails() != null &&
            !request.getSourceDetails().trim().isEmpty()) {
            return request.getSource().getDisplayName() + " (" + request.getSourceDetails() + ")";
        }

        return request.getSource().getDisplayName();
    }

    // === Методи для роботи з NewClientFormDTO ===

    /**
     * Конвертує NewClientFormDTO в CreateClientRequest.
     */
    public CreateClientRequest toCreateClientRequest(NewClientFormDTO formDTO) {
        if (formDTO == null) {
            return null;
        }

        return CreateClientRequest.builder()
                .firstName(formDTO.getFirstName())
                .lastName(formDTO.getLastName())
                .phone(formDTO.getPhone())
                .email(formDTO.getEmail())
                .address(formDTO.getAddress())
                .communicationChannels(formDTO.getCommunicationChannels())
                .source(formDTO.getInformationSource())
                .sourceDetails(formDTO.getSourceDetails())
                .build();
    }

    /**
     * Конвертує CreateClientRequest в NewClientFormDTO.
     */
    public NewClientFormDTO toNewClientFormDTO(CreateClientRequest request) {
        if (request == null) {
            return null;
        }

        NewClientFormDTO formDTO = new NewClientFormDTO();
        formDTO.setFirstName(request.getFirstName());
        formDTO.setLastName(request.getLastName());
        formDTO.setPhone(request.getPhone());
        formDTO.setEmail(request.getEmail());
        formDTO.setAddress(request.getAddress());
        formDTO.setCommunicationChannels(request.getCommunicationChannels());
        formDTO.setInformationSource(request.getSource());
        formDTO.setSourceDetails(request.getSourceDetails());

        return formDTO;
    }

    /**
     * Перевіряє валідність форми нового клієнта.
     */
    public boolean isValidNewClientForm(NewClientFormDTO formDTO) {
        return formDTO != null &&
               formDTO.hasRequiredFields() &&
               (!formDTO.isOtherInformationSource() || !formDTO.needsSourceDetails());
    }

    /**
     * Отримує відображувану назву джерела інформації з NewClientFormDTO.
     */
    public String formatSourceDisplayName(NewClientFormDTO formDTO) {
        if (formDTO == null || formDTO.getInformationSource() == null) {
            return "Не вказано";
        }

        if (formDTO.getInformationSource() == ClientSource.OTHER &&
            formDTO.getSourceDetails() != null &&
            !formDTO.getSourceDetails().trim().isEmpty()) {
            return formDTO.getInformationSource().getDisplayName() + " (" + formDTO.getSourceDetails() + ")";
        }

        return formDTO.getInformationSource().getDisplayName();
    }

    /**
     * Отримує відображувані назви каналів комунікації з NewClientFormDTO.
     */
    public String formatCommunicationChannels(NewClientFormDTO formDTO) {
        if (formDTO == null || !formDTO.hasCommunicationChannels()) {
            return "Не вказано";
        }

        return formatCommunicationChannels(formDTO.getCommunicationChannels());
    }
}
