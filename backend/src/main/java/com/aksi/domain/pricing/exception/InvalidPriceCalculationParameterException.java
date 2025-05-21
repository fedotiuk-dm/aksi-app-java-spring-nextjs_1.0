package com.aksi.domain.pricing.exception;

/**
 * Виняток, який виникає при передачі недійсних параметрів
 * для обчислення ціни.
 */
public class InvalidPriceCalculationParameterException extends PriceCalculationException {

    /**
     * Створює новий виняток з вказаним повідомленням.
     *
     * @param message повідомлення про помилку
     */
    public InvalidPriceCalculationParameterException(String message) {
        super(message);
    }

    /**
     * Створює новий виняток з вказаним повідомленням та причиною.
     *
     * @param message повідомлення про помилку
     * @param cause причина винятку
     */
    public InvalidPriceCalculationParameterException(String message, Throwable cause) {
        super(message, cause);
    }
}
