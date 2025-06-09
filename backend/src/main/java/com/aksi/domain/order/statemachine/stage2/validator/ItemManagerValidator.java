package com.aksi.domain.order.statemachine.stage2.validator;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage2.dto.ItemManagerDTO;

/**
 * Валідатор для головного екрану менеджера предметів (Етап 2.0).
 */
@Component
public class ItemManagerValidator {

    /**
     * Валідує готовність до переходу на наступний етап
     */
    public ValidationResult validateReadinessToProceed(final ItemManagerDTO manager) {
        final List<String> errors = new ArrayList<>();

        if (manager == null) {
            errors.add("Менеджер предметів не ініціалізований");
            return ValidationResult.failure(errors);
        }

        if (!manager.hasItems()) {
            errors.add("Потрібно додати мінімум один предмет до замовлення");
        }

        if (manager.isWizardActive()) {
            errors.add("Неможливо перейти до наступного етапу поки активний підвізард");
        }

        if (manager.getTotalAmount() == null || manager.getTotalAmount().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            errors.add("Загальна вартість замовлення повинна бути більше нуля");
        }

        return errors.isEmpty() ? ValidationResult.success() : ValidationResult.failure(errors);
    }

    /**
     * Валідує можливість запуску нового підвізарда
     */
    public ValidationResult validateNewWizardStart(final ItemManagerDTO manager) {
        final List<String> errors = new ArrayList<>();

        if (manager == null) {
            errors.add("Менеджер предметів не ініціалізований");
            return ValidationResult.failure(errors);
        }

        if (manager.isWizardActive()) {
            errors.add("Вже активний підвізард. Завершіть поточний підвізард перед запуском нового");
        }

        if (manager.getOrderId() == null) {
            errors.add("Ідентифікатор замовлення не встановлений");
        }

        return errors.isEmpty() ? ValidationResult.success() : ValidationResult.failure(errors);
    }

    /**
     * Валідує можливість запуску підвізарда редагування
     */
    public ValidationResult validateEditWizardStart(final ItemManagerDTO manager, final java.util.UUID itemId) {
        final List<String> errors = new ArrayList<>();

        if (manager == null) {
            errors.add("Менеджер предметів не ініціалізований");
            return ValidationResult.failure(errors);
        }

        if (manager.isWizardActive()) {
            errors.add("Вже активний підвізард. Завершіть поточний підвізард перед запуском нового");
        }

        if (itemId == null) {
            errors.add("Ідентифікатор предмета для редагування не вказаний");
        } else {
            final boolean itemExists = manager.getAddedItems().stream()
                    .anyMatch(item -> item.getId().equals(itemId));

            if (!itemExists) {
                errors.add("Предмет для редагування не знайдений");
            }
        }

        return errors.isEmpty() ? ValidationResult.success() : ValidationResult.failure(errors);
    }

    /**
     * Валідує можливість видалення предмета
     */
    public ValidationResult validateItemDeletion(final ItemManagerDTO manager, final java.util.UUID itemId) {
        final List<String> errors = new ArrayList<>();

        if (manager == null) {
            errors.add("Менеджер предметів не ініціалізований");
            return ValidationResult.failure(errors);
        }

        if (manager.isWizardActive()) {
            errors.add("Неможливо видаляти предмети поки активний підвізард");
        }

        if (itemId == null) {
            errors.add("Ідентифікатор предмета для видалення не вказаний");
        } else {
            final boolean itemExists = manager.getAddedItems().stream()
                    .anyMatch(item -> item.getId().equals(itemId));

            if (!itemExists) {
                errors.add("Предмет для видалення не знайдений");
            }
        }

        return errors.isEmpty() ? ValidationResult.success() : ValidationResult.failure(errors);
    }

    /**
     * Валідує цілісність даних менеджера
     */
    public ValidationResult validateManagerIntegrity(final ItemManagerDTO manager) {
        final List<String> errors = new ArrayList<>();

        if (manager == null) {
            errors.add("Менеджер предметів не ініціалізований");
            return ValidationResult.failure(errors);
        }

        if (manager.getSessionId() == null) {
            errors.add("Ідентифікатор сесії не встановлений");
        }

        if (manager.getOrderId() == null) {
            errors.add("Ідентифікатор замовлення не встановлений");
        }

        if (manager.getAddedItems() == null) {
            errors.add("Список предметів не ініціалізований");
        }

        // Перевіряємо розрахункові поля
        final int actualItemCount = manager.calculateItemCount();
        if (manager.getItemCount() != actualItemCount) {
            errors.add("Кількість предметів не відповідає дійсності");
        }

        final java.math.BigDecimal actualTotalAmount = manager.calculateTotalAmount();
        if (manager.getTotalAmount() == null ||
            manager.getTotalAmount().compareTo(actualTotalAmount) != 0) {
            errors.add("Загальна вартість не відповідає дійсності");
        }

        return errors.isEmpty() ? ValidationResult.success() : ValidationResult.failure(errors);
    }
}
