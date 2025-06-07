package com.aksi.domain.order.statemachine.config;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage1.actions.InitializeOrderAction;
import com.aksi.domain.order.statemachine.stage1.actions.SaveClientDataAction;
import com.aksi.domain.order.statemachine.stage1.actions.SaveOrderBasicInfoAction;
import com.aksi.domain.order.statemachine.stage1.guards.ClientValidGuard;
import com.aksi.domain.order.statemachine.stage1.guards.OrderBasicInfoValidGuard;
import com.aksi.domain.order.statemachine.stage2.actions.InitializeStage2Action;
import com.aksi.domain.order.statemachine.stage2.actions.StartItemWizardAction;
import com.aksi.domain.order.statemachine.stage2.actions.CompleteItemWizardAction;
import com.aksi.domain.order.statemachine.stage2.actions.DeleteItemAction;
import com.aksi.domain.order.statemachine.stage2.guards.CanCompleteStage2Guard;
import com.aksi.domain.order.statemachine.stage2.guards.CanStartItemWizardGuard;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.statemachine.config.EnableStateMachineFactory;
import org.springframework.statemachine.config.StateMachineConfigurerAdapter;
import org.springframework.statemachine.config.builders.StateMachineConfigurationConfigurer;
import org.springframework.statemachine.config.builders.StateMachineStateConfigurer;
import org.springframework.statemachine.config.builders.StateMachineTransitionConfigurer;
import org.springframework.statemachine.listener.StateMachineListener;
import org.springframework.statemachine.listener.StateMachineListenerAdapter;
import org.springframework.statemachine.state.State;

/**
 * Конфігурація Spring State Machine для Order Wizard
 *
 * Використовує in-memory State Machine з власною персистенцією через OrderWizardSessionEntity
 * Це уникає конфліктів з основною JPA конфігурацією
 */
@Configuration
@EnableStateMachineFactory
@RequiredArgsConstructor
@Slf4j
public class OrderStateMachineConfig extends StateMachineConfigurerAdapter<OrderState, OrderEvent> {

    // Stage 1 Actions and Guards
    private final InitializeOrderAction initializeOrderAction;
    private final SaveClientDataAction saveClientDataAction;
    private final SaveOrderBasicInfoAction saveOrderBasicInfoAction;
    private final ClientValidGuard clientValidGuard;
    private final OrderBasicInfoValidGuard orderBasicInfoValidGuard;

    // Stage 2 Actions and Guards
    private final InitializeStage2Action initializeStage2Action;
    private final StartItemWizardAction startItemWizardAction;
    private final CompleteItemWizardAction completeItemWizardAction;
    private final DeleteItemAction deleteItemAction;
    private final CanCompleteStage2Guard canCompleteStage2Guard;
    private final CanStartItemWizardGuard canStartItemWizardGuard;

    @Override
    public void configure(StateMachineConfigurationConfigurer<OrderState, OrderEvent> config)
            throws Exception {
        config
            .withConfiguration()
                .autoStartup(false) // Не запускаємо автоматично
                .listener(globalStateMachineListener());
    }

    @Override
    public void configure(StateMachineStateConfigurer<OrderState, OrderEvent> states)
            throws Exception {
        states
            .withStates()
                // Початковий стан
                .initial(OrderState.INITIAL)

                // === ЕТАП 1: Клієнт та базова інформація ===
                .state(OrderState.CLIENT_SELECTION)
                .state(OrderState.ORDER_INITIALIZATION)

                // === ЕТАП 2: Менеджер предметів ===
                .state(OrderState.ITEM_MANAGEMENT)

                // Підвізард предметів (циклічний)
                .state(OrderState.ITEM_WIZARD_ACTIVE)
                .state(OrderState.ITEM_BASIC_INFO)
                .state(OrderState.ITEM_CHARACTERISTICS)
                .state(OrderState.ITEM_DEFECTS_STAINS)
                .state(OrderState.ITEM_PRICING)
                .state(OrderState.ITEM_PHOTOS)
                .state(OrderState.ITEM_COMPLETED)

                // === ЕТАП 3: Загальні параметри замовлення ===
                .state(OrderState.EXECUTION_PARAMS)
                .state(OrderState.GLOBAL_DISCOUNTS)
                .state(OrderState.PAYMENT_PROCESSING)
                .state(OrderState.ADDITIONAL_INFO)

                // === ЕТАП 4: Підтвердження та завершення ===
                .state(OrderState.ORDER_CONFIRMATION)
                .state(OrderState.ORDER_REVIEW)
                .state(OrderState.LEGAL_ASPECTS)
                .state(OrderState.RECEIPT_GENERATION)

                // Фінальні стани
                .state(OrderState.COMPLETED)
                .state(OrderState.CANCELLED);
    }

    @Override
    public void configure(StateMachineTransitionConfigurer<OrderState, OrderEvent> transitions)
            throws Exception {
        transitions
            // === Ініціалізація ===
            .withExternal()
                .source(OrderState.INITIAL)
                .target(OrderState.CLIENT_SELECTION)
                .event(OrderEvent.START_ORDER)
                .action(initializeOrderAction)

            // === ЕТАП 1.1: Робота з клієнтом ===
            .and()
            .withExternal()
                .source(OrderState.CLIENT_SELECTION)
                .target(OrderState.ORDER_INITIALIZATION)
                .event(OrderEvent.CLIENT_SELECTED)
                .action(saveClientDataAction)
                .guard(clientValidGuard)

                        // === ЕТАП 1.2 -> ЕТАП 2: Базова інформація замовлення + ініціалізація етапу 2 ===
            .and()
            .withExternal()
                .source(OrderState.ORDER_INITIALIZATION)
                .target(OrderState.ITEM_MANAGEMENT)
                .event(OrderEvent.ORDER_INFO_COMPLETED)
                .action(saveOrderBasicInfoAction, initializeStage2Action)
                .guard(orderBasicInfoValidGuard)

            // === ЕТАП 2: Менеджер предметів ===

            // Запуск підвізарда предметів
            .and()
            .withExternal()
                .source(OrderState.ITEM_MANAGEMENT)
                .target(OrderState.ITEM_WIZARD_ACTIVE)
                .event(OrderEvent.ADD_ITEM)
                .action(startItemWizardAction)
                .guard(canStartItemWizardGuard)

            // Початок підвізарда - перехід до основної інформації
            .and()
            .withExternal()
                .source(OrderState.ITEM_WIZARD_ACTIVE)
                .target(OrderState.ITEM_BASIC_INFO)
                .event(OrderEvent.START_ITEM_WIZARD)

            // Підвізард: 2.1 -> 2.2
            .and()
            .withExternal()
                .source(OrderState.ITEM_BASIC_INFO)
                .target(OrderState.ITEM_CHARACTERISTICS)
                .event(OrderEvent.BASIC_INFO_COMPLETED)

            // Підвізард: 2.2 -> 2.3
            .and()
            .withExternal()
                .source(OrderState.ITEM_CHARACTERISTICS)
                .target(OrderState.ITEM_DEFECTS_STAINS)
                .event(OrderEvent.CHARACTERISTICS_COMPLETED)

            // Підвізард: 2.3 -> 2.4
            .and()
            .withExternal()
                .source(OrderState.ITEM_DEFECTS_STAINS)
                .target(OrderState.ITEM_PRICING)
                .event(OrderEvent.DEFECTS_COMPLETED)

            // Підвізард: 2.4 -> 2.5
            .and()
            .withExternal()
                .source(OrderState.ITEM_PRICING)
                .target(OrderState.ITEM_PHOTOS)
                .event(OrderEvent.PRICING_COMPLETED)

            // Підвізард: 2.5 -> Завершення
            .and()
            .withExternal()
                .source(OrderState.ITEM_PHOTOS)
                .target(OrderState.ITEM_COMPLETED)
                .event(OrderEvent.PHOTOS_COMPLETED)

            // Пропуск фото (необов'язковий крок)
            .and()
            .withExternal()
                .source(OrderState.ITEM_PHOTOS)
                .target(OrderState.ITEM_COMPLETED)
                .event(OrderEvent.SKIP_PHOTOS)

            // Завершення підвізарда - додавання предмета до замовлення
            .and()
            .withExternal()
                .source(OrderState.ITEM_COMPLETED)
                .target(OrderState.ITEM_MANAGEMENT)
                .event(OrderEvent.ITEM_ADDED)
                .action(completeItemWizardAction)

            // Видалення предмета (внутрішній перехід в ITEM_MANAGEMENT)
            .and()
            .withInternal()
                .source(OrderState.ITEM_MANAGEMENT)
                .event(OrderEvent.DELETE_ITEM)
                .action(deleteItemAction)

            // Завершення етапу 2 - перехід до етапу 3
            .and()
            .withExternal()
                .source(OrderState.ITEM_MANAGEMENT)
                .target(OrderState.EXECUTION_PARAMS)
                .event(OrderEvent.ITEMS_COMPLETED)
                .guard(canCompleteStage2Guard)

            // === Навігація назад в підвізарді ===

            // 2.2 -> 2.1
            .and()
            .withExternal()
                .source(OrderState.ITEM_CHARACTERISTICS)
                .target(OrderState.ITEM_BASIC_INFO)
                .event(OrderEvent.GO_BACK)

            // 2.3 -> 2.2
            .and()
            .withExternal()
                .source(OrderState.ITEM_DEFECTS_STAINS)
                .target(OrderState.ITEM_CHARACTERISTICS)
                .event(OrderEvent.GO_BACK)

            // 2.4 -> 2.3
            .and()
            .withExternal()
                .source(OrderState.ITEM_PRICING)
                .target(OrderState.ITEM_DEFECTS_STAINS)
                .event(OrderEvent.GO_BACK)

            // 2.5 -> 2.4
            .and()
            .withExternal()
                .source(OrderState.ITEM_PHOTOS)
                .target(OrderState.ITEM_PRICING)
                .event(OrderEvent.GO_BACK)

            // === Скасування підвізарда ===

            .and()
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
                .event(OrderEvent.CANCEL_ITEM_WIZARD)

            // === Скасування на будь-якому етапі ===

            .and()
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
                .event(OrderEvent.CANCEL_ORDER);
    }

    /**
     * Статичний метод для створення listener щоб уникнути проблем з BeanPostProcessor.
     * Статичні @Bean методи ініціалізуються раніше в lifecycle контейнера.
     */
    @Bean
    public static StateMachineListener<OrderState, OrderEvent> globalStateMachineListener() {
        return new StateMachineListenerAdapter<OrderState, OrderEvent>() {
            private static final org.slf4j.Logger log =
                org.slf4j.LoggerFactory.getLogger(OrderStateMachineConfig.class);

            @Override
            public void stateChanged(State<OrderState, OrderEvent> from, State<OrderState, OrderEvent> to) {
                if (from != null) {
                    log.info("🔄 Order State Machine перехід: {} -> {}", from.getId(), to.getId());
                } else {
                    log.info("🚀 Order State Machine ініціалізація: -> {}", to.getId());
                }
            }

            @Override
            public void eventNotAccepted(org.springframework.messaging.Message<OrderEvent> event) {
                log.warn("❌ Order Event відхилено: {}", event.getPayload());
            }

            @Override
            public void stateMachineStarted(org.springframework.statemachine.StateMachine<OrderState, OrderEvent> stateMachine) {
                log.info("▶️ Order State Machine запущено");
            }

            @Override
            public void stateMachineStopped(org.springframework.statemachine.StateMachine<OrderState, OrderEvent> stateMachine) {
                log.info("⏹️ Order State Machine зупинено");
            }

            @Override
            public void stateMachineError(org.springframework.statemachine.StateMachine<OrderState, OrderEvent> stateMachine, Exception exception) {
                log.error("💥 Order State Machine помилка: {}", exception.getMessage(), exception);
            }
        };
    }


}
