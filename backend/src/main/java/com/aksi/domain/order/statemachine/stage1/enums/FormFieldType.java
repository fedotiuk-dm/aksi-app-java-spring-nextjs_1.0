package com.aksi.domain.order.statemachine.stage1.enums;

/**
 * Типи полів у формах Stage1.
 */
public enum FormFieldType {

    // Поля форми нового клієнта
    FIRST_NAME("firstName", "Ім'я", true),
    LAST_NAME("lastName", "Прізвище", true),
    PHONE("phone", "Телефон", true),
    EMAIL("email", "Email", false),
    ADDRESS("address", "Адреса", false),
    COMMUNICATION_CHANNELS("communicationChannels", "Канали зв'язку", false),
    INFORMATION_SOURCE("informationSource", "Джерело інформації", false),
    SOURCE_DETAILS("sourceDetails", "Деталі джерела", false),

    // Поля базової інформації замовлення
    RECEIPT_NUMBER("receiptNumber", "Номер квитанції", true),
    UNIQUE_TAG("uniqueTag", "Унікальна мітка", true),
    BRANCH_LOCATION("branchLocation", "Пункт прийому", true),
    CREATED_AT("createdAt", "Дата створення", true);

    private final String fieldName;
    private final String displayName;
    private final boolean required;

    FormFieldType(String fieldName, String displayName, boolean required) {
        this.fieldName = fieldName;
        this.displayName = displayName;
        this.required = required;
    }

    public String getFieldName() {
        return fieldName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public boolean isRequired() {
        return required;
    }
}
