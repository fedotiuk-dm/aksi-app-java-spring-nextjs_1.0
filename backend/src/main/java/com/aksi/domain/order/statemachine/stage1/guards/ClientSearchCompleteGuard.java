package com.aksi.domain.order.statemachine.stage1.guards;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage1.enums.ClientSearchEvent;
import com.aksi.domain.order.statemachine.stage1.enums.ClientSearchState;
import com.aksi.domain.order.statemachine.stage1.service.ClientSearchCoordinationService;

/**
 * Guard для перевірки готовності до завершення пошуку клієнта.
 * Перевіряє, чи вибраний клієнт.
 */
@Component
public class ClientSearchCompleteGuard implements Guard<ClientSearchState, ClientSearchEvent> {

    private final ClientSearchCoordinationService coordinationService;

    public ClientSearchCompleteGuard(ClientSearchCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

                @Override
    public boolean evaluate(StateContext<ClientSearchState, ClientSearchEvent> context) {
        String sessionId = context.getExtendedState().get("sessionId", String.class);

        if (sessionId == null) {
            return false;
        }

        // Використовуємо координаційний сервіс для перевірки готовності завершення
        return coordinationService.isReadyToComplete(sessionId);
    }
}
