package com.aksi.domain.order.statemachine.stage2.substep3.validator;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage2.substep3.dto.StainsDefectsDTO;

/**
 * Валідатор для підетапу 2.3 "Забруднення, дефекти та ризики".
 * Залежить тільки від DTO + ValidationResult (згідно архітектурних правил).
 */
@Component
public class StainsDefectsValidator {

    /**
     * Валідує дані про плями та дефекти.
     *
     * @param data дані для валідації
     * @return результат валідації
     */
    public ValidationResult validateStainsDefects(final StainsDefectsDTO data) {
        final List<String> errors = new ArrayList<>();

        if (data == null) {
            errors.add("Дані про плями та дефекти не можуть бути null");
            return ValidationResult.failure(errors);
        }

        // Валідація currentItem
        if (data.getCurrentItem() == null) {
            errors.add("Інформація про предмет відсутня");
            return ValidationResult.failure(errors);
        }

        // Перевірка обов'язкових полів
        validateRequiredData(data, errors);

        // Перевірка спеціальних умов
        validateSpecialConditions(data, errors);

        if (errors.isEmpty()) {
            return ValidationResult.success();
        }

        return ValidationResult.failure(errors);
    }

    /**
     * Валідує обов'язкові дані.
     */
    private void validateRequiredData(final StainsDefectsDTO data, final List<String> errors) {
        // Перевірка вибору плям або дефектів (хоча б щось повинно бути вибрано)
        if (!data.hasStains() && !data.hasDefects()) {
            errors.add("Необхідно вибрати принаймні плями або дефекти");
        }

        // Перевірка завершеності етапів
        if (!data.isStainsSelectionCompleted()) {
            errors.add("Вибір плям не завершено");
        }

        if (!data.isDefectsSelectionCompleted()) {
            errors.add("Вибір дефектів не завершено");
        }
    }

    /**
     * Валідує спеціальні умови (наприклад, "Без гарантій").
     */
    private void validateSpecialConditions(final StainsDefectsDTO data, final List<String> errors) {
        // Якщо вибрано "Без гарантій", має бути вказана причина
        if (data.isNoGuaranteeReasonRequired()) {
            errors.add("При виборі 'Без гарантій' необхідно вказати причину");
        }
    }

    /**
     * Валідує готовність до завершення підетапу.
     *
     * @param data дані для валідації
     * @return результат валідації
     */
    public ValidationResult validateReadyForCompletion(final StainsDefectsDTO data) {
        final List<String> errors = new ArrayList<>();

        if (data == null) {
            errors.add("Дані відсутні");
            return ValidationResult.failure(errors);
        }

        if (!data.isDataValid()) {
            errors.add("Дані не пройшли валідацію");
        }

        if (errors.isEmpty()) {
            return ValidationResult.success();
        }

        return ValidationResult.failure(errors);
    }
}
