package com.aksi.domain.order.statemachine.stage1.adapter;

import java.util.List;
import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.stereotype.Component;

import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.client.dto.CreateClientRequest;
import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage1.service.Stage1CoordinationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Адаптер для підетапу 1.1 - Вибір або створення клієнта.
 *
 * Інтегрує операції з клієнтами з State Machine через координаційний сервіс,
 * дотримуючись принципу Single Responsibility.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ClientSelectionStateMachineAdapter {

    private final Stage1CoordinationService coordinationService;

    /**
     * Ініціалізує підетап вибору клієнта.
     */
    public void initializeClientSelection(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Ініціалізація підетапу 1.1 - Вибір клієнта");

        String wizardId = extractWizardId(context);
        coordinationService.getStateService().initializeClientSelection(wizardId, context);
    }

    /**
     * Завершує підетап вибору клієнта.
     */
    public void finalizeClientSelection(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Завершення підетапу 1.1 - Вибір клієнта");

        coordinationService.getOperationsService().finalizeClientSelection(context);
    }

    /**
     * Виконує пошук клієнтів за запитом.
     */
    public List<ClientResponse> searchClients(String searchQuery, StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Пошук клієнтів за запитом: {}", searchQuery);

        return coordinationService.getOperationsService().searchClients(searchQuery, context);
    }

    /**
     * Вибирає існуючого клієнта.
     */
    public void selectClient(UUID clientId, StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Вибір клієнта: {}", clientId);

        coordinationService.getOperationsService().selectExistingClient(clientId, context);
    }

    /**
     * Переключає в режим створення нового клієнта.
     */
    public void switchToCreateNewClient(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Переключення на створення нового клієнта");

        coordinationService.getOperationsService().switchToCreateNewClientMode(context);
    }

    /**
     * Створює нового клієнта.
     */
    public ClientResponse saveNewClientData(CreateClientRequest request, StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Створення нового клієнта");

        return coordinationService.getOperationsService().createNewClient(request, context);
    }

    /**
     * Переключає назад в режим пошуку існуючих клієнтів.
     */
    public void switchToSearchExisting(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Переключення на пошук існуючих клієнтів");

        coordinationService.getOperationsService().switchToSearchExistingMode(context);
    }

    /**
     * Перевіряє готовність підетапу до завершення.
     */
    public boolean validateClientSelectionCompletion(StateContext<OrderState, OrderEvent> context) {
        return coordinationService.getValidationService().validateClientSelectionCompletion(context);
    }

    /**
     * Перевіряє чи може користувач перейти до наступного кроку.
     */
    public boolean canProceedToNext(StateContext<OrderState, OrderEvent> context) {
        return coordinationService.getValidationService().canProceedToNextInClientSelection(context);
    }

    /**
     * Отримує wizardId з контексту State Machine.
     */
    private String extractWizardId(StateContext<OrderState, OrderEvent> context) {
        Object wizardIdObj = context.getExtendedState().getVariables().get("wizardId");
        if (wizardIdObj instanceof String) {
            return (String) wizardIdObj;
        }
        throw new IllegalStateException("WizardId не знайдено в контексті State Machine");
    }
}
