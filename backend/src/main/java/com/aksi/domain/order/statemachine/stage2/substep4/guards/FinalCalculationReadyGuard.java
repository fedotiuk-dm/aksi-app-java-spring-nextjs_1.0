package com.aksi.domain.order.statemachine.stage2.substep4.guards;

import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage2.substep4.enums.PriceDiscountEvent;
import com.aksi.domain.order.statemachine.stage2.substep4.enums.PriceDiscountState;
import com.aksi.domain.order.statemachine.stage2.substep4.service.PriceDiscountCoordinationService;

/**
 * Guard для перевірки готовності до фінального розрахунку ціни.
 */
@Component
public class FinalCalculationReadyGuard implements Guard<PriceDiscountState, PriceDiscountEvent> {

    private final PriceDiscountCoordinationService coordinationService;

    public FinalCalculationReadyGuard(PriceDiscountCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public boolean evaluate(StateContext<PriceDiscountState, PriceDiscountEvent> context) {
        try {
            Object sessionId = context.getExtendedState().getVariables().get("sessionId");
            if (sessionId == null) {
                return false;
            }

            return coordinationService.canCalculateFinalPrice(UUID.fromString(sessionId.toString()));
        } catch (Exception e) {
            return false;
        }
    }
}
