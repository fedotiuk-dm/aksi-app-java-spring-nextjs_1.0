package com.aksi.domain.order.statemachine.stage2.substep2.actions;

import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage2.substep2.enums.ItemCharacteristicsEvent;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.ItemCharacteristicsState;
import com.aksi.domain.order.statemachine.stage2.substep2.service.ItemCharacteristicsCoordinationService;

/**
 * Action для завершення підетапу характеристик предмета
 */
@Component
public class CompleteSubstepAction implements Action<ItemCharacteristicsState, ItemCharacteristicsEvent> {

    private final ItemCharacteristicsCoordinationService coordinationService;

    public CompleteSubstepAction(ItemCharacteristicsCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public void execute(StateContext<ItemCharacteristicsState, ItemCharacteristicsEvent> context) {
        try {
            UUID sessionId = getSessionId(context);

            if (sessionId != null) {
                // Завершуємо підетап через координатор
                coordinationService.completeSubstep(sessionId);
            }

        } catch (Exception e) {
            // У разі помилки встановлюємо стан ERROR
            UUID sessionId = getSessionId(context);
            if (sessionId != null) {
                coordinationService.setCurrentState(sessionId, ItemCharacteristicsState.ERROR);
            }
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
