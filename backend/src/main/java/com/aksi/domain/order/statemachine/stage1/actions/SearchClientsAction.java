package com.aksi.domain.order.statemachine.stage1.actions;

import java.util.List;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage1.service.Stage1CoordinationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Action для пошуку клієнтів у підетапі 1.1.
 *
 * Виконується при події SEARCH_CLIENTS.
 * Використовує Stage1CoordinationService для пошуку клієнтів.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class SearchClientsAction implements Action<OrderState, OrderEvent> {

    private final Stage1CoordinationService coordinationService;

    @Override
    public void execute(StateContext<OrderState, OrderEvent> context) {
        String wizardId = (String) context.getExtendedState().getVariables().get("wizardId");
        log.info("Пошук клієнтів для wizard: {}", wizardId);

        try {
            // Отримуємо термін пошуку з headers повідомлення
            Object searchTermObj = context.getMessageHeaders().get("searchTerm");

            if (!(searchTermObj instanceof String searchTerm)) {
                throw new IllegalArgumentException("Термін пошуку не вказано або має неправильний тип");
            }

            if (searchTerm.trim().isEmpty()) {
                log.warn("Порожній термін пошуку для wizard: {}", wizardId);
                return;
            }

            // Виконуємо пошук через координаційний сервіс
            List<ClientResponse> searchResults = coordinationService.getOperationsService()
                .searchClients(searchTerm, context);

            // Зберігаємо результати пошуку в контексті для доступу з UI
            context.getExtendedState().getVariables().put("lastSearchResults", searchResults);
            context.getExtendedState().getVariables().put("lastSearchTerm", searchTerm);

            log.info("Пошук клієнтів завершено для wizard: {}. Знайдено {} результатів",
                     wizardId, searchResults.size());

        } catch (IllegalArgumentException e) {
            log.error("Некоректні дані пошуку для wizard {}: {}", wizardId, e.getMessage());
            context.getExtendedState().getVariables().put("lastError",
                "Некоректні дані пошуку: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Помилка пошуку клієнтів для wizard {}: {}", wizardId, e.getMessage(), e);
            context.getExtendedState().getVariables().put("lastError",
                "Помилка пошуку клієнтів: " + e.getMessage());
            throw e;
        }
    }
}
