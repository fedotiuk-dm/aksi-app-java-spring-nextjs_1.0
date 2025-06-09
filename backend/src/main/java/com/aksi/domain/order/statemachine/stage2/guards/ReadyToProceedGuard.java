package com.aksi.domain.order.statemachine.stage2.guards;

import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage2.enums.Stage2Event;
import com.aksi.domain.order.statemachine.stage2.enums.Stage2State;
import com.aksi.domain.order.statemachine.stage2.service.Stage2CoordinationService;

/**
 * Guard для перевірки готовності до переходу на наступний етап.
 * Перевіряє чи достатньо предметів у замовленні та чи все валідно.
 */
@Component
public class ReadyToProceedGuard implements Guard<Stage2State, Stage2Event> {

    private final Stage2CoordinationService coordinationService;

    public ReadyToProceedGuard(final Stage2CoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public boolean evaluate(final StateContext<Stage2State, Stage2Event> context) {
        try {
            // Отримуємо sessionId з контексту State Machine
            final UUID sessionId = context.getExtendedState()
                    .get("sessionId", UUID.class);

            if (sessionId == null) {
                return false;
            }

            // Перевіряємо готовність до переходу через координаційний сервіс
            return coordinationService.isReadyToProceed(sessionId);

        } catch (Exception e) {
            return false;
        }
    }
}
