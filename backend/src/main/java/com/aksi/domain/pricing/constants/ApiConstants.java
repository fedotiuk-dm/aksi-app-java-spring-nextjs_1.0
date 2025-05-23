package com.aksi.domain.pricing.constants;

/**
 * Константи для API взаємодії
 *
 * Цей клас містить константи для:
 * - Ендпойнти API
 * - Параметри запитів
 * - HTTP заголовки
 * - Константи кешування
 * - Ліміти валідації
 * - Налаштування UI
 *
 * Категорії послуг (з прайс-листу):
 * - CLOTHING: Чистка одягу та текстилю
 * - LAUNDRY: Прання білизни
 * - IRONING: Прасування
 * - LEATHER: Чистка та відновлення шкіряних виробів
 * - PADDING: Дублянки
 * - FUR: Вироби із натурального хутра
 * - DYEING: Фарбування текстильних виробів
 * - ADDITIONAL_SERVICES: Додаткові послуги
 */
public final class ApiConstants {

    private ApiConstants() {
        // Utility class
    }

    // Базові шляхи API
    public static final String API_BASE_PATH = "/api";
    public static final String PRICING_BASE_PATH = API_BASE_PATH + "/pricing";
    public static final String AUTOCOMPLETE_BASE_PATH = API_BASE_PATH + "/autocomplete";

    // Ендпоінти для розрахунку цін
    public static final class Pricing {
        public static final String CALCULATE = PRICING_BASE_PATH + "/calculate";
        public static final String ITEMS_SEARCH = PRICING_BASE_PATH + "/items/search";
        public static final String MODIFIERS_SEARCH = PRICING_BASE_PATH + "/modifiers/search";
        public static final String CATEGORIES = PRICING_BASE_PATH + "/categories";
        public static final String UNITS = PRICING_BASE_PATH + "/units";
    }

    // Ендпоінти для автокомпліту
    public static final class Autocomplete {
        public static final String ITEMS = AUTOCOMPLETE_BASE_PATH + "/items";
        public static final String MODIFIERS = AUTOCOMPLETE_BASE_PATH + "/modifiers";
        public static final String CATEGORIES = AUTOCOMPLETE_BASE_PATH + "/categories";
        public static final String MATERIALS = AUTOCOMPLETE_BASE_PATH + "/materials";
        public static final String COLORS = AUTOCOMPLETE_BASE_PATH + "/colors";
    }

    // Параметри запитів
    public static final class RequestParams {
        public static final String QUERY = "query";
        public static final String CATEGORY = "category";
        public static final String LIMIT = "limit";
        public static final String PAGE = "page";
        public static final String SIZE = "size";
        public static final String SORT_BY = "sortBy";
        public static final String SORT_DIRECTION = "sortDirection";
        public static final String INCLUDE_INACTIVE = "includeInactive";
    }

    // Заголовки HTTP
    public static final class Headers {
        public static final String CONTENT_TYPE = "Content-Type";
        public static final String ACCEPT = "Accept";
        public static final String AUTHORIZATION = "Authorization";
        public static final String APPLICATION_JSON = "application/json";
        public static final String TEXT_PLAIN = "text/plain";
    }

    // Коди відповідей HTTP
    public static final class HttpStatus {
        public static final int OK = 200;
        public static final int CREATED = 201;
        public static final int BAD_REQUEST = 400;
        public static final int UNAUTHORIZED = 401;
        public static final int FORBIDDEN = 403;
        public static final int NOT_FOUND = 404;
        public static final int INTERNAL_SERVER_ERROR = 500;
    }

    // Константи для кешування
    public static final class Cache {
        public static final String ITEMS_CACHE = "items";
        public static final String MODIFIERS_CACHE = "modifiers";
        public static final String CATEGORIES_CACHE = "categories";
        public static final int DEFAULT_TTL_SECONDS = 300; // 5 хвилин
        public static final int AUTOCOMPLETE_TTL_SECONDS = 600; // 10 хвилин
    }

    // Обмеження для автокомпліту
    public static final class AutocompleteLimits {
        public static final int DEFAULT_LIMIT = 10;
        public static final int MAX_LIMIT = 50;
        public static final int MIN_QUERY_LENGTH = 2;
        public static final int MAX_QUERY_LENGTH = 100;
    }

    // Константи для валідації запитів
    public static final class Validation {
        public static final int MAX_ITEMS_PER_REQUEST = 100;
        public static final int MAX_MODIFIERS_PER_ITEM = 10;
        public static final int MIN_SEARCH_TERM_LENGTH = 2;
        public static final int MAX_SEARCH_TERM_LENGTH = 255;
    }

    // Константи для форматування відповідей
    public static final class ResponseFormat {
        public static final String SUCCESS_STATUS = "success";
        public static final String ERROR_STATUS = "error";
        public static final String PARTIAL_STATUS = "partial";

        public static final String DATA_FIELD = "data";
        public static final String MESSAGE_FIELD = "message";
        public static final String STATUS_FIELD = "status";
        public static final String TIMESTAMP_FIELD = "timestamp";
        public static final String ERRORS_FIELD = "errors";
        public static final String WARNINGS_FIELD = "warnings";
    }

    // Мета-дані для фронтенду
    public static final class FrontendMetadata {
        public static final String FIELD_TYPE_TEXT = "text";
        public static final String FIELD_TYPE_NUMBER = "number";
        public static final String FIELD_TYPE_SELECT = "select";
        public static final String FIELD_TYPE_MULTISELECT = "multiselect";
        public static final String FIELD_TYPE_AUTOCOMPLETE = "autocomplete";
        public static final String FIELD_TYPE_CHECKBOX = "checkbox";
        public static final String FIELD_TYPE_RADIO = "radio";
        public static final String FIELD_TYPE_DATE = "date";
        public static final String FIELD_TYPE_CURRENCY = "currency";
        public static final String FIELD_TYPE_PERCENTAGE = "percentage";
    }

    // Конфігурація для UI компонентів
    public static final class UIConfig {
        public static final int AUTOCOMPLETE_DEBOUNCE_MS = 300;
        public static final int SEARCH_DEBOUNCE_MS = 500;
        public static final int CALCULATION_THROTTLE_MS = 200;
        public static final int TOAST_DURATION_MS = 5000;
        public static final int LOADING_TIMEOUT_MS = 30000;
    }
}
