package com.aksi.domain.order.statemachine.stage2.substep2.service;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.substep2.dto.ItemCharacteristicsDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.validator.ItemCharacteristicsValidator;
import com.aksi.domain.order.statemachine.stage2.substep2.validator.ValidationResult;

/**
 * Сервіс валідації підетапу 2.2 "Характеристики предмета".
 * Консолідує всі валідатори та забезпечує єдиний інтерфейс для валідації.
 */
@Service
public class ItemCharacteristicsValidationService {

    private final ItemCharacteristicsValidator validator;

    public ItemCharacteristicsValidationService(final ItemCharacteristicsValidator validator) {
        this.validator = validator;
    }

    /**
     * Валідація всіх характеристик предмета.
     */
    public ValidationResult validateAllCharacteristics(final ItemCharacteristicsDTO dto) {
        return validator.validateCharacteristics(dto);
    }

    /**
     * Валідація тільки матеріалу.
     */
    public ValidationResult validateMaterial(final String material) {
        return validator.validateMaterial(material);
    }

    /**
     * Валідація тільки кольору.
     */
    public ValidationResult validateColor(final String color) {
        return validator.validateColor(color);
    }

    /**
     * Валідація тільки ступеня зносу.
     */
    public ValidationResult validateWearDegree(final String wearDegree) {
        return validator.validateWearDegree(wearDegree);
    }

    /**
     * Валідація тільки наповнювача.
     */
    public ValidationResult validateFiller(final String fillerType) {
        return validator.validateFiller(fillerType);
    }

    /**
     * Перевірка повноти заповнення даних.
     */
    public ValidationResult validateCompleteness(final ItemCharacteristicsDTO dto) {
        return validator.validateCompleteness(dto);
    }

    /**
     * Перевірка готовності до переходу на наступний етап.
     */
    public ValidationResult validateReadinessForNextStep(final ItemCharacteristicsDTO dto) {
        // Спочатку перевіряємо повноту даних
        final ValidationResult completenessResult = validateCompleteness(dto);
        if (!completenessResult.isValid()) {
            return completenessResult;
        }

        // Потім перевіряємо всі характеристики
        return validateAllCharacteristics(dto);
    }

    /**
     * Швидка перевірка валідності основних полів.
     */
    public boolean isBasicDataValid(final ItemCharacteristicsDTO dto) {
        if (dto == null || dto.getCurrentItem() == null) {
            return false;
        }

        return dto.getCurrentItem().getMaterial() != null &&
               !dto.getCurrentItem().getMaterial().trim().isEmpty() &&
               dto.getCurrentItem().getColor() != null &&
               !dto.getCurrentItem().getColor().trim().isEmpty() &&
               dto.getCurrentItem().getWearDegree() != null &&
               !dto.getCurrentItem().getWearDegree().trim().isEmpty();
    }
}
