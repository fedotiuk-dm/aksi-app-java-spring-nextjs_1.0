package com.aksi.domain.order.statemachine.stage1.actions;

import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.order.statemachine.stage1.enums.ClientSearchEvent;
import com.aksi.domain.order.statemachine.stage1.enums.ClientSearchState;
import com.aksi.domain.order.statemachine.stage1.service.ClientSearchCoordinationService;
import com.aksi.domain.order.statemachine.stage1.validator.ValidationResult;

/**
 * Action для вибору клієнта зі списку результатів пошуку.
 * Зберігає вибраного клієнта в контексті через координаційний сервіс.
 */
@Component
public class ClientSearchSelectAction implements Action<ClientSearchState, ClientSearchEvent> {

    private final ClientSearchCoordinationService coordinationService;

    public ClientSearchSelectAction(ClientSearchCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public void execute(StateContext<ClientSearchState, ClientSearchEvent> context) {
        String sessionId = context.getExtendedState().get("sessionId", String.class);
        String clientIdStr = context.getExtendedState().get("clientId", String.class);

        if (sessionId == null || clientIdStr == null || clientIdStr.trim().isEmpty()) {
            // Зберігаємо помилку в контексті
            context.getExtendedState().getVariables().put("selectionError",
                "Missing sessionId or clientId for client selection");
            return;
        }

        try {
            UUID clientId = UUID.fromString(clientIdStr);

            // Обробляємо вибір клієнта через координаційний сервіс
            ValidationResult result = coordinationService.selectClient(sessionId, clientId);

            if (result.isValid()) {
                // Отримуємо обраного клієнта з контексту
                ClientResponse selectedClient = coordinationService.getSelectedClient(sessionId);

                if (selectedClient != null) {
                    // Зберігаємо інформацію про вибраного клієнта в ExtendedState
                    context.getExtendedState().getVariables().put("selectedClientId", clientId.toString());
                    context.getExtendedState().getVariables().put("selectedClientName",
                        selectedClient.getFirstName() + " " + selectedClient.getLastName());
                    context.getExtendedState().getVariables().put("selectedClientPhone", selectedClient.getPhone());
                    context.getExtendedState().getVariables().put("clientSelected", true);

                    // Очищаємо результати пошуку (не потрібні більше)
                    context.getExtendedState().getVariables().remove("searchResults");
                    context.getExtendedState().getVariables().remove("selectionError");

                    System.out.println("Client selected: " + selectedClient.getFirstName() + " " + selectedClient.getLastName());
                } else {
                    context.getExtendedState().getVariables().put("selectionError",
                        "Failed to retrieve selected client from context");
                }
                        } else {
                // Зберігаємо помилки валідації
                context.getExtendedState().getVariables().put("selectionError",
                    String.join(", ", result.getErrorMessages()));
            }

        } catch (IllegalArgumentException e) {
            // Некоректний UUID
            context.getExtendedState().getVariables().put("selectionError",
                "Invalid client ID format: " + clientIdStr);
        } catch (Exception e) {
            // Загальна помилка
            context.getExtendedState().getVariables().put("selectionError",
                "Error selecting client: " + e.getMessage());
        }
    }
}
