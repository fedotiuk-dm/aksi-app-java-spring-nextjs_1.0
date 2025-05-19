package com.aksi.domain.pricing.constants;

/**
 * Константи для одиниць виміру предметів згідно з реальним прайс-листом.
 */
public final class UnitOfMeasureConstants {

    private UnitOfMeasureConstants() {
        // Приватний конструктор, щоб запобігти створенню екземплярів
    }

    /**
     * Одиниця виміру: Штуки (використовується для більшості виробів).
     */
    public static final String PIECES = "шт";

    /**
     * Одиниця виміру: Кілограми (використовується для білизни та певних текстильних виробів).
     */
    public static final String KILOGRAMS = "кг";

    /**
     * Одиниця виміру: Пара (використовується для взуття).
     */
    public static final String PAIR = "пара";

    /**
     * Одиниця виміру: Квадратні метри (використовується для шкіри, килимів тощо).
     */
    public static final String SQUARE_METERS = "кв.м";
}
