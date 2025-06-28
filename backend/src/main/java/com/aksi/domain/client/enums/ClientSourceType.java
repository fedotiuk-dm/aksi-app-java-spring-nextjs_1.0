package com.aksi.domain.client.enums;

/**
 * Джерело надходження клієнта
 * Синхронізовано з API enum ClientSourceType
 */
public enum ClientSourceType {
    REFERRAL,        // Рекомендація
    ADVERTISING,     // Реклама
    SOCIAL_MEDIA,    // Соціальні мережі
    WEBSITE,         // Веб-сайт
    WALKING_BY,      // Проходив повз
    REPEAT_CUSTOMER, // Постійний клієнт
    OTHER            // Інше
}
