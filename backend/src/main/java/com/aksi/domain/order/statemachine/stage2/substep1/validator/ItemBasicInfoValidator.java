package com.aksi.domain.order.statemachine.stage2.substep1.validator;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage2.substep1.dto.ItemBasicInfoDTO;

/**
 * Валідатор для основної інформації про предмет (підетап 2.1)
 */
@Component
public class ItemBasicInfoValidator {

    private static final BigDecimal MIN_QUANTITY = BigDecimal.valueOf(0.01);
    private static final BigDecimal MAX_QUANTITY = BigDecimal.valueOf(1000);

    /**
     * Валідує основну інформацію про предмет
     */
    public ValidationResult validate(ItemBasicInfoDTO itemBasicInfo) {
        if (itemBasicInfo == null) {
            return ValidationResult.failure("Дані про предмет не можуть бути порожніми");
        }

        List<String> errors = new ArrayList<>();

        // Валідація категорії послуги
        validateServiceCategory(itemBasicInfo, errors);

        // Валідація найменування виробу
        validatePriceListItem(itemBasicInfo, errors);

        // Валідація кількості
        validateQuantity(itemBasicInfo, errors);

        // Валідація узгодженості даних
        validateDataConsistency(itemBasicInfo, errors);

        if (errors.isEmpty()) {
            return ValidationResult.success();
        } else {
            return ValidationResult.failure(errors);
        }
    }

    /**
     * Валідує вибрану категорію послуги
     */
    private void validateServiceCategory(ItemBasicInfoDTO itemBasicInfo, List<String> errors) {
        if (itemBasicInfo.getServiceCategory() == null) {
            errors.add("Категорія послуги обов'язкова для вибору");
            return;
        }

        if (itemBasicInfo.getServiceCategory().getId() == null) {
            errors.add("Ідентифікатор категорії послуги не може бути порожнім");
        }

        if (itemBasicInfo.getServiceCategory().getName() == null ||
            itemBasicInfo.getServiceCategory().getName().trim().isEmpty()) {
            errors.add("Назва категорії послуги не може бути порожньою");
        }

        if (!itemBasicInfo.getServiceCategory().isActive()) {
            errors.add("Вибрана категорія послуги неактивна");
        }
    }

    /**
     * Валідує вибране найменування виробу
     */
    private void validatePriceListItem(ItemBasicInfoDTO itemBasicInfo, List<String> errors) {
        if (itemBasicInfo.getPriceListItem() == null) {
            errors.add("Найменування виробу обов'язкове для вибору");
            return;
        }

        if (itemBasicInfo.getPriceListItem().getId() == null) {
            errors.add("Ідентифікатор виробу не може бути порожнім");
        }

        if (itemBasicInfo.getPriceListItem().getName() == null ||
            itemBasicInfo.getPriceListItem().getName().trim().isEmpty()) {
            errors.add("Назва виробу не може бути порожньою");
        }

        if (itemBasicInfo.getPriceListItem().getBasePrice() == null ||
            itemBasicInfo.getPriceListItem().getBasePrice().compareTo(BigDecimal.ZERO) <= 0) {
            errors.add("Базова ціна виробу повинна бути більше нуля");
        }

        if (!itemBasicInfo.getPriceListItem().isActive()) {
            errors.add("Вибраний виріб неактивний");
        }

        if (itemBasicInfo.getPriceListItem().getUnitOfMeasure() == null ||
            itemBasicInfo.getPriceListItem().getUnitOfMeasure().trim().isEmpty()) {
            errors.add("Одиниця виміру виробу не може бути порожньою");
        }
    }

    /**
     * Валідує введену кількість
     */
    private void validateQuantity(ItemBasicInfoDTO itemBasicInfo, List<String> errors) {
        if (itemBasicInfo.getQuantity() == null) {
            errors.add("Кількість обов'язкова для введення");
            return;
        }

        if (itemBasicInfo.getQuantity().compareTo(MIN_QUANTITY) < 0) {
            errors.add("Кількість повинна бути не менше " + MIN_QUANTITY);
        }

        if (itemBasicInfo.getQuantity().compareTo(MAX_QUANTITY) > 0) {
            errors.add("Кількість не може перевищувати " + MAX_QUANTITY);
        }

        // Для штучних товарів кількість повинна бути цілим числом
        if (itemBasicInfo.getUnitOfMeasure() != null &&
            itemBasicInfo.getUnitOfMeasure().equalsIgnoreCase("шт")) {
            if (itemBasicInfo.getQuantity().stripTrailingZeros().scale() > 0) {
                errors.add("Для штучних товарів кількість повинна бути цілим числом");
            }
        }
    }

    /**
     * Валідує узгодженість даних між полями
     */
    private void validateDataConsistency(ItemBasicInfoDTO itemBasicInfo, List<String> errors) {
        // Перевіряємо відповідність виробу до категорії
        if (itemBasicInfo.getServiceCategory() != null &&
            itemBasicInfo.getPriceListItem() != null) {

            if (!itemBasicInfo.getServiceCategory().getId()
                    .equals(itemBasicInfo.getPriceListItem().getCategoryId())) {
                errors.add("Вибраний виріб не відповідає вибраній категорії послуги");
            }
        }

        // Перевіряємо відповідність одиниці виміру
        if (itemBasicInfo.getPriceListItem() != null &&
            itemBasicInfo.getUnitOfMeasure() != null) {

            if (!itemBasicInfo.getPriceListItem().getUnitOfMeasure()
                    .equals(itemBasicInfo.getUnitOfMeasure())) {
                errors.add("Одиниця виміру не відповідає вибраному виробу");
            }
        }

        // Перевіряємо правильність розрахунку базової вартості
        if (itemBasicInfo.getPriceListItem() != null &&
            itemBasicInfo.getQuantity() != null &&
            itemBasicInfo.getTotalBasePrice() != null) {

            BigDecimal expectedTotal = itemBasicInfo.getPriceListItem().getBasePrice()
                    .multiply(itemBasicInfo.getQuantity());

            if (itemBasicInfo.getTotalBasePrice().compareTo(expectedTotal) != 0) {
                errors.add("Загальна базова вартість розрахована неправильно");
            }
        }
    }
}
