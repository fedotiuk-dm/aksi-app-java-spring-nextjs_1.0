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
 * Action для завершення етапу 1 та ініціалізації етапу 2.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class CompleteStage1Action implements Action<OrderState, OrderEvent> {

    private final OrderWizardSessionService sessionService;

    @Override
    public void execute(StateContext<OrderState, OrderEvent> context) {
        log.info("Завершення етапу 1 - Клієнт та базова інформація");

        try {
            UUID sessionId = (UUID) context.getExtendedState().getVariables().get("sessionId");
            if (sessionId == null) {
                log.error("Відсутній sessionId в контексті");
                context.getStateMachine().sendEventCollect(Mono.just(MessageBuilder.withPayload(OrderEvent.SYSTEM_ERROR).build())).block();
                return;
            }

            // Оновлюємо стан сесії
            sessionService.updateSessionState(sessionId, OrderState.ITEM_MANAGEMENT);

            // Зберігаємо мітку часу завершення етапу 1
            context.getExtendedState().getVariables().put("stage1CompletedAt", System.currentTimeMillis());

            log.info("Етап 1 завершено для сесії: {}", sessionId);

            // Автоматичний перехід до етапу 2
            context.getStateMachine().sendEventCollect(Mono.just(MessageBuilder.withPayload(OrderEvent.ADD_ITEM).build())).block();

        } catch (Exception e) {
            log.error("Помилка завершення етапу 1: {}", e.getMessage(), e);
            context.getExtendedState().getVariables().put("errorMessage", e.getMessage());
            context.getStateMachine().sendEventCollect(Mono.just(MessageBuilder.withPayload(OrderEvent.SYSTEM_ERROR).build())).block();
        }
    }
}
