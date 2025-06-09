package com.aksi.domain.order.statemachine.stage1.guards;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage1.enums.NewClientFormEvent;
import com.aksi.domain.order.statemachine.stage1.enums.NewClientFormState;
import com.aksi.domain.order.statemachine.stage1.service.NewClientFormCoordinationService;

/**
 * Guard для перевірки готовності форми нового клієнта до завершення.
 * Перевіряє валідність всіх обов'язкових полів.
 */
@Component
public class NewClientFormCompleteGuard implements Guard<NewClientFormState, NewClientFormEvent> {

    private final NewClientFormCoordinationService coordinationService;

    public NewClientFormCompleteGuard(NewClientFormCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public boolean evaluate(StateContext<NewClientFormState, NewClientFormEvent> context) {
        String sessionId = context.getExtendedState().get("sessionId", String.class);

        if (sessionId == null) {
            return false;
        }

        // Використовуємо CoordinationService для перевірки готовності завершення
        return coordinationService.isFormComplete(sessionId);
    }
}
