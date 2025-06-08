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
 * Guard для перевірки можливості завершення Етапу 2.
 *
 * Використовує готові бізнес-правила з доменних сервісів для валідації:
 * - Наявність мінімум одного предмета в замовленні
 * - Валідність всіх доданих предметів
 * - Завершеність всіх активних Item Wizard сесій
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class CanCompleteStage2Guard implements Guard<OrderState, OrderEvent> {

    private final Stage2StateMachineAdapter stage2Adapter;

    @Override
    public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
        log.debug("Виконання CanCompleteStage2Guard - перевірка готовності етапу 2");

        try {
            // Перевіряємо чи немає активного Item Wizard
            boolean noActiveItemWizard = checkNoActiveItemWizard(context);
            if (!noActiveItemWizard) {
                log.debug("Етап 2 не готовий: активний Item Wizard");
                return false;
            }

            // Використовуємо готові бізнес-правила через адаптер
            boolean canComplete = stage2Adapter.canCompleteStage2(context);

            if (canComplete) {
                log.info("Етап 2 готовий до завершення");
            } else {
                log.debug("Етап 2 не готовий до завершення - не виконані умови");
            }

            return canComplete;

        } catch (Exception e) {
            log.error("Помилка в CanCompleteStage2Guard: {}", e.getMessage(), e);

            // У випадку помилки блокуємо перехід
            return false;
        }
    }

    /**
     * Перевіряє, що немає активного Item Wizard.
     * Етап не можна завершити, якщо користувач ще додає/редагує предмет.
     */
    private boolean checkNoActiveItemWizard(StateContext<OrderState, OrderEvent> context) {
        try {
            // Перевіряємо чи є активна сесія Item Wizard
            return stage2Adapter.getCurrentItemWizardSession(context) == null;

        } catch (Exception e) {
            log.warn("Помилка перевірки активного Item Wizard: {}", e.getMessage());
            // У випадку помилки вважаємо, що сесія активна (безпечніше)
            return false;
        }
    }
}
