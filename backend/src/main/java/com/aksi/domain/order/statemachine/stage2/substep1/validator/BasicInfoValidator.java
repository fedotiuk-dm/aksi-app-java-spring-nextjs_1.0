package com.aksi.domain.order.statemachine.stage2.substep1.validator;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage2.substep1.dto.BasicInfoDTO;

import lombok.Data;

/**
 * Валідатор для основної інформації підетапу 2.1
 */
@Component
public class BasicInfoValidator {

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

    /**
     * Валідує основну інформацію про предмет
     *
     * @param basicInfo дані для валідації
     * @return результат валідації
     */
    public ValidationResult validate(BasicInfoDTO basicInfo) {
        List<String> errors = new ArrayList<>();

        if (basicInfo == null) {
            errors.add("Основна інформація не може бути порожньою");
            return new ValidationResult(false, errors);
        }

        // Валідація категорії
        validateCategory(basicInfo, errors);

        // Валідація предмета
        validateItem(basicInfo, errors);

        // Валідація кількості
        validateQuantity(basicInfo, errors);

        // Валідація одиниці виміру
        validateUnitOfMeasure(basicInfo, errors);

        // Валідація цін
        validatePricing(basicInfo, errors);

        return new ValidationResult(errors.isEmpty(), errors);
    }

    /**
     * Валідує категорію
     */
    private void validateCategory(BasicInfoDTO basicInfo, List<String> errors) {
        if (basicInfo.getCategoryId() == null || basicInfo.getCategoryId().trim().isEmpty()) {
            errors.add("Категорія обов'язкова для вибору");
        }

        if (basicInfo.getCategoryCode() == null || basicInfo.getCategoryCode().trim().isEmpty()) {
            errors.add("Код категорії обов'язковий");
        }
    }

    /**
     * Валідує предмет
     */
    private void validateItem(BasicInfoDTO basicInfo, List<String> errors) {
        if (basicInfo.getItemName() == null || basicInfo.getItemName().trim().isEmpty()) {
            errors.add("Назва предмета обов'язкова");
        } else if (basicInfo.getItemName().length() > 255) {
            errors.add("Назва предмета не може перевищувати 255 символів");
        }

        // Якщо задано опис, перевіряємо його довжину
        if (basicInfo.getDescription() != null && basicInfo.getDescription().length() > 1000) {
            errors.add("Опис не може перевищувати 1000 символів");
        }
    }

    /**
     * Валідує кількість
     */
    private void validateQuantity(BasicInfoDTO basicInfo, List<String> errors) {
        if (basicInfo.getQuantity() == null) {
            errors.add("Кількість обов'язкова");
        } else if (basicInfo.getQuantity() <= 0) {
            errors.add("Кількість має бути більше нуля");
        } else if (basicInfo.getQuantity() > 1000) {
            errors.add("Кількість не може перевищувати 1000 одиниць");
        }
    }

    /**
     * Валідує одиницю виміру
     */
    private void validateUnitOfMeasure(BasicInfoDTO basicInfo, List<String> errors) {
        if (basicInfo.getUnitOfMeasure() == null || basicInfo.getUnitOfMeasure().trim().isEmpty()) {
            errors.add("Одиниця виміру обов'язкова");
        } else {
            String unit = basicInfo.getUnitOfMeasure().trim().toLowerCase();
            if (!isValidUnit(unit)) {
                errors.add("Неприпустима одиниця виміру: " + basicInfo.getUnitOfMeasure());
            }
        }
    }

    /**
     * Валідує ціни
     */
    private void validatePricing(BasicInfoDTO basicInfo, List<String> errors) {
        if (basicInfo.getBasePrice() != null && basicInfo.getBasePrice().signum() < 0) {
            errors.add("Базова ціна не може бути від'ємною");
        }
    }

    /**
     * Перевіряє чи валідна одиниця виміру
     */
    private boolean isValidUnit(String unit) {
        return unit.equals("шт") ||
               unit.equals("кг") ||
               unit.equals("м") ||
               unit.equals("л") ||
               unit.equals("шт.") ||
               unit.equals("кг.") ||
               unit.equals("м.") ||
               unit.equals("л.");
    }

    /**
     * Швидка валідація готовності до наступного кроку
     *
     * @param basicInfo дані для перевірки
     * @return true якщо можна переходити далі
     */
    public boolean isReadyForNextStep(BasicInfoDTO basicInfo) {
        if (basicInfo == null) {
            return false;
        }

        return basicInfo.isComplete() && validate(basicInfo).isValid();
    }
}
