package com.aksi.domain.item.exception;

/**
 * Exception що викидається коли елемент прайс-листа вже існує.
 */
public class PriceListItemAlreadyExistsException extends RuntimeException {

    public PriceListItemAlreadyExistsException(String message) {
        super(message);
    }

    public static PriceListItemAlreadyExistsException byCatalogNumber(String catalogNumber) {
        return new PriceListItemAlreadyExistsException("Елемент прайс-листа з каталожним номером '" + catalogNumber + "' вже існує");
    }

    public PriceListItemAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }
}
