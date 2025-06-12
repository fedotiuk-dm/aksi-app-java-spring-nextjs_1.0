package com.aksi.domain.order.statemachine.config;

import java.util.EnumSet;

import org.springframework.context.annotation.Configuration;
import org.springframework.statemachine.config.EnableStateMachineFactory;
import org.springframework.statemachine.config.EnumStateMachineConfigurerAdapter;
import org.springframework.statemachine.config.builders.StateMachineConfigurationConfigurer;
import org.springframework.statemachine.config.builders.StateMachineStateConfigurer;
import org.springframework.statemachine.config.builders.StateMachineTransitionConfigurer;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.actions.InitializeStage1ContextAction;

/**
 * Головна конфігурація Spring State Machine Factory для Order Wizard.
 * Управляє переходами між основними етапами (Stage1 → Stage2 → Stage3 → Stage4).
 * Використовує @EnableStateMachineFactory для роботи з StateMachineService.
 */
@Configuration
@EnableStateMachineFactory
public class OrderWizardMainStateMachineConfig extends EnumStateMachineConfigurerAdapter<OrderState, OrderEvent> {

    private final InitializeStage1ContextAction initializeStage1ContextAction;

    public OrderWizardMainStateMachineConfig(InitializeStage1ContextAction initializeStage1ContextAction) {
        this.initializeStage1ContextAction = initializeStage1ContextAction;
    }

    @Override
    public void configure(StateMachineConfigurationConfigurer<OrderState, OrderEvent> config)
            throws Exception {
        config
            .withConfiguration()
                .autoStartup(false)
                .machineId("orderWizardMain");
    }

    @Override
    public void configure(StateMachineStateConfigurer<OrderState, OrderEvent> states)
            throws Exception {
        states
            .withStates()
                .initial(OrderState.INITIAL)
                .states(EnumSet.allOf(OrderState.class))
                .end(OrderState.COMPLETED)
                .end(OrderState.CANCELLED);
    }

    @Override
    public void configure(StateMachineTransitionConfigurer<OrderState, OrderEvent> transitions)
            throws Exception {
        transitions
            // ========== ПОЧАТОК ORDER WIZARD ==========
            .withExternal()
                .source(OrderState.INITIAL)
                .target(OrderState.CLIENT_SELECTION)
                .event(OrderEvent.START_ORDER)
                .action(initializeStage1ContextAction)
                .and()

            // ========== ЕТАП 1: CLIENT_SELECTION → ORDER_INITIALIZATION ==========
            .withExternal()
                .source(OrderState.CLIENT_SELECTION)
                .target(OrderState.ORDER_INITIALIZATION)
                .event(OrderEvent.CLIENT_SELECTED)
                .and()

            // ========== ЕТАП 1 → ЕТАП 2: ORDER_INITIALIZATION → ITEM_MANAGEMENT ==========
            .withExternal()
                .source(OrderState.ORDER_INITIALIZATION)
                .target(OrderState.ITEM_MANAGEMENT)
                .event(OrderEvent.ORDER_INFO_COMPLETED)
                .and()

            // ========== ЕТАП 2: ITEM_MANAGEMENT (внутрішні переходи керуються Stage2StateMachine) ==========
            .withInternal()
                .source(OrderState.ITEM_MANAGEMENT)
                .event(OrderEvent.ADD_ITEM)
                .and()

            .withInternal()
                .source(OrderState.ITEM_MANAGEMENT)
                .event(OrderEvent.START_ITEM_WIZARD)
                .and()

            .withInternal()
                .source(OrderState.ITEM_MANAGEMENT)
                .event(OrderEvent.EDIT_ITEM)
                .and()

            .withInternal()
                .source(OrderState.ITEM_MANAGEMENT)
                .event(OrderEvent.DELETE_ITEM)
                .and()

            // ========== ITEM_WIZARD_ACTIVE залишається для сумісності з OrderState ==========
            .withExternal()
                .source(OrderState.ITEM_MANAGEMENT)
                .target(OrderState.ITEM_WIZARD_ACTIVE)
                .event(OrderEvent.START_ITEM_WIZARD)
                .and()

            .withExternal()
                .source(OrderState.ITEM_WIZARD_ACTIVE)
                .target(OrderState.ITEM_MANAGEMENT)
                .event(OrderEvent.ITEM_ADDED)
                .and()

            .withExternal()
                .source(OrderState.ITEM_WIZARD_ACTIVE)
                .target(OrderState.ITEM_MANAGEMENT)
                .event(OrderEvent.CANCEL_ITEM_WIZARD)
                .and()

            // ========== ЕТАП 2 → ЕТАП 3: ITEM_MANAGEMENT → EXECUTION_PARAMS ==========
            .withExternal()
                .source(OrderState.ITEM_MANAGEMENT)
                .target(OrderState.EXECUTION_PARAMS)
                .event(OrderEvent.ITEMS_COMPLETED)
                .and()

            // ========== ЕТАП 3: ПАРАМЕТРИ ЗАМОВЛЕННЯ ==========
            .withExternal()
                .source(OrderState.EXECUTION_PARAMS)
                .target(OrderState.GLOBAL_DISCOUNTS)
                .event(OrderEvent.EXECUTION_PARAMS_SET)
                .and()

            .withExternal()
                .source(OrderState.GLOBAL_DISCOUNTS)
                .target(OrderState.PAYMENT_PROCESSING)
                .event(OrderEvent.DISCOUNTS_APPLIED)
                .and()

            .withExternal()
                .source(OrderState.PAYMENT_PROCESSING)
                .target(OrderState.ADDITIONAL_INFO)
                .event(OrderEvent.PAYMENT_PROCESSED)
                .and()

            // ========== ЕТАП 3 → ЕТАП 4: ADDITIONAL_INFO → ORDER_CONFIRMATION ==========
            .withExternal()
                .source(OrderState.ADDITIONAL_INFO)
                .target(OrderState.ORDER_CONFIRMATION)
                .event(OrderEvent.ADDITIONAL_INFO_COMPLETED)
                .and()

            // ========== ЕТАП 4: ПІДТВЕРДЖЕННЯ ТА ЗАВЕРШЕННЯ ==========
            .withExternal()
                .source(OrderState.ORDER_CONFIRMATION)
                .target(OrderState.ORDER_REVIEW)
                .event(OrderEvent.REVIEW_ORDER)
                .and()

            .withExternal()
                .source(OrderState.ORDER_REVIEW)
                .target(OrderState.LEGAL_ASPECTS)
                .event(OrderEvent.ORDER_APPROVED)
                .and()

            .withExternal()
                .source(OrderState.LEGAL_ASPECTS)
                .target(OrderState.RECEIPT_GENERATION)
                .event(OrderEvent.TERMS_ACCEPTED)
                .and()

            .withExternal()
                .source(OrderState.RECEIPT_GENERATION)
                .target(OrderState.COMPLETED)
                .event(OrderEvent.RECEIPT_GENERATED)
                .and()

            // ========== СКАСУВАННЯ ==========
            .withExternal()
                .source(OrderState.CLIENT_SELECTION)
                .target(OrderState.CANCELLED)
                .event(OrderEvent.CANCEL_ORDER)
                .and()

            .withExternal()
                .source(OrderState.ORDER_INITIALIZATION)
                .target(OrderState.CANCELLED)
                .event(OrderEvent.CANCEL_ORDER)
                .and()

            .withExternal()
                .source(OrderState.ITEM_MANAGEMENT)
                .target(OrderState.CANCELLED)
                .event(OrderEvent.CANCEL_ORDER)
                .and()

            .withExternal()
                .source(OrderState.EXECUTION_PARAMS)
                .target(OrderState.CANCELLED)
                .event(OrderEvent.CANCEL_ORDER)
                .and()

            .withExternal()
                .source(OrderState.GLOBAL_DISCOUNTS)
                .target(OrderState.CANCELLED)
                .event(OrderEvent.CANCEL_ORDER)
                .and()

            .withExternal()
                .source(OrderState.PAYMENT_PROCESSING)
                .target(OrderState.CANCELLED)
                .event(OrderEvent.CANCEL_ORDER)
                .and()

            .withExternal()
                .source(OrderState.ADDITIONAL_INFO)
                .target(OrderState.CANCELLED)
                .event(OrderEvent.CANCEL_ORDER)
                .and()

            .withExternal()
                .source(OrderState.ORDER_CONFIRMATION)
                .target(OrderState.CANCELLED)
                .event(OrderEvent.CANCEL_ORDER)
                .and()

            .withExternal()
                .source(OrderState.ORDER_REVIEW)
                .target(OrderState.CANCELLED)
                .event(OrderEvent.CANCEL_ORDER)
                .and()

            .withExternal()
                .source(OrderState.LEGAL_ASPECTS)
                .target(OrderState.CANCELLED)
                .event(OrderEvent.CANCEL_ORDER)
                .and()

            // ========== НАВІГАЦІЯ НАЗАД ==========
            .withExternal()
                .source(OrderState.ORDER_INITIALIZATION)
                .target(OrderState.CLIENT_SELECTION)
                .event(OrderEvent.GO_BACK)
                .and()

            .withExternal()
                .source(OrderState.ITEM_MANAGEMENT)
                .target(OrderState.ORDER_INITIALIZATION)
                .event(OrderEvent.GO_BACK)
                .and()

            .withExternal()
                .source(OrderState.EXECUTION_PARAMS)
                .target(OrderState.ITEM_MANAGEMENT)
                .event(OrderEvent.GO_BACK)
                .and()

            .withExternal()
                .source(OrderState.GLOBAL_DISCOUNTS)
                .target(OrderState.EXECUTION_PARAMS)
                .event(OrderEvent.GO_BACK)
                .and()

            .withExternal()
                .source(OrderState.PAYMENT_PROCESSING)
                .target(OrderState.GLOBAL_DISCOUNTS)
                .event(OrderEvent.GO_BACK)
                .and()

            .withExternal()
                .source(OrderState.ADDITIONAL_INFO)
                .target(OrderState.PAYMENT_PROCESSING)
                .event(OrderEvent.GO_BACK)
                .and()

            .withExternal()
                .source(OrderState.ORDER_CONFIRMATION)
                .target(OrderState.ADDITIONAL_INFO)
                .event(OrderEvent.GO_BACK)
                .and()

            .withExternal()
                .source(OrderState.ORDER_REVIEW)
                .target(OrderState.ORDER_CONFIRMATION)
                .event(OrderEvent.GO_BACK)
                .and()

            .withExternal()
                .source(OrderState.LEGAL_ASPECTS)
                .target(OrderState.ORDER_REVIEW)
                .event(OrderEvent.GO_BACK)
                .and()

            .withExternal()
                .source(OrderState.RECEIPT_GENERATION)
                .target(OrderState.LEGAL_ASPECTS)
                .event(OrderEvent.GO_BACK);
    }
}
