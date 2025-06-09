package com.aksi.domain.order.statemachine.stage1.config;

import java.util.EnumSet;

import org.springframework.context.annotation.Configuration;
import org.springframework.statemachine.config.EnableStateMachine;
import org.springframework.statemachine.config.EnumStateMachineConfigurerAdapter;
import org.springframework.statemachine.config.builders.StateMachineConfigurationConfigurer;
import org.springframework.statemachine.config.builders.StateMachineStateConfigurer;
import org.springframework.statemachine.config.builders.StateMachineTransitionConfigurer;

import com.aksi.domain.order.statemachine.stage1.actions.NewClientFormInitializeAction;
import com.aksi.domain.order.statemachine.stage1.actions.NewClientFormSaveAction;
import com.aksi.domain.order.statemachine.stage1.enums.NewClientFormEvent;
import com.aksi.domain.order.statemachine.stage1.enums.NewClientFormState;
import com.aksi.domain.order.statemachine.stage1.guards.NewClientFormCompleteGuard;
import com.aksi.domain.order.statemachine.stage1.guards.NewClientFormValidGuard;

/**
 * Конфігурація Spring State Machine для форми нового клієнта.
 * Визначає стани, переходи та дії для процесу створення клієнта.
 */
@Configuration
@EnableStateMachine(name = "newClientFormStateMachine")
public class NewClientFormStateMachineConfig
        extends EnumStateMachineConfigurerAdapter<NewClientFormState, NewClientFormEvent> {

    private final NewClientFormInitializeAction initializeAction;
    private final NewClientFormSaveAction saveAction;
    private final NewClientFormValidGuard validGuard;
    private final NewClientFormCompleteGuard completeGuard;

    public NewClientFormStateMachineConfig(
            NewClientFormInitializeAction initializeAction,
            NewClientFormSaveAction saveAction,
            NewClientFormValidGuard validGuard,
            NewClientFormCompleteGuard completeGuard) {
        this.initializeAction = initializeAction;
        this.saveAction = saveAction;
        this.validGuard = validGuard;
        this.completeGuard = completeGuard;
    }

    @Override
    public void configure(StateMachineConfigurationConfigurer<NewClientFormState, NewClientFormEvent> config)
            throws Exception {
        config
            .withConfiguration()
                .autoStartup(true);
    }

    @Override
    public void configure(StateMachineStateConfigurer<NewClientFormState, NewClientFormEvent> states)
            throws Exception {
        states
            .withStates()
                .initial(NewClientFormState.INIT)
                .states(EnumSet.allOf(NewClientFormState.class))
                .end(NewClientFormState.COMPLETED)
                .end(NewClientFormState.CANCELLED);
    }

    @Override
    public void configure(StateMachineTransitionConfigurer<NewClientFormState, NewClientFormEvent> transitions)
            throws Exception {
        transitions
            // Ініціалізація
            .withExternal()
                .source(NewClientFormState.INIT)
                .target(NewClientFormState.FILLING_BASIC_INFO)
                .event(NewClientFormEvent.START_FILLING)
                .action(initializeAction)
            .and()

            // Заповнення базової інформації
            .withInternal()
                .source(NewClientFormState.FILLING_BASIC_INFO)
                .event(NewClientFormEvent.UPDATE_BASIC_INFO)
            .and()

            .withExternal()
                .source(NewClientFormState.FILLING_BASIC_INFO)
                .target(NewClientFormState.FILLING_CONTACT_INFO)
                .event(NewClientFormEvent.COMPLETE_BASIC_INFO)
            .and()

            // Заповнення контактної інформації
            .withInternal()
                .source(NewClientFormState.FILLING_CONTACT_INFO)
                .event(NewClientFormEvent.UPDATE_CONTACT_INFO)
            .and()

            .withExternal()
                .source(NewClientFormState.FILLING_CONTACT_INFO)
                .target(NewClientFormState.VALIDATING)
                .event(NewClientFormEvent.COMPLETE_CONTACT_INFO)
            .and()

            // Валідація
            .withExternal()
                .source(NewClientFormState.VALIDATING)
                .target(NewClientFormState.CHECKING_DUPLICATES)
                .event(NewClientFormEvent.VALIDATION_SUCCESS)
                .guard(validGuard)
            .and()

            .withExternal()
                .source(NewClientFormState.VALIDATING)
                .target(NewClientFormState.FILLING_BASIC_INFO)
                .event(NewClientFormEvent.VALIDATION_FAILED)
            .and()

            // Перевірка дублікатів
            .withExternal()
                .source(NewClientFormState.CHECKING_DUPLICATES)
                .target(NewClientFormState.SAVING)
                .event(NewClientFormEvent.NO_DUPLICATES_FOUND)
                .guard(completeGuard)
            .and()

            .withExternal()
                .source(NewClientFormState.CHECKING_DUPLICATES)
                .target(NewClientFormState.DUPLICATES_FOUND)
                .event(NewClientFormEvent.DUPLICATES_FOUND)
            .and()

            // Обробка дублікатів
            .withExternal()
                .source(NewClientFormState.DUPLICATES_FOUND)
                .target(NewClientFormState.SAVING)
                .event(NewClientFormEvent.PROCEED_WITH_DUPLICATES)
                .guard(completeGuard)
            .and()

            .withExternal()
                .source(NewClientFormState.DUPLICATES_FOUND)
                .target(NewClientFormState.CANCELLED)
                .event(NewClientFormEvent.CANCEL_DUE_TO_DUPLICATES)
            .and()

            // Збереження
            .withExternal()
                .source(NewClientFormState.SAVING)
                .target(NewClientFormState.COMPLETED)
                .event(NewClientFormEvent.CLIENT_SAVED)
                .action(saveAction)
            .and()

            .withExternal()
                .source(NewClientFormState.SAVING)
                .target(NewClientFormState.ERROR)
                .event(NewClientFormEvent.SAVE_ERROR)
            .and()

            // Глобальні переходи
            .withExternal()
                .source(NewClientFormState.FILLING_BASIC_INFO)
                .target(NewClientFormState.CANCELLED)
                .event(NewClientFormEvent.CANCEL)
            .and()

            .withExternal()
                .source(NewClientFormState.FILLING_CONTACT_INFO)
                .target(NewClientFormState.CANCELLED)
                .event(NewClientFormEvent.CANCEL)
            .and()

            .withExternal()
                .source(NewClientFormState.ERROR)
                .target(NewClientFormState.INIT)
                .event(NewClientFormEvent.RESET);
    }
}
