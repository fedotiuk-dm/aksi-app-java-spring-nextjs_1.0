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
 * State Machine Action для видалення предмета з замовлення
 *
 * Обробляє події:
 * - DELETE_ITEM - видалення предмета з замовлення
 *
 * Функціональність:
 * - Видалення предмета з замовлення за ID
 * - Оновлення загальної суми замовлення
 * - Перевірка мінімальної кількості предметів
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DeleteItemAction implements Action<OrderState, OrderEvent> {

    private final Stage2StateMachineAdapter stateMachineAdapter;

    @Override
    public void execute(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine Action: Видалення предмета з замовлення");

        try {
            // Отримуємо ID предмета для видалення з контексту
            String itemId = (String) context.getExtendedState().getVariables().get("itemToDeleteId");

            if (itemId == null) {
                log.warn("❌ ID предмета для видалення не знайдено в контексті");
                return;
            }

            // Видаляємо предмет через адаптер
            stateMachineAdapter.deleteItem(context, itemId);

            log.info("✅ Предмет {} успішно видалено з замовлення", itemId);

            // Очищуємо тимчасові дані з контексту
            context.getExtendedState().getVariables().remove("itemToDeleteId");

        } catch (Exception e) {
            log.error("❌ Помилка при видаленні предмета: {}", e.getMessage(), e);

            // Додаємо інформацію про помилку в контекст
            context.getExtendedState().getVariables().put("error",
                "Не вдалося видалити предмет: " + e.getMessage());
            context.getExtendedState().getVariables().put("hasError", true);
        }
    }
}
