package com.aksi.domain.order.statemachine.stage1.actions;

import java.util.List;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.branch.dto.BranchLocationDTO;
import com.aksi.domain.order.statemachine.stage1.dto.BasicOrderInfoDTO;
import com.aksi.domain.order.statemachine.stage1.enums.BasicOrderInfoEvent;
import com.aksi.domain.order.statemachine.stage1.enums.BasicOrderInfoState;
import com.aksi.domain.order.statemachine.stage1.service.BasicOrderInfoCoordinationService;

/**
 * Action для ініціалізації базової інформації замовлення.
 * Створює новий контекст, ініціалізує початкові дані та завантажує філії.
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
            // Перевіряємо чи є sessionId від головного Order Wizard
            String sessionId = context.getExtendedState().get("sessionId", String.class);

            if (sessionId != null) {
                // Використовуємо існуючий sessionId від головного wizard
                coordinationService.initializeBasicOrderInfo(sessionId);
                System.out.println("BasicOrderInfo initialized with existing sessionId: " + sessionId);
            } else {
                // Ініціалізуємо новий контекст (для зворотної сумісності)
                sessionId = coordinationService.initializeContext();
            context.getExtendedState().getVariables().put("sessionId", sessionId);
                System.out.println("BasicOrderInfo initialized with new sessionId: " + sessionId);
            }

            // Створюємо початкові дані
            BasicOrderInfoDTO initialData = coordinationService.createEmpty();

            // Завантажуємо всі доступні філії через координаційний сервіс
            List<BranchLocationDTO> branches = coordinationService.getAllBranches();

            // Додаємо філії до початкових даних
            initialData.setAvailableBranches(branches);

            // Зберігаємо дані в контексті
            coordinationService.updateBasicOrderInfo(sessionId, initialData);

            // Зберігаємо дані в контексті state machine для швидкого доступу
            context.getExtendedState().getVariables().put("basicOrderInfo", initialData);

            // Зберігаємо філії окремо в контексті state machine для API доступу
            context.getExtendedState().getVariables().put("availableBranches", branches);

            // Логування для діагностики
            System.out.println("Ініціалізовано сесію " + sessionId + " з " + branches.size() + " філіями");

        } catch (Exception e) {
            // В разі помилки зберігаємо її в контексті
            String errorMessage = "Помилка ініціалізації: " + e.getMessage();
            context.getExtendedState().getVariables().put("error", errorMessage);
            System.err.println(errorMessage);
        }
    }
}
