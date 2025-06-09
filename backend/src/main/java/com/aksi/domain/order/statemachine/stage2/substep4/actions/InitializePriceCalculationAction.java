package com.aksi.domain.order.statemachine.stage2.substep4.actions;

import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage2.substep1.dto.ItemBasicInfoDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.dto.ItemCharacteristicsDTO;
import com.aksi.domain.order.statemachine.stage2.substep3.dto.StainsDefectsDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.dto.SubstepResultDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.enums.PriceDiscountEvent;
import com.aksi.domain.order.statemachine.stage2.substep4.enums.PriceDiscountState;
import com.aksi.domain.order.statemachine.stage2.substep4.service.PriceDiscountCoordinationService;

import lombok.extern.slf4j.Slf4j;

/**
 * Action для ініціалізації розрахунку ціни з даними з попередніх підетапів.
 */
@Component
@Slf4j
public class InitializePriceCalculationAction implements Action<PriceDiscountState, PriceDiscountEvent> {

    private final PriceDiscountCoordinationService coordinationService;

    public InitializePriceCalculationAction(PriceDiscountCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public void execute(StateContext<PriceDiscountState, PriceDiscountEvent> context) {
        try {
            Object sessionId = context.getExtendedState().getVariables().get("sessionId");
            Object basicInfo = context.getExtendedState().getVariables().get("basicInfo");
            Object characteristics = context.getExtendedState().getVariables().get("characteristics");
            Object stainsDefects = context.getExtendedState().getVariables().get("stainsDefects");

            if (sessionId == null || basicInfo == null || characteristics == null || stainsDefects == null) {
                log.error("Недостатньо даних для ініціалізації розрахунку ціни");
                context.getExtendedState().getVariables().put("error", "Недостатньо даних для ініціалізації");
                return;
            }

            UUID sessionUUID = UUID.fromString(sessionId.toString());

            log.info("Ініціалізація розрахунку ціни для сесії: {}", sessionUUID);

            SubstepResultDTO result = coordinationService.initializeSubstep(
                    sessionUUID,
                    (ItemBasicInfoDTO) basicInfo,
                    (ItemCharacteristicsDTO) characteristics,
                    (StainsDefectsDTO) stainsDefects
            );

            // Зберігаємо результат
            context.getExtendedState().getVariables().put("result", result);

            if (!result.isSuccess()) {
                log.error("Помилка ініціалізації розрахунку ціни: {}", result.getMessage());
                context.getExtendedState().getVariables().put("error", result.getMessage());
            } else {
                log.info("Розрахунок ціни успішно ініціалізовано для сесії: {}", sessionUUID);
            }

        } catch (Exception e) {
            log.error("Критична помилка при ініціалізації розрахунку ціни: {}", e.getMessage(), e);
            context.getExtendedState().getVariables().put("error", "Критична помилка ініціалізації: " + e.getMessage());
        }
    }
}
