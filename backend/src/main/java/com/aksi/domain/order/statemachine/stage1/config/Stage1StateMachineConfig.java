package com.aksi.domain.order.statemachine.stage1.config;

import java.util.EnumSet;

import org.springframework.context.annotation.Configuration;
import org.springframework.statemachine.config.EnableStateMachine;
import org.springframework.statemachine.config.EnumStateMachineConfigurerAdapter;
import org.springframework.statemachine.config.builders.StateMachineStateConfigurer;
import org.springframework.statemachine.config.builders.StateMachineTransitionConfigurer;

import com.aksi.domain.order.statemachine.stage1.actions.ClientSelectedAction;
import com.aksi.domain.order.statemachine.stage1.actions.CompleteStage1Action;
import com.aksi.domain.order.statemachine.stage1.actions.InitializeStage1Action;
import com.aksi.domain.order.statemachine.stage1.enums.Stage1Event;
import com.aksi.domain.order.statemachine.stage1.enums.Stage1State;
import com.aksi.domain.order.statemachine.stage1.guards.ClientSelectedGuard;

/**
 * Конфігурація Spring State Machine для Stage1.
 */
@Configuration
@EnableStateMachine(name = "stage1StateMachine")
public class Stage1StateMachineConfig extends EnumStateMachineConfigurerAdapter<Stage1State, Stage1Event> {

    private final InitializeStage1Action initializeStage1Action;
    private final ClientSelectedAction clientSelectedAction;
    private final CompleteStage1Action completeStage1Action;
    private final ClientSelectedGuard clientSelectedGuard;

    public Stage1StateMachineConfig(
            InitializeStage1Action initializeStage1Action,
            ClientSelectedAction clientSelectedAction,
            CompleteStage1Action completeStage1Action,
            ClientSelectedGuard clientSelectedGuard) {
        this.initializeStage1Action = initializeStage1Action;
        this.clientSelectedAction = clientSelectedAction;
        this.completeStage1Action = completeStage1Action;
        this.clientSelectedGuard = clientSelectedGuard;
    }

    @Override
    public void configure(StateMachineStateConfigurer<Stage1State, Stage1Event> states) throws Exception {
        states
            .withStates()
                .initial(Stage1State.INIT)
                .states(EnumSet.allOf(Stage1State.class))
                .end(Stage1State.COMPLETED);
    }

    @Override
    public void configure(StateMachineTransitionConfigurer<Stage1State, Stage1Event> transitions) throws Exception {
        transitions
            // INIT -> CLIENT_SELECTION (при START_CLIENT_SELECTION)
            .withExternal()
                .source(Stage1State.INIT)
                .target(Stage1State.CLIENT_SELECTION)
                .event(Stage1Event.START_CLIENT_SELECTION)
                .action(initializeStage1Action)

            .and()

            // CLIENT_SELECTION -> CLIENT_SELECTION (при CLIENT_SELECTED з guard)
            .withInternal()
                .source(Stage1State.CLIENT_SELECTION)
                .event(Stage1Event.CLIENT_SELECTED)
                .guard(clientSelectedGuard)
                .action(clientSelectedAction)

            .and()

            // CLIENT_SELECTION -> COMPLETED (при COMPLETE_CLIENT_SELECTION з guard)
            .withExternal()
                .source(Stage1State.CLIENT_SELECTION)
                .target(Stage1State.COMPLETED)
                .event(Stage1Event.COMPLETE_CLIENT_SELECTION)
                .guard(clientSelectedGuard)
                .action(completeStage1Action);
    }
}
