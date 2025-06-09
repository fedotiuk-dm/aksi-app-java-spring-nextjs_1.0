package com.aksi.domain.order.statemachine.stage2.substep1.guards;

import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage2.substep1.enums.ItemBasicInfoEvent;
import com.aksi.domain.order.statemachine.stage2.substep1.enums.ItemBasicInfoState;
import com.aksi.domain.order.statemachine.stage2.substep1.service.ItemBasicInfoCoordinationService;

/**
 * Guard для перевірки валідності всіх даних
 */
@Component
public class DataValidGuard implements Guard<ItemBasicInfoState, ItemBasicInfoEvent> {

    private final ItemBasicInfoCoordinationService coordinationService;

    public DataValidGuard(ItemBasicInfoCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public boolean evaluate(StateContext<ItemBasicInfoState, ItemBasicInfoEvent> context) {
        UUID sessionId = context.getExtendedState().get("sessionId", UUID.class);

        if (sessionId == null) {
            return false;
        }

        // Використовуємо CoordinationService для повної перевірки валідності
        return coordinationService.isDataValid(sessionId);
    }
}
