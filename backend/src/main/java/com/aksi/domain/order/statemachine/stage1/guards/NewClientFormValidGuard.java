package com.aksi.domain.order.statemachine.stage1.guards;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage1.enums.NewClientFormEvent;
import com.aksi.domain.order.statemachine.stage1.enums.NewClientFormState;
import com.aksi.domain.order.statemachine.stage1.service.NewClientFormCoordinationService;

/**
 * Guard для перевірки валідності форми нового клієнта.
 * Перевіряє чи пройшла форма валідацію успішно.
 */
@Component
public class NewClientFormValidGuard implements Guard<NewClientFormState, NewClientFormEvent> {

    private final NewClientFormCoordinationService coordinationService;

    public NewClientFormValidGuard(NewClientFormCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public boolean evaluate(StateContext<NewClientFormState, NewClientFormEvent> context) {
        String sessionId = context.getExtendedState().get("sessionId", String.class);

        if (sessionId == null) {
            return false;
        }

        // Використовуємо CoordinationService для перевірки валідності форми
        return coordinationService.isFormValid(sessionId);
    }
}
