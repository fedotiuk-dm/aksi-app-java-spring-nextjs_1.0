package com.aksi.domain.order.statemachine.stage2.substep2.validator;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage2.substep2.dto.CharacteristicsDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.FillingType;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.MaterialType;

import lombok.Data;

/**
 * Валідатор для характеристик предмета (підетап 2.2)
 */
@Component
public class CharacteristicsValidator {

    /**
     * Результат валідації
     */
    @Data
    public static class ValidationResult {
        private boolean isValid;
        private List<String> errors;

        public ValidationResult(boolean isValid, List<String> errors) {
            this.isValid = isValid;
            this.errors = errors != null ? errors : List.of();
        }
    }

    // Базові кольори для швидкого вибору
    private static final Set<String> STANDARD_COLORS = Set.of(
        "білий", "чорний", "сірий", "коричневий", "синій", "зелений",
        "червоний", "жовтий", "помаранчевий", "фіолетовий", "рожевий",
        "бежевий", "кремовий", "темно-синій", "світло-сірий"
    );

    /**
     * Валідує характеристики предмета
     *
     * @param characteristics дані для валідації
     * @return результат валідації
     */
    public ValidationResult validate(CharacteristicsDTO characteristics) {
        List<String> errors = new ArrayList<>();

        if (characteristics == null) {
            errors.add("Характеристики не можуть бути порожніми");
            return new ValidationResult(false, errors);
        }

        // Валідація матеріала
        validateMaterial(characteristics, errors);

        // Валідація кольору
        validateColor(characteristics, errors);

        // Валідація наповнювача
        validateFilling(characteristics, errors);

        // Валідація примітки
        validateNotes(characteristics, errors);

        // Бізнес-правила
        validateBusinessRules(characteristics, errors);

        return new ValidationResult(errors.isEmpty(), errors);
    }

    /**
     * Валідує матеріал
     */
    private void validateMaterial(CharacteristicsDTO characteristics, List<String> errors) {
        if (characteristics.getMaterial() == null) {
            errors.add("Матеріал обов'язковий для вибору");
        }
    }

    /**
     * Валідує колір
     */
    private void validateColor(CharacteristicsDTO characteristics, List<String> errors) {
        String color = characteristics.getColor();

        if (color == null || color.trim().isEmpty()) {
            errors.add("Колір обов'язковий для вказання");
            return;
        }

        if (color.length() > 100) {
            errors.add("Назва кольору не може перевищувати 100 символів");
        }

        // Перевірка чи це стандартний колір
        boolean isStandard = STANDARD_COLORS.contains(color.toLowerCase().trim());
        characteristics.setIsStandardColor(isStandard);
    }

    /**
     * Валідує наповнювач
     */
    private void validateFilling(CharacteristicsDTO characteristics, List<String> errors) {
        FillingType filling = characteristics.getFilling();
        String customFilling = characteristics.getCustomFilling();

        // Якщо вибрано "Інше", то має бути вказаний кастомний наповнювач
        if (filling == FillingType.OTHER) {
            if (customFilling == null || customFilling.trim().isEmpty()) {
                errors.add("При виборі 'Інше' необхідно вказати тип наповнювача");
            } else if (customFilling.length() > 100) {
                errors.add("Назва наповнювача не може перевищувати 100 символів");
            }
        }

        // Якщо не вибрано "Інше", кастомний наповнювач не повинен бути заданий
        if (filling != FillingType.OTHER && customFilling != null && !customFilling.trim().isEmpty()) {
            errors.add("Кастомний наповнювач можна вказувати тільки при виборі 'Інше'");
        }

        // Якщо наповнювач не може бути збитим, але вказано що збитий
        if (filling != null && !filling.canBeDamaged() && Boolean.TRUE.equals(characteristics.getIsDamagedFilling())) {
            errors.add("Цей тип наповнювача не може бути збитим");
        }
    }

    /**
     * Валідує примітки
     */
    private void validateNotes(CharacteristicsDTO characteristics, List<String> errors) {
        String notes = characteristics.getNotes();

        if (notes != null && notes.length() > 500) {
            errors.add("Примітки не можуть перевищувати 500 символів");
        }
    }

    /**
     * Валідує бізнес-правила
     */
    private void validateBusinessRules(CharacteristicsDTO characteristics, List<String> errors) {
        MaterialType material = characteristics.getMaterial();

        // Перевірка сумісності матеріала з наповнювачем
        if (material != null && characteristics.getFilling() != null) {
            if (material.isLeather() && characteristics.getFilling() != null) {
                errors.add("Шкіряні вироби зазвичай не мають наповнювача");
            }
        }

        // Критичні комбінації
        if (material != null && material.isLeather() &&
            characteristics.getWearLevel() != null && characteristics.getWearLevel().isCritical()) {
            // Це попередження, не помилка - додаємо до warnings в DTO
        }

        // Збитий наповнювач без вказання типу
        if (Boolean.TRUE.equals(characteristics.getIsDamagedFilling()) && characteristics.getFilling() == null) {
            errors.add("Неможливо вказати збитий наповнювач без вказання його типу");
        }
    }

    /**
     * Швидка валідація готовності до наступного кроку
     *
     * @param characteristics дані для перевірки
     * @return true якщо можна переходити далі
     */
    public boolean isReadyForNextStep(CharacteristicsDTO characteristics) {
        if (characteristics == null) {
            return false;
        }

        return characteristics.isComplete() && validate(characteristics).isValid();
    }

    /**
     * Валідує сумісність матеріала з категорією послуги
     *
     * @param material матеріал
     * @param categoryCode код категорії послуги
     * @return true якщо сумісний
     */
    public boolean isMaterialCompatibleWithCategory(MaterialType material, String categoryCode) {
        if (material == null || categoryCode == null) {
            return false;
        }

        // Логіка сумісності матеріалів з категоріями
        return switch (categoryCode.toLowerCase()) {
            case "leather_cleaning", "leather_restoration" -> material.isLeather();
            case "fur_cleaning" -> material == MaterialType.WOOL || material.isLeather();
            case "textile_cleaning", "laundry", "ironing" -> material.isTextile();
            case "dyeing" -> true; // Фарбування доступне для всіх матеріалів
            default -> true; // За замовчуванням дозволяємо всі матеріали
        };
    }

    /**
     * Отримує рекомендовані матеріали для категорії
     *
     * @param categoryCode код категорії послуги
     * @return список рекомендованих матеріалів
     */
    public List<MaterialType> getRecommendedMaterials(String categoryCode) {
        if (categoryCode == null) {
            return List.of(MaterialType.values());
        }

        return switch (categoryCode.toLowerCase()) {
            case "leather_cleaning", "leather_restoration" ->
                List.of(MaterialType.getByCategory(MaterialType.MaterialCategory.LEATHER));
            case "textile_cleaning", "laundry", "ironing" ->
                List.of(MaterialType.getByCategory(MaterialType.MaterialCategory.TEXTILE));
            case "fur_cleaning" ->
                List.of(MaterialType.WOOL, MaterialType.SMOOTH_LEATHER);
            default -> List.of(MaterialType.values());
        };
    }

    /**
     * Перевіряє чи є колір стандартним
     *
     * @param color колір для перевірки
     * @return true якщо стандартний
     */
    public boolean isStandardColor(String color) {
        if (color == null) {
            return false;
        }
        return STANDARD_COLORS.contains(color.toLowerCase().trim());
    }

    /**
     * Отримує список стандартних кольорів
     *
     * @return список стандартних кольорів
     */
    public List<String> getStandardColors() {
        return new ArrayList<>(STANDARD_COLORS);
    }
}
