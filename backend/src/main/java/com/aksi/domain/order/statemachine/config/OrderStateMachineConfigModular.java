package com.aksi.domain.order.statemachine.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.statemachine.StateMachine;
import org.springframework.statemachine.config.EnableStateMachineFactory;
import org.springframework.statemachine.config.EnumStateMachineConfigurerAdapter;
import org.springframework.statemachine.config.builders.StateMachineConfigurationConfigurer;
import org.springframework.statemachine.config.builders.StateMachineStateConfigurer;
import org.springframework.statemachine.config.builders.StateMachineTransitionConfigurer;
import org.springframework.statemachine.listener.StateMachineListener;
import org.springframework.statemachine.listener.StateMachineListenerAdapter;
import org.springframework.statemachine.state.State;
import org.springframework.statemachine.transition.Transition;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Модульна конфігурація Spring State Machine для Order Wizard.
 *
 * Використовує окремі конфігуратори для кожного етапу:
 * - Stage1TransitionConfigurer - Клієнт та базова інформація
 * - Stage2TransitionConfigurer - Менеджер предметів (з підвізардом)
 * - Stage3TransitionConfigurer - Параметри замовлення
 * - Stage4TransitionConfigurer - Підтвердження та завершення
 *
 * Переваги модульного підходу:
 * - Легкість підтримки кожного етапу окремо
 * - Покращене тестування
 * - Менша складність файлів
 * - Краща читабельність коду
 */
@Configuration
@EnableStateMachineFactory
@RequiredArgsConstructor
@Slf4j
public class OrderStateMachineConfigModular extends EnumStateMachineConfigurerAdapter<OrderState, OrderEvent> {

    // Конфігуратори етапів
    private final Stage1TransitionConfigurer stage1Configurer;
    private final Stage2TransitionConfigurer stage2Configurer;
    private final Stage3TransitionConfigurer stage3Configurer;
    private final Stage4TransitionConfigurer stage4Configurer;

    @Override
    public void configure(StateMachineConfigurationConfigurer<OrderState, OrderEvent> config) throws Exception {
        config
            .withConfiguration()
                .autoStartup(false)
                .listener(stateMachineListener())
            .and()
            .withPersistence()
                // Налаштування персистенції через OrderWizardSessionEntity
                .runtimePersister(null); // Буде налаштовано окремо
    }

    @Override
    public void configure(StateMachineStateConfigurer<OrderState, OrderEvent> states) throws Exception {
        log.info("Конфігурація станів Order Wizard State Machine");

        states
            .withStates()
                // Початковий стан
                .initial(OrderState.INITIAL)

                // Етап 1: Клієнт та базова інформація
                .state(OrderState.CLIENT_SELECTION)
                .state(OrderState.ORDER_INITIALIZATION)

                // Етап 2: Менеджер предметів
                .state(OrderState.ITEM_MANAGEMENT)
                .state(OrderState.ITEM_WIZARD_ACTIVE)

                // Підвізард предметів (етап 2.1-2.5)
                .state(OrderState.ITEM_BASIC_INFO)
                .state(OrderState.ITEM_CHARACTERISTICS)
                .state(OrderState.ITEM_DEFECTS_STAINS)
                .state(OrderState.ITEM_PRICING)
                .state(OrderState.ITEM_PHOTOS)
                .state(OrderState.ITEM_COMPLETED)

                // Етап 3: Параметри замовлення
                .state(OrderState.EXECUTION_PARAMS)
                .state(OrderState.GLOBAL_DISCOUNTS)
                .state(OrderState.PAYMENT_PROCESSING)
                .state(OrderState.ADDITIONAL_INFO)

                // Етап 4: Підтвердження та завершення
                .state(OrderState.ORDER_CONFIRMATION)
                .state(OrderState.ORDER_REVIEW)
                .state(OrderState.LEGAL_ASPECTS)
                .state(OrderState.RECEIPT_GENERATION)

                // Фінальні стани
                .end(OrderState.COMPLETED)
                .end(OrderState.CANCELLED);

        log.debug("Конфігурація станів завершена. Всього станів: {}", OrderState.values().length);
    }

    @Override
    public void configure(StateMachineTransitionConfigurer<OrderState, OrderEvent> transitions) throws Exception {
        log.info("Початок конфігурації переходів Order Wizard State Machine");

        // Конфігуруємо кожен етап через відповідний конфігуратор
        stage1Configurer.configureTransitions(transitions);
        stage2Configurer.configureTransitions(transitions);
        stage3Configurer.configureTransitions(transitions);
        stage4Configurer.configureTransitions(transitions);

        log.info("Конфігурація переходів Order Wizard State Machine завершена");
        log.debug("Етапи сконфігуровано: {} {} {} {}",
            stage1Configurer.getStageName(),
            stage2Configurer.getStageName(),
            stage3Configurer.getStageName(),
            stage4Configurer.getStageName());
    }

    /**
     * Bean для StateMachine Listener з детальним логуванням.
     */
    @Bean
    public StateMachineListener<OrderState, OrderEvent> stateMachineListener() {
        return new StateMachineListenerAdapter<OrderState, OrderEvent>() {

            @Override
            public void stateChanged(State<OrderState, OrderEvent> from, State<OrderState, OrderEvent> to) {
                String fromState = from != null ? from.getId().name() : "null";
                String toState = to != null ? to.getId().name() : "null";

                log.info("State Machine перехід: {} -> {}", fromState, toState);

                if (to != null) {
                    logStageInfo(to.getId());
                }
            }

            @Override
            public void transition(Transition<OrderState, OrderEvent> transition) {
                if (transition.getSource() != null && transition.getTarget() != null) {
                    log.debug("Transition виконано: {} --[{}]--> {}",
                        transition.getSource().getId().name(),
                        transition.getTrigger() != null ? transition.getTrigger().getEvent().name() : "no-event",
                        transition.getTarget().getId().name());
                }
            }

            @Override
            public void stateMachineError(StateMachine<OrderState, OrderEvent> stateMachine, Exception exception) {
                log.error("State Machine помилка: {}", exception.getMessage(), exception);
            }

            /**
             * Логує інформацію про етап на основі поточного стану.
             */
            private void logStageInfo(OrderState state) {
                String stageInfo = getStageInfo(state);
                if (stageInfo != null) {
                    log.info("Поточний етап: {}", stageInfo);
                }
            }

            /**
             * Повертає інформацію про етап для даного стану.
             */
            private String getStageInfo(OrderState state) {
                return switch (state) {
                    case CLIENT_SELECTION, ORDER_INITIALIZATION -> stage1Configurer.getStageName();
                    case ITEM_MANAGEMENT, ITEM_WIZARD_ACTIVE, ITEM_BASIC_INFO, ITEM_CHARACTERISTICS,
                         ITEM_DEFECTS_STAINS, ITEM_PRICING, ITEM_PHOTOS, ITEM_COMPLETED -> stage2Configurer.getStageName();
                    case EXECUTION_PARAMS, GLOBAL_DISCOUNTS, PAYMENT_PROCESSING, ADDITIONAL_INFO -> stage3Configurer.getStageName();
                    case ORDER_CONFIRMATION, ORDER_REVIEW, LEGAL_ASPECTS, RECEIPT_GENERATION -> stage4Configurer.getStageName();
                    case COMPLETED -> "Wizard завершено успішно";
                    case CANCELLED -> "Wizard скасовано";
                    default -> null;
                };
            }
        };
    }

    /**
     * Додатковий метод для отримання статистики конфігурації.
     * Корисний для діагностики та логування.
     */
    public void printConfigurationSummary() {
        log.info("=== Order Wizard State Machine Configuration Summary ===");
        log.info("Загальна кількість станів: {}", OrderState.values().length);
        log.info("Загальна кількість подій: {}", OrderEvent.values().length);

        List<StageTransitionConfigurer> configurers = List.of(
            stage1Configurer, stage2Configurer, stage3Configurer, stage4Configurer
        );

        configurers.forEach(configurer -> {
            log.info("Етап {}: {}", configurer.getStageNumber(), configurer.getStageName());
        });

        log.info("=== End Configuration Summary ===");
    }
}
