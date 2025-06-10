package com.aksi.domain.order.statemachine.stage3.actions;

import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage3.enums.Stage3Event;
import com.aksi.domain.order.statemachine.stage3.enums.Stage3State;
import com.aksi.domain.order.statemachine.stage3.service.Stage3CoordinationService;

/**
 * Action для ініціалізації Stage3 - Загальні параметри замовлення.
 * Виконує початкову підготовку контексту та ініціалізацію всіх підетапів.
 *
 * ЕТАП 5.3: Actions (складна логіка)
 * Дозволені імпорти: ТІЛЬКИ CoordinationService + DTO + енуми + Spring State Machine + Java стандартні
 * Заборонено: Прямі імпорти окремих Services (крім Coordination), Guards, Config
 */
@Component
public class InitializeStage3Action implements Action<Stage3State, Stage3Event> {

    private static final Logger logger = LoggerFactory.getLogger(InitializeStage3Action.class);

    private final Stage3CoordinationService coordinationService;

    public InitializeStage3Action(Stage3CoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public void execute(StateContext<Stage3State, Stage3Event> context) {
        UUID sessionId = getSessionIdFromContext(context);

        if (sessionId == null) {
            logger.error("SessionId не знайдено в контексті для ініціалізації Stage3");
            return;
        }

        logger.info("Ініціалізація Stage3 для сесії: {}", sessionId);

        try {
            // Делегуємо всю складну логіку координаційному сервісу
            coordinationService.initializeStage3(sessionId);

            logger.info("Stage3 успішно ініціалізовано для сесії: {}", sessionId);

        } catch (Exception e) {
            logger.error("Помилка під час ініціалізації Stage3 для сесії {}: {}", sessionId, e.getMessage(), e);

            // Встановлюємо стан помилки в контексті
            context.getExtendedState().getVariables().put("stage3_error", e.getMessage());
        }
    }

    /**
     * Витягує sessionId з контексту state machine
     */
    private UUID getSessionIdFromContext(StateContext<Stage3State, Stage3Event> context) {
        Object sessionIdObj = context.getExtendedState().getVariables().get("sessionId");

        if (sessionIdObj instanceof UUID uuid) {
            return uuid;
        }

        if (sessionIdObj instanceof String str) {
            try {
                return UUID.fromString(str);
            } catch (IllegalArgumentException e) {
                return null;
            }
        }

        return null;
    }
}
