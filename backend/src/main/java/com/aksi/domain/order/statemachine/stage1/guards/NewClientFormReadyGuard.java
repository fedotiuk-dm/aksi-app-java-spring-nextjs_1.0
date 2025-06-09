package com.aksi.domain.order.statemachine.stage1.guards;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage1.dto.NewClientFormDTO;
import com.aksi.domain.order.statemachine.stage1.enums.Stage1Event;
import com.aksi.domain.order.statemachine.stage1.enums.Stage1State;
import com.aksi.domain.order.statemachine.stage1.service.NewClientFormValidationService;

/**
 * Guard для перевірки готовності форми нового клієнта.
 * Перевіряє, чи форма заповнена правильно та готова до створення клієнта.
 */
@Component
public class NewClientFormReadyGuard implements Guard<Stage1State, Stage1Event> {

    private final NewClientFormValidationService validationService;

    public NewClientFormReadyGuard(NewClientFormValidationService validationService) {
        this.validationService = validationService;
    }

    @Override
    public boolean evaluate(StateContext<Stage1State, Stage1Event> context) {
        NewClientFormDTO formData = getNewClientFormFromContext(context);

        if (formData == null) {
            return false;
        }

        return validationService.isFormReadyForSubmission(formData);
    }

    /**
     * Отримання NewClientFormDTO з контексту State Machine.
     */
    private NewClientFormDTO getNewClientFormFromContext(StateContext<Stage1State, Stage1Event> context) {
        Object formDataObj = context.getExtendedState().getVariables().get("newClientForm");

        if (formDataObj instanceof NewClientFormDTO formData) {
            return formData;
        }

        return null;
    }
}
