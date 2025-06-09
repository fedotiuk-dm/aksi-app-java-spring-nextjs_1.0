package com.aksi.domain.order.statemachine.stage2.substep3.guards;

import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage2.substep3.enums.StainsDefectsEvent;
import com.aksi.domain.order.statemachine.stage2.substep3.enums.StainsDefectsState;
import com.aksi.domain.order.statemachine.stage2.substep3.service.StainsDefectsCoordinationService;

/**
 * Guard для перевірки готовності переходу після вибору дефектів.
 * Використовує ТІЛЬКИ CoordinationService (згідно архітектурних правил).
 */
@Component
public class DefectsSelectedGuard implements Guard<StainsDefectsState, StainsDefectsEvent> {

    private final StainsDefectsCoordinationService coordinationService;

    public DefectsSelectedGuard(final StainsDefectsCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public boolean evaluate(final StateContext<StainsDefectsState, StainsDefectsEvent> context) {
        final UUID sessionId = context.getExtendedState().get("sessionId", UUID.class);

        if (sessionId == null) {
            return false;
        }

        try {
            // Перевіряємо, чи є дані в контексті
            if (!coordinationService.hasData(sessionId)) {
                return false;
            }

            // Перевіряємо, чи завершено вибір дефектів
            if (!coordinationService.isDefectSelectionCompleted(sessionId)) {
                return false;
            }

            // Перевіряємо, чи є вибрані дефекти
            return coordinationService.hasDefects(sessionId);

        } catch (Exception e) {
            coordinationService.setError(sessionId, "Помилка перевірки вибору дефектів: " + e.getMessage());
            return false;
        }
    }
}
