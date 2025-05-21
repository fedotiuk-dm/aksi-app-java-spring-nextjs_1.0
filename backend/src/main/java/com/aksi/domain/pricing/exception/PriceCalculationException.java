package com.aksi.domain.pricing.exception;

/**
 * Базовий клас для всіх винятків, пов'язаних з обчисленням ціни.
 * Використовується як батьківський клас для більш специфічних винятків
 * у доменній області ціноутворення.
 */
public class PriceCalculationException extends RuntimeException {

    /**
     * Створює новий виняток з вказаним повідомленням.
     *
     * @param message повідомлення про помилку
     */
    public PriceCalculationException(String message) {
        super(message);
    }

    /**
     * Створює новий виняток з вказаним повідомленням та причиною.
     *
     * @param message повідомлення про помилку
     * @param cause причина винятку
     */
    public PriceCalculationException(String message, Throwable cause) {
        super(message, cause);
    }
}
