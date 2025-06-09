package com.aksi.domain.order.statemachine.stage2.substep4.actions;

import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage2.substep4.dto.SubstepResultDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.enums.PriceDiscountEvent;
import com.aksi.domain.order.statemachine.stage2.substep4.enums.PriceDiscountState;
import com.aksi.domain.order.statemachine.stage2.substep4.service.PriceDiscountCoordinationService;

import lombok.extern.slf4j.Slf4j;

/**
 * Action для завершення розрахунку ціни та підтвердження результату.
 */
@Component
@Slf4j
public class CompletePriceCalculationAction implements Action<PriceDiscountState, PriceDiscountEvent> {

    private final PriceDiscountCoordinationService coordinationService;

    public CompletePriceCalculationAction(PriceDiscountCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public void execute(StateContext<PriceDiscountState, PriceDiscountEvent> context) {
        try {
            Object sessionId = context.getExtendedState().getVariables().get("sessionId");

            if (sessionId == null) {
                log.error("SessionId відсутній для завершення розрахунку ціни");
                context.getExtendedState().getVariables().put("error", "SessionId відсутній");
                return;
            }

            UUID sessionUUID = UUID.fromString(sessionId.toString());

            log.info("Завершення розрахунку ціни для сесії: {}", sessionUUID);

            SubstepResultDTO result = coordinationService.confirmCalculation(sessionUUID);

            // Зберігаємо результат
            context.getExtendedState().getVariables().put("result", result);

            if (!result.isSuccess()) {
                log.error("Помилка завершення розрахунку ціни: {}", result.getMessage());
                context.getExtendedState().getVariables().put("error", result.getMessage());
            } else {
                log.info("Розрахунок ціни успішно завершено для сесії: {}", sessionUUID);

                // Додаємо підтвердження завершення
                context.getExtendedState().getVariables().put("completed", true);
                context.getExtendedState().getVariables().put("completionTime", System.currentTimeMillis());

                // Зберігаємо фінальні дані
                if (result.getData() != null) {
                    context.getExtendedState().getVariables().put("finalCalculationData", result.getData());
                }
            }

        } catch (Exception e) {
            log.error("Критична помилка при завершенні розрахунку ціни: {}", e.getMessage(), e);
            context.getExtendedState().getVariables().put("error", "Критична помилка завершення: " + e.getMessage());
        }
    }
}
