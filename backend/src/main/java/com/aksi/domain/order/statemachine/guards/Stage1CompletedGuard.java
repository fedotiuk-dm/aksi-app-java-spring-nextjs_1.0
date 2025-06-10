package com.aksi.domain.order.statemachine.guards;

import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.service.OrderWizardSessionService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Guard для перевірки готовності завершення етапу 1.
 * Перевіряє чи всі необхідні дані Stage1 заповнені.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class Stage1CompletedGuard implements Guard<OrderState, OrderEvent> {

    private final OrderWizardSessionService sessionService;

    @Override
    public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
        log.debug("Перевірка готовності завершення етапу 1");

        try {
            UUID sessionId = (UUID) context.getExtendedState().getVariables().get("sessionId");
            if (sessionId == null) {
                log.warn("Відсутній sessionId в контексті");
                return false;
            }

            // Перевіряємо чи активна сесія
            if (!sessionService.isSessionActive(sessionId)) {
                log.warn("Сесія {} не активна", sessionId);
                return false;
            }

            // Перевіряємо чи клієнт вибраний
            boolean clientSelected = context.getExtendedState().getVariables().containsKey("selectedClientId");

            // Перевіряємо чи базова інформація замовлення заповнена
            boolean basicInfoCompleted = context.getExtendedState().getVariables().containsKey("receiptNumber") &&
                                       context.getExtendedState().getVariables().containsKey("uniqueTag") &&
                                       context.getExtendedState().getVariables().containsKey("branchId");

            boolean stage1Ready = clientSelected && basicInfoCompleted;

            log.debug("Стан етапу 1: клієнт={}, базова інформація={}, готовий={}",
                     clientSelected, basicInfoCompleted, stage1Ready);

            return stage1Ready;

        } catch (Exception e) {
            log.error("Помилка валідації етапу 1: {}", e.getMessage(), e);
            return false;
        }
    }
}
