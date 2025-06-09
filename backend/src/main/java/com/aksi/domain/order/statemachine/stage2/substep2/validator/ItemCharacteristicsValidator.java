package com.aksi.domain.order.statemachine.stage2.substep2.validator;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.constants.ItemCharacteristicsConstants;
import com.aksi.domain.order.statemachine.stage2.substep2.dto.ItemCharacteristicsDTO;

/**
 * Валідатор для характеристик предмета
 */
@Component
public class ItemCharacteristicsValidator {

    /**
     * Валідація основних характеристик предмета
     */
    public ValidationResult validateCharacteristics(ItemCharacteristicsDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("Дані характеристик відсутні");
        }

        List<String> errors = new ArrayList<>();

        // Валідація матеріалу
        validateMaterial(dto.getMaterial(), errors);

        // Валідація кольору
        validateColor(dto.getColor(), errors);

        // Валідація ступеню зносу
        validateWearDegree(dto.getWearDegree(), errors);

        // Валідація наповнювача (якщо потрібно)
        if (Boolean.TRUE.equals(dto.getShowFillerSection())) {
            validateFiller(dto.getFillerType(), errors);
        }

        return errors.isEmpty() ? ValidationResult.success() : ValidationResult.failure(errors);
    }

    /**
     * Валідація тільки матеріалу
     */
    public ValidationResult validateMaterial(String material) {
        List<String> errors = new ArrayList<>();
        validateMaterial(material, errors);
        return errors.isEmpty() ? ValidationResult.success() : ValidationResult.failure(errors);
    }

    /**
     * Валідація тільки кольору
     */
    public ValidationResult validateColor(String color) {
        List<String> errors = new ArrayList<>();
        validateColor(color, errors);
        return errors.isEmpty() ? ValidationResult.success() : ValidationResult.failure(errors);
    }

    /**
     * Валідація тільки ступеню зносу
     */
    public ValidationResult validateWearDegree(String wearDegree) {
        List<String> errors = new ArrayList<>();
        validateWearDegree(wearDegree, errors);
        return errors.isEmpty() ? ValidationResult.success() : ValidationResult.failure(errors);
    }

    /**
     * Валідація тільки наповнювача
     */
    public ValidationResult validateFiller(String fillerType) {
        List<String> errors = new ArrayList<>();
        validateFiller(fillerType, errors);
        return errors.isEmpty() ? ValidationResult.success() : ValidationResult.failure(errors);
    }

    /**
     * Перевірка чи всі обов'язкові поля заповнені
     */
    public ValidationResult validateCompleteness(ItemCharacteristicsDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("Дані характеристик відсутні");
        }

        if (!dto.isComplete()) {
            return ValidationResult.failure("Не всі обов'язкові поля заповнені");
        }

        return ValidationResult.success();
    }

    // Приватні методи валідації

    private void validateMaterial(String material, List<String> errors) {
        if (material == null || material.trim().isEmpty()) {
            errors.add("Матеріал обов'язковий для заповнення");
            return;
        }

        List<String> validMaterials = ItemCharacteristicsConstants.Materials.getAllMaterials();
        if (!validMaterials.contains(material.trim())) {
            errors.add("Невірний матеріал. Доступні: " + String.join(", ", validMaterials));
        }
    }

    private void validateColor(String color, List<String> errors) {
        if (color == null || color.trim().isEmpty()) {
            errors.add("Колір обов'язковий для заповнення");
            return;
        }

        if (color.trim().length() > 50) {
            errors.add("Назва кольору не може перевищувати 50 символів");
        }
    }

    private void validateWearDegree(String wearDegree, List<String> errors) {
        if (wearDegree == null || wearDegree.trim().isEmpty()) {
            errors.add("Ступінь зносу обов'язковий для заповнення");
            return;
        }

        List<String> validWearDegrees = ItemCharacteristicsConstants.WearDegrees.getAllWearDegrees();
        if (!validWearDegrees.contains(wearDegree.trim())) {
            errors.add("Невірний ступінь зносу. Доступні: " + String.join(", ", validWearDegrees));
        }
    }

    private void validateFiller(String fillerType, List<String> errors) {
        if (fillerType == null || fillerType.trim().isEmpty()) {
            errors.add("Тип наповнювача обов'язковий для заповнення для даної категорії");
            return;
        }

        List<String> validFillers = ItemCharacteristicsConstants.FillerTypes.getAllFillerTypes();
        if (!validFillers.contains(fillerType.trim())) {
            errors.add("Невірний тип наповнювача. Доступні: " + String.join(", ", validFillers));
        }
    }
}
