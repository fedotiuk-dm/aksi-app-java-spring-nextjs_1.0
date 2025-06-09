package com.aksi.domain.order.statemachine.stage2.substep3.actions;

import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage2.substep3.enums.StainsDefectsEvent;
import com.aksi.domain.order.statemachine.stage2.substep3.enums.StainsDefectsState;
import com.aksi.domain.order.statemachine.stage2.substep3.service.StainsDefectsCoordinationService;

/**
 * Action для обробки вибору плям у підетапі 2.3.
 * Використовує ТІЛЬКИ CoordinationService (згідно архітектурних правил).
 */
@Component
public class StainsSelectedAction implements Action<StainsDefectsState, StainsDefectsEvent> {

    private final StainsDefectsCoordinationService coordinationService;

    public StainsSelectedAction(final StainsDefectsCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public void execute(final StateContext<StainsDefectsState, StainsDefectsEvent> context) {
        final UUID sessionId = context.getExtendedState().get("sessionId", UUID.class);
        final String selectedStains = context.getExtendedState().get("selectedStains", String.class);
        final String otherStains = context.getExtendedState().get("otherStains", String.class);

        if (sessionId == null) {
            throw new IllegalStateException("Session ID не може бути null при обробці вибору плям");
        }

        try {
            // Перевіряємо наявність даних
            if (!coordinationService.hasData(sessionId)) {
                coordinationService.setError(sessionId, "Контекст сесії не ініціалізовано");
                throw new IllegalStateException("Контекст сесії не знайдено");
            }

            // Обробляємо вибір плям через координатор
            coordinationService.processStainSelection(sessionId, selectedStains, otherStains);

        } catch (IllegalStateException | IllegalArgumentException e) {
            coordinationService.setError(sessionId, "Помилка обробки вибору плям: " + e.getMessage());
            throw e;
        } catch (RuntimeException e) {
            coordinationService.setError(sessionId, "Неочікувана помилка при обробці плям: " + e.getMessage());
            throw new IllegalStateException("Критична помилка обробки плям у підетапі 2.3", e);
        }
    }
}
