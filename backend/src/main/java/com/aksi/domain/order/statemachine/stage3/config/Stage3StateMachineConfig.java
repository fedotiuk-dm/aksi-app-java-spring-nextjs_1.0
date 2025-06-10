package com.aksi.domain.order.statemachine.stage3.config;

import java.util.EnumSet;

import org.springframework.context.annotation.Configuration;
import org.springframework.statemachine.config.EnableStateMachine;
import org.springframework.statemachine.config.EnumStateMachineConfigurerAdapter;
import org.springframework.statemachine.config.builders.StateMachineStateConfigurer;
import org.springframework.statemachine.config.builders.StateMachineTransitionConfigurer;

import com.aksi.domain.order.statemachine.stage3.actions.CompleteStage3Action;
import com.aksi.domain.order.statemachine.stage3.actions.InitializeStage3Action;
import com.aksi.domain.order.statemachine.stage3.enums.Stage3Event;
import com.aksi.domain.order.statemachine.stage3.enums.Stage3State;
import com.aksi.domain.order.statemachine.stage3.guards.DiscountConfigReadyGuard;
import com.aksi.domain.order.statemachine.stage3.guards.ExecutionParamsReadyGuard;
import com.aksi.domain.order.statemachine.stage3.guards.PaymentConfigReadyGuard;
import com.aksi.domain.order.statemachine.stage3.guards.Stage3CompleteGuard;

/**
 * Конфігурація Spring State Machine для Stage3 - Загальні параметри замовлення.
 *
 * ЕТАП 6.1: Config (фінальна інтеграція)
 * Дозволені імпорти: ТІЛЬКИ енуми + Actions + Guards + Spring State Machine + Java стандартні
 * Заборонено: Services, Validators, DTO, Mappers, Adapters
 */
@Configuration
@EnableStateMachine(name = "stage3StateMachine")
public class Stage3StateMachineConfig extends EnumStateMachineConfigurerAdapter<Stage3State, Stage3Event> {

    private final InitializeStage3Action initializeStage3Action;
    private final CompleteStage3Action completeStage3Action;
    private final ExecutionParamsReadyGuard executionParamsReadyGuard;
    private final DiscountConfigReadyGuard discountConfigReadyGuard;
    private final PaymentConfigReadyGuard paymentConfigReadyGuard;
    private final Stage3CompleteGuard stage3CompleteGuard;

    public Stage3StateMachineConfig(
            InitializeStage3Action initializeStage3Action,
            CompleteStage3Action completeStage3Action,
            ExecutionParamsReadyGuard executionParamsReadyGuard,
            DiscountConfigReadyGuard discountConfigReadyGuard,
            PaymentConfigReadyGuard paymentConfigReadyGuard,
            Stage3CompleteGuard stage3CompleteGuard) {
        this.initializeStage3Action = initializeStage3Action;
        this.completeStage3Action = completeStage3Action;
        this.executionParamsReadyGuard = executionParamsReadyGuard;
        this.discountConfigReadyGuard = discountConfigReadyGuard;
        this.paymentConfigReadyGuard = paymentConfigReadyGuard;
        this.stage3CompleteGuard = stage3CompleteGuard;
    }

    @Override
    public void configure(StateMachineStateConfigurer<Stage3State, Stage3Event> states) throws Exception {
        states
            .withStates()
                .initial(Stage3State.STAGE3_INIT)
                .states(EnumSet.allOf(Stage3State.class))
                .end(Stage3State.STAGE3_COMPLETED)
                .end(Stage3State.STAGE3_ERROR);
    }

    @Override
    public void configure(StateMachineTransitionConfigurer<Stage3State, Stage3Event> transitions) throws Exception {
        transitions
            // ========== ІНІЦІАЛІЗАЦІЯ ==========
            .withExternal()
                .source(Stage3State.STAGE3_INIT)
                .target(Stage3State.EXECUTION_PARAMS_INIT)
                .event(Stage3Event.INITIALIZE_STAGE3)
                .action(initializeStage3Action)
            .and()

                        // ========== 3.1 ПАРАМЕТРИ ВИКОНАННЯ ==========
            .withExternal()
                .source(Stage3State.EXECUTION_PARAMS_INIT)
                .target(Stage3State.DATE_SELECTION)
                .event(Stage3Event.SET_EXECUTION_DATE)
            .and()
            .withExternal()
                .source(Stage3State.DATE_SELECTION)
                .target(Stage3State.URGENCY_SELECTION)
                .event(Stage3Event.SET_URGENCY)
            .and()
            .withExternal()
                .source(Stage3State.URGENCY_SELECTION)
                .target(Stage3State.EXECUTION_PARAMS_COMPLETED)
                .event(Stage3Event.COMPLETE_EXECUTION_PARAMS)
            .and()

            // Перехід до наступного підетапу з перевіркою готовності
            .withExternal()
                .source(Stage3State.EXECUTION_PARAMS_COMPLETED)
                .target(Stage3State.DISCOUNT_CONFIG_INIT)
                .event(Stage3Event.GO_TO_DISCOUNT_CONFIG)
                .guard(executionParamsReadyGuard)
            .and()

                        // ========== 3.2 КОНФІГУРАЦІЯ ЗНИЖОК ==========
            .withExternal()
                .source(Stage3State.DISCOUNT_CONFIG_INIT)
                .target(Stage3State.DISCOUNT_TYPE_SELECTION)
                .event(Stage3Event.START_DISCOUNT_CONFIG)
            .and()
            .withExternal()
                .source(Stage3State.DISCOUNT_TYPE_SELECTION)
                .target(Stage3State.DISCOUNT_VALIDATION)
                .event(Stage3Event.SET_DISCOUNT_TYPE)
            .and()
            .withExternal()
                .source(Stage3State.DISCOUNT_VALIDATION)
                .target(Stage3State.DISCOUNT_CONFIG_COMPLETED)
                .event(Stage3Event.COMPLETE_DISCOUNT_CONFIG)
            .and()

            // Перехід до наступного підетапу з перевіркою готовності
            .withExternal()
                .source(Stage3State.DISCOUNT_CONFIG_COMPLETED)
                .target(Stage3State.PAYMENT_CONFIG_INIT)
                .event(Stage3Event.GO_TO_PAYMENT_CONFIG)
                .guard(discountConfigReadyGuard)
            .and()

            // ========== 3.3 КОНФІГУРАЦІЯ ОПЛАТИ ==========
            .withExternal()
                .source(Stage3State.PAYMENT_CONFIG_INIT)
                .target(Stage3State.PAYMENT_METHOD_SELECTION)
                .event(Stage3Event.START_PAYMENT_CONFIG)
            .and()
            .withExternal()
                .source(Stage3State.PAYMENT_METHOD_SELECTION)
                .target(Stage3State.PAYMENT_AMOUNT_CALCULATION)
                .event(Stage3Event.SET_PAYMENT_METHOD)
            .and()
            .withExternal()
                .source(Stage3State.PAYMENT_AMOUNT_CALCULATION)
                .target(Stage3State.PAYMENT_CONFIG_COMPLETED)
                .event(Stage3Event.COMPLETE_PAYMENT_CONFIG)
            .and()

            // Перехід до наступного підетапу з перевіркою готовності
            .withExternal()
                .source(Stage3State.PAYMENT_CONFIG_COMPLETED)
                .target(Stage3State.ADDITIONAL_INFO_INIT)
                .event(Stage3Event.GO_TO_ADDITIONAL_INFO)
                .guard(paymentConfigReadyGuard)
            .and()

            // ========== 3.4 ДОДАТКОВА ІНФОРМАЦІЯ ==========
            .withExternal()
                .source(Stage3State.ADDITIONAL_INFO_INIT)
                .target(Stage3State.NOTES_INPUT)
                .event(Stage3Event.START_ADDITIONAL_INFO)
            .and()
            .withExternal()
                .source(Stage3State.NOTES_INPUT)
                .target(Stage3State.REQUIREMENTS_INPUT)
                .event(Stage3Event.SET_ORDER_NOTES)
            .and()
            .withExternal()
                .source(Stage3State.REQUIREMENTS_INPUT)
                .target(Stage3State.ADDITIONAL_INFO_COMPLETED)
                .event(Stage3Event.COMPLETE_ADDITIONAL_INFO)
            .and()

            // ========== ЗАВЕРШЕННЯ STAGE3 ==========
            .withExternal()
                .source(Stage3State.ADDITIONAL_INFO_COMPLETED)
                .target(Stage3State.STAGE3_COMPLETED)
                .event(Stage3Event.COMPLETE_STAGE3)
                .guard(stage3CompleteGuard)
                .action(completeStage3Action)
            .and()

            // ========== НАВІГАЦІЯ НАЗАД ==========
            .withExternal()
                .source(Stage3State.DISCOUNT_CONFIG_INIT)
                .target(Stage3State.EXECUTION_PARAMS_COMPLETED)
                .event(Stage3Event.GO_TO_EXECUTION_PARAMS)
            .and()
            .withExternal()
                .source(Stage3State.PAYMENT_CONFIG_INIT)
                .target(Stage3State.DISCOUNT_CONFIG_COMPLETED)
                .event(Stage3Event.GO_TO_DISCOUNT_CONFIG)
            .and()
            .withExternal()
                .source(Stage3State.ADDITIONAL_INFO_INIT)
                .target(Stage3State.PAYMENT_CONFIG_COMPLETED)
                .event(Stage3Event.GO_TO_PAYMENT_CONFIG)
            .and()

            // ========== ОБРОБКА ПОМИЛОК ==========
            .withExternal()
                .source(Stage3State.EXECUTION_PARAMS_INIT)
                .target(Stage3State.STAGE3_ERROR)
                .event(Stage3Event.ERROR_OCCURRED)
            .and()
            .withExternal()
                .source(Stage3State.DISCOUNT_CONFIG_INIT)
                .target(Stage3State.STAGE3_ERROR)
                .event(Stage3Event.ERROR_OCCURRED)
            .and()
            .withExternal()
                .source(Stage3State.PAYMENT_CONFIG_INIT)
                .target(Stage3State.STAGE3_ERROR)
                .event(Stage3Event.ERROR_OCCURRED)
            .and()
            .withExternal()
                .source(Stage3State.ADDITIONAL_INFO_INIT)
                .target(Stage3State.STAGE3_ERROR)
                .event(Stage3Event.ERROR_OCCURRED);
    }
}
