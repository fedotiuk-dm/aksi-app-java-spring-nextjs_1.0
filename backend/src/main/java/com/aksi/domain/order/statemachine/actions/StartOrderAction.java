package com.aksi.domain.order.statemachine.actions;

import java.util.UUID;

import org.springframework.messaging.support.MessageBuilder;
import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.service.OrderWizardSessionService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

/**
 * Action для початку нового замовлення.
 * Ініціалізує сесію Order Wizard та встановлює початковий контекст.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class StartOrderAction implements Action<OrderState, OrderEvent> {

    private final OrderWizardSessionService sessionService;

    @Override
    public void execute(StateContext<OrderState, OrderEvent> context) {
        log.info("Розпочинаємо нове замовлення");

        try {
            // Створення нової сесії замовлення
            UUID sessionId = UUID.randomUUID();
            sessionService.createSession(sessionId);

            // Зберігання ID сесії в контексті State Machine
            context.getExtendedState().getVariables().put("sessionId", sessionId);
            context.getExtendedState().getVariables().put("wizardStartTime", System.currentTimeMillis());

            log.info("Нову сесію замовлення створено з ID: {}", sessionId);

            // Автоматичний перехід до етапу вибору клієнта
            context.getStateMachine().sendEventCollect(Mono.just(MessageBuilder.withPayload(OrderEvent.CLIENT_SELECTED).build())).block();

        } catch (Exception e) {
            log.error("Помилка ініціалізації замовлення: {}", e.getMessage(), e);
            context.getExtendedState().getVariables().put("errorMessage", e.getMessage());
            context.getStateMachine().sendEventCollect(Mono.just(MessageBuilder.withPayload(OrderEvent.SYSTEM_ERROR).build())).block();
        }
    }
}
