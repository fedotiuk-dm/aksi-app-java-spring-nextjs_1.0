package com.aksi.domain.order.statemachine.stage2.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.dto.ItemManagerDTO;
import com.aksi.domain.order.statemachine.stage2.validator.ItemManagerValidator;
import com.aksi.domain.order.statemachine.stage2.validator.ValidationResult;

/**
 * Сервіс валідації для консолідації всіх валідаторів Stage2.
 */
@Service
public class Stage2ValidationService {

    private final ItemManagerValidator itemManagerValidator;

    public Stage2ValidationService(final ItemManagerValidator itemManagerValidator) {
        this.itemManagerValidator = itemManagerValidator;
    }

    /**
     * Валідує готовність до переходу на наступний етап
     */
    public ValidationResult validateReadinessToProceed(final ItemManagerDTO manager) {
        return itemManagerValidator.validateReadinessToProceed(manager);
    }

    /**
     * Валідує можливість запуску нового підвізарда
     */
    public ValidationResult validateNewWizardStart(final ItemManagerDTO manager) {
        return itemManagerValidator.validateNewWizardStart(manager);
    }

    /**
     * Валідує можливість запуску підвізарда редагування
     */
    public ValidationResult validateEditWizardStart(final ItemManagerDTO manager, final UUID itemId) {
        return itemManagerValidator.validateEditWizardStart(manager, itemId);
    }

    /**
     * Валідує можливість видалення предмета
     */
    public ValidationResult validateItemDeletion(final ItemManagerDTO manager, final UUID itemId) {
        return itemManagerValidator.validateItemDeletion(manager, itemId);
    }

    /**
     * Валідує цілісність даних менеджера
     */
    public ValidationResult validateManagerIntegrity(final ItemManagerDTO manager) {
        return itemManagerValidator.validateManagerIntegrity(manager);
    }

    /**
     * Комплексна валідація менеджера предметів
     */
    public ValidationResult validateManager(final ItemManagerDTO manager) {
        // Спочатку перевіряємо цілісність
        final ValidationResult integrityResult = validateManagerIntegrity(manager);
        if (!integrityResult.isValid()) {
            return integrityResult;
        }

        // Потім перевіряємо готовність до переходу
        return validateReadinessToProceed(manager);
    }
}
