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
 * Guard для перевірки чи всі дані характеристик предмета валідні та повні
 */
@Component
public class CharacteristicsDataValidGuard implements Guard<ItemCharacteristicsState, ItemCharacteristicsEvent> {

    private final ItemCharacteristicsCoordinationService coordinationService;

    public CharacteristicsDataValidGuard(ItemCharacteristicsCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public boolean evaluate(StateContext<ItemCharacteristicsState, ItemCharacteristicsEvent> context) {
        try {
            UUID sessionId = getSessionId(context);
            if (sessionId == null) {
                return false;
            }

            ItemCharacteristicsDTO data = coordinationService.getCurrentData(sessionId);
            if (data == null) {
                return false;
            }

            // Перевіряємо повноту через координатор
            return coordinationService.validateCompleteness(data).isValid();

        } catch (Exception e) {
            return false;
        }
    }

    private UUID getSessionId(StateContext<ItemCharacteristicsState, ItemCharacteristicsEvent> context) {
        Object sessionIdObj = context.getExtendedState().getVariables().get("sessionId");
        if (sessionIdObj instanceof UUID uuid) {
            return uuid;
        }
        return null;
    }
}
