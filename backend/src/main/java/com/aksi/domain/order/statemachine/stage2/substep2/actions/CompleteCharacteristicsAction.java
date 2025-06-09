package com.aksi.domain.order.statemachine.stage2.substep2.actions;

import java.util.Map;
import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage2.substep2.dto.ItemCharacteristicsDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.ItemCharacteristicsEvent;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.ItemCharacteristicsState;
import com.aksi.domain.order.statemachine.stage2.substep2.service.ItemCharacteristicsCoordinationService;

/**
 * Action для завершення підетапу 2.2 "Характеристики предмета".
 * Виконується при переході до стану COMPLETED.
 */
@Component
public class CompleteCharacteristicsAction implements Action<ItemCharacteristicsState, ItemCharacteristicsEvent> {

    private final ItemCharacteristicsCoordinationService coordinationService;

    public CompleteCharacteristicsAction(final ItemCharacteristicsCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public void execute(final StateContext<ItemCharacteristicsState, ItemCharacteristicsEvent> context) {
        try {
            // Отримуємо sessionId з контексту
            final UUID sessionId = context.getExtendedState().get("sessionId", UUID.class);
            if (sessionId == null) {
                throw new IllegalStateException("SessionId не знайдено в контексті");
            }

            // Отримуємо поточні дані з контексту
            final ItemCharacteristicsDTO currentData = context.getExtendedState()
                    .get("characteristicsData", ItemCharacteristicsDTO.class);
            if (currentData == null) {
                throw new IllegalStateException("CharacteristicsData не знайдено в контексті");
            }

            // Завершуємо підетап через CoordinationService
            final Map<String, Object> completionResult = coordinationService.completeSubstep(sessionId);

            // Зберігаємо результат в контексті
            context.getExtendedState().getVariables().put("completionResult", completionResult);

            // Оновлюємо стан через CoordinationService
            coordinationService.updateState(sessionId, ItemCharacteristicsState.COMPLETED);

            // Очищуємо помилки
            coordinationService.clearError(sessionId);

        } catch (IllegalStateException | IllegalArgumentException e) {
            // Помилки стану або аргументів
            final UUID sessionId = context.getExtendedState().get("sessionId", UUID.class);
            if (sessionId != null) {
                coordinationService.setError(sessionId, "Помилка завершення характеристик: " + e.getMessage());
            }
        } catch (RuntimeException e) {
            // Інші неочікувані помилки виконання
            final UUID sessionId = context.getExtendedState().get("sessionId", UUID.class);
            if (sessionId != null) {
                coordinationService.setError(sessionId, "Неочікувана помилка завершення характеристик: " + e.getMessage());
            }
        }
    }
}
