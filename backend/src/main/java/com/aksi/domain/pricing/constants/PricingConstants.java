package com.aksi.domain.pricing.constants;

import java.math.BigDecimal;

/**
 * Центральні константи для домену ціноутворення.
 */
public final class PricingConstants {

    private PricingConstants() {
        // Utility class
    }

    // Валютні константи (централізовано)
    public static final String DEFAULT_CURRENCY_CODE = "UAH";
    public static final String DEFAULT_CURRENCY_SYMBOL = "грн";
    public static final int CURRENCY_DECIMAL_PLACES = 2;

    // Константи для валідації відсотків
    public static final BigDecimal MIN_DISCOUNT_PERCENTAGE = BigDecimal.ZERO;
    public static final BigDecimal MAX_DISCOUNT_PERCENTAGE = BigDecimal.valueOf(50);
    public static final BigDecimal MIN_EXPEDITE_PERCENTAGE = BigDecimal.ZERO;
    public static final BigDecimal MAX_EXPEDITE_PERCENTAGE = BigDecimal.valueOf(200);

    // Константи для валідації кількості
    public static final int MIN_QUANTITY = 1;
    public static final int MAX_QUANTITY = 1000;

    // Константи для пагінації
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MIN_PAGE_SIZE = 1;
    public static final int MAX_PAGE_SIZE = 1000;

    // Коди помилок
    public static final String ERROR_ITEM_NOT_FOUND = "ITEM_NOT_FOUND";
    public static final String ERROR_CATEGORY_NOT_FOUND = "CATEGORY_NOT_FOUND";
    public static final String ERROR_MODIFIER_NOT_FOUND = "MODIFIER_NOT_FOUND";
    public static final String ERROR_INVALID_QUANTITY = "INVALID_QUANTITY";
    public static final String ERROR_INVALID_DISCOUNT = "INVALID_DISCOUNT";
    public static final String ERROR_INVALID_EXPEDITE = "INVALID_EXPEDITE";

    // Повідомлення для валідації
    public static final String MSG_QUANTITY_MIN = "Кількість повинна бути більше " + (MIN_QUANTITY - 1);
    public static final String MSG_QUANTITY_MAX = "Кількість не може перевищувати " + MAX_QUANTITY;
    public static final String MSG_DISCOUNT_MIN = "Відсоток знижки не може бути від'ємним";
    public static final String MSG_DISCOUNT_MAX = "Відсоток знижки не може перевищувати " + MAX_DISCOUNT_PERCENTAGE + "%";
    public static final String MSG_EXPEDITE_MIN = "Відсоток терміновості не може бути від'ємним";
    public static final String MSG_EXPEDITE_MAX = "Відсоток терміновості не може перевищувати " + MAX_EXPEDITE_PERCENTAGE + "%";

    // ===== КОНСТАНТИ ДЛЯ ФРОНТЕНДУ =====

    // Лейбли полів (для автогенерації форм)
    public static final class FieldLabels {
        public static final String ITEM_NAME = "Назва предмета";
        public static final String ITEM_CATEGORY = "Категорія";
        public static final String ITEM_MATERIAL = "Матеріал";
        public static final String ITEM_COLOR = "Колір";
        public static final String QUANTITY = "Кількість";
        public static final String UNIT_OF_MEASURE = "Одиниця виміру";
        public static final String BASE_PRICE = "Базова ціна";
        public static final String DISCOUNT_PERCENTAGE = "Знижка (%)";
        public static final String EXPEDITE_PERCENTAGE = "Термінова обробка (%)";
        public static final String TOTAL_PRICE = "Загальна вартість";
        public static final String SEARCH_TERM = "Пошук";
        public static final String FILTER_CATEGORY = "Фільтр за категорією";
    }

    // Плейсхолдери для полів
    public static final class FieldPlaceholders {
        public static final String SEARCH_ITEMS = "Введіть назву предмета...";
        public static final String SEARCH_CATEGORIES = "Пошук категорій...";
        public static final String SEARCH_MODIFIERS = "Пошук модифікаторів...";
        public static final String ENTER_QUANTITY = "Введіть кількість";
        public static final String ENTER_DISCOUNT = "Введіть знижку від 0 до " + MAX_DISCOUNT_PERCENTAGE + "%";
        public static final String ENTER_EXPEDITE = "Введіть відсоток терміновості";
        public static final String SELECT_CATEGORY = "Оберіть категорію";
        public static final String SELECT_UNIT = "Оберіть одиницю виміру";
    }

    /**
     * Категорії предметів для хімчистки (з прайс-листу)
     */
    public static final class ItemCategories {
        public static final String CLOTHING = "CLOTHING";           // Чистка одягу та текстилю
        public static final String LAUNDRY = "LAUNDRY";             // Прання білизни
        public static final String IRONING = "IRONING";             // Прасування
        public static final String LEATHER = "LEATHER";             // Чистка та відновлення шкіряних виробів
        public static final String PADDING = "PADDING";             // Дублянки
        public static final String FUR = "FUR";                     // Вироби із натурального хутра
        public static final String DYEING = "DYEING";               // Фарбування текстильних виробів
        public static final String ADDITIONAL_SERVICES = "ADDITIONAL_SERVICES"; // Додаткові послуги

        // Масив всіх категорій для ітерації
        public static final String[] ALL_CATEGORIES = {
            CLOTHING, LAUNDRY, IRONING, LEATHER, PADDING, FUR, DYEING, ADDITIONAL_SERVICES
        };

        private ItemCategories() {
            throw new UnsupportedOperationException("Utility class");
        }
    }

    /**
     * Українські назви категорій предметів
     */
    public static final class CategoryLabels {
        public static final String CLOTHING = "Чистка одягу та текстилю";
        public static final String LAUNDRY = "Прання білизни";
        public static final String IRONING = "Прасування";
        public static final String LEATHER = "Чистка та відновлення шкіряних виробів";
        public static final String PADDING = "Дублянки";
        public static final String FUR = "Вироби із натурального хутра";
        public static final String DYEING = "Фарбування текстильних виробів";
        public static final String ADDITIONAL_SERVICES = "Додаткові послуги";

        private CategoryLabels() {
            throw new UnsupportedOperationException("Utility class");
        }
    }

    // Типи модифікаторів цін (для автокомпліту)
    public static final class ModifierTypes {
        public static final String EXPEDITE = "expedite";
        public static final String MATERIAL_SURCHARGE = "material_surcharge";
        public static final String SIZE_MODIFIER = "size_modifier";
        public static final String CONDITION_MODIFIER = "condition_modifier";
        public static final String SPECIAL_TREATMENT = "special_treatment";
        public static final String SEASONAL_DISCOUNT = "seasonal_discount";
    }

    // Локалізовані назви типів модифікаторів
    public static final class ModifierTypeLabels {
        public static final String EXPEDITE = "Термінова обробка";
        public static final String MATERIAL_SURCHARGE = "Доплата за матеріал";
        public static final String SIZE_MODIFIER = "Модифікатор розміру";
        public static final String CONDITION_MODIFIER = "Стан предмета";
        public static final String SPECIAL_TREATMENT = "Спеціальна обробка";
        public static final String SEASONAL_DISCOUNT = "Сезонна знижка";
    }

    // Часто використовувані кольори
    public static final class CommonColors {
        public static final String BLACK = "чорний";
        public static final String WHITE = "білий";
        public static final String BLUE = "синій";
        public static final String RED = "червоний";
        public static final String GREEN = "зелений";
        public static final String YELLOW = "жовтий";
        public static final String BROWN = "коричневий";
        public static final String GRAY = "сірий";
        public static final String PINK = "рожевий";
        public static final String PURPLE = "фіолетовий";
    }

    // Часто використовувані матеріали
    public static final class CommonMaterials {
        public static final String COTTON = "бавовна";
        public static final String WOOL = "вовна";
        public static final String SILK = "шовк";
        public static final String POLYESTER = "поліестер";
        public static final String LEATHER = "шкіра";
        public static final String SUEDE = "замша";
        public static final String DENIM = "джинс";
        public static final String LINEN = "льон";
        public static final String CASHMERE = "кашемір";
        public static final String VELVET = "оксамит";
    }

    // Розміри одягу (для UI)
    public static final class ClothingSizes {
        public static final String[] STANDARD_SIZES = {"XS", "S", "M", "L", "XL", "XXL", "XXXL"};
        public static final String[] NUMERIC_SIZES = {"32", "34", "36", "38", "40", "42", "44", "46", "48", "50", "52", "54", "56", "58"};
        public static final String[] SHOE_SIZES = {"35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47"};
    }

    // Стани предметів
    public static final class ItemConditions {
        public static final String NEW = "новий";
        public static final String LIKE_NEW = "як новий";
        public static final String GOOD = "хороший";
        public static final String FAIR = "задовільний";
        public static final String WORN = "зношений";
        public static final String DAMAGED = "пошкоджений";
    }
}
