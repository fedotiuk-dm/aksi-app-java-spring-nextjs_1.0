package com.aksi.domain.client.entity;

/**
 * Категорії клієнтів хімчистки.
 */
public enum ClientCategoryEntity {
    STANDARD("Стандарт"),
    REGULAR("Постійний"),
    VIP("VIP"),
    CORPORATE("Корпоративний");

    private final String displayName;

    ClientCategoryEntity(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
