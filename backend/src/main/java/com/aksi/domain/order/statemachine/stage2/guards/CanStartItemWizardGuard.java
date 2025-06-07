package com.aksi.domain.order.statemachine.stage2.guards;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage2.adapter.Stage2StateMachineAdapter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * State Machine Guard для перевірки можливості запуску підвізарда предмета
 *
 * Перевіряє:
 * - Чи немає активного підвізарда
 * - Чи валідний стан замовлення
 * - Чи доступні базові дані для створення предмета
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class CanStartItemWizardGuard implements Guard<OrderState, OrderEvent> {

    private final Stage2StateMachineAdapter stateMachineAdapter;

    @Override
    public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine Guard: Перевірка можливості запуску підвізарда предмета");

        try {
            // Перевіряємо базові умови для запуску підвізарда
            String wizardId = (String) context.getExtendedState().getVariables().get("wizardId");

            if (wizardId == null) {
                log.warn("❌ wizardId не знайдено в контексті");
                return false;
            }

            // Перевіряємо чи немає активного підвізарда
            Boolean hasActiveItemWizard = (Boolean) context.getExtendedState()
                .getVariables().get("hasActiveItemWizard");

            if (Boolean.TRUE.equals(hasActiveItemWizard)) {
                log.warn("❌ Вже є активний підвізард предмета");
                return false;
            }

            // Перевіряємо валідність замовлення
            Boolean orderValid = (Boolean) context.getExtendedState()
                .getVariables().get("orderValid");

            if (!Boolean.TRUE.equals(orderValid)) {
                log.warn("❌ Замовлення не валідне для додавання предметів");
                return false;
            }

            log.debug("✅ Підвізард предмета може бути запущений");
            return true;

        } catch (Exception e) {
            log.error("❌ Помилка при перевірці можливості запуску підвізарда: {}", e.getMessage(), e);
            return false;
        }
    }
}
