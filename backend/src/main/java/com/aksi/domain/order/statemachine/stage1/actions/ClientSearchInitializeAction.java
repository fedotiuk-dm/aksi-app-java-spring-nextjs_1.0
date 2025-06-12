package com.aksi.domain.order.statemachine.stage1.actions;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage1.enums.ClientSearchEvent;
import com.aksi.domain.order.statemachine.stage1.enums.ClientSearchState;
import com.aksi.domain.order.statemachine.stage1.service.ClientSearchCoordinationService;

/**
 * Action для ініціалізації пошуку клієнта.
 * Виконує початкові налаштування для пошуку клієнта.
 */
@Component
public class ClientSearchInitializeAction implements Action<ClientSearchState, ClientSearchEvent> {

    private final ClientSearchCoordinationService coordinationService;

    public ClientSearchInitializeAction(ClientSearchCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public void execute(StateContext<ClientSearchState, ClientSearchEvent> context) {
        // Перевіряємо чи є sessionId від головного Order Wizard
        String sessionId = context.getExtendedState().get("sessionId", String.class);

        if (sessionId != null) {
            // Використовуємо існуючий sessionId від головного wizard
            coordinationService.initializeClientSearch(sessionId);
            System.out.println("ClientSearch initialized with existing sessionId: " + sessionId);
        } else {
            // Створюємо новий контекст пошуку (для зворотної сумісності)
            sessionId = coordinationService.startClientSearch();
        context.getExtendedState().getVariables().put("sessionId", sessionId);
            System.out.println("ClientSearch initialized with new sessionId: " + sessionId);
        }

        // Очищаємо попередні результати та змінні
        context.getExtendedState().getVariables().remove("searchResults");
        context.getExtendedState().getVariables().remove("selectedClientId");
        context.getExtendedState().getVariables().remove("searchError");

        // Встановлюємо початкові значення змінних
        context.getExtendedState().getVariables().put("isSearching", false);
        context.getExtendedState().getVariables().put("hasResults", false);
        context.getExtendedState().getVariables().put("isCreateNewClientMode", false);

        // Логування для відстеження
        System.out.println("ClientSearch initialized with sessionId: " + sessionId);
    }
}
