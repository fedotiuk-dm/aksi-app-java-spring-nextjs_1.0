package com.aksi.domain.order.statemachine.stage4.config;

import java.util.EnumSet;

import org.springframework.context.annotation.Configuration;
import org.springframework.statemachine.config.EnableStateMachine;
import org.springframework.statemachine.config.StateMachineConfigurerAdapter;
import org.springframework.statemachine.config.builders.StateMachineStateConfigurer;
import org.springframework.statemachine.config.builders.StateMachineTransitionConfigurer;

import com.aksi.domain.order.statemachine.stage4.actions.CompleteStage4Action;
import com.aksi.domain.order.statemachine.stage4.actions.GenerateReceiptAction;
import com.aksi.domain.order.statemachine.stage4.actions.InitializeStage4Action;
import com.aksi.domain.order.statemachine.stage4.actions.ProcessLegalAcceptanceAction;
import com.aksi.domain.order.statemachine.stage4.enums.Stage4Event;
import com.aksi.domain.order.statemachine.stage4.enums.Stage4State;
import com.aksi.domain.order.statemachine.stage4.guards.LegalAcceptanceCompletedGuard;
import com.aksi.domain.order.statemachine.stage4.guards.OrderConfirmedGuard;
import com.aksi.domain.order.statemachine.stage4.guards.ReceiptConfiguredGuard;
import com.aksi.domain.order.statemachine.stage4.guards.Stage4CompletedGuard;

/**
 * Конфігурація Spring State Machine для Stage4 (Підтвердження та завершення замовлення).
 *
  * Флоу станів:
 * STAGE4_INITIALIZED → ORDER_SUMMARY_REVIEW → LEGAL_ACCEPTANCE →
 * LEGAL_ACCEPTANCE_COMPLETED → RECEIPT_GENERATION → RECEIPT_GENERATED →
 * ORDER_COMPLETION → STAGE4_COMPLETED
 */
@Configuration
@EnableStateMachine(name = "stage4StateMachine")
public class Stage4StateMachineConfig extends StateMachineConfigurerAdapter<Stage4State, Stage4Event> {

    private final InitializeStage4Action initializeStage4Action;
    private final ProcessLegalAcceptanceAction processLegalAcceptanceAction;
    private final GenerateReceiptAction generateReceiptAction;
    private final CompleteStage4Action completeStage4Action;

    private final OrderConfirmedGuard orderConfirmedGuard;
    private final LegalAcceptanceCompletedGuard legalAcceptanceCompletedGuard;
    private final ReceiptConfiguredGuard receiptConfiguredGuard;
    private final Stage4CompletedGuard stage4CompletedGuard;

    public Stage4StateMachineConfig(
            InitializeStage4Action initializeStage4Action,
            ProcessLegalAcceptanceAction processLegalAcceptanceAction,
            GenerateReceiptAction generateReceiptAction,
            CompleteStage4Action completeStage4Action,
            OrderConfirmedGuard orderConfirmedGuard,
            LegalAcceptanceCompletedGuard legalAcceptanceCompletedGuard,
            ReceiptConfiguredGuard receiptConfiguredGuard,
            Stage4CompletedGuard stage4CompletedGuard
    ) {
        this.initializeStage4Action = initializeStage4Action;
        this.processLegalAcceptanceAction = processLegalAcceptanceAction;
        this.generateReceiptAction = generateReceiptAction;
        this.completeStage4Action = completeStage4Action;
        this.orderConfirmedGuard = orderConfirmedGuard;
        this.legalAcceptanceCompletedGuard = legalAcceptanceCompletedGuard;
        this.receiptConfiguredGuard = receiptConfiguredGuard;
        this.stage4CompletedGuard = stage4CompletedGuard;
    }

    @Override
    public void configure(StateMachineStateConfigurer<Stage4State, Stage4Event> states) throws Exception {
        states
            .withStates()
                .initial(Stage4State.STAGE4_INITIALIZED)
                .states(EnumSet.allOf(Stage4State.class))
                .end(Stage4State.STAGE4_COMPLETED)
                // Налаштування входів в стани з виконанням Actions
                .stateEntry(Stage4State.STAGE4_INITIALIZED, initializeStage4Action)
                .stateEntry(Stage4State.LEGAL_ACCEPTANCE, processLegalAcceptanceAction)
                .stateEntry(Stage4State.RECEIPT_GENERATION, generateReceiptAction)
                .stateEntry(Stage4State.STAGE4_COMPLETED, completeStage4Action);
    }

    @Override
    public void configure(StateMachineTransitionConfigurer<Stage4State, Stage4Event> transitions) throws Exception {
        transitions
            // Ініціалізація → Перегляд підсумку замовлення
            .withExternal()
                .source(Stage4State.STAGE4_INITIALIZED)
                .target(Stage4State.ORDER_SUMMARY_REVIEW)
                .event(Stage4Event.REVIEW_ORDER_SUMMARY)
            .and()

            // Перегляд підсумку → Юридичне прийняття (з Guard)
            .withExternal()
                .source(Stage4State.ORDER_SUMMARY_REVIEW)
                .target(Stage4State.LEGAL_ACCEPTANCE)
                .event(Stage4Event.ACCEPT_LEGAL_TERMS)
                .guard(orderConfirmedGuard)
            .and()

            // Юридичне прийняття → Завершено (з Guard)
            .withExternal()
                .source(Stage4State.LEGAL_ACCEPTANCE)
                .target(Stage4State.LEGAL_ACCEPTANCE_COMPLETED)
                .event(Stage4Event.ACCEPT_LEGAL_TERMS)
                .guard(legalAcceptanceCompletedGuard)
            .and()

            // Юридичне прийняття завершено → Генерація квитанції (з Guard)
            .withExternal()
                .source(Stage4State.LEGAL_ACCEPTANCE_COMPLETED)
                .target(Stage4State.RECEIPT_GENERATION)
                .event(Stage4Event.GENERATE_RECEIPT)
                .guard(receiptConfiguredGuard)
            .and()

            // Генерація квитанції → Квитанція згенерована
            .withExternal()
                .source(Stage4State.RECEIPT_GENERATION)
                .target(Stage4State.RECEIPT_GENERATED)
                .event(Stage4Event.GENERATE_RECEIPT)
            .and()

            // Квитанція згенерована → Завершення замовлення
            .withExternal()
                .source(Stage4State.RECEIPT_GENERATED)
                .target(Stage4State.ORDER_COMPLETION)
                .event(Stage4Event.COMPLETE_ORDER)
            .and()

            // Завершення замовлення → Завершення Stage4 (з Guard)
            .withExternal()
                .source(Stage4State.ORDER_COMPLETION)
                .target(Stage4State.STAGE4_COMPLETED)
                .event(Stage4Event.COMPLETE_ORDER)
                .guard(stage4CompletedGuard);
    }
}
