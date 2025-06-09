package com.aksi.domain.order.statemachine.stage1.guards;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage1.dto.NewClientFormDTO;
import com.aksi.domain.order.statemachine.stage1.enums.ClientSearchEvent;
import com.aksi.domain.order.statemachine.stage1.enums.ClientSearchState;
import com.aksi.domain.order.statemachine.stage1.service.NewClientFormValidationService;

/**
 * Guard для перевірки готовності форми нового клієнта.
 * Перевіряє, чи форма заповнена правильно та готова до створення клієнта.
 */
@Component
public class NewClientFormReadyGuard implements Guard<ClientSearchState, ClientSearchEvent> {

    private final NewClientFormValidationService validationService;

    public NewClientFormReadyGuard(NewClientFormValidationService validationService) {
        this.validationService = validationService;
    }

    @Override
    public boolean evaluate(StateContext<ClientSearchState, ClientSearchEvent> context) {
        NewClientFormDTO formData = getNewClientFormFromContext(context);

        if (formData == null) {
            return false;
        }

        return validationService.isFormReadyForSubmission(formData);
    }

    /**
     * Отримання NewClientFormDTO з контексту State Machine.
     */
    private NewClientFormDTO getNewClientFormFromContext(StateContext<ClientSearchState, ClientSearchEvent> context) {
        Object formDataObj = context.getExtendedState().getVariables().get("newClientForm");

        if (formDataObj instanceof NewClientFormDTO formData) {
            return formData;
        }

        return null;
    }
}
