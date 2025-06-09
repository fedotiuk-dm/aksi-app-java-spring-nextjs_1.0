package com.aksi.domain.order.statemachine.stage1.guards;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage1.dto.NewClientFormDTO;
import com.aksi.domain.order.statemachine.stage1.enums.NewClientFormEvent;
import com.aksi.domain.order.statemachine.stage1.enums.NewClientFormState;
import com.aksi.domain.order.statemachine.stage1.service.NewClientFormValidationService;

/**
 * Guard для перевірки готовності форми нового клієнта до завершення.
 * Перевіряє валідність всіх обов'язкових полів.
 */
@Component
public class NewClientFormCompleteGuard implements Guard<NewClientFormState, NewClientFormEvent> {

    private final NewClientFormValidationService validationService;

    public NewClientFormCompleteGuard(NewClientFormValidationService validationService) {
        this.validationService = validationService;
    }

    @Override
    public boolean evaluate(StateContext<NewClientFormState, NewClientFormEvent> context) {
        NewClientFormDTO formData = context.getExtendedState().get("formData", NewClientFormDTO.class);

        if (formData == null) {
            return false;
        }

        return validationService.isFormReadyForSubmission(formData);
    }
}
