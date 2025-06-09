package com.aksi.domain.order.statemachine.stage1.guards;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage1.enums.ClientSearchEvent;
import com.aksi.domain.order.statemachine.stage1.enums.ClientSearchState;
import com.aksi.domain.order.statemachine.stage1.service.NewClientFormCoordinationService;

/**
 * Guard для перевірки готовності форми нового клієнта.
 * Перевіряє, чи форма заповнена правильно та готова до створення клієнта.
 */
@Component
public class NewClientFormReadyGuard implements Guard<ClientSearchState, ClientSearchEvent> {

    private final NewClientFormCoordinationService coordinationService;

    public NewClientFormReadyGuard(NewClientFormCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public boolean evaluate(StateContext<ClientSearchState, ClientSearchEvent> context) {
        String sessionId = context.getExtendedState().get("sessionId", String.class);

        if (sessionId == null) {
            return false;
        }

        // Використовуємо CoordinationService для перевірки готовності форми
        return coordinationService.isFormComplete(sessionId);
    }
}
