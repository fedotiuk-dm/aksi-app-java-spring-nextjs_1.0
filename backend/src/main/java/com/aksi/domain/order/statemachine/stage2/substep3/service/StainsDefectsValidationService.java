package com.aksi.domain.order.statemachine.stage2.substep3.service;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.substep3.dto.StainsDefectsDTO;
import com.aksi.domain.order.statemachine.stage2.substep3.validator.StainsDefectsValidator;
import com.aksi.domain.order.statemachine.stage2.substep3.validator.ValidationResult;

/**
 * Консолідуючий сервіс валідації для підетапу 2.3 "Забруднення, дефекти та ризики".
 * Об'єднує всі валідатори (згідно архітектурних правил).
 */
@Service
public class StainsDefectsValidationService {

    private final StainsDefectsValidator stainsDefectsValidator;

    public StainsDefectsValidationService(final StainsDefectsValidator stainsDefectsValidator) {
        this.stainsDefectsValidator = stainsDefectsValidator;
    }

    /**
     * Валідує дані про плями та дефекти.
     *
     * @param data дані для валідації
     * @return результат валідації
     */
    public ValidationResult validateStainsDefects(final StainsDefectsDTO data) {
        return stainsDefectsValidator.validateStainsDefects(data);
    }

    /**
     * Валідує готовність до завершення підетапу.
     *
     * @param data дані для валідації
     * @return результат валідації
     */
    public ValidationResult validateReadyForCompletion(final StainsDefectsDTO data) {
        return stainsDefectsValidator.validateReadyForCompletion(data);
    }

    /**
     * Перевіряє, чи всі дані валідні для переходу до наступного етапу.
     *
     * @param data дані для перевірки
     * @return true, якщо дані валідні
     */
    public boolean isDataValid(final StainsDefectsDTO data) {
        final ValidationResult result = validateStainsDefects(data);
        return result.isValid();
    }

    /**
     * Перевіряє, чи готові дані для завершення підетапу.
     *
     * @param data дані для перевірки
     * @return true, якщо готові для завершення
     */
    public boolean isReadyForCompletion(final StainsDefectsDTO data) {
        final ValidationResult result = validateReadyForCompletion(data);
        return result.isValid();
    }

    /**
     * Отримує повідомлення про помилки валідації.
     *
     * @param data дані для валідації
     * @return повідомлення про помилки або порожній рядок
     */
    public String getValidationErrors(final StainsDefectsDTO data) {
        final ValidationResult result = validateStainsDefects(data);
        return result.getErrorMessage();
    }

    /**
     * Перевіряє можливість збереження в базу даних.
     *
     * @param data дані для перевірки
     * @return true, якщо можна зберегти в БД
     */
    public boolean canSaveToDatabase(final StainsDefectsDTO data) {
        return data != null && isReadyForCompletion(data);
    }
}
