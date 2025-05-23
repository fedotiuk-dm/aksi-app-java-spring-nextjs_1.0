/**
 * Пакет констант для домену ціноутворення.
 *
 * <h2>Структура пакету:</h2>
 * <ul>
 *   <li>{@link com.aksi.domain.pricing.constants.PricingConstants} -
 *       Центральні константи: валідація, межі значень, категорії, лейбли полів</li>
 *   <li>{@link com.aksi.domain.pricing.constants.PriceCalculationConstants} -
 *       Константи для математичних розрахунків цін</li>
 *   <li>{@link com.aksi.domain.pricing.constants.UnitOfMeasureConstants} -
 *       Одиниці виміру для предметів</li>
 *   <li>{@link com.aksi.domain.pricing.constants.ModifierFormatConstants} -
 *       Формати відображення модифікаторів та цін</li>
 *   <li>{@link com.aksi.domain.pricing.constants.LocalizationConstants} -
 *       Локалізовані тексти для українського інтерфейсу</li>
 *   <li>{@link com.aksi.domain.pricing.constants.ApiConstants} -
 *       Константи для API ендпоінтів та фронтенд інтеграції</li>
 * </ul>
 *
 * <h2>Принципи організації:</h2>
 * <ul>
 *   <li><b>Централізація:</b> Всі константи організовані в спеціалізованих класах</li>
 *   <li><b>Відсутність дублів:</b> Кожна константа визначена в одному місці</li>
 *   <li><b>Типобезпека:</b> Використання enum'ів та статичних констант</li>
 *   <li><b>Зручність для фронтенду:</b> Константи включають UI лейбли, плейсхолдери, кольори</li>
 *   <li><b>Локалізація:</b> Підтримка українського інтерфейсу</li>
 * </ul>
 *
 * <h2>Використання:</h2>
 * <pre>{@code
 * // Валідація
 * import static com.aksi.domain.pricing.constants.PricingConstants.*;
 * if (discount.compareTo(MAX_DISCOUNT_PERCENTAGE) > 0) {
 *     throw new ValidationException(MSG_DISCOUNT_MAX);
 * }
 *
 * // Форматування для UI
 * import static com.aksi.domain.pricing.constants.ModifierFormatConstants.*;
 * String displayText = String.format(PERCENTAGE_FORMAT, PERCENTAGE_PLUS_PREFIX, value);
 *
 * // API ендпоінти
 * import static com.aksi.domain.pricing.constants.ApiConstants.Autocomplete.*;
 * String itemsUrl = ITEMS + "?query=" + searchTerm;
 * }</pre>
 *
 * @version 1.0
 * @since 1.0
 */
package com.aksi.domain.pricing.constants;
