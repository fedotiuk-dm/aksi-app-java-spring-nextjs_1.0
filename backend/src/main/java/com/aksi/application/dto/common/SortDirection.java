package com.aksi.application.dto.common;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Напрямки сортування.
 */
@Schema(description = "Напрямок сортування")
public enum SortDirection {

    @Schema(description = "Сортування за зростанням")
    ASC("asc"),

    @Schema(description = "Сортування за спаданням")
    DESC("desc");

    private final String value;

    SortDirection(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    /**
     * Отримує направление сортування за рядковим значенням.
     */
    public static SortDirection fromString(String value) {
        if (value == null) {
            return ASC;
        }

        for (SortDirection direction : SortDirection.values()) {
            if (direction.value.equalsIgnoreCase(value) ||
                direction.name().equalsIgnoreCase(value)) {
                return direction;
            }
        }

        return ASC; // значення за замовчуванням
    }
}
