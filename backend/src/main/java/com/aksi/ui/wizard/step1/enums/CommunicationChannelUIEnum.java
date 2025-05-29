package com.aksi.ui.wizard.step1.enums;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

import com.aksi.domain.client.entity.CommunicationChannelEntity;

/**
 * UI енум для каналів зв'язку з клієнтом.
 * Забезпечує конвертацію між UI strings та доменними енумами.
 */
public enum CommunicationChannelUIEnum {

    PHONE("Номер телефону", CommunicationChannelEntity.PHONE),
    SMS("SMS", CommunicationChannelEntity.SMS),
    VIBER("Viber", CommunicationChannelEntity.VIBER);

    private final String displayName;
    private final CommunicationChannelEntity domainEnum;

    CommunicationChannelUIEnum(String displayName, CommunicationChannelEntity domainEnum) {
        this.displayName = displayName;
        this.domainEnum = domainEnum;
    }

    public String getDisplayName() {
        return displayName;
    }

    public CommunicationChannelEntity getDomainEnum() {
        return domainEnum;
    }

    /**
     * Отримати всі доступні UI назви для відображення.
     */
    public static String[] getAllDisplayNames() {
        return Arrays.stream(values())
            .map(CommunicationChannelUIEnum::getDisplayName)
            .toArray(String[]::new);
    }

    /**
     * Знайти UI енум за відображуваною назвою.
     */
    public static CommunicationChannelUIEnum fromDisplayName(String displayName) {
        return Arrays.stream(values())
            .filter(e -> e.getDisplayName().equals(displayName))
            .findFirst()
            .orElse(PHONE); // За замовчуванням телефон
    }

    /**
     * Конвертувати UI strings в доменні енуми.
     */
    public static Set<CommunicationChannelEntity> convertToDomainEnums(Set<String> uiDisplayNames) {
        return uiDisplayNames.stream()
            .map(CommunicationChannelUIEnum::fromDisplayName)
            .map(CommunicationChannelUIEnum::getDomainEnum)
            .collect(Collectors.toSet());
    }

    /**
     * Конвертувати доменні енуми в UI strings.
     */
    public static Set<String> convertToUIDisplayNames(Set<CommunicationChannelEntity> domainEnums) {
        return domainEnums.stream()
            .map(CommunicationChannelUIEnum::fromDomainEnum)
            .map(CommunicationChannelUIEnum::getDisplayName)
            .collect(Collectors.toSet());
    }

    /**
     * Знайти UI енум за доменним енумом.
     */
    public static CommunicationChannelUIEnum fromDomainEnum(CommunicationChannelEntity domainEnum) {
        return Arrays.stream(values())
            .filter(e -> e.getDomainEnum() == domainEnum)
            .findFirst()
            .orElse(PHONE);
    }
}
