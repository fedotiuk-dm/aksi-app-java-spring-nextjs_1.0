package com.aksi.domain.order.statemachine.stage2.substep2.guards;

import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage2.substep2.dto.ItemCharacteristicsDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.ItemCharacteristicsEvent;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.ItemCharacteristicsState;
import com.aksi.domain.order.statemachine.stage2.substep2.service.ItemCharacteristicsCoordinationService;

/**
 * Guard для перевірки готовності завершення характеристик в підетапі 2.2.
 * Перевіряє чи можна переходити до стану COMPLETED.
 */
@Component
public class CharacteristicsCompleteGuard implements Guard<ItemCharacteristicsState, ItemCharacteristicsEvent> {

    private final ItemCharacteristicsCoordinationService coordinationService;

    public CharacteristicsCompleteGuard(final ItemCharacteristicsCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public boolean evaluate(final StateContext<ItemCharacteristicsState, ItemCharacteristicsEvent> context) {
        try {
            // Отримуємо sessionId з контексту
            final UUID sessionId = context.getExtendedState().get("sessionId", UUID.class);
            if (sessionId == null) {
                return false;
            }

            // Отримуємо поточні дані з контексту
            final ItemCharacteristicsDTO data = context.getExtendedState()
                    .get("characteristicsData", ItemCharacteristicsDTO.class);
            if (data == null) {
                return false;
            }

            // Перевіряємо готовність до завершення через CoordinationService
            return data.isDataValid() && coordinationService.isCharacteristicsComplete(sessionId);

        } catch (Exception e) {
            // Логування помилки і повернення false
            return false;
        }
    }
}
