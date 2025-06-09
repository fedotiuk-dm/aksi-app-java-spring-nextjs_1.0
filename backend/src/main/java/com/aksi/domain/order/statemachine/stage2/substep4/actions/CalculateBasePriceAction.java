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
 * Action для розрахунку базової ціни предмета.
 */
@Component
@Slf4j
public class CalculateBasePriceAction implements Action<PriceDiscountState, PriceDiscountEvent> {

    private final PriceDiscountCoordinationService coordinationService;

    public CalculateBasePriceAction(PriceDiscountCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public void execute(StateContext<PriceDiscountState, PriceDiscountEvent> context) {
        try {
            Object sessionId = context.getExtendedState().getVariables().get("sessionId");

            if (sessionId == null) {
                log.error("SessionId відсутній для розрахунку базової ціни");
                context.getExtendedState().getVariables().put("error", "SessionId відсутній");
                return;
            }

            UUID sessionUUID = UUID.fromString(sessionId.toString());

            log.info("Розрахунок базової ціни для сесії: {}", sessionUUID);

            SubstepResultDTO result = coordinationService.calculateBasePrice(sessionUUID);

            // Зберігаємо результат
            context.getExtendedState().getVariables().put("result", result);

            if (!result.isSuccess()) {
                log.error("Помилка розрахунку базової ціни: {}", result.getMessage());
                context.getExtendedState().getVariables().put("error", result.getMessage());
            } else {
                log.info("Базова ціна успішно розрахована для сесії: {}", sessionUUID);

                // Додаємо інформацію про базову ціну в контекст
                if (result.getData() != null && result.getData().getBasePrice() != null) {
                    context.getExtendedState().getVariables().put("basePrice", result.getData().getBasePrice());
                }
            }

        } catch (Exception e) {
            log.error("Критична помилка при розрахунку базової ціни: {}", e.getMessage(), e);
            context.getExtendedState().getVariables().put("error", "Критична помилка розрахунку: " + e.getMessage());
        }
    }
}
