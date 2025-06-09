package com.aksi.domain.order.statemachine.stage2.substep4.config;

import java.util.EnumSet;

import org.springframework.context.annotation.Configuration;
import org.springframework.statemachine.config.EnableStateMachine;
import org.springframework.statemachine.config.EnumStateMachineConfigurerAdapter;
import org.springframework.statemachine.config.builders.StateMachineConfigurationConfigurer;
import org.springframework.statemachine.config.builders.StateMachineStateConfigurer;
import org.springframework.statemachine.config.builders.StateMachineTransitionConfigurer;
import org.springframework.statemachine.listener.StateMachineListener;
import org.springframework.statemachine.listener.StateMachineListenerAdapter;

import com.aksi.domain.order.statemachine.stage2.substep4.actions.CalculateBasePriceAction;
import com.aksi.domain.order.statemachine.stage2.substep4.actions.CalculateFinalPriceAction;
import com.aksi.domain.order.statemachine.stage2.substep4.actions.CompletePriceCalculationAction;
import com.aksi.domain.order.statemachine.stage2.substep4.actions.InitializePriceCalculationAction;
import com.aksi.domain.order.statemachine.stage2.substep4.enums.PriceDiscountEvent;
import com.aksi.domain.order.statemachine.stage2.substep4.enums.PriceDiscountState;
import com.aksi.domain.order.statemachine.stage2.substep4.guards.BaseDataValidGuard;
import com.aksi.domain.order.statemachine.stage2.substep4.guards.CalculationCompletedGuard;
import com.aksi.domain.order.statemachine.stage2.substep4.guards.FinalCalculationReadyGuard;
import com.aksi.domain.order.statemachine.stage2.substep4.guards.ModifiersValidGuard;

import lombok.extern.slf4j.Slf4j;

/**
 * Конфігурація Spring State Machine для підетапу 2.4: Знижки та надбавки (калькулятор ціни).
 *
 * Схема переходів:
 * INITIAL → CALCULATING_BASE_PRICE → SELECTING_MODIFIERS → CALCULATING_FINAL_PRICE → COMPLETED
 *
 * З можливістю повернення для корекції модифікаторів та скидання розрахунку.
 */
@Configuration
@EnableStateMachine(name = "priceDiscountStateMachine")
@Slf4j
public class PriceDiscountStateMachineConfig extends EnumStateMachineConfigurerAdapter<PriceDiscountState, PriceDiscountEvent> {

    private final InitializePriceCalculationAction initializePriceCalculationAction;
    private final CalculateBasePriceAction calculateBasePriceAction;
    private final CalculateFinalPriceAction calculateFinalPriceAction;
    private final CompletePriceCalculationAction completePriceCalculationAction;

    private final BaseDataValidGuard baseDataValidGuard;
    private final ModifiersValidGuard modifiersValidGuard;
    private final FinalCalculationReadyGuard finalCalculationReadyGuard;
    private final CalculationCompletedGuard calculationCompletedGuard;

    public PriceDiscountStateMachineConfig(
            InitializePriceCalculationAction initializePriceCalculationAction,
            CalculateBasePriceAction calculateBasePriceAction,
            CalculateFinalPriceAction calculateFinalPriceAction,
            CompletePriceCalculationAction completePriceCalculationAction,
            BaseDataValidGuard baseDataValidGuard,
            ModifiersValidGuard modifiersValidGuard,
            FinalCalculationReadyGuard finalCalculationReadyGuard,
            CalculationCompletedGuard calculationCompletedGuard) {

        this.initializePriceCalculationAction = initializePriceCalculationAction;
        this.calculateBasePriceAction = calculateBasePriceAction;
        this.calculateFinalPriceAction = calculateFinalPriceAction;
        this.completePriceCalculationAction = completePriceCalculationAction;
        this.baseDataValidGuard = baseDataValidGuard;
        this.modifiersValidGuard = modifiersValidGuard;
        this.finalCalculationReadyGuard = finalCalculationReadyGuard;
        this.calculationCompletedGuard = calculationCompletedGuard;
    }

    @Override
    public void configure(StateMachineConfigurationConfigurer<PriceDiscountState, PriceDiscountEvent> config)
            throws Exception {
        config
            .withConfiguration()
                .autoStartup(false)
                .listener(stateMachineListener());
    }

    @Override
    public void configure(StateMachineStateConfigurer<PriceDiscountState, PriceDiscountEvent> states)
            throws Exception {
        states
            .withStates()
                .initial(PriceDiscountState.INITIAL)
                .states(EnumSet.allOf(PriceDiscountState.class))
                .end(PriceDiscountState.COMPLETED)
                .end(PriceDiscountState.ERROR);
    }

    @Override
    public void configure(StateMachineTransitionConfigurer<PriceDiscountState, PriceDiscountEvent> transitions)
            throws Exception {
        transitions
            // ========== ОСНОВНИЙ ШЛЯХ ==========

            // Ініціалізація підетапу
            .withExternal()
                .source(PriceDiscountState.INITIAL)
                .target(PriceDiscountState.CALCULATING_BASE_PRICE)
                .event(PriceDiscountEvent.INITIALIZE)
                .action(initializePriceCalculationAction)
                .and()

            // Розрахунок базової ціни
            .withExternal()
                .source(PriceDiscountState.CALCULATING_BASE_PRICE)
                .target(PriceDiscountState.SELECTING_MODIFIERS)
                .event(PriceDiscountEvent.CALCULATE_BASE_PRICE)
                .guard(baseDataValidGuard)
                .action(calculateBasePriceAction)
                .and()

            // Перехід до фінального розрахунку (з модифікаторами або без)
            .withExternal()
                .source(PriceDiscountState.SELECTING_MODIFIERS)
                .target(PriceDiscountState.CALCULATING_FINAL_PRICE)
                .event(PriceDiscountEvent.CALCULATE_FINAL_PRICE)
                .guard(modifiersValidGuard)
                .action(calculateFinalPriceAction)
                .and()

            // Завершення розрахунку
            .withExternal()
                .source(PriceDiscountState.CALCULATING_FINAL_PRICE)
                .target(PriceDiscountState.COMPLETED)
                .event(PriceDiscountEvent.CONFIRM_CALCULATION)
                .guard(finalCalculationReadyGuard)
                .guard(calculationCompletedGuard)
                .action(completePriceCalculationAction)
                .and()

            // ========== ДОДАВАННЯ/ВИДАЛЕННЯ МОДИФІКАТОРІВ ==========

            // Додавання модифікатора (внутрішній перехід)
            .withInternal()
                .source(PriceDiscountState.SELECTING_MODIFIERS)
                .event(PriceDiscountEvent.ADD_MODIFIER)
                .and()

            // Видалення модифікатора (внутрішній перехід)
            .withInternal()
                .source(PriceDiscountState.SELECTING_MODIFIERS)
                .event(PriceDiscountEvent.REMOVE_MODIFIER)
                .and()

            // ========== СКИДАННЯ ==========

            // Скидання з будь-якого стану до початкового
            .withExternal()
                .source(PriceDiscountState.CALCULATING_BASE_PRICE)
                .target(PriceDiscountState.INITIAL)
                .event(PriceDiscountEvent.RESET_CALCULATION)
                .and()

            .withExternal()
                .source(PriceDiscountState.SELECTING_MODIFIERS)
                .target(PriceDiscountState.INITIAL)
                .event(PriceDiscountEvent.RESET_CALCULATION)
                .and()

            .withExternal()
                .source(PriceDiscountState.CALCULATING_FINAL_PRICE)
                .target(PriceDiscountState.INITIAL)
                .event(PriceDiscountEvent.RESET_CALCULATION)
                .and()

            // ========== ОБРОБКА ПОМИЛОК ==========

            // Переходи на стан помилки
            .withExternal()
                .source(PriceDiscountState.CALCULATING_BASE_PRICE)
                .target(PriceDiscountState.ERROR)
                .event(PriceDiscountEvent.HANDLE_ERROR)
                .and()

            .withExternal()
                .source(PriceDiscountState.SELECTING_MODIFIERS)
                .target(PriceDiscountState.ERROR)
                .event(PriceDiscountEvent.HANDLE_ERROR)
                .and()

            .withExternal()
                .source(PriceDiscountState.CALCULATING_FINAL_PRICE)
                .target(PriceDiscountState.ERROR)
                .event(PriceDiscountEvent.HANDLE_ERROR)
                .and()

            // Відновлення з помилки
            .withExternal()
                .source(PriceDiscountState.ERROR)
                .target(PriceDiscountState.INITIAL)
                .event(PriceDiscountEvent.RESET_CALCULATION);
    }

    /**
     * Слухач подій State Machine для логування та моніторингу.
     */
    private StateMachineListener<PriceDiscountState, PriceDiscountEvent> stateMachineListener() {
        return new StateMachineListenerAdapter<PriceDiscountState, PriceDiscountEvent>() {

            @Override
            public void stateChanged(org.springframework.statemachine.state.State<PriceDiscountState, PriceDiscountEvent> from,
                                   org.springframework.statemachine.state.State<PriceDiscountState, PriceDiscountEvent> to) {
                log.info("State changed from [{}] to [{}]",
                    from != null ? from.getId() : "null",
                    to != null ? to.getId() : "null");
            }

            @Override
            public void eventNotAccepted(org.springframework.messaging.Message<PriceDiscountEvent> event) {
                log.warn("Event not accepted: [{}]", event.getPayload());
            }

            @Override
            public void stateMachineError(org.springframework.statemachine.StateMachine<PriceDiscountState, PriceDiscountEvent> stateMachine,
                                        Exception exception) {
                log.error("State machine error: {}", exception.getMessage(), exception);
            }
        };
    }
}
