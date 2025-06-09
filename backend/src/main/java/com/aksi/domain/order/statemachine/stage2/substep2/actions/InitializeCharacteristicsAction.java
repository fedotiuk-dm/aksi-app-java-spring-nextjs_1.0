package com.aksi.domain.order.statemachine.stage2.substep2.actions;

import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage2.substep2.enums.ItemCharacteristicsEvent;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.ItemCharacteristicsState;
import com.aksi.domain.order.statemachine.stage2.substep2.service.ItemCharacteristicsCoordinationService;

/**
 * Action для ініціалізації підетапу характеристик предмета
 */
@Component
public class InitializeCharacteristicsAction implements Action<ItemCharacteristicsState, ItemCharacteristicsEvent> {

    private final ItemCharacteristicsCoordinationService coordinationService;

    public InitializeCharacteristicsAction(ItemCharacteristicsCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public void execute(StateContext<ItemCharacteristicsState, ItemCharacteristicsEvent> context) {
        try {
            UUID sessionId = getSessionId(context);
            String categoryCode = getCategoryCode(context);

            if (sessionId != null && categoryCode != null) {
                // Ініціалізуємо підетап через координатор
                coordinationService.startSubstep(sessionId, categoryCode);
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

    private String getCategoryCode(StateContext<ItemCharacteristicsState, ItemCharacteristicsEvent> context) {
        Object categoryCodeObj = context.getExtendedState().getVariables().get("categoryCode");
        if (categoryCodeObj instanceof String categoryCode) {
            return categoryCode;
        }
        return null;
    }
}
