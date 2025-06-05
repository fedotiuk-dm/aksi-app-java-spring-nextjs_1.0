package com.aksi.domain.order.statemachine.stage2.validator;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.aksi.domain.order.statemachine.stage2.dto.ItemPricingDTO;

/**
 * Валідатор для підетапу 2.4 "Знижки та надбавки (калькулятор ціни)".
 *
 * Перевіряє правильність заповнення всіх обов'язкових полів
 * та відповідність бізнес-правилам розрахунку ціни.
 */
@Component
public class ItemPricingValidator {

    private static final Logger logger = LoggerFactory.getLogger(ItemPricingValidator.class);

    // Мінімальні та максимальні значення
    private static final BigDecimal MIN_PRICE = BigDecimal.valueOf(0.01);
    private static final BigDecimal MAX_PRICE = BigDecimal.valueOf(100000);
    private static final BigDecimal MIN_QUANTITY = BigDecimal.ONE;
    private static final BigDecimal MAX_QUANTITY = BigDecimal.valueOf(1000);
    private static final BigDecimal MIN_DISCOUNT = BigDecimal.ZERO;
    private static final BigDecimal MAX_DISCOUNT = BigDecimal.valueOf(100);
    private static final BigDecimal MIN_EXPEDITE = BigDecimal.valueOf(50);
    private static final BigDecimal MAX_EXPEDITE = BigDecimal.valueOf(100);

    /**
     * Перевіряє валідність даних pricing.
     *
     * @param dto DTO з даними pricing
     * @return true, якщо всі дані валідні
     */
    public boolean isValid(ItemPricingDTO dto) {
        if (dto == null) {
            return false;
        }

        List<String> errors = validate(dto);
        return errors.isEmpty();
    }

    /**
     * Виконує повну валідацію даних pricing.
     *
     * @param dto DTO з даними pricing
     * @return список помилок валідації (порожній, якщо помилок немає)
     */
    public List<String> validate(ItemPricingDTO dto) {
        List<String> errors = new ArrayList<>();

        if (dto == null) {
            errors.add("Дані для розрахунку ціни відсутні");
            return errors;
        }

        logger.debug("Валідація даних pricing: {}", dto);

        // Валідація базових даних
        validateBasicData(dto, errors);

        // Валідація базової ціни
        validateBasePrice(dto, errors);

        // Валідація модифікаторів
        validateModifiers(dto, errors);

        // Валідація терміновості
        validateExpedite(dto, errors);

        // Валідація знижок
        validateDiscount(dto, errors);

        // Валідація розрахованих цін (якщо є)
        if (dto.isPriceCalculated()) {
            validateCalculatedPrices(dto, errors);
        }

        if (errors.isEmpty()) {
            logger.debug("Валідація pricing пройшла успішно");
        } else {
            logger.warn("Знайдено помилки валідації pricing: {}", errors);
        }

        return errors;
    }

    /**
     * Перевіряє базову валідність (тільки обов'язкові поля).
     *
     * @param dto DTO з даними pricing
     * @return true, якщо основні поля заповнені
     */
    public boolean isBasicValidationPassed(ItemPricingDTO dto) {
        if (dto == null) {
            return false;
        }

        // Перевіряємо тільки критично важливі поля
        return StringUtils.hasText(dto.getCategoryCode()) &&
               StringUtils.hasText(dto.getItemName()) &&
               dto.getQuantity() != null && dto.getQuantity() > 0 &&
               dto.getBaseUnitPrice() != null && dto.getBaseUnitPrice().compareTo(BigDecimal.ZERO) > 0;
    }

    /**
     * Перевіряє чи готові дані для розрахунку ціни.
     *
     * @param dto DTO з даними pricing
     * @return true, якщо можна розраховувати ціну
     */
    public boolean isReadyForCalculation(ItemPricingDTO dto) {
        if (!isBasicValidationPassed(dto)) {
            return false;
        }

        // Для розрахунку потрібні ще й модифікатори (навіть порожній список)
        return dto.getSelectedModifierCodes() != null;
    }

    /**
     * Валідує базові дані предмета.
     */
    private void validateBasicData(ItemPricingDTO dto, List<String> errors) {
        // Категорія
        if (!StringUtils.hasText(dto.getCategoryCode())) {
            errors.add("Код категорії є обов'язковим полем");
        } else if (dto.getCategoryCode().trim().length() < 2) {
            errors.add("Код категорії занадто короткий");
        }

        // Найменування предмета
        if (!StringUtils.hasText(dto.getItemName())) {
            errors.add("Найменування предмета є обов'язковим полем");
        } else if (dto.getItemName().trim().length() < 2) {
            errors.add("Найменування предмета занадто коротке");
        }

        // Кількість
        if (dto.getQuantity() == null) {
            errors.add("Кількість є обов'язковим полем");
        } else if (dto.getQuantity() < MIN_QUANTITY.intValue()) {
            errors.add("Кількість повинна бути мінімум " + MIN_QUANTITY);
        } else if (dto.getQuantity() > MAX_QUANTITY.intValue()) {
            errors.add("Кількість занадто велика (максимум " + MAX_QUANTITY + ")");
        }

        // Одиниця виміру (якщо є)
        if (StringUtils.hasText(dto.getUnitOfMeasure())) {
            validateUnitOfMeasure(dto.getUnitOfMeasure(), errors);
        }
    }

    /**
     * Валідує базову ціну.
     */
    private void validateBasePrice(ItemPricingDTO dto, List<String> errors) {
        if (dto.getBaseUnitPrice() == null) {
            errors.add("Базова ціна є обов'язковою");
            return;
        }

        if (dto.getBaseUnitPrice().compareTo(MIN_PRICE) < 0) {
            errors.add("Базова ціна занадто мала (мінімум " + MIN_PRICE + " грн)");
        }

        if (dto.getBaseUnitPrice().compareTo(MAX_PRICE) > 0) {
            errors.add("Базова ціна занадто велика (максимум " + MAX_PRICE + " грн)");
        }

        // Перевіряємо відповідність базової загальної ціни
        if (dto.getBaseTotalPrice() != null) {
            BigDecimal expectedTotal = dto.getBaseUnitPrice().multiply(BigDecimal.valueOf(dto.getQuantity()));
            if (dto.getBaseTotalPrice().compareTo(expectedTotal) != 0) {
                errors.add("Базова загальна ціна не відповідає розрахунку");
            }
        }
    }

    /**
     * Валідує модифікатори.
     */
    private void validateModifiers(ItemPricingDTO dto, List<String> errors) {
        // Перевіряємо діапазонні модифікатори
        if (dto.getRangeModifierValues() != null) {
            for (ItemPricingDTO.RangeModifierValue rangeValue : dto.getRangeModifierValues()) {
                validateRangeModifier(rangeValue, errors);
            }
        }

        // Перевіряємо фіксовані модифікатори
        if (dto.getFixedModifierQuantities() != null) {
            for (ItemPricingDTO.FixedModifierQuantity fixedModifier : dto.getFixedModifierQuantities()) {
                validateFixedModifier(fixedModifier, errors);
            }
        }

        // Перевіряємо чи всі вибрані модифікатори мають відповідні значення
        if (dto.getSelectedModifierCodes() != null) {
            validateSelectedModifierConsistency(dto, errors);
        }
    }

    /**
     * Валідує діапазонний модифікатор.
     */
    private void validateRangeModifier(ItemPricingDTO.RangeModifierValue rangeValue, List<String> errors) {
        if (!StringUtils.hasText(rangeValue.getModifierCode())) {
            errors.add("Код діапазонного модифікатора не може бути порожнім");
            return;
        }

        if (rangeValue.getValue() == null) {
            errors.add("Значення діапазонного модифікатора '" + rangeValue.getModifierCode() + "' не може бути порожнім");
            return;
        }

        if (rangeValue.getMinValue() != null && rangeValue.getValue().compareTo(rangeValue.getMinValue()) < 0) {
            errors.add("Значення модифікатора '" + rangeValue.getModifierCode() +
                      "' менше мінімального (" + rangeValue.getMinValue() + ")");
        }

        if (rangeValue.getMaxValue() != null && rangeValue.getValue().compareTo(rangeValue.getMaxValue()) > 0) {
            errors.add("Значення модифікатора '" + rangeValue.getModifierCode() +
                      "' більше максимального (" + rangeValue.getMaxValue() + ")");
        }
    }

    /**
     * Валідує фіксований модифікатор.
     */
    private void validateFixedModifier(ItemPricingDTO.FixedModifierQuantity fixedModifier, List<String> errors) {
        if (!StringUtils.hasText(fixedModifier.getModifierCode())) {
            errors.add("Код фіксованого модифікатора не може бути порожнім");
            return;
        }

        if (fixedModifier.getQuantity() == null || fixedModifier.getQuantity() < 1) {
            errors.add("Кількість фіксованого модифікатора '" + fixedModifier.getModifierCode() +
                      "' повинна бути більше 0");
        }

        if (fixedModifier.getQuantity() != null && fixedModifier.getQuantity() > 100) {
            errors.add("Кількість фіксованого модифікатора '" + fixedModifier.getModifierCode() +
                      "' занадто велика (максимум 100)");
        }
    }

    /**
     * Валідує узгодженість вибраних модифікаторів.
     */
    private void validateSelectedModifierConsistency(ItemPricingDTO dto, List<String> errors) {
        List<String> selectedCodes = dto.getSelectedModifierCodes();
        if (selectedCodes == null || selectedCodes.isEmpty()) {
            return; // Немає вибраних модифікаторів для перевірки
        }

        logger.debug("Перевірка узгодженості {} вибраних модифікаторів", selectedCodes.size());

        // Збираємо коди з діапазонних модифікаторів
        List<String> rangeModifierCodes = new ArrayList<>();
        if (dto.getRangeModifierValues() != null) {
            rangeModifierCodes = dto.getRangeModifierValues().stream()
                    .map(ItemPricingDTO.RangeModifierValue::getModifierCode)
                    .filter(StringUtils::hasText)
                    .toList();
        }

        // Збираємо коди з фіксованих модифікаторів
        List<String> fixedModifierCodes = new ArrayList<>();
        if (dto.getFixedModifierQuantities() != null) {
            fixedModifierCodes = dto.getFixedModifierQuantities().stream()
                    .map(ItemPricingDTO.FixedModifierQuantity::getModifierCode)
                    .filter(StringUtils::hasText)
                    .toList();
        }

        // Перевіряємо, що всі вибрані модифікатори мають відповідні значення
        for (String selectedCode : selectedCodes) {
            if (!rangeModifierCodes.contains(selectedCode) && !fixedModifierCodes.contains(selectedCode)) {
                errors.add("Вибраний модифікатор '" + selectedCode + "' не має відповідного значення");
            }
        }

        // Перевіряємо, що немає зайвих значень для невибраних модифікаторів
        for (String rangeCode : rangeModifierCodes) {
            if (!selectedCodes.contains(rangeCode)) {
                errors.add("Діапазонний модифікатор '" + rangeCode + "' має значення, але не вибраний");
            }
        }

        for (String fixedCode : fixedModifierCodes) {
            if (!selectedCodes.contains(fixedCode)) {
                errors.add("Фіксований модифікатор '" + fixedCode + "' має значення, але не вибраний");
            }
        }
    }

    /**
     * Валідує терміновість.
     */
    private void validateExpedite(ItemPricingDTO dto, List<String> errors) {
        if (dto.getIsExpedited() == null) {
            return; // Поле не обов'язкове
        }

        if (dto.getIsExpedited()) {
            if (dto.getExpediteFactor() == null) {
                errors.add("Коефіцієнт терміновості обов'язковий для термінових замовлень");
                return;
            }

            if (dto.getExpediteFactor().compareTo(MIN_EXPEDITE) < 0) {
                errors.add("Коефіцієнт терміновості занадто малий (мінімум " + MIN_EXPEDITE + "%)");
            }

            if (dto.getExpediteFactor().compareTo(MAX_EXPEDITE) > 0) {
                errors.add("Коефіцієнт терміновості занадто великий (максимум " + MAX_EXPEDITE + "%)");
            }

            if (!StringUtils.hasText(dto.getExpediteType())) {
                errors.add("Тип терміновості обов'язковий для термінових замовлень");
            } else {
                validateExpediteType(dto.getExpediteType(), errors);
            }
        }
    }

    /**
     * Валідує знижки.
     */
    private void validateDiscount(ItemPricingDTO dto, List<String> errors) {
        if (dto.getHasDiscount() == null || !dto.getHasDiscount()) {
            return; // Знижки немає
        }

        if (dto.getDiscountPercent() == null) {
            errors.add("Відсоток знижки обов'язковий якщо знижка застосовується");
            return;
        }

        if (dto.getDiscountPercent().compareTo(MIN_DISCOUNT) < 0) {
            errors.add("Відсоток знижки не може бути негативним");
        }

        if (dto.getDiscountPercent().compareTo(MAX_DISCOUNT) > 0) {
            errors.add("Відсоток знижки занадто великий (максимум " + MAX_DISCOUNT + "%)");
        }

        if (!StringUtils.hasText(dto.getDiscountType())) {
            errors.add("Тип знижки обов'язковий якщо знижка застосовується");
        } else {
            validateDiscountType(dto.getDiscountType(), errors);
        }

        // Перевіряємо чи можна застосувати знижку до категорії
        if (dto.getDiscountApplicable() != null && !dto.getDiscountApplicable()) {
            errors.add("Знижка не може бути застосована до цієї категорії товарів");
        }
    }

    /**
     * Валідує розраховані ціни.
     */
    private void validateCalculatedPrices(ItemPricingDTO dto, List<String> errors) {
        if (dto.getFinalUnitPrice() == null) {
            errors.add("Фінальна ціна за одиницю відсутня");
            return;
        }

        if (dto.getFinalTotalPrice() == null) {
            errors.add("Фінальна загальна ціна відсутня");
            return;
        }

        if (dto.getFinalUnitPrice().compareTo(MIN_PRICE) < 0) {
            errors.add("Фінальна ціна за одиницю занадто мала");
        }

        if (dto.getFinalTotalPrice().compareTo(MIN_PRICE) < 0) {
            errors.add("Фінальна загальна ціна занадто мала");
        }

        // Перевіряємо відповідність загальної ціни
        BigDecimal expectedTotal = dto.getFinalUnitPrice().multiply(BigDecimal.valueOf(dto.getQuantity()));
        if (dto.getFinalTotalPrice().compareTo(expectedTotal) != 0) {
            errors.add("Фінальна загальна ціна не відповідає розрахунку");
        }
    }

    /**
     * Валідує одиницю виміру.
     */
    private void validateUnitOfMeasure(String unitOfMeasure, List<String> errors) {
        List<String> validUnits = List.of("шт", "кг", "кв.м", "пара", "м");
        if (!validUnits.contains(unitOfMeasure.toLowerCase())) {
            errors.add("Недопустима одиниця виміру: " + unitOfMeasure);
        }
    }

    /**
     * Валідує тип терміновості.
     */
    private void validateExpediteType(String expediteType, List<String> errors) {
        List<String> validTypes = List.of("48hours", "24hours", "same_day", "express");
        if (!validTypes.contains(expediteType.toLowerCase())) {
            errors.add("Недопустимий тип терміновості: " + expediteType);
        }
    }

    /**
     * Валідує тип знижки.
     */
    private void validateDiscountType(String discountType, List<String> errors) {
        List<String> validTypes = List.of("еверкард", "соцмережі", "зсу", "постійний_клієнт", "акція", "інше");
        if (!validTypes.contains(discountType.toLowerCase())) {
            errors.add("Недопустимий тип знижки: " + discountType);
        }
    }
}
