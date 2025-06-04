package com.aksi.domain.order.statemachine.stage1.actions;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage1.service.Stage1WizardService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Action для збереження даних клієнта в Stage 1.
 * Використовує новий Stage1WizardService для роботи з клієнтами.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class SaveClientDataAction implements Action<OrderState, OrderEvent> {

    private final Stage1WizardService stage1WizardService;

    @Override
    public void execute(StateContext<OrderState, OrderEvent> context) {
        String wizardId = (String) context.getExtendedState().getVariables().get("wizardId");
        log.info("Збереження даних клієнта для wizard: {}", wizardId);

        try {
            // Отримуємо дані клієнта з headers повідомлення
            Object clientDataObj = context.getMessageHeaders().get("clientData");

            if (!(clientDataObj instanceof ClientResponse clientResponse)) {
                log.error("Некоректний тип даних клієнта: {}",
                    clientDataObj != null ? clientDataObj.getClass() : "null");
                throw new IllegalArgumentException("Некоректні дані клієнта");
            }

            // Визначаємо тип дії: вибір існуючого або створення нового клієнта
            String actionType = (String) context.getMessageHeaders().get("actionType");

            if (actionType == null) {
                throw new IllegalArgumentException("Тип дії не вказано");
            }

            switch (actionType) {
                case "selectExisting" -> {
                    // Вибір існуючого клієнта
                    String clientId = clientResponse.getId() != null ? clientResponse.getId().toString() : null;
                    if (clientId == null) {
                        throw new IllegalArgumentException("ID клієнта не вказано для вибору існуючого клієнта");
                    }
                    stage1WizardService.selectClient(wizardId, clientId, context);
                }
                case "createNew" -> {
                    // Збереження даних нового клієнта
                    stage1WizardService.saveNewClientData(wizardId, clientResponse, context);
                }
                default -> throw new IllegalArgumentException("Невідомий тип дії: " + actionType);
            }

            log.info("Дані клієнта успішно оброблено для wizard: {} (тип дії: {})", wizardId, actionType);

        } catch (IllegalArgumentException e) {
            log.error("Некоректні дані клієнта для wizard {}: {}", wizardId, e.getMessage());
            context.getExtendedState().getVariables().put("lastError",
                "Некоректні дані клієнта: " + e.getMessage());
            throw e;
        } catch (RuntimeException e) {
            log.error("Помилка збереження клієнта для wizard {}: {}", wizardId, e.getMessage(), e);
            context.getExtendedState().getVariables().put("lastError",
                "Помилка збереження клієнта: " + e.getMessage());
            throw e;
        }
    }
}
