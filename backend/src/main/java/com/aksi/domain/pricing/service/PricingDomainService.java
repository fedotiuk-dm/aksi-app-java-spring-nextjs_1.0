package com.aksi.domain.pricing.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.aksi.domain.pricing.dto.PriceModifierDTO;
import com.aksi.domain.pricing.valueobject.DiscountPercentage;
import com.aksi.domain.pricing.valueobject.ExpeditePercentage;
import com.aksi.domain.pricing.valueobject.Money;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Domain Service для складної бізнес-логіки ціноутворення.
 * Містить логіку, яка не належить до конкретної сутності, але є частиною домену.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PricingDomainService {

    /**
     * Визначити рекомендовану одиницю виміру для предмету.
     *
     * @param categoryCode Код категорії
     * @param itemName Назва предмету
     * @return Рекомендована одиниця виміру
     */
    public String determineUnitOfMeasure(String categoryCode, String itemName) {
        log.debug("Визначаємо одиницю виміру для категорії {} та предмету {}", categoryCode, itemName);

        // Бізнес-правила для визначення одиниці виміру
        if (categoryCode == null || itemName == null) {
            return "шт";
        }

        String lowerItemName = itemName.toLowerCase();
        String lowerCategoryCode = categoryCode.toLowerCase();

        // Правила для взуття
        if (lowerCategoryCode.contains("shoes") || lowerCategoryCode.contains("взуття") ||
            lowerItemName.contains("черевик") || lowerItemName.contains("туфл") ||
            lowerItemName.contains("кросівк") || lowerItemName.contains("сандал")) {
            return "пара";
        }

        // Правила для килимів та великих текстильних виробів
        if (lowerCategoryCode.contains("carpet") || lowerCategoryCode.contains("килим") ||
            lowerItemName.contains("килим") || lowerItemName.contains("палас") ||
            lowerItemName.contains("доріжка")) {
            return "кв.м";
        }

        // Правила для важких предметів (пальта, куртки тощо)
        if (lowerItemName.contains("пальто") || lowerItemName.contains("шуба") ||
            lowerItemName.contains("дублянка") || lowerItemName.contains("пуховик")) {
            return "кг";
        }

        // За замовчуванням - штуки
        return "шт";
    }

    /**
     * Розрахувати пріоритет модифікатора на основі типу та важливості.
     *
     * @param modifier Модифікатор
     * @return Пріоритет (чим менше число, тим вищий пріоритет)
     */
    public int calculateModifierPriority(PriceModifierDTO modifier) {
        if (modifier == null || modifier.getModifierType() == null) {
            return Integer.MAX_VALUE;
        }

        // Пріоритети за типом модифікатора
        return switch (modifier.getModifierType()) {
            case FIXED -> 1; // Найвищий пріоритет
            case ADDITION -> 2;
            case PERCENTAGE -> 3;
            case RANGE_PERCENTAGE -> 4; // Найнижчий пріоритет
        };
    }

    /**
     * Перевірити сумісність модифікаторів.
     *
     * @param modifiers Список модифікаторів
     * @return true, якщо модифікатори сумісні
     */
    public boolean areModifiersCompatible(List<PriceModifierDTO> modifiers) {
        if (modifiers == null || modifiers.size() <= 1) {
            return true;
        }

        // Перевіряємо наявність конфліктуючих модифікаторів
        Set<String> incompatibleCodes = Set.of("manual_cleaning", "machine_cleaning");

        long conflictingCount = modifiers.stream()
                .map(PriceModifierDTO::getCode)
                .filter(incompatibleCodes::contains)
                .count();

        if (conflictingCount > 1) {
            log.warn("Знайдено конфліктуючі модифікатори: ручне та машинне прання");
            return false;
        }

        return true;
    }

    /**
     * Розрахувати максимально допустиму знижку для категорії.
     *
     * @param categoryCode Код категорії
     * @param basePrice Базова ціна
     * @return Максимальний відсоток знижки
     */
    public DiscountPercentage calculateMaxAllowedDiscount(String categoryCode, Money basePrice) {
        log.debug("Розраховуємо максимальну знижку для категорії {} з базовою ціною {}",
                categoryCode, basePrice);

        // Бізнес-правила для максимальних знижок
        if (categoryCode == null) {
            return DiscountPercentage.of(10); // 10% за замовчуванням
        }

        String lowerCategoryCode = categoryCode.toLowerCase();

        // Для дорогих предметів - менша знижка
        if (basePrice.getAmount().compareTo(BigDecimal.valueOf(1000)) > 0) {
            return DiscountPercentage.of(5); // 5% для дорогих предметів
        }

        // Для різних категорій - різні максимальні знижки
        if (lowerCategoryCode.contains("premium") || lowerCategoryCode.contains("luxury")) {
            return DiscountPercentage.of(5);
        }

        if (lowerCategoryCode.contains("standard") || lowerCategoryCode.contains("clothing")) {
            return DiscountPercentage.of(15);
        }

        if (lowerCategoryCode.contains("basic") || lowerCategoryCode.contains("simple")) {
            return DiscountPercentage.of(20);
        }

        return DiscountPercentage.of(10); // За замовчуванням
    }

    /**
     * Перевірити, чи можна застосувати терміновість для категорії.
     *
     * @param categoryCode Код категорії
     * @return true, якщо терміновість доступна
     */
    public boolean isExpediteAvailable(String categoryCode) {
        if (categoryCode == null) {
            return false;
        }

        String lowerCategoryCode = categoryCode.toLowerCase();

        // Категорії, для яких терміновість недоступна
        Set<String> nonExpediteCategories = Set.of(
                "carpet", "килим", "restoration", "реставрація"
        );

        return nonExpediteCategories.stream()
                .noneMatch(lowerCategoryCode::contains);
    }

    /**
     * Розрахувати рекомендований фактор терміновості.
     *
     * @param categoryCode Код категорії
     * @param basePrice Базова ціна
     * @return Рекомендований відсоток надбавки за терміновість
     */
    public ExpeditePercentage calculateRecommendedExpediteFactor(String categoryCode, Money basePrice) {
        if (!isExpediteAvailable(categoryCode)) {
            return ExpeditePercentage.none();
        }

        // Для дорогих предметів - менший фактор
        if (basePrice.getAmount().compareTo(BigDecimal.valueOf(500)) > 0) {
            return ExpeditePercentage.of(30);
        }

        // Для дешевих предметів - більший фактор
        if (basePrice.getAmount().compareTo(BigDecimal.valueOf(100)) < 0) {
            return ExpeditePercentage.of(100);
        }

        // Стандартний фактор терміновості
        return ExpeditePercentage.standard();
    }

    /**
     * Валідувати розумність знижки для категорії та ціни.
     *
     * @param discount Запропонована знижка
     * @param categoryCode Код категорії
     * @param basePrice Базова ціна
     * @return true, якщо знижка розумна
     */
    public boolean isDiscountReasonable(DiscountPercentage discount, String categoryCode, Money basePrice) {
        DiscountPercentage maxAllowed = calculateMaxAllowedDiscount(categoryCode, basePrice);
        return discount.getValue().compareTo(maxAllowed.getValue()) <= 0;
    }

    /**
     * Валідувати розумність надбавки за терміновість.
     *
     * @param expedite Запропонована надбавка
     * @param categoryCode Код категорії
     * @return true, якщо надбавка розумна
     */
    public boolean isExpediteReasonable(ExpeditePercentage expedite, String categoryCode) {
        if (!isExpediteAvailable(categoryCode)) {
            return expedite.isNone();
        }

        // Надбавка більше 150% вважається нерозумною
        return expedite.getValue().compareTo(BigDecimal.valueOf(150)) <= 0;
    }
}
