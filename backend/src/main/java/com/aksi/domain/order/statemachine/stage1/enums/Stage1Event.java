package com.aksi.domain.order.statemachine.stage1.enums;

/**
 * Події Stage1 - Вибір клієнта.
 */
public enum Stage1Event {

    /**
     * Запуск процесу вибору клієнта.
     */
    START_CLIENT_SELECTION,

    /**
     * Клієнт обраний або створений.
     */
    CLIENT_SELECTED,

    /**
     * Завершення вибору клієнта.
     */
    COMPLETE_CLIENT_SELECTION
}
