package com.aksi.domain.item.validation;

import java.util.UUID;

import org.springframework.stereotype.Component;

import com.aksi.domain.item.entity.PriceListItemEntity;
import com.aksi.domain.item.exception.ItemValidationException;
import com.aksi.domain.item.repository.PriceListItemRepository;
import com.aksi.domain.item.repository.ServiceCategoryRepository;
import com.aksi.shared.validation.ValidationResult;

import lombok.RequiredArgsConstructor;

/**
 * Спрощений validator для предметів прайс-листа з функціональним підходом.
 * Замінює безкінечні if-и на композиційні валідаційні правила.
 */
@Component
@RequiredArgsConstructor
public class PriceListItemValidator {

    private final PriceListItemRepository priceListItemRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;

    /**
     * Валідація для створення нового предмета.
     * Функціональна композиція замість if-нагромаджень.
     */
    public void validateForCreate(PriceListItemEntity item) {
        var result = ItemValidationRules.uniqueCatalogNumber(priceListItemRepository)
            .and(ItemValidationRules.validCategory(serviceCategoryRepository))
            .and(ItemValidationRules.validPricing())
            .validate(item);

        throwIfInvalid(result);
    }

    /**
     * Валідація для оновлення існуючого предмета.
     * Композиція правил з перевіркою унікальності для update.
     */
    public void validateForUpdate(PriceListItemEntity item) {
        var result = ItemValidationRules.uniqueCatalogNumberForUpdate(priceListItemRepository)
            .and(ItemValidationRules.validCategory(serviceCategoryRepository))
            .and(ItemValidationRules.validPricing())
            .validate(item);

        throwIfInvalid(result);
    }

    /**
     * Валідація для видалення предмета.
     * Перевіряє використання в активних замовленнях (коли буде Order domain).
     */
    public void validateForDelete(UUID itemUuid) {
        // Тут буде перевірка використання в активних замовленнях коли буде реалізований Order domain
        // var result = ItemValidationRules.itemNotUsedInActiveOrders(orderRepository).validate(itemUuid);
        // throwIfInvalid(result);
    }

    /**
     * Конвертує ValidationResult в exception якщо валідація не пройшла.
     */
    private void throwIfInvalid(ValidationResult result) {
        if (!result.isValid()) {
            throw ItemValidationException.businessRuleViolation("validation_failed", result.getErrorMessage());
        }
    }
}
