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
 * Action для запуску Item Wizard.
 *
 * Виконується при переході до стану ITEM_WIZARD_ACTIVE.
 * Координує створення нової сесії підвізарда через готові сервіси.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class StartItemWizardAction implements Action<OrderState, OrderEvent> {

    private final Stage2StateMachineAdapter stage2Adapter;

    @Override
    public void execute(StateContext<OrderState, OrderEvent> context) {
        log.debug("Виконання StartItemWizardAction");

        try {
            // Перевіряємо чи це редагування чи новий предмет
            String itemId = extractItemIdFromContext(context);

            if (itemId != null && !itemId.trim().isEmpty()) {
                // Режим редагування існуючого предмета
                log.debug("Запуск Item Wizard для редагування предмета: {}", itemId);
                stage2Adapter.startEditItemWizard(context, itemId);
            } else {
                // Режим додавання нового предмета
                log.debug("Запуск Item Wizard для нового предмета");
                stage2Adapter.startNewItemWizard(context);
            }

            log.info("Item Wizard успішно запущено через State Machine Action");

        } catch (Exception e) {
            log.error("Помилка в StartItemWizardAction: {}", e.getMessage(), e);

            // Зберігаємо помилку в контексті
            context.getExtendedState().getVariables().put("itemWizardStartError", e.getMessage());
        }
    }

    /**
     * Витягує ID предмета з контексту для режиму редагування.
     */
    private String extractItemIdFromContext(StateContext<OrderState, OrderEvent> context) {
        Object itemIdObj = context.getExtendedState().getVariables().get("editingItemId");
        return itemIdObj instanceof String ? (String) itemIdObj : null;
    }
}
