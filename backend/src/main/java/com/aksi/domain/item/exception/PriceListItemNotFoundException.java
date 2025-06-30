package com.aksi.domain.item.exception;

import java.util.UUID;

/**
 * Exception що викидається коли елемент прайс-листа не знайдений.
 */
public class PriceListItemNotFoundException extends RuntimeException {

    public PriceListItemNotFoundException(String message) {
        super(message);
    }

    public PriceListItemNotFoundException(UUID uuid) {
        super("Елемент прайс-листа з UUID " + uuid + " не знайдений");
    }

    public static PriceListItemNotFoundException byCatalogNumber(String catalogNumber) {
        return new PriceListItemNotFoundException("Елемент прайс-листа з каталожним номером '" + catalogNumber + "' не знайдений");
    }

    public PriceListItemNotFoundException(Long id) {
        super("Елемент прайс-листа з ID " + id + " не знайдений");
    }

    public PriceListItemNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
