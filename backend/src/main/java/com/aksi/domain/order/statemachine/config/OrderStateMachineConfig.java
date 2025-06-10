package com.aksi.domain.order.statemachine.config;

import java.util.EnumSet;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.statemachine.StateMachineContext;
import org.springframework.statemachine.StateMachinePersist;
import org.springframework.statemachine.config.EnableStateMachineFactory;
import org.springframework.statemachine.config.EnumStateMachineConfigurerAdapter;
import org.springframework.statemachine.config.builders.StateMachineConfigurationConfigurer;
import org.springframework.statemachine.config.builders.StateMachineStateConfigurer;
import org.springframework.statemachine.config.builders.StateMachineTransitionConfigurer;
import org.springframework.statemachine.persist.DefaultStateMachinePersister;
import org.springframework.statemachine.persist.StateMachinePersister;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.actions.CompleteStage1Action;
import com.aksi.domain.order.statemachine.actions.StartOrderAction;
import com.aksi.domain.order.statemachine.guards.Stage1CompletedGuard;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Основна конфігурація Spring State Machine для Order Wizard.
 * Координує всі 4 етапи Order Wizard.
 */
@Configuration
@EnableStateMachineFactory(name = "orderStateMachine")
@RequiredArgsConstructor
@Slf4j
public class OrderStateMachineConfig extends EnumStateMachineConfigurerAdapter<OrderState, OrderEvent> {

    private final StartOrderAction startOrderAction;
    private final CompleteStage1Action completeStage1Action;
    private final Stage1CompletedGuard stage1CompletedGuard;

    @Override
    public void configure(StateMachineConfigurationConfigurer<OrderState, OrderEvent> config) throws Exception {
        config
            .withConfiguration()
                .autoStartup(true)
                .listener(stateMachineListener());
    }

    @Override
    public void configure(StateMachineStateConfigurer<OrderState, OrderEvent> states) throws Exception {
        states
            .withStates()
                .initial(OrderState.INITIAL)
                .states(EnumSet.allOf(OrderState.class))
                .end(OrderState.COMPLETED)
                .end(OrderState.CANCELLED);
    }

    @Override
    public void configure(StateMachineTransitionConfigurer<OrderState, OrderEvent> transitions) throws Exception {
        transitions
            // ========== ПОЧАТОК ЗАМОВЛЕННЯ ==========
            .withExternal()
                .source(OrderState.INITIAL)
                .target(OrderState.CLIENT_SELECTION)
                .event(OrderEvent.START_ORDER)
                .action(startOrderAction)
            .and()

            // ========== ЕТАП 1: КЛІЄНТ ТА БАЗОВА ІНФОРМАЦІЯ ==========
            .withExternal()
                .source(OrderState.CLIENT_SELECTION)
                .target(OrderState.ORDER_INITIALIZATION)
                .event(OrderEvent.CLIENT_SELECTED)
            .and()

            .withExternal()
                .source(OrderState.ORDER_INITIALIZATION)
                .target(OrderState.ITEM_MANAGEMENT)
                .event(OrderEvent.ORDER_INFO_COMPLETED)
                .guard(stage1CompletedGuard)
                .action(completeStage1Action)
            .and()

            // ========== ЕТАП 2: МЕНЕДЖЕР ПРЕДМЕТІВ ==========
            .withExternal()
                .source(OrderState.ITEM_MANAGEMENT)
                .target(OrderState.ITEM_WIZARD_ACTIVE)
                .event(OrderEvent.ADD_ITEM)
            .and()

            // Підвізард предметів - послідовні кроки
            .withExternal()
                .source(OrderState.ITEM_WIZARD_ACTIVE)
                .target(OrderState.ITEM_BASIC_INFO)
                .event(OrderEvent.START_ITEM_WIZARD)
            .and()

            .withExternal()
                .source(OrderState.ITEM_BASIC_INFO)
                .target(OrderState.ITEM_CHARACTERISTICS)
                .event(OrderEvent.BASIC_INFO_COMPLETED)
            .and()

            .withExternal()
                .source(OrderState.ITEM_CHARACTERISTICS)
                .target(OrderState.ITEM_DEFECTS_STAINS)
                .event(OrderEvent.CHARACTERISTICS_COMPLETED)
            .and()

            .withExternal()
                .source(OrderState.ITEM_DEFECTS_STAINS)
                .target(OrderState.ITEM_PRICING)
                .event(OrderEvent.DEFECTS_COMPLETED)
            .and()

            .withExternal()
                .source(OrderState.ITEM_PRICING)
                .target(OrderState.ITEM_PHOTOS)
                .event(OrderEvent.PRICING_COMPLETED)
            .and()

            .withExternal()
                .source(OrderState.ITEM_PHOTOS)
                .target(OrderState.ITEM_COMPLETED)
                .event(OrderEvent.PHOTOS_COMPLETED)
            .and()

            // Завершення предмета - повернення до менеджера
            .withExternal()
                .source(OrderState.ITEM_COMPLETED)
                .target(OrderState.ITEM_MANAGEMENT)
                .event(OrderEvent.ITEM_ADDED)
            .and()

            // Перехід до етапу 3 коли всі предмети додані
            .withExternal()
                .source(OrderState.ITEM_MANAGEMENT)
                .target(OrderState.EXECUTION_PARAMS)
                .event(OrderEvent.ITEMS_COMPLETED)
            .and()

            // ========== ЕТАП 3: ЗАГАЛЬНІ ПАРАМЕТРИ ==========
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

            // ========== СКАСУВАННЯ ЗАМОВЛЕННЯ ==========
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

            // Скасування підвізарда предмета
            .withExternal()
                .source(OrderState.ITEM_WIZARD_ACTIVE)
                .target(OrderState.ITEM_MANAGEMENT)
                .event(OrderEvent.CANCEL_ITEM_WIZARD)
            .and()

            .withExternal()
                .source(OrderState.ITEM_BASIC_INFO)
                .target(OrderState.ITEM_MANAGEMENT)
                .event(OrderEvent.CANCEL_ITEM_WIZARD)
            .and()

            .withExternal()
                .source(OrderState.ITEM_CHARACTERISTICS)
                .target(OrderState.ITEM_MANAGEMENT)
                .event(OrderEvent.CANCEL_ITEM_WIZARD)
            .and()

            .withExternal()
                .source(OrderState.ITEM_DEFECTS_STAINS)
                .target(OrderState.ITEM_MANAGEMENT)
                .event(OrderEvent.CANCEL_ITEM_WIZARD)
            .and()

            .withExternal()
                .source(OrderState.ITEM_PRICING)
                .target(OrderState.ITEM_MANAGEMENT)
                .event(OrderEvent.CANCEL_ITEM_WIZARD)
            .and()

            .withExternal()
                .source(OrderState.ITEM_PHOTOS)
                .target(OrderState.ITEM_MANAGEMENT)
                .event(OrderEvent.CANCEL_ITEM_WIZARD);
    }

    /**
     * Слухач подій State Machine для логування та діагностики.
     */
    private org.springframework.statemachine.listener.StateMachineListener<OrderState, OrderEvent> stateMachineListener() {
        return new org.springframework.statemachine.listener.StateMachineListenerAdapter<OrderState, OrderEvent>() {
            @Override
            public void stateChanged(org.springframework.statemachine.state.State<OrderState, OrderEvent> from,
                                   org.springframework.statemachine.state.State<OrderState, OrderEvent> to) {
                log.info("State changed from [{}] to [{}]",
                    from != null ? from.getId() : "null",
                    to != null ? to.getId() : "null");
            }

            @Override
            public void eventNotAccepted(org.springframework.messaging.Message<OrderEvent> event) {
                log.warn("Event not accepted: [{}]", event.getPayload());
            }

            @Override
            public void stateMachineError(org.springframework.statemachine.StateMachine<OrderState, OrderEvent> stateMachine,
                                        Exception exception) {
                log.error("State machine error: {}", exception.getMessage(), exception);
            }
        };
    }

    /**
     * Персистенція State Machine для збереження стану між запитами.
     */
    @Bean
    public StateMachinePersister<OrderState, OrderEvent, String> stateMachinePersister() {
        return new DefaultStateMachinePersister<>(new StateMachinePersist<OrderState, OrderEvent, String>() {
            @Override
            public void write(StateMachineContext<OrderState, OrderEvent> context, String contextObj) throws Exception {
                // Тут можна реалізувати збереження в базу даних або кеш
                log.debug("Збереження стану State Machine для контексту: {}", contextObj);
            }

            @Override
            public StateMachineContext<OrderState, OrderEvent> read(String contextObj) throws Exception {
                // Тут можна реалізувати завантаження з бази даних або кешу
                log.debug("Завантаження стану State Machine для контексту: {}", contextObj);
                return null;
            }
        });
    }
}
