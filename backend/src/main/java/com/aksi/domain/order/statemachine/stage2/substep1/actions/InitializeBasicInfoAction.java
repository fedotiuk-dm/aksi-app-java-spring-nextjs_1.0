package com.aksi.domain.order.statemachine.stage2.substep1.actions;

import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage2.substep1.dto.ItemBasicInfoDTO;
import com.aksi.domain.order.statemachine.stage2.substep1.enums.ItemBasicInfoEvent;
import com.aksi.domain.order.statemachine.stage2.substep1.enums.ItemBasicInfoState;
import com.aksi.domain.order.statemachine.stage2.substep1.service.ItemBasicInfoCoordinationService;

/**
 * Action для ініціалізації підетапу основної інформації про предмет
 */
@Component
public class InitializeBasicInfoAction implements Action<ItemBasicInfoState, ItemBasicInfoEvent> {

    private final ItemBasicInfoCoordinationService coordinationService;

    public InitializeBasicInfoAction(ItemBasicInfoCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public void execute(StateContext<ItemBasicInfoState, ItemBasicInfoEvent> context) {
        // Отримуємо sessionId з контексту або створюємо новий
        UUID sessionId = context.getExtendedState().get("sessionId", UUID.class);

        if (sessionId == null) {
            sessionId = UUID.randomUUID();
            context.getExtendedState().getVariables().put("sessionId", sessionId);
        }

        // Ініціалізуємо підетап через CoordinationService
        ItemBasicInfoDTO data = coordinationService.initializeSubstep(sessionId);

        // Зберігаємо дані в контексті state machine
        context.getExtendedState().getVariables().put("data", data);
    }
}
