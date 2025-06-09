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
 * Action для обробки обрання категорії послуги
 */
@Component
public class CategorySelectedAction implements Action<ItemBasicInfoState, ItemBasicInfoEvent> {

    private final ItemBasicInfoCoordinationService coordinationService;

    public CategorySelectedAction(ItemBasicInfoCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public void execute(StateContext<ItemBasicInfoState, ItemBasicInfoEvent> context) {
        UUID sessionId = context.getExtendedState().get("sessionId", UUID.class);
        UUID categoryId = context.getExtendedState().get("categoryId", UUID.class);

        if (sessionId != null && categoryId != null) {
            // Обробляємо вибір категорії через CoordinationService
            ItemBasicInfoDTO updatedData = coordinationService.selectServiceCategory(sessionId, categoryId);

            // Оновлюємо дані в контексті
            context.getExtendedState().getVariables().put("data", updatedData);
        }
    }
}
