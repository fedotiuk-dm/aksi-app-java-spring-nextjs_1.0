package com.aksi.domain.pricing.constants;

/**
 * Константи локалізації для домену ціноутворення.
 * Містить усі текстові повідомлення, які використовуються в UI.
 */
public final class LocalizationConstants {

    private LocalizationConstants() {
        // Utility class
    }

    // Заголовки розділів
    public static final class SectionTitles {
        public static final String PRICE_CALCULATION = "Розрахунок вартості";
        public static final String ITEM_SELECTION = "Вибір предметів";
        public static final String MODIFIERS = "Модифікатори цін";
        public static final String DISCOUNT_SETTINGS = "Налаштування знижок";
        public static final String ORDER_SUMMARY = "Підсумок замовлення";
        public static final String PAYMENT_DETAILS = "Деталі оплати";
    }

    // Дії користувача
    public static final class Actions {
        public static final String ADD_ITEM = "Додати предмет";
        public static final String REMOVE_ITEM = "Видалити предмет";
        public static final String EDIT_ITEM = "Редагувати предмет";
        public static final String CALCULATE_PRICE = "Розрахувати ціну";
        public static final String APPLY_DISCOUNT = "Застосувати знижку";
        public static final String REMOVE_DISCOUNT = "Видалити знижку";
        public static final String ADD_MODIFIER = "Додати модифікатор";
        public static final String REMOVE_MODIFIER = "Видалити модифікатор";
        public static final String SAVE_CHANGES = "Зберегти зміни";
        public static final String CANCEL_CHANGES = "Скасувати зміни";
        public static final String CONFIRM_ORDER = "Підтвердити замовлення";
        public static final String SEARCH = "Пошук";
        public static final String FILTER = "Фільтрувати";
        public static final String RESET = "Скинути";
        public static final String CLEAR_ALL = "Очистити все";
    }

    // Статуси та стани
    public static final class Status {
        public static final String LOADING = "Завантаження...";
        public static final String SAVING = "Збереження...";
        public static final String CALCULATING = "Розрахунок...";
        public static final String SUCCESS = "Успішно";
        public static final String ERROR = "Помилка";
        public static final String WARNING = "Попередження";
        public static final String INFO = "Інформація";
        public static final String READY = "Готово";
        public static final String PENDING = "Очікування";
        public static final String COMPLETED = "Завершено";
    }

    // Повідомлення про помилки
    public static final class ErrorMessages {
        public static final String ITEM_NOT_FOUND = "Предмет не знайдено";
        public static final String CATEGORY_NOT_FOUND = "Категорію не знайдено";
        public static final String MODIFIER_NOT_FOUND = "Модифікатор не знайдено";
        public static final String INVALID_QUANTITY = "Некоректна кількість";
        public static final String INVALID_PRICE = "Некоректна ціна";
        public static final String INVALID_DISCOUNT = "Некоректна знижка";
        public static final String INVALID_EXPEDITE = "Некоректний відсоток терміновості";
        public static final String CALCULATION_FAILED = "Не вдалося розрахувати ціну";
        public static final String NETWORK_ERROR = "Помилка мережі";
        public static final String SERVER_ERROR = "Помилка сервера";
        public static final String VALIDATION_ERROR = "Помилка валідації";
        public static final String REQUIRED_FIELD = "Обов'язкове поле";
        public static final String FIELD_TOO_SHORT = "Поле занадто коротке";
        public static final String FIELD_TOO_LONG = "Поле занадто довге";
    }

    // Повідомлення про успіх
    public static final class SuccessMessages {
        public static final String ITEM_ADDED = "Предмет додано";
        public static final String ITEM_UPDATED = "Предмет оновлено";
        public static final String ITEM_REMOVED = "Предмет видалено";
        public static final String DISCOUNT_APPLIED = "Знижку застосовано";
        public static final String MODIFIER_APPLIED = "Модифікатор застосовано";
        public static final String PRICE_CALCULATED = "Ціну розраховано";
        public static final String ORDER_CREATED = "Замовлення створено";
        public static final String CHANGES_SAVED = "Зміни збережено";
    }

    // Інформаційні повідомлення
    public static final class InfoMessages {
        public static final String NO_ITEMS_FOUND = "Предметів не знайдено";
        public static final String NO_MODIFIERS_AVAILABLE = "Модифікатори недоступні";
        public static final String DISCOUNT_NOT_APPLICABLE = "Знижка не може бути застосована до цієї категорії";
        public static final String EXPEDITE_AVAILABLE = "Доступна термінова обробка";
        public static final String SEASONAL_DISCOUNT = "Діє сезонна знижка";
        public static final String BULK_DISCOUNT = "Діє знижка за кількість";
        public static final String CALCULATION_IN_PROGRESS = "Відбувається розрахунок ціни...";
        public static final String SEARCH_IN_PROGRESS = "Пошук предметів...";
    }

    // Підказки для користувача
    public static final class Tooltips {
        public static final String EXPEDITE_HELP = "Термінова обробка збільшує вартість послуги";
        public static final String DISCOUNT_HELP = "Знижка застосовується до базової ціни";
        public static final String MODIFIER_HELP = "Модифікатори можуть збільшувати або зменшувати ціну";
        public static final String CATEGORY_HELP = "Оберіть категорію для фільтрації предметів";
        public static final String QUANTITY_HELP = "Введіть кількість предметів";
        public static final String SEARCH_HELP = "Введіть назву предмета для пошуку";
        public static final String UNIT_HELP = "Одиниця виміру залежить від типу предмета";
    }

    // Заголовки таблиць та списків
    public static final class TableHeaders {
        public static final String ITEM_NAME = "Назва";
        public static final String CATEGORY = "Категорія";
        public static final String QUANTITY = "Кількість";
        public static final String UNIT = "Од. виміру";
        public static final String UNIT_PRICE = "Ціна за одиницю";
        public static final String TOTAL_PRICE = "Загальна ціна";
        public static final String DISCOUNT = "Знижка";
        public static final String EXPEDITE = "Термінова";
        public static final String MODIFIERS = "Модифікатори";
        public static final String ACTIONS = "Дії";
        public static final String STATUS = "Статус";
    }

    // Формати дат та часу
    public static final class DateFormats {
        public static final String DATE_FORMAT = "dd.MM.yyyy";
        public static final String DATETIME_FORMAT = "dd.MM.yyyy HH:mm";
        public static final String TIME_FORMAT = "HH:mm";
        public static final String MONTH_YEAR_FORMAT = "MMMM yyyy";
    }

    // Одиниці часу
    public static final class TimeUnits {
        public static final String MINUTES = "хвилин";
        public static final String HOURS = "годин";
        public static final String DAYS = "днів";
        public static final String WEEKS = "тижнів";
        public static final String MONTHS = "місяців";
    }

    // Числові формати
    public static final class NumberFormats {
        public static final String DECIMAL_FORMAT = "#,##0.00";
        public static final String PERCENTAGE_FORMAT = "#0.##%";
        public static final String CURRENCY_FORMAT = "#,##0.00 ₴";
    }
}
