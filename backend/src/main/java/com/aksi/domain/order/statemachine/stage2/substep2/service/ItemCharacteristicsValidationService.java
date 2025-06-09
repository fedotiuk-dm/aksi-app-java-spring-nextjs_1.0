package com.aksi.domain.order.statemachine.stage2.substep2.service;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.substep2.dto.ItemCharacteristicsDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.validator.ItemCharacteristicsValidator;
import com.aksi.domain.order.statemachine.stage2.substep2.validator.ValidationResult;

/**
 * Сервіс консолідації валідації характеристик предмета
 */
@Service
public class ItemCharacteristicsValidationService {

    private final ItemCharacteristicsValidator characteristicsValidator;

    public ItemCharacteristicsValidationService(ItemCharacteristicsValidator characteristicsValidator) {
        this.characteristicsValidator = characteristicsValidator;
    }

    /**
     * Повна валідація характеристик предмета
     */
    public ValidationResult validateComplete(ItemCharacteristicsDTO dto) {
        return characteristicsValidator.validateCharacteristics(dto);
    }

    /**
     * Валідація окремого поля матеріалу
     */
    public ValidationResult validateMaterial(String material) {
        return characteristicsValidator.validateMaterial(material);
    }

    /**
     * Валідація окремого поля кольору
     */
    public ValidationResult validateColor(String color) {
        return characteristicsValidator.validateColor(color);
    }

    /**
     * Валідація окремого поля ступеню зносу
     */
    public ValidationResult validateWearDegree(String wearDegree) {
        return characteristicsValidator.validateWearDegree(wearDegree);
    }

    /**
     * Валідація окремого поля наповнювача
     */
    public ValidationResult validateFiller(String fillerType) {
        return characteristicsValidator.validateFiller(fillerType);
    }

    /**
     * Перевірка повноти заповнення обов'язкових полів
     */
    public ValidationResult validateCompleteness(ItemCharacteristicsDTO dto) {
        return characteristicsValidator.validateCompleteness(dto);
    }

    /**
     * Валідація при переході до наступного кроку
     */
    public ValidationResult validateForNext(ItemCharacteristicsDTO dto) {
        // Спочатку перевіряємо повноту
        ValidationResult completenessResult = validateCompleteness(dto);
        if (!completenessResult.isValid()) {
            return completenessResult;
        }

        // Потім повну валідацію
        return validateComplete(dto);
    }

    /**
     * Валідація при зберіганні проміжних даних
     */
    public ValidationResult validateForSave(ItemCharacteristicsDTO dto) {
        // Для збереження проміжних даних, перевіряємо тільки заповнені поля
        if (dto == null) {
            return ValidationResult.success();
        }

        ValidationResult result = ValidationResult.success();

        // Валідуємо тільки якщо поле заповнене
        if (dto.getMaterial() != null && !dto.getMaterial().trim().isEmpty()) {
            ValidationResult materialResult = validateMaterial(dto.getMaterial());
            if (!materialResult.isValid()) {
                return materialResult;
            }
        }

        if (dto.getColor() != null && !dto.getColor().trim().isEmpty()) {
            ValidationResult colorResult = validateColor(dto.getColor());
            if (!colorResult.isValid()) {
                return colorResult;
            }
        }

        if (dto.getWearDegree() != null && !dto.getWearDegree().trim().isEmpty()) {
            ValidationResult wearResult = validateWearDegree(dto.getWearDegree());
            if (!wearResult.isValid()) {
                return wearResult;
            }
        }

        if (Boolean.TRUE.equals(dto.getShowFillerSection()) &&
            dto.getFillerType() != null && !dto.getFillerType().trim().isEmpty()) {
            ValidationResult fillerResult = validateFiller(dto.getFillerType());
            if (!fillerResult.isValid()) {
                return fillerResult;
            }
        }

        return result;
    }
}
