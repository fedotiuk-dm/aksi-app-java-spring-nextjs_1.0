package com.aksi.domain.order.statemachine.stage2.substep5.enums;

/**
 * Події підетапу 2.5: Фотодокументація.
 */
public enum PhotoDocumentationEvent {

    /**
     * Ініціалізація підетапу фотодокументації.
     */
    INITIALIZE,

    /**
     * Початок завантаження фотографій.
     */
    START_UPLOAD,

    /**
     * Завантаження файлу фотографії.
     */
    UPLOAD_PHOTO,

    /**
     * Початок обробки завантажених фотографій.
     */
    PROCESS_PHOTOS,

    /**
     * Завершення обробки фотографій.
     */
    PROCESSING_COMPLETED,

    /**
     * Перегляд та редагування фотографій.
     */
    REVIEW_PHOTOS,

    /**
     * Видалення фотографії.
     */
    DELETE_PHOTO,

    /**
     * Завершення фотодокументації.
     */
    COMPLETE_DOCUMENTATION,

    /**
     * Повернення до редагування.
     */
    EDIT_PHOTOS,

    /**
     * Обробка помилки.
     */
    HANDLE_ERROR,

    /**
     * Скидання після помилки.
     */
    RESET_AFTER_ERROR
}
