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
 * Action для ініціалізації Stage2 - головного екрану менеджера предметів.
 * Створює новий сеанс та завантажує існуючі предмети замовлення.
 */
@Component
public class InitializeStage2Action implements Action<Stage2State, Stage2Event> {

    private final Stage2CoordinationService coordinationService;

    public InitializeStage2Action(final Stage2CoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public void execute(final StateContext<Stage2State, Stage2Event> context) {
        try {
            // Отримуємо orderId з контексту
            final UUID orderId = context.getExtendedState().get("orderId", UUID.class);
            if (orderId == null) {
                throw new IllegalStateException("orderId не знайдено в контексті State Machine");
            }

            // Ініціалізуємо менеджер предметів
            final ItemManagerDTO manager = coordinationService.initializeItemManager(orderId);

            // Зберігаємо sessionId та manager в контексті State Machine
            context.getExtendedState().getVariables().put("sessionId", manager.getSessionId());
            context.getExtendedState().getVariables().put("manager", manager);
            context.getExtendedState().getVariables().put("orderId", orderId);

        } catch (RuntimeException e) {
            // Зберігаємо помилку в контексті для подальшого аналізу
            context.getStateMachine().getExtendedState().getVariables().put("error", e.getMessage());
            context.getStateMachine().getExtendedState().getVariables().put("hasError", true);
        }
    }
}
