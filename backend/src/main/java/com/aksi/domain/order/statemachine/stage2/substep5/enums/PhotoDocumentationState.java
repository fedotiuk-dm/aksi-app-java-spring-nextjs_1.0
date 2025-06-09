package com.aksi.domain.order.statemachine.stage2.substep5.enums;

/**
 * Стани підетапу 2.5: Фотодокументація.
 */
public enum PhotoDocumentationState {

    /**
     * Початковий стан - очікування ініціалізації.
     */
    INITIAL,

    /**
     * Стан завантаження фотографій.
     */
    UPLOADING_PHOTOS,

    /**
     * Стан обробки фотографій (стиснення, валідація).
     */
    PROCESSING_PHOTOS,

    /**
     * Стан перегляду та управління фотографіями.
     */
    REVIEWING_PHOTOS,

    /**
     * Стан завершення підетапу.
     */
    COMPLETED,

    /**
     * Стан помилки.
     */
    ERROR
}
