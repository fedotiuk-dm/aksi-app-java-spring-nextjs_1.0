package com.aksi.domain.order.statemachine.stage1.actions;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage1.dto.BasicOrderInfoDTO;
import com.aksi.domain.order.statemachine.stage1.enums.BasicOrderInfoEvent;
import com.aksi.domain.order.statemachine.stage1.enums.BasicOrderInfoState;
import com.aksi.domain.order.statemachine.stage1.service.BasicOrderInfoCoordinationService;

/**
 * Action для ініціалізації базової інформації замовлення.
 * Створює новий контекст та ініціалізує початкові дані.
 */
@Component
public class BasicOrderInfoInitializeAction implements Action<BasicOrderInfoState, BasicOrderInfoEvent> {

    private final BasicOrderInfoCoordinationService coordinationService;

    public BasicOrderInfoInitializeAction(BasicOrderInfoCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public void execute(StateContext<BasicOrderInfoState, BasicOrderInfoEvent> context) {
        try {
            // Ініціалізуємо новий контекст
            String sessionId = coordinationService.initializeContext();

            // Зберігаємо sessionId в контексті state machine
            context.getExtendedState().getVariables().put("sessionId", sessionId);

            // Створюємо початкові дані
            BasicOrderInfoDTO initialData = coordinationService.createEmpty();

            // Зберігаємо дані в контексті
            coordinationService.updateBasicOrderInfo(sessionId, initialData);

            // Зберігаємо дані в контексті state machine для швидкого доступу
            context.getExtendedState().getVariables().put("basicOrderInfo", initialData);

        } catch (Exception e) {
            // В разі помилки зберігаємо її в контексті
            context.getExtendedState().getVariables().put("error", "Помилка ініціалізації: " + e.getMessage());
        }
    }
}
