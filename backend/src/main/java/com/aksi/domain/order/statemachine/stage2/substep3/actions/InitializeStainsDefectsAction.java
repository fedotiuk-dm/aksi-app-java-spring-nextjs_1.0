package com.aksi.domain.order.statemachine.stage2.substep3.actions;

import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.dto.OrderItemAddRequest;
import com.aksi.domain.order.statemachine.stage2.substep3.enums.StainsDefectsEvent;
import com.aksi.domain.order.statemachine.stage2.substep3.enums.StainsDefectsState;
import com.aksi.domain.order.statemachine.stage2.substep3.service.StainsDefectsCoordinationService;

/**
 * Action для ініціалізації підетапу 2.3 "Забруднення, дефекти та ризики".
 * Використовує ТІЛЬКИ CoordinationService (згідно архітектурних правил).
 */
@Component
public class InitializeStainsDefectsAction implements Action<StainsDefectsState, StainsDefectsEvent> {

    private final StainsDefectsCoordinationService coordinationService;

    public InitializeStainsDefectsAction(final StainsDefectsCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public void execute(final StateContext<StainsDefectsState, StainsDefectsEvent> context) {
        final UUID sessionId = context.getExtendedState().get("sessionId", UUID.class);
        final OrderItemAddRequest currentItem = context.getExtendedState().get("currentItem", OrderItemAddRequest.class);

        if (sessionId == null) {
            throw new IllegalStateException("Session ID не може бути null при ініціалізації підетапу 2.3");
        }

        try {
            // Ініціалізуємо підетап через координатор
            coordinationService.initializeSubstep(sessionId, currentItem);

        } catch (IllegalStateException | IllegalArgumentException e) {
            coordinationService.setError(sessionId, "Помилка ініціалізації підетапу: " + e.getMessage());
            throw e;
        } catch (RuntimeException e) {
            coordinationService.setError(sessionId, "Неочікувана помилка при ініціалізації: " + e.getMessage());
            throw new IllegalStateException("Критична помилка ініціалізації підетапу 2.3", e);
        }
    }
}
