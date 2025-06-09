package com.aksi.domain.order.statemachine.stage2.actions;

import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage2.dto.ItemManagerDTO;
import com.aksi.domain.order.statemachine.stage2.enums.Stage2Event;
import com.aksi.domain.order.statemachine.stage2.enums.Stage2State;
import com.aksi.domain.order.statemachine.stage2.service.Stage2CoordinationService;

/**
 * Action для повернення до головного екрану менеджера предметів.
 * Закриває активний підвізард без збереження змін.
 */
@Component
public class ReturnToManagerAction implements Action<Stage2State, Stage2Event> {

    private final Stage2CoordinationService coordinationService;

    public ReturnToManagerAction(final Stage2CoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public void execute(final StateContext<Stage2State, Stage2Event> context) {
        try {
            // Отримуємо sessionId з контексту
            final UUID sessionId = context.getExtendedState().get("sessionId", UUID.class);
            if (sessionId == null) {
                throw new IllegalStateException("sessionId не знайдено в контексті State Machine");
            }

            // Закриваємо підвізард та повертаємося до менеджера
            final ItemManagerDTO updatedManager = coordinationService.closeWizard(sessionId);

            // Оновлюємо manager в контексті State Machine
            context.getExtendedState().getVariables().put("manager", updatedManager);

            // Очищаємо допоміжні змінні
            context.getExtendedState().getVariables().remove("editingItemId");
            context.getExtendedState().getVariables().remove("newItemData");

        } catch (RuntimeException e) {
            // При помилці переходимо в стан ERROR
            context.getStateMachine().getExtendedState().getVariables().put("error", e.getMessage());
            context.getStateMachine().getExtendedState().getVariables().put("hasError", true);
        }
    }
}
