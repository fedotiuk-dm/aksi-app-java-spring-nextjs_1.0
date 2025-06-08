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
 * Action для ініціалізації Етапу 2: Менеджер предметів.
 *
 * Виконується при переході до стану ITEM_MANAGEMENT.
 * Використовує готові доменні сервіси через адаптер для:
 * - Завантаження існуючих предметів замовлення
 * - Ініціалізації інтерфейсу управління предметами
 * - Підготовки до роботи з Item Wizard
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class InitializeStage2Action implements Action<OrderState, OrderEvent> {

    private final Stage2StateMachineAdapter stage2Adapter;

    @Override
    public void execute(StateContext<OrderState, OrderEvent> context) {
        log.debug("Виконання InitializeStage2Action");

        try {
            // Делегуємо ініціалізацію адаптеру, який використовує готові сервіси
            stage2Adapter.initializeStage2(context);

            log.info("Етап 2 успішно ініціалізовано через State Machine Action");

        } catch (Exception e) {
            log.error("Помилка в InitializeStage2Action: {}", e.getMessage(), e);

            // Зберігаємо помилку в контексті для подальшої обробки
            context.getExtendedState().getVariables().put("stage2InitError", e.getMessage());
        }
    }
}
