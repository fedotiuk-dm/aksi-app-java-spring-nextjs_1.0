package com.aksi.domain.order.statemachine.stage2.substep2.validator;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage2.substep2.dto.ItemCharacteristicsDTO;

/**
 * Валідатор для підетапу 2.2 "Характеристики предмета".
 * Працює тільки з DTO згідно з архітектурними правилами.
 */
@Component
public class ItemCharacteristicsValidator {

    /**
     * Валідація основних характеристик предмета.
     */
    public ValidationResult validateCharacteristics(final ItemCharacteristicsDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("Дані характеристик відсутні");
        }

        if (dto.getCurrentItem() == null) {
            return ValidationResult.failure("Поточний предмет відсутній");
        }

        final List<String> errors = new ArrayList<>();

        // Валідація матеріалу
        validateMaterial(dto.getCurrentItem().getMaterial(), errors);

        // Валідація кольору
        validateColor(dto.getCurrentItem().getColor(), errors);

        // Валідація ступеня зносу
        validateWearDegree(dto.getCurrentItem().getWearDegree(), errors);

        // Валідація наповнювача (якщо є)
        if (dto.getCurrentItem().getFillerType() != null && !dto.getCurrentItem().getFillerType().trim().isEmpty()) {
            validateFiller(dto.getCurrentItem().getFillerType(), errors);
        }

        return errors.isEmpty() ? ValidationResult.success() : ValidationResult.failure(errors);
    }

    /**
     * Валідація тільки матеріалу.
     */
    public ValidationResult validateMaterial(final String material) {
        final List<String> errors = new ArrayList<>();
        validateMaterial(material, errors);
        return errors.isEmpty() ? ValidationResult.success() : ValidationResult.failure(errors);
    }

    /**
     * Валідація тільки кольору.
     */
    public ValidationResult validateColor(final String color) {
        final List<String> errors = new ArrayList<>();
        validateColor(color, errors);
        return errors.isEmpty() ? ValidationResult.success() : ValidationResult.failure(errors);
    }

    /**
     * Валідація тільки ступеня зносу.
     */
    public ValidationResult validateWearDegree(final String wearDegree) {
        final List<String> errors = new ArrayList<>();
        validateWearDegree(wearDegree, errors);
        return errors.isEmpty() ? ValidationResult.success() : ValidationResult.failure(errors);
    }

    /**
     * Валідація тільки наповнювача.
     */
    public ValidationResult validateFiller(final String fillerType) {
        final List<String> errors = new ArrayList<>();
        validateFiller(fillerType, errors);
        return errors.isEmpty() ? ValidationResult.success() : ValidationResult.failure(errors);
    }

    /**
     * Перевірка чи всі обов'язкові поля заповнені.
     */
    public ValidationResult validateCompleteness(final ItemCharacteristicsDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("Дані характеристик відсутні");
        }

        if (!dto.isDataValid()) {
            return ValidationResult.failure("Не всі обов'язкові поля заповнені");
        }

        return ValidationResult.success();
    }

    // Приватні методи валідації

    private void validateMaterial(final String material, final List<String> errors) {
        if (material == null || material.trim().isEmpty()) {
            errors.add("Матеріал обов'язковий для заповнення");
            return;
        }

        // Базова валідація довжини
        if (material.trim().length() > 100) {
            errors.add("Назва матеріалу не може перевищувати 100 символів");
        }
    }

    private void validateColor(final String color, final List<String> errors) {
        if (color == null || color.trim().isEmpty()) {
            errors.add("Колір обов'язковий для заповнення");
            return;
        }

        if (color.trim().length() > 50) {
            errors.add("Назва кольору не може перевищувати 50 символів");
        }
    }

    private void validateWearDegree(final String wearDegree, final List<String> errors) {
        if (wearDegree == null || wearDegree.trim().isEmpty()) {
            errors.add("Ступінь зносу обов'язковий для заповнення");
            return;
        }

        // Перевірка на валідні значення
        if (!wearDegree.matches("^(10|30|50|75)%$")) {
            errors.add("Невірний ступінь зносу. Доступні: 10%, 30%, 50%, 75%");
        }
    }

    private void validateFiller(final String fillerType, final List<String> errors) {
        if (fillerType == null || fillerType.trim().isEmpty()) {
            errors.add("Тип наповнювача обов'язковий для заповнення");
            return;
        }

        if (fillerType.trim().length() > 100) {
            errors.add("Назва наповнювача не може перевищувати 100 символів");
        }
    }
}
