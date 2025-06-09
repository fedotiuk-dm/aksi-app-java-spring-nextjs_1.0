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
 * Action для завершення Stage2 та переходу до наступного етапу.
 * Виконує фінальні перевірки та підготовку до наступного етапу.
 */
@Component
public class CompleteStage2Action implements Action<Stage2State, Stage2Event> {

    private final Stage2CoordinationService coordinationService;

    public CompleteStage2Action(final Stage2CoordinationService coordinationService) {
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

            // Завершуємо етап 2
            final ItemManagerDTO completedManager = coordinationService.completeStage2(sessionId);

            // Оновлюємо manager в контексті State Machine
            context.getExtendedState().getVariables().put("manager", completedManager);

            // Встановлюємо флаг завершення етапу
            context.getExtendedState().getVariables().put("stage2Completed", true);

        } catch (RuntimeException e) {
            // Зберігаємо помилку в контексті для подальшого аналізу
            context.getStateMachine().getExtendedState().getVariables().put("error", e.getMessage());
            context.getStateMachine().getExtendedState().getVariables().put("hasError", true);
        }
    }
}
