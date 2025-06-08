package com.aksi.domain.order.statemachine.stage3.validator;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.model.DiscountType;
import com.aksi.domain.order.model.NonDiscountableCategory;
import com.aksi.domain.order.statemachine.stage3.dto.OrderDiscountDTO;

import lombok.extern.slf4j.Slf4j;

/**
 * Валідатор для підетапу 3.2 "Знижки (глобальні для замовлення)".
 *
 * Відповідає за перевірку:
 * - Типу знижки та її параметрів
 * - Можливості застосування знижки до категорій товарів
 * - Бізнес-правил для різних типів знижок
 */
@Component
@Slf4j
public class OrderDiscountValidator {

    // Константи валідації
    private static final int MIN_CUSTOM_DISCOUNT = 1;
    private static final int MAX_CUSTOM_DISCOUNT = 50;
    private static final int MAX_DESCRIPTION_LENGTH = 255;

    /**
     * Валідація параметрів знижки.
     */
    public List<String> validate(OrderDiscountDTO dto) {
        List<String> errors = new ArrayList<>();

        if (dto == null) {
            errors.add("Дані знижки відсутні");
            return errors;
        }

        validateDiscountType(dto, errors);
        validateDiscountParameters(dto, errors);
        validateDiscountApplicability(dto, errors);
        validateBusinessRules(dto, errors);

        return errors;
    }

    /**
     * Перевіряє чи параметри знижки валідні.
     */
    public boolean isValid(OrderDiscountDTO dto) {
        return validate(dto).isEmpty();
    }

    /**
     * Перевіряє чи можна перейти до наступного кроку.
     */
    public boolean canProceedToNext(OrderDiscountDTO dto) {
        if (!isValid(dto)) {
            return false;
        }

        // Додаткові перевірки для переходу
        return dto.getDiscountType() != null && !dto.getHasErrors();
    }

    /**
     * Валідація типу знижки.
     */
    private void validateDiscountType(OrderDiscountDTO dto, List<String> errors) {
        DiscountType discountType = dto.getDiscountType();

        if (discountType == null) {
            errors.add("Тип знижки обов'язковий");
            return;
        }

        // Перевірка параметрів для користувацьких знижок
        if (discountType == DiscountType.CUSTOM) {
            validateCustomDiscountParameters(dto, errors);
        }
    }

    /**
     * Валідація параметрів користувацької знижки.
     */
    private void validateCustomDiscountParameters(OrderDiscountDTO dto, List<String> errors) {
        Integer percentage = dto.getDiscountPercentage();
        String description = dto.getDiscountDescription();

        if (percentage == null) {
            errors.add("Для користувацької знижки потрібно вказати відсоток");
        } else {
            if (percentage < MIN_CUSTOM_DISCOUNT) {
                errors.add("Відсоток користувацької знижки не може бути меншим за " + MIN_CUSTOM_DISCOUNT + "%");
            }
            if (percentage > MAX_CUSTOM_DISCOUNT) {
                errors.add("Відсоток користувацької знижки не може бути більшим за " + MAX_CUSTOM_DISCOUNT + "%");
            }
        }

        if (description == null || description.trim().isEmpty()) {
            errors.add("Для користувацької знижки потрібно вказати опис");
        } else if (description.length() > MAX_DESCRIPTION_LENGTH) {
            errors.add("Опис знижки не може перевищувати " + MAX_DESCRIPTION_LENGTH + " символів");
        }
    }

    /**
     * Валідація параметрів знижки.
     */
    private void validateDiscountParameters(OrderDiscountDTO dto, List<String> errors) {
        if (dto.getOrderId() == null) {
            errors.add("ID замовлення обов'язковий");
        }

        // Перевірка що для стандартних типів знижок відсоток відповідає enum
        DiscountType discountType = dto.getDiscountType();
        if (discountType != null && discountType != DiscountType.CUSTOM && discountType != DiscountType.NO_DISCOUNT) {
            Integer expectedPercentage = discountType.getDefaultPercentage();
            Integer actualPercentage = dto.getDiscountPercentage();

            if (actualPercentage != null && !actualPercentage.equals(expectedPercentage)) {
                errors.add("Для типу знижки " + discountType + " очікується відсоток " + expectedPercentage + "%");
            }
        }
    }

    /**
     * Валідація можливості застосування знижки до категорій.
     */
    private void validateDiscountApplicability(OrderDiscountDTO dto, List<String> errors) {
        if (dto.getDiscountType() == DiscountType.NO_DISCOUNT) {
            return; // Без знижки - нічого перевіряти
        }

        List<String> categories = dto.getOrderItemCategories();
        if (categories == null || categories.isEmpty()) {
            errors.add("Відсутні категорії товарів для перевірки можливості застосування знижки");
            return;
        }

        // Перевіряємо чи є категорії що не підлягають знижкам
        List<String> nonDiscountableCategories = new ArrayList<>();
        for (String category : categories) {
            if (NonDiscountableCategory.isNonDiscountable(category)) {
                nonDiscountableCategories.add(category);
            }
        }

        if (!nonDiscountableCategories.isEmpty()) {
            log.info("Знайдені категорії що не підлягають знижкам: {}", nonDiscountableCategories);

            // Якщо всі категорії не підлягають знижкам
            if (nonDiscountableCategories.size() == categories.size()) {
                errors.add("Знижка не може бути застосована - усі товари в замовленні належать до категорій " +
                          "що не підлягають знижкам (прання, прасування, фарбування)");
            }
        }
    }

    /**
     * Валідація бізнес-правил для знижок.
     */
    private void validateBusinessRules(OrderDiscountDTO dto, List<String> errors) {
        // Перевірка що знижка не застосовується до порожнього замовлення
        if (dto.getTotalAmount() != null && dto.getTotalAmount().signum() <= 0) {
            errors.add("Знижку не можна застосувати до замовлення з нульовою сумою");
        }

        // Перевірка розумності розрахунків знижки
        if (dto.hasActiveDiscount()) {
            validateDiscountCalculations(dto, errors);
        }

        // Перевірка комбінування з іншими модифікаторами
        validateDiscountCompatibility(dto, errors);
    }

    /**
     * Валідація розрахунків знижки.
     */
    private void validateDiscountCalculations(OrderDiscountDTO dto, List<String> errors) {
        if (dto.getDiscountAmount() == null) {
            errors.add("Відсутня сума знижки при активній знижці");
            return;
        }

        if (dto.getTotalAmount() == null) {
            errors.add("Відсутня загальна сума замовлення для розрахунку знижки");
            return;
        }

        // Перевірка що знижка не перевищує загальну суму
        if (dto.getDiscountAmount().compareTo(dto.getTotalAmount()) > 0) {
            errors.add("Сума знижки не може перевищувати загальну суму замовлення");
        }

        // Перевірка що фінальна сума правильно розрахована
        if (dto.getFinalAmount() != null) {
            var expectedFinalAmount = dto.getTotalAmount().subtract(dto.getDiscountAmount());
            if (dto.getFinalAmount().compareTo(expectedFinalAmount) != 0) {
                errors.add("Помилка в розрахунку фінальної суми зі знижкою");
            }
        }
    }

    /**
     * Валідація сумісності знижки з іншими модифікаторами.
     */
    private void validateDiscountCompatibility(OrderDiscountDTO dto, List<String> errors) {
        // TODO: Додати перевірку сумісності зі знижками етапу 2 (на рівні товарів)
        // TODO: Додати перевірку сумісності з терміновістю (етап 3.1)

        log.debug("Перевірка сумісності знижки з іншими модифікаторами - поки не реалізовано");
    }

    /**
     * Генерує попередження про застосування знижки.
     */
    public String generateDiscountWarning(OrderDiscountDTO dto) {
        if (dto.getDiscountType() == DiscountType.NO_DISCOUNT) {
            return null;
        }

        List<String> nonDiscountableCategories = dto.getNonDiscountableCategories();
        if (nonDiscountableCategories == null || nonDiscountableCategories.isEmpty()) {
            return null;
        }

        StringBuilder warning = new StringBuilder();
        warning.append("Знижка не буде застосована до наступних категорій: ");
        warning.append(String.join(", ", nonDiscountableCategories));
        warning.append(". Ці категорії не підлягають знижкам згідно з правилами компанії.");

        return warning.toString();
    }

    /**
     * Перевіряє чи потрібно показувати попередження про знижку.
     */
    public boolean shouldShowDiscountWarning(OrderDiscountDTO dto) {
        return dto.hasDiscountSelected() &&
               dto.getNonDiscountableCategories() != null &&
               !dto.getNonDiscountableCategories().isEmpty();
    }
}
