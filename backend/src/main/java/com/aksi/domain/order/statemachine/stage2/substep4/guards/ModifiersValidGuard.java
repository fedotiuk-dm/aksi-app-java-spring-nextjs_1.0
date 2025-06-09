package com.aksi.domain.order.statemachine.stage2.substep4.guards;

import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage2.substep4.enums.PriceDiscountEvent;
import com.aksi.domain.order.statemachine.stage2.substep4.enums.PriceDiscountState;
import com.aksi.domain.order.statemachine.stage2.substep4.service.PriceDiscountCoordinationService;

/**
 * Guard для перевірки валідності вибраних модифікаторів.
 */
@Component
public class ModifiersValidGuard implements Guard<PriceDiscountState, PriceDiscountEvent> {

    private final PriceDiscountCoordinationService coordinationService;

    public ModifiersValidGuard(PriceDiscountCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public boolean evaluate(StateContext<PriceDiscountState, PriceDiscountEvent> context) {
        try {
            Object sessionId = context.getExtendedState().getVariables().get("sessionId");
            if (sessionId == null) {
                return false;
            }

            return coordinationService.hasValidModifiers(UUID.fromString(sessionId.toString()));
        } catch (Exception e) {
            return false;
        }
    }
}
