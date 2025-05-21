package com.aksi.domain.pricing.exception;

/**
 * Виняток, який виникає, коли модифікатор не може бути
 * застосований в поточному контексті.
 */
public class ModifierNotApplicableException extends PriceCalculationException {

    /**
     * Створює новий виняток з вказаним повідомленням.
     *
     * @param message повідомлення про помилку
     */
    public ModifierNotApplicableException(String message) {
        super(message);
    }

    /**
     * Створює новий виняток з вказаним повідомленням та причиною.
     *
     * @param message повідомлення про помилку
     * @param cause причина винятку
     */
    public ModifierNotApplicableException(String message, Throwable cause) {
        super(message, cause);
    }
}
