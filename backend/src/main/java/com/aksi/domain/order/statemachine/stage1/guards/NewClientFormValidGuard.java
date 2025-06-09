package com.aksi.domain.order.statemachine.stage1.guards;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage1.dto.NewClientFormDTO;
import com.aksi.domain.order.statemachine.stage1.enums.NewClientFormEvent;
import com.aksi.domain.order.statemachine.stage1.enums.NewClientFormState;
import com.aksi.domain.order.statemachine.stage1.service.NewClientFormValidationService;
import com.aksi.domain.order.statemachine.stage1.validator.ValidationResult;

/**
 * Guard для перевірки валідності форми нового клієнта.
 * Перевіряє чи пройшла форма валідацію успішно.
 */
@Component
public class NewClientFormValidGuard implements Guard<NewClientFormState, NewClientFormEvent> {

    private final NewClientFormValidationService validationService;

    public NewClientFormValidGuard(NewClientFormValidationService validationService) {
        this.validationService = validationService;
    }

    @Override
    public boolean evaluate(StateContext<NewClientFormState, NewClientFormEvent> context) {
        NewClientFormDTO formData = context.getExtendedState().get("formData", NewClientFormDTO.class);

        if (formData == null) {
            return false;
        }

        ValidationResult result = validationService.validateNewClientForm(formData);
        return result.isValid();
    }
}
