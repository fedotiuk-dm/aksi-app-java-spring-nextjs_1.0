package com.aksi.domain.item.validation;

import java.util.UUID;

import org.springframework.stereotype.Component;

import com.aksi.domain.item.entity.PriceModifierEntity;
import com.aksi.domain.item.exception.ItemValidationException;
import com.aksi.domain.item.repository.PriceModifierRepository;
import com.aksi.domain.item.repository.ServiceCategoryRepository;
import com.aksi.shared.validation.ValidationResult;

import lombok.RequiredArgsConstructor;

/**
 * Спрощений validator для модифікаторів цін з функціональним підходом.
 * Замінює безкінечні if-и на композиційні валідаційні правила.
 */
@Component
@RequiredArgsConstructor
public class PriceModifierValidator {

    private final PriceModifierRepository priceModifierRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;

    /**
     * Валідація для створення нового модифікатора.
     * Функціональна композиція замість if-нагромаджень.
     */
    public void validateForCreate(PriceModifierEntity modifier) {
        var result = ItemValidationRules.uniqueModifierCode(priceModifierRepository)
            .and(ItemValidationRules.validPercentageValue())
            .and(ItemValidationRules.validFixedAmountValue())
            .and(ItemValidationRules.validApplicableCategories(serviceCategoryRepository))
            .validate(modifier);

        throwIfInvalid(result);
    }

    /**
     * Валідація для оновлення існуючого модифікатора.
     * Композиція правил з перевіркою унікальності для update.
     */
    public void validateForUpdate(PriceModifierEntity modifier) {
        var result = ItemValidationRules.uniqueModifierCodeForUpdate(priceModifierRepository)
            .and(ItemValidationRules.validPercentageValue())
            .and(ItemValidationRules.validFixedAmountValue())
            .and(ItemValidationRules.validApplicableCategories(serviceCategoryRepository))
            .validate(modifier);

        throwIfInvalid(result);
    }

    /**
     * Валідація для видалення модифікатора.
     * Поки що тільки заглушка для майбутньої логіки з Order domain.
     */
    public void validateForDelete(UUID modifierUuid) {
        // Тут буде перевірка використання в активних замовленнях коли буде реалізований Order domain
        // var result = ItemValidationRules.modifierNotUsedInActiveOrders(orderRepository).validate(modifierUuid);
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
