package com.aksi.domain.order.statemachine.config;

import org.springframework.statemachine.config.builders.StateMachineTransitionConfigurer;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;

/**
 * Базовий інтерфейс для конфігураторів переходів етапів Order Wizard.
 *
 * Кожен етап має власний реалізатор цього інтерфейсу для інкапсуляції
 * своїх переходів, actions та guards.
 */
public interface StageTransitionConfigurer {

    /**
     * Конфігурує переходи для конкретного етапу.
     *
     * @param transitions builder для конфігурації переходів
     * @throws Exception якщо сталася помилка під час конфігурації
     */
    void configureTransitions(StateMachineTransitionConfigurer<OrderState, OrderEvent> transitions)
            throws Exception;

    /**
     * Повертає номер етапу для логування та діагностики.
     *
     * @return номер етапу (1, 2, 3, 4)
     */
    int getStageNumber();

    /**
     * Повертає назву етапу для логування та діагностики.
     *
     * @return назва етапу
     */
    String getStageName();
}
