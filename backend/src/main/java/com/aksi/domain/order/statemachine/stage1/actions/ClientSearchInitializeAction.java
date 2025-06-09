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
        // Створюємо новий контекст пошуку через координаційний сервіс
        String sessionId = coordinationService.startClientSearch();

        // Зберігаємо sessionId в ExtendedState для подальшого використання
        context.getExtendedState().getVariables().put("sessionId", sessionId);

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
