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
 * Action для завершення Stage3 - Загальні параметри замовлення.
 * Виконує фінальну валідацію та підготовку до переходу на наступний етап.
 *
 * ЕТАП 5.3: Actions (складна логіка)
 * Дозволені імпорти: ТІЛЬКИ CoordinationService + DTO + енуми + Spring State Machine + Java стандартні
 * Заборонено: Прямі імпорти окремих Services (крім Coordination), Guards, Config
 */
@Component
public class CompleteStage3Action implements Action<Stage3State, Stage3Event> {

    private static final Logger logger = LoggerFactory.getLogger(CompleteStage3Action.class);

    private final Stage3CoordinationService coordinationService;

    public CompleteStage3Action(Stage3CoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public void execute(StateContext<Stage3State, Stage3Event> context) {
        UUID sessionId = getSessionIdFromContext(context);

        if (sessionId == null) {
            logger.error("SessionId не знайдено в контексті для завершення Stage3");
            return;
        }

        logger.info("Завершення Stage3 для сесії: {}", sessionId);

        try {
            // Перевіряємо готовність до завершення
            if (!coordinationService.isStage3Ready(sessionId)) {
                logger.error("Stage3 не готовий до завершення для сесії: {}", sessionId);
                context.getExtendedState().getVariables().put("stage3_error", "Stage3 не готовий до завершення");
                return;
            }

            // Встановлюємо фінальний стан
            coordinationService.setSessionState(sessionId, Stage3State.STAGE3_COMPLETED);

            logger.info("Stage3 успішно завершено для сесії: {}", sessionId);

            // Зберігаємо інформацію про успішне завершення в контексті
            context.getExtendedState().getVariables().put("stage3_completed", true);

        } catch (Exception e) {
            logger.error("Помилка під час завершення Stage3 для сесії {}: {}", sessionId, e.getMessage(), e);

            // Встановлюємо стан помилки
            coordinationService.setSessionState(sessionId, Stage3State.STAGE3_ERROR);
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
