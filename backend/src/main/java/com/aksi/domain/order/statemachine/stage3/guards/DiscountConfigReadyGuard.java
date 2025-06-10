package com.aksi.domain.order.statemachine.stage3.guards;

import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage3.enums.Stage3Event;
import com.aksi.domain.order.statemachine.stage3.enums.Stage3State;
import com.aksi.domain.order.statemachine.stage3.service.Stage3CoordinationService;

/**
 * Guard для перевірки готовності підетапу 3.2 - Конфігурація знижок.
 * Перевіряє чи можна переходити від налаштування знижок до наступного підетапу.
 *
 * ЕТАП 5.2: Guards (перевірки готовності)
 * Дозволені імпорти: ТІЛЬКИ CoordinationService + DTO + енуми + Spring State Machine + Java стандартні
 * Заборонено: Operations Services, StateService, ValidationService, Actions, Config
 */
@Component
public class DiscountConfigReadyGuard implements Guard<Stage3State, Stage3Event> {

    private final Stage3CoordinationService coordinationService;

    public DiscountConfigReadyGuard(Stage3CoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public boolean evaluate(StateContext<Stage3State, Stage3Event> context) {
        UUID sessionId = getSessionIdFromContext(context);

        if (sessionId == null) {
            return false;
        }

        // Використовуємо координаційний сервіс для перевірки готовності
        return coordinationService.isDiscountConfigReady(sessionId);
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
