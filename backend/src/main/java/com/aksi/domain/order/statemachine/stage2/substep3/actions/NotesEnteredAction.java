package com.aksi.domain.order.statemachine.stage2.substep3.actions;

import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage2.substep3.enums.StainsDefectsEvent;
import com.aksi.domain.order.statemachine.stage2.substep3.enums.StainsDefectsState;
import com.aksi.domain.order.statemachine.stage2.substep3.service.StainsDefectsCoordinationService;

/**
 * Action для обробки введення приміток про дефекти у підетапі 2.3.
 * Використовує ТІЛЬКИ CoordinationService (згідно архітектурних правил).
 */
@Component
public class NotesEnteredAction implements Action<StainsDefectsState, StainsDefectsEvent> {

    private final StainsDefectsCoordinationService coordinationService;

    public NotesEnteredAction(final StainsDefectsCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public void execute(final StateContext<StainsDefectsState, StainsDefectsEvent> context) {
        final UUID sessionId = context.getExtendedState().get("sessionId", UUID.class);
        final String defectNotes = context.getExtendedState().get("defectNotes", String.class);

        if (sessionId == null) {
            throw new IllegalStateException("Session ID не може бути null при обробці приміток");
        }

        try {
            // Перевіряємо наявність даних
            if (!coordinationService.hasData(sessionId)) {
                coordinationService.setError(sessionId, "Контекст сесії не ініціалізовано");
                throw new IllegalStateException("Контекст сесії не знайдено");
            }

            // Обробляємо примітки через координатор
            coordinationService.processDefectNotes(sessionId, defectNotes);

        } catch (IllegalStateException | IllegalArgumentException e) {
            coordinationService.setError(sessionId, "Помилка обробки приміток: " + e.getMessage());
            throw e;
        } catch (RuntimeException e) {
            coordinationService.setError(sessionId, "Неочікувана помилка при обробці приміток: " + e.getMessage());
            throw new IllegalStateException("Критична помилка обробки приміток у підетапі 2.3", e);
        }
    }
}
