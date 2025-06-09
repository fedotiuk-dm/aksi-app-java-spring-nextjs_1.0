package com.aksi.domain.order.statemachine.stage1.guards;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage1.enums.BasicOrderInfoEvent;
import com.aksi.domain.order.statemachine.stage1.enums.BasicOrderInfoState;
import com.aksi.domain.order.statemachine.stage1.service.BasicOrderInfoCoordinationService;

/**
 * Guard для перевірки готовності базової інформації замовлення.
 * Перевіряє чи готова базова інформація для переходу до наступного етапу.
 */
@Component
public class BasicOrderInfoReadyGuard implements Guard<BasicOrderInfoState, BasicOrderInfoEvent> {

    private final BasicOrderInfoCoordinationService coordinationService;

    public BasicOrderInfoReadyGuard(BasicOrderInfoCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public boolean evaluate(StateContext<BasicOrderInfoState, BasicOrderInfoEvent> context) {
        String sessionId = context.getExtendedState().get("sessionId", String.class);

        if (sessionId == null) {
            return false;
        }

        // Використовуємо CoordinationService для перевірки готовності
        return coordinationService.isBasicOrderInfoReady(sessionId);
    }
}
