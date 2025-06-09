package com.aksi.domain.order.statemachine.stage2.substep2.actions;

import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage2.substep2.enums.ItemCharacteristicsEvent;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.ItemCharacteristicsState;
import com.aksi.domain.order.statemachine.stage2.substep2.service.ItemCharacteristicsCoordinationService;

/**
 * Action для обробки вибору матеріалу
 */
@Component
public class MaterialSelectedAction implements Action<ItemCharacteristicsState, ItemCharacteristicsEvent> {

    private final ItemCharacteristicsCoordinationService coordinationService;

    public MaterialSelectedAction(ItemCharacteristicsCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public void execute(StateContext<ItemCharacteristicsState, ItemCharacteristicsEvent> context) {
        try {
            UUID sessionId = getSessionId(context);
            String material = getMaterial(context);

            if (sessionId != null && material != null) {
                // Обробляємо вибір матеріалу через координатор
                coordinationService.selectMaterial(sessionId, material);
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

    private String getMaterial(StateContext<ItemCharacteristicsState, ItemCharacteristicsEvent> context) {
        Object materialObj = context.getExtendedState().getVariables().get("material");
        if (materialObj instanceof String material) {
            return material;
        }
        return null;
    }
}
