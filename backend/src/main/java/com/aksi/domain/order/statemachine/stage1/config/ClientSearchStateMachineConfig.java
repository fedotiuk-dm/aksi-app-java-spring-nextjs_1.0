package com.aksi.domain.order.statemachine.stage1.config;

import java.util.EnumSet;

import org.springframework.context.annotation.Configuration;
import org.springframework.statemachine.config.EnableStateMachine;
import org.springframework.statemachine.config.EnumStateMachineConfigurerAdapter;
import org.springframework.statemachine.config.builders.StateMachineStateConfigurer;
import org.springframework.statemachine.config.builders.StateMachineTransitionConfigurer;

import com.aksi.domain.order.statemachine.stage1.actions.ClientSearchExecuteAction;
import com.aksi.domain.order.statemachine.stage1.actions.ClientSearchInitializeAction;
import com.aksi.domain.order.statemachine.stage1.actions.ClientSearchSelectAction;
import com.aksi.domain.order.statemachine.stage1.enums.ClientSearchEvent;
import com.aksi.domain.order.statemachine.stage1.enums.ClientSearchState;
import com.aksi.domain.order.statemachine.stage1.guards.ClientSearchCompleteGuard;
import com.aksi.domain.order.statemachine.stage1.guards.ClientSearchValidGuard;

/**
 * Конфігурація State Machine для пошуку клієнта (Stage 1.1).
 */
@Configuration
@EnableStateMachine
public class ClientSearchStateMachineConfig extends EnumStateMachineConfigurerAdapter<ClientSearchState, ClientSearchEvent> {

    private final ClientSearchInitializeAction initializeAction;
    private final ClientSearchExecuteAction executeAction;
    private final ClientSearchSelectAction selectAction;
    private final ClientSearchValidGuard validGuard;
    private final ClientSearchCompleteGuard completeGuard;

    public ClientSearchStateMachineConfig(
            ClientSearchInitializeAction initializeAction,
            ClientSearchExecuteAction executeAction,
            ClientSearchSelectAction selectAction,
            ClientSearchValidGuard validGuard,
            ClientSearchCompleteGuard completeGuard) {
        this.initializeAction = initializeAction;
        this.executeAction = executeAction;
        this.selectAction = selectAction;
        this.validGuard = validGuard;
        this.completeGuard = completeGuard;
    }

    @Override
    public void configure(StateMachineStateConfigurer<ClientSearchState, ClientSearchEvent> states) throws Exception {
        states
            .withStates()
                .initial(ClientSearchState.READY_TO_SEARCH)
                .states(EnumSet.allOf(ClientSearchState.class))
                .end(ClientSearchState.CLIENT_SELECTED)
                .end(ClientSearchState.CANCELLED);
    }

    @Override
    public void configure(StateMachineTransitionConfigurer<ClientSearchState, ClientSearchEvent> transitions) throws Exception {
        transitions
            // Ініціалізація
            .withExternal()
                .source(ClientSearchState.READY_TO_SEARCH)
                .target(ClientSearchState.READY_TO_SEARCH)
                .event(ClientSearchEvent.START_SEARCH)
                .action(initializeAction)
            .and()

            // Пошук за телефоном
            .withExternal()
                .source(ClientSearchState.READY_TO_SEARCH)
                .target(ClientSearchState.SEARCHING)
                .event(ClientSearchEvent.SEARCH_BY_PHONE)
                .guard(validGuard)
                .action(executeAction)
            .and()

            // Пошук за іменем
            .withExternal()
                .source(ClientSearchState.READY_TO_SEARCH)
                .target(ClientSearchState.SEARCHING)
                .event(ClientSearchEvent.SEARCH_BY_NAME)
                .guard(validGuard)
                .action(executeAction)
            .and()

            // Загальний пошук
            .withExternal()
                .source(ClientSearchState.READY_TO_SEARCH)
                .target(ClientSearchState.SEARCHING)
                .event(ClientSearchEvent.GENERAL_SEARCH)
                .guard(validGuard)
                .action(executeAction)
            .and()

            // Результати знайдені
            .withExternal()
                .source(ClientSearchState.SEARCHING)
                .target(ClientSearchState.RESULTS_FOUND)
                .event(ClientSearchEvent.RESULTS_FOUND)
            .and()

            // Результати не знайдені
            .withExternal()
                .source(ClientSearchState.SEARCHING)
                .target(ClientSearchState.NO_RESULTS)
                .event(ClientSearchEvent.NO_RESULTS_FOUND)
            .and()

            // Помилка пошуку
            .withExternal()
                .source(ClientSearchState.SEARCHING)
                .target(ClientSearchState.SEARCH_ERROR)
                .event(ClientSearchEvent.SEARCH_ERROR)
            .and()

            // Вибір клієнта
            .withExternal()
                .source(ClientSearchState.RESULTS_FOUND)
                .target(ClientSearchState.CLIENT_SELECTED)
                .event(ClientSearchEvent.CLIENT_SELECTED)
                .guard(completeGuard)
                .action(selectAction)
            .and()

            // Повернення до пошуку з результатів
            .withExternal()
                .source(ClientSearchState.RESULTS_FOUND)
                .target(ClientSearchState.READY_TO_SEARCH)
                .event(ClientSearchEvent.BACK_TO_SEARCH)
            .and()

            // Повернення до пошуку з "немає результатів"
            .withExternal()
                .source(ClientSearchState.NO_RESULTS)
                .target(ClientSearchState.READY_TO_SEARCH)
                .event(ClientSearchEvent.BACK_TO_SEARCH)
            .and()

            // Повернення до пошуку з помилки
            .withExternal()
                .source(ClientSearchState.SEARCH_ERROR)
                .target(ClientSearchState.READY_TO_SEARCH)
                .event(ClientSearchEvent.BACK_TO_SEARCH)
            .and()

            // Скасування
            .withExternal()
                .source(ClientSearchState.READY_TO_SEARCH)
                .target(ClientSearchState.CANCELLED)
                .event(ClientSearchEvent.CANCEL_SEARCH)
            .and()
            .withExternal()
                .source(ClientSearchState.RESULTS_FOUND)
                .target(ClientSearchState.CANCELLED)
                .event(ClientSearchEvent.CANCEL_SEARCH)
            .and()
            .withExternal()
                .source(ClientSearchState.NO_RESULTS)
                .target(ClientSearchState.CANCELLED)
                .event(ClientSearchEvent.CANCEL_SEARCH);
    }
}
