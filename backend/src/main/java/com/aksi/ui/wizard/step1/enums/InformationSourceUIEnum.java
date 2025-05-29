package com.aksi.ui.wizard.step1.enums;

import java.util.Arrays;

import com.aksi.domain.client.enums.ClientSource;

/**
 * UI енум для джерел інформації про хімчистку.
 * Забезпечує конвертацію між UI strings та доменними енумами.
 */
public enum InformationSourceUIEnum {

    INSTAGRAM("Інстаграм", ClientSource.INSTAGRAM),
    GOOGLE("Google", ClientSource.GOOGLE),
    RECOMMENDATION("Рекомендації", ClientSource.RECOMMENDATION),
    OTHER("Інше", ClientSource.OTHER);

    private final String displayName;
    private final ClientSource domainEnum;

    InformationSourceUIEnum(String displayName, ClientSource domainEnum) {
        this.displayName = displayName;
        this.domainEnum = domainEnum;
    }

    public String getDisplayName() {
        return displayName;
    }

    public ClientSource getDomainEnum() {
        return domainEnum;
    }

    /**
     * Отримати всі доступні UI назви для відображення.
     */
    public static String[] getAllDisplayNames() {
        return Arrays.stream(values())
            .map(InformationSourceUIEnum::getDisplayName)
            .toArray(String[]::new);
    }

    /**
     * Знайти UI енум за відображуваною назвою.
     */
    public static InformationSourceUIEnum fromDisplayName(String displayName) {
        return Arrays.stream(values())
            .filter(e -> e.getDisplayName().equals(displayName))
            .findFirst()
            .orElse(null);
    }

    /**
     * Конвертувати UI string в доменний енум.
     */
    public static ClientSource convertToDomainEnum(String uiDisplayName) {
        InformationSourceUIEnum uiEnum = fromDisplayName(uiDisplayName);
        return uiEnum != null ? uiEnum.getDomainEnum() : null;
    }

    /**
     * Конвертувати доменний енум в UI string.
     */
    public static String convertToUIDisplayName(ClientSource domainEnum) {
        InformationSourceUIEnum uiEnum = fromDomainEnum(domainEnum);
        return uiEnum != null ? uiEnum.getDisplayName() : null;
    }

    /**
     * Знайти UI енум за доменним енумом.
     */
    public static InformationSourceUIEnum fromDomainEnum(ClientSource domainEnum) {
        return Arrays.stream(values())
            .filter(e -> e.getDomainEnum() == domainEnum)
            .findFirst()
            .orElse(null);
    }

    /**
     * Перевірити чи потрібне поле для додаткових деталей.
     */
    public boolean requiresCustomDetails() {
        return this == OTHER;
    }
}
