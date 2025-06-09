package com.aksi.domain.order.statemachine.stage1.actions;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage1.dto.NewClientFormDTO;
import com.aksi.domain.order.statemachine.stage1.enums.NewClientFormEvent;
import com.aksi.domain.order.statemachine.stage1.enums.NewClientFormState;
import com.aksi.domain.order.statemachine.stage1.service.NewClientFormCoordinationService;

/**
 * Action для ініціалізації форми нового клієнта.
 * Створює нову сесію та ініціалізує початкові дані.
 */
@Component
public class NewClientFormInitializeAction implements Action<NewClientFormState, NewClientFormEvent> {

    private final NewClientFormCoordinationService coordinationService;

    public NewClientFormInitializeAction(NewClientFormCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public void execute(StateContext<NewClientFormState, NewClientFormEvent> context) {
        try {
            // Ініціалізуємо нову сесію форми
            String sessionId = coordinationService.initializeFormSession();

            // Зберігаємо sessionId в контексті state machine
            context.getExtendedState().getVariables().put("sessionId", sessionId);

            // Створюємо початкові дані форми
            NewClientFormDTO initialData = new NewClientFormDTO();

            // Зберігаємо початкові дані в сесії
            coordinationService.updateFormDataInSession(sessionId, initialData);

            // Зберігаємо дані в контексті state machine для швидкого доступу
            context.getExtendedState().getVariables().put("formData", initialData);

        } catch (Exception e) {
            // В разі помилки зберігаємо її в контексті
            context.getExtendedState().getVariables().put("error", "Помилка ініціалізації: " + e.getMessage());
        }
    }
}
