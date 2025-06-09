package com.aksi.domain.order.statemachine.stage1.actions;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.order.statemachine.stage1.enums.NewClientFormEvent;
import com.aksi.domain.order.statemachine.stage1.enums.NewClientFormState;
import com.aksi.domain.order.statemachine.stage1.service.NewClientFormCoordinationService;

/**
 * Action для збереження нового клієнта.
 * Створює клієнта на основі даних форми.
 */
@Component
public class NewClientFormSaveAction implements Action<NewClientFormState, NewClientFormEvent> {

    private final NewClientFormCoordinationService coordinationService;

    public NewClientFormSaveAction(NewClientFormCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public void execute(StateContext<NewClientFormState, NewClientFormEvent> context) {
        try {
            String sessionId = context.getExtendedState().get("sessionId", String.class);

            if (sessionId == null) {
                context.getExtendedState().getVariables().put("error", "Сесія не знайдена");
                return;
            }

            // Створюємо клієнта з даних форми
            ClientResponse createdClient = coordinationService.createClientFromForm(sessionId);

            // Зберігаємо результат в контексті
            context.getExtendedState().getVariables().put("createdClient", createdClient);

            // Завершуємо сесію форми
            coordinationService.completeFormSession(sessionId);

        } catch (IllegalStateException e) {
            context.getExtendedState().getVariables().put("error", "Дані форми не знайдені: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            context.getExtendedState().getVariables().put("error", "Помилка валідації: " + e.getMessage());
        } catch (Exception e) {
            context.getExtendedState().getVariables().put("error", "Помилка створення клієнта: " + e.getMessage());
        }
    }
}
