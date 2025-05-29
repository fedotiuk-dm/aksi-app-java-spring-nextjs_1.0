package com.aksi.ui.wizard.step1.builder;

import java.util.Set;

import org.springframework.stereotype.Component;

import com.aksi.domain.client.dto.CreateClientRequest;
import com.aksi.domain.client.entity.CommunicationChannelEntity;
import com.aksi.domain.client.enums.ClientSource;
import com.aksi.ui.wizard.step1.enums.CommunicationChannelUIEnum;
import com.aksi.ui.wizard.step1.enums.InformationSourceUIEnum;

import lombok.extern.slf4j.Slf4j;

/**
 * Builder компонент для створення запитів клієнта.
 * Domain логіка згідно з DDD принципами.
 * Цей компонент не є UI компонентом, тому використовує стандартний @Component.
 */
@Component
@Slf4j
public class ClientRequestBuilder {

    /**
     * Побудувати CreateClientRequest з UI даних.
     */
    public CreateClientRequest buildCreateClientRequest(
            String lastName, String firstName, String phone, String email, String address,
            Set<String> communicationChannelsUI, String informationSourceUI, String customInformationSource) {

        // Конвертувати канали зв'язку
        Set<CommunicationChannelEntity> communicationChannels =
            CommunicationChannelUIEnum.convertToDomainEnums(communicationChannelsUI);

        // Конвертувати джерело інформації
        ClientSource clientSource = InformationSourceUIEnum.convertToDomainEnum(informationSourceUI);

        // Визначити sourceDetails
        String sourceDetails = isOtherSource(informationSourceUI) ? customInformationSource : null;

        CreateClientRequest request = CreateClientRequest.builder()
            .lastName(trimValue(lastName))
            .firstName(trimValue(firstName))
            .phone(trimValue(phone))
            .email(trimValue(email))
            .address(trimValue(address))
            .communicationChannels(communicationChannels)
            .source(clientSource)
            .sourceDetails(sourceDetails)
            .build();

        log.debug("Built CreateClientRequest for client: {} {}", firstName, lastName);
        return request;
    }

    /**
     * Встановити значення за замовчуванням для каналів зв'язку.
     */
    public Set<String> getDefaultCommunicationChannels() {
        return Set.of(CommunicationChannelUIEnum.PHONE.getDisplayName());
    }

    /**
     * Перевірити чи потрібне поле для деталей джерела.
     */
    public boolean requiresCustomSourceDetails(String informationSourceUI) {
        InformationSourceUIEnum sourceEnum = InformationSourceUIEnum.fromDisplayName(informationSourceUI);
        return sourceEnum != null && sourceEnum.requiresCustomDetails();
    }

    /**
     * Отримати всі доступні канали зв'язку для UI.
     */
    public String[] getAvailableCommunicationChannels() {
        return CommunicationChannelUIEnum.getAllDisplayNames();
    }

    /**
     * Отримати всі доступні джерела інформації для UI.
     */
    public String[] getAvailableInformationSources() {
        return InformationSourceUIEnum.getAllDisplayNames();
    }

    private String trimValue(String value) {
        return value != null ? value.trim() : null;
    }

    private boolean isOtherSource(String informationSourceUI) {
        return InformationSourceUIEnum.OTHER.getDisplayName().equals(informationSourceUI);
    }
}
