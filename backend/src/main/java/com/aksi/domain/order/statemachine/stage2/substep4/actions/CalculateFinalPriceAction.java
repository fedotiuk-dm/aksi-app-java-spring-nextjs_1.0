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
 * Action для розрахунку фінальної ціни з усіма модифікаторами.
 */
@Component
@Slf4j
public class CalculateFinalPriceAction implements Action<PriceDiscountState, PriceDiscountEvent> {

    private final PriceDiscountCoordinationService coordinationService;

    public CalculateFinalPriceAction(PriceDiscountCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public void execute(StateContext<PriceDiscountState, PriceDiscountEvent> context) {
        try {
            Object sessionId = context.getExtendedState().getVariables().get("sessionId");

            if (sessionId == null) {
                log.error("SessionId відсутній для розрахунку фінальної ціни");
                context.getExtendedState().getVariables().put("error", "SessionId відсутній");
                return;
            }

            UUID sessionUUID = UUID.fromString(sessionId.toString());

            log.info("Розрахунок фінальної ціни для сесії: {}", sessionUUID);

            SubstepResultDTO result = coordinationService.calculateFinalPrice(sessionUUID);

            // Зберігаємо результат
            context.getExtendedState().getVariables().put("result", result);

            if (!result.isSuccess()) {
                log.error("Помилка розрахунку фінальної ціни: {}", result.getMessage());
                context.getExtendedState().getVariables().put("error", result.getMessage());
            } else {
                log.info("Фінальна ціна успішно розрахована для сесії: {}", sessionUUID);

                // Додаємо інформацію про фінальну ціну в контекст
                if (result.getData() != null) {
                    if (result.getData().getFinalPrice() != null) {
                        context.getExtendedState().getVariables().put("finalPrice", result.getData().getFinalPrice());
                    }
                    if (result.getData().getCalculationResponse() != null) {
                        context.getExtendedState().getVariables().put("calculationResponse", result.getData().getCalculationResponse());
                    }
                }
            }

        } catch (Exception e) {
            log.error("Критична помилка при розрахунку фінальної ціни: {}", e.getMessage(), e);
            context.getExtendedState().getVariables().put("error", "Критична помилка розрахунку: " + e.getMessage());
        }
    }
}
