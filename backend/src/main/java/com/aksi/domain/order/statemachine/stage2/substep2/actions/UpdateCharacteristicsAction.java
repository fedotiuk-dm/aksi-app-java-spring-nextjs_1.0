package com.aksi.domain.order.statemachine.stage2.substep2.actions;

import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage2.substep2.dto.ItemCharacteristicsDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.ItemCharacteristicsEvent;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.ItemCharacteristicsState;
import com.aksi.domain.order.statemachine.stage2.substep2.service.ItemCharacteristicsCoordinationService;

/**
 * Action для оновлення характеристик предмета в підетапі 2.2.
 * Виконується при оновленні матеріалу, кольору, наповнювача або ступеня зносу.
 */
@Component
public class UpdateCharacteristicsAction implements Action<ItemCharacteristicsState, ItemCharacteristicsEvent> {

    private final ItemCharacteristicsCoordinationService coordinationService;

    public UpdateCharacteristicsAction(final ItemCharacteristicsCoordinationService coordinationService) {
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
            ItemCharacteristicsDTO currentData = context.getExtendedState()
                    .get("characteristicsData", ItemCharacteristicsDTO.class);
            if (currentData == null) {
                throw new IllegalStateException("CharacteristicsData не знайдено в контексті");
            }

            // Оновлюємо дані через CoordinationService
            coordinationService.updateData(sessionId, currentData);

            // Очищуємо помилки, якщо були
            coordinationService.clearError(sessionId);

        } catch (IllegalStateException | IllegalArgumentException e) {
            // Помилки стану або аргументів
            final UUID sessionId = context.getExtendedState().get("sessionId", UUID.class);
            if (sessionId != null) {
                coordinationService.setError(sessionId, "Помилка оновлення характеристик: " + e.getMessage());
            }
        } catch (RuntimeException e) {
            // Інші неочікувані помилки виконання
            final UUID sessionId = context.getExtendedState().get("sessionId", UUID.class);
            if (sessionId != null) {
                coordinationService.setError(sessionId, "Неочікувана помилка оновлення характеристик: " + e.getMessage());
            }
        }
    }
}
