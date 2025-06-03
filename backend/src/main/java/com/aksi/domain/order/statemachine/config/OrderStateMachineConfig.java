package com.aksi.domain.order.statemachine.config;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage1.actions.InitializeOrderAction;
import com.aksi.domain.order.statemachine.stage1.actions.SaveClientDataAction;
import com.aksi.domain.order.statemachine.stage1.actions.SaveOrderBasicInfoAction;
import com.aksi.domain.order.statemachine.stage1.guards.ClientValidGuard;
import com.aksi.domain.order.statemachine.stage1.guards.OrderBasicInfoValidGuard;
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

    private final InitializeOrderAction initializeOrderAction;
    private final SaveClientDataAction saveClientDataAction;
    private final SaveOrderBasicInfoAction saveOrderBasicInfoAction;
    private final ClientValidGuard clientValidGuard;
    private final OrderBasicInfoValidGuard orderBasicInfoValidGuard;

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

                // === ЕТАП 2: Менеджер предметів (тимчасово для переходу) ===
                .state(OrderState.ITEM_MANAGEMENT)

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

            // === ЕТАП 1.2: Базова інформація замовлення ===
            .and()
            .withExternal()
                .source(OrderState.ORDER_INITIALIZATION)
                .target(OrderState.ITEM_MANAGEMENT)
                .event(OrderEvent.ORDER_INFO_COMPLETED)
                .action(saveOrderBasicInfoAction)
                .guard(orderBasicInfoValidGuard)

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
