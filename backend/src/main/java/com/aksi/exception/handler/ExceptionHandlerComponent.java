package com.aksi.exception.handler;

/**
 * Базовий інтерфейс для компонентів обробки винятків.
 * Всі спеціалізовані обробники винятків повинні реалізувати цей інтерфейс.
 */
public interface ExceptionHandlerComponent {

    /**
     * Повертає порядок виконання компонента.
     * Компоненти з меншим значенням мають вищий пріоритет.
     *
     * @return значення порядку
     */
    int getOrder();

    /**
     * Перевіряє, чи цей компонент може обробити вказаний тип винятку.
     *
     * @param exceptionClass клас винятку
     * @return true, якщо компонент може обробити цей виняток
     */
    boolean canHandle(Class<? extends Throwable> exceptionClass);
}
