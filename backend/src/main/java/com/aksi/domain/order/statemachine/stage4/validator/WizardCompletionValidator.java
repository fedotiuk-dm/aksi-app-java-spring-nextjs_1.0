package com.aksi.domain.order.statemachine.stage4.validator;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage4.dto.WizardCompletionDTO;

/**
 * Валідатор для WizardCompletionDTO.
 */
@Component
public class WizardCompletionValidator {

    /**
     * Валідує дані завершення wizard.
     */
    public List<String> validate(WizardCompletionDTO dto) {
        List<String> errors = new ArrayList<>();

        if (dto == null) {
            errors.add("DTO не може бути null");
            return errors;
        }

        // Базові перевірки не потрібні для completion

        return errors;
    }

    /**
     * Валідує можливість завершення wizard.
     */
    public List<String> validateForCompletion(WizardCompletionDTO dto) {
        List<String> errors = validate(dto);

        if (dto != null) {
            if (!dto.isOrderFinalized()) {
                errors.add("Замовлення повинно бути фіналізовано перед завершенням");
            }

            if (!dto.isPdfGenerated()) {
                errors.add("PDF-квитанція повинна бути згенерована перед завершенням");
            }
        }

        return errors;
    }

    /**
     * Перевіряє чи можна завершити процес.
     */
    public boolean canCompleteWizard(WizardCompletionDTO dto) {
        return dto != null &&
               dto.canCompleteWizard() &&
               !dto.isHasErrors() &&
               validateForCompletion(dto).isEmpty();
    }

    /**
     * Перевіряє чи процес повністю завершено.
     */
    public boolean isFullyCompleted(WizardCompletionDTO dto) {
        return dto != null &&
               dto.isFullyCompleted() &&
               !dto.isHasErrors();
    }
}
