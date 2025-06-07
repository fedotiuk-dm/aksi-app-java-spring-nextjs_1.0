package com.aksi.domain.order.statemachine.stage2.actions;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage2.adapter.Stage2StateMachineAdapter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * State Machine Action для завершення підвізарда предмета
 *
 * Обробляє події:
 * - ITEM_ADDED - додавання предмета до замовлення
 *
 * Функціональність:
 * - Злиття даних з усіх кроків підвізарда
 * - Створення OrderItemDTO
 * - Додавання до замовлення
 * - Очищення тимчасових даних підвізарда
 * - Повернення до головного екрану менеджера предметів
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class CompleteItemWizardAction implements Action<OrderState, OrderEvent> {

    private final Stage2StateMachineAdapter stateMachineAdapter;

    @Override
    public void execute(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine Action: Завершення підвізарда предмета");

        try {
            // Завершуємо підвізард та додаємо предмет до замовлення
            stateMachineAdapter.completeItemWizard(context);

            log.info("✅ Підвізард предмета успішно завершено");

        } catch (Exception e) {
            log.error("❌ Помилка при завершенні підвізарда предмета: {}", e.getMessage(), e);

            // Додаємо інформацію про помилку в контекст
            context.getExtendedState().getVariables().put("error",
                "Не вдалося завершити підвізард предмета: " + e.getMessage());
            context.getExtendedState().getVariables().put("hasError", true);
        }
    }
}
