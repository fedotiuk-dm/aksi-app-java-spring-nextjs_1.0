package com.aksi.domain.order.statemachine.stage2.substep3.actions;

import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage2.substep3.enums.StainsDefectsEvent;
import com.aksi.domain.order.statemachine.stage2.substep3.enums.StainsDefectsState;
import com.aksi.domain.order.statemachine.stage2.substep3.service.StainsDefectsCoordinationService;

/**
 * Action для завершення підетапу 2.3 "Забруднення, дефекти та ризики".
 * Використовує ТІЛЬКИ CoordinationService (згідно архітектурних правил).
 */
@Component
public class CompleteStainsDefectsAction implements Action<StainsDefectsState, StainsDefectsEvent> {

    private final StainsDefectsCoordinationService coordinationService;

    public CompleteStainsDefectsAction(final StainsDefectsCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public void execute(final StateContext<StainsDefectsState, StainsDefectsEvent> context) {
        final UUID sessionId = context.getExtendedState().get("sessionId", UUID.class);

        if (sessionId == null) {
            throw new IllegalStateException("Session ID не може бути null при завершенні підетапу 2.3");
        }

        try {
            // Перевіряємо наявність даних
            if (!coordinationService.hasData(sessionId)) {
                coordinationService.setError(sessionId, "Контекст сесії не ініціалізовано");
                throw new IllegalStateException("Контекст сесії не знайдено");
            }

            // Перевіряємо готовність до завершення
            if (!coordinationService.isReadyForCompletion(sessionId)) {
                final String errors = coordinationService.getValidationErrors(sessionId);
                coordinationService.setError(sessionId, "Не можна завершити підетап: " + errors);
                throw new IllegalStateException("Дані не готові для завершення підетапу");
            }

            // Перевіряємо відсутність помилок
            if (coordinationService.hasErrors(sessionId)) {
                throw new IllegalStateException("Неможливо завершити підетап з помилками");
            }

            // Перевіряємо можливість збереження в БД
            if (!coordinationService.canSaveToDatabase(sessionId)) {
                coordinationService.setError(sessionId, "Неможливо зберегти дані в базу даних");
                throw new IllegalStateException("Помилка збереження в базу даних");
            }

            // Завершуємо підетап через координатор
            coordinationService.completeSubstep(sessionId);

        } catch (IllegalStateException | IllegalArgumentException e) {
            coordinationService.setError(sessionId, "Помилка завершення підетапу: " + e.getMessage());
            throw e;
        } catch (RuntimeException e) {
            coordinationService.setError(sessionId, "Неочікувана помилка при завершенні: " + e.getMessage());
            throw new IllegalStateException("Критична помилка завершення підетапу 2.3", e);
        }
    }
}
