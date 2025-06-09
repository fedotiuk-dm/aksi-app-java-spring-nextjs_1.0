package com.aksi.domain.order.statemachine.stage2.config;

import java.util.EnumSet;

import org.springframework.context.annotation.Configuration;
import org.springframework.statemachine.config.EnableStateMachine;
import org.springframework.statemachine.config.EnumStateMachineConfigurerAdapter;
import org.springframework.statemachine.config.builders.StateMachineConfigurationConfigurer;
import org.springframework.statemachine.config.builders.StateMachineStateConfigurer;
import org.springframework.statemachine.config.builders.StateMachineTransitionConfigurer;

import com.aksi.domain.order.statemachine.stage2.actions.CompleteStage2Action;
import com.aksi.domain.order.statemachine.stage2.actions.InitializeStage2Action;
import com.aksi.domain.order.statemachine.stage2.actions.ReturnToManagerAction;
import com.aksi.domain.order.statemachine.stage2.actions.StartEditWizardAction;
import com.aksi.domain.order.statemachine.stage2.actions.StartNewWizardAction;
import com.aksi.domain.order.statemachine.stage2.enums.Stage2Event;
import com.aksi.domain.order.statemachine.stage2.enums.Stage2State;
import com.aksi.domain.order.statemachine.stage2.guards.ManagerValidGuard;
import com.aksi.domain.order.statemachine.stage2.guards.ReadyToProceedGuard;

/**
 * Конфігурація Spring State Machine для Stage2 - головного екрану менеджера предметів.
 * Налаштовує всі стани, переходи, дії та умови для роботи з менеджером предметів.
 */
@Configuration
@EnableStateMachine(name = "stage2StateMachine")
public class Stage2StateMachineConfig extends EnumStateMachineConfigurerAdapter<Stage2State, Stage2Event> {

    private final InitializeStage2Action initializeAction;
    private final StartNewWizardAction startNewWizardAction;
    private final StartEditWizardAction startEditWizardAction;
    private final ReturnToManagerAction returnToManagerAction;
    private final CompleteStage2Action completeAction;
    private final ManagerValidGuard managerValidGuard;
    private final ReadyToProceedGuard readyToProceedGuard;

    public Stage2StateMachineConfig(
            final InitializeStage2Action initializeAction,
            final StartNewWizardAction startNewWizardAction,
            final StartEditWizardAction startEditWizardAction,
            final ReturnToManagerAction returnToManagerAction,
            final CompleteStage2Action completeAction,
            final ManagerValidGuard managerValidGuard,
            final ReadyToProceedGuard readyToProceedGuard) {
        this.initializeAction = initializeAction;
        this.startNewWizardAction = startNewWizardAction;
        this.startEditWizardAction = startEditWizardAction;
        this.returnToManagerAction = returnToManagerAction;
        this.completeAction = completeAction;
        this.managerValidGuard = managerValidGuard;
        this.readyToProceedGuard = readyToProceedGuard;
    }

    @Override
    public void configure(final StateMachineConfigurationConfigurer<Stage2State, Stage2Event> config)
            throws Exception {
        config
            .withConfiguration()
                .autoStartup(false);
    }

    @Override
    public void configure(final StateMachineStateConfigurer<Stage2State, Stage2Event> states)
            throws Exception {
        states
            .withStates()
                .initial(Stage2State.NOT_STARTED)
                .states(EnumSet.allOf(Stage2State.class))
                .end(Stage2State.COMPLETED)
                .end(Stage2State.ERROR);
    }

    @Override
    public void configure(final StateMachineTransitionConfigurer<Stage2State, Stage2Event> transitions)
            throws Exception {
        transitions
            // Ініціалізація етапу
            .withExternal()
                .source(Stage2State.NOT_STARTED)
                .target(Stage2State.INITIALIZING)
                .event(Stage2Event.START_STAGE)
                .action(initializeAction)
                .and()

            // Завершення ініціалізації
            .withExternal()
                .source(Stage2State.INITIALIZING)
                .target(Stage2State.ITEMS_MANAGER_SCREEN)
                .event(Stage2Event.INITIALIZATION_COMPLETED)
                .guard(managerValidGuard)
                .and()

            // Запуск нового підвізарда
            .withExternal()
                .source(Stage2State.ITEMS_MANAGER_SCREEN)
                .target(Stage2State.ITEM_WIZARD_ACTIVE)
                .event(Stage2Event.START_NEW_ITEM_WIZARD)
                .action(startNewWizardAction)
                .guard(managerValidGuard)
                .and()

            // Запуск підвізарда редагування
            .withExternal()
                .source(Stage2State.ITEMS_MANAGER_SCREEN)
                .target(Stage2State.ITEM_WIZARD_ACTIVE)
                .event(Stage2Event.START_EDIT_ITEM_WIZARD)
                .action(startEditWizardAction)
                .guard(managerValidGuard)
                .and()

            // Завершення роботи з підвізардом
            .withExternal()
                .source(Stage2State.ITEM_WIZARD_ACTIVE)
                .target(Stage2State.ITEMS_MANAGER_SCREEN)
                .event(Stage2Event.ITEM_WIZARD_COMPLETED)
                .action(returnToManagerAction)
                .and()

            // Повернення до менеджера з підвізарда
            .withExternal()
                .source(Stage2State.ITEM_WIZARD_ACTIVE)
                .target(Stage2State.ITEMS_MANAGER_SCREEN)
                .event(Stage2Event.RETURN_TO_MANAGER_SCREEN)
                .action(returnToManagerAction)
                .and()

            // Видалення предмета
            .withInternal()
                .source(Stage2State.ITEMS_MANAGER_SCREEN)
                .event(Stage2Event.DELETE_ITEM)
                .guard(managerValidGuard)
                .and()

            // Перевірка готовності до переходу
            .withExternal()
                .source(Stage2State.ITEMS_MANAGER_SCREEN)
                .target(Stage2State.READY_TO_PROCEED)
                .event(Stage2Event.CHECK_READY_TO_PROCEED)
                .guard(readyToProceedGuard)
                .and()

            // Завершення етапу
            .withExternal()
                .source(Stage2State.READY_TO_PROCEED)
                .target(Stage2State.COMPLETED)
                .event(Stage2Event.PROCEED_TO_NEXT_STAGE)
                .action(completeAction)
                .and()

            // Повернення до менеджера з готового стану
            .withExternal()
                .source(Stage2State.READY_TO_PROCEED)
                .target(Stage2State.ITEMS_MANAGER_SCREEN)
                .event(Stage2Event.RETURN_TO_MANAGER_SCREEN)
                .and()

            // Скидання етапу
            .withExternal()
                .source(Stage2State.ITEMS_MANAGER_SCREEN)
                .target(Stage2State.NOT_STARTED)
                .event(Stage2Event.RESET_STAGE)
                .and()

            .withExternal()
                .source(Stage2State.READY_TO_PROCEED)
                .target(Stage2State.NOT_STARTED)
                .event(Stage2Event.RESET_STAGE)
                .and()

            // Обробка системних помилок з будь-якого стану
            .withExternal()
                .source(Stage2State.NOT_STARTED)
                .target(Stage2State.ERROR)
                .event(Stage2Event.SYSTEM_ERROR)
                .and()

            .withExternal()
                .source(Stage2State.INITIALIZING)
                .target(Stage2State.ERROR)
                .event(Stage2Event.SYSTEM_ERROR)
                .and()

            .withExternal()
                .source(Stage2State.ITEMS_MANAGER_SCREEN)
                .target(Stage2State.ERROR)
                .event(Stage2Event.SYSTEM_ERROR)
                .and()

            .withExternal()
                .source(Stage2State.ITEM_WIZARD_ACTIVE)
                .target(Stage2State.ERROR)
                .event(Stage2Event.SYSTEM_ERROR)
                .and()

            .withExternal()
                .source(Stage2State.READY_TO_PROCEED)
                .target(Stage2State.ERROR)
                .event(Stage2Event.SYSTEM_ERROR);
    }
}
