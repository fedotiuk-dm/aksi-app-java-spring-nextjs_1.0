package com.aksi.domain.order.statemachine.stage1.config;

import java.util.EnumSet;

import org.springframework.context.annotation.Configuration;
import org.springframework.statemachine.config.EnableStateMachine;
import org.springframework.statemachine.config.EnumStateMachineConfigurerAdapter;
import org.springframework.statemachine.config.builders.StateMachineConfigurationConfigurer;
import org.springframework.statemachine.config.builders.StateMachineStateConfigurer;
import org.springframework.statemachine.config.builders.StateMachineTransitionConfigurer;

import com.aksi.domain.order.statemachine.stage1.actions.BasicOrderInfoCompleteAction;
import com.aksi.domain.order.statemachine.stage1.actions.BasicOrderInfoInitializeAction;
import com.aksi.domain.order.statemachine.stage1.enums.BasicOrderInfoEvent;
import com.aksi.domain.order.statemachine.stage1.enums.BasicOrderInfoState;
import com.aksi.domain.order.statemachine.stage1.guards.BasicOrderInfoReadyGuard;
import com.aksi.domain.order.statemachine.stage1.guards.BasicOrderInfoValidGuard;

/**
 * Конфігурація Spring State Machine для базової інформації замовлення.
 * Визначає стани, переходи та дії для процесу обробки базової інформації.
 */
@Configuration
@EnableStateMachine(name = "basicOrderInfoStateMachine")
public class BasicOrderInfoStateMachineConfig
        extends EnumStateMachineConfigurerAdapter<BasicOrderInfoState, BasicOrderInfoEvent> {

    private final BasicOrderInfoInitializeAction initializeAction;
    private final BasicOrderInfoCompleteAction completeAction;
    private final BasicOrderInfoValidGuard validGuard;
    private final BasicOrderInfoReadyGuard readyGuard;

    public BasicOrderInfoStateMachineConfig(
            BasicOrderInfoInitializeAction initializeAction,
            BasicOrderInfoCompleteAction completeAction,
            BasicOrderInfoValidGuard validGuard,
            BasicOrderInfoReadyGuard readyGuard) {
        this.initializeAction = initializeAction;
        this.completeAction = completeAction;
        this.validGuard = validGuard;
        this.readyGuard = readyGuard;
    }

    @Override
    public void configure(StateMachineConfigurationConfigurer<BasicOrderInfoState, BasicOrderInfoEvent> config)
            throws Exception {
        config
            .withConfiguration()
                .autoStartup(true);
    }

    @Override
    public void configure(StateMachineStateConfigurer<BasicOrderInfoState, BasicOrderInfoEvent> states)
            throws Exception {
        states
            .withStates()
                .initial(BasicOrderInfoState.INIT)
                .states(EnumSet.allOf(BasicOrderInfoState.class))
                .end(BasicOrderInfoState.COMPLETED)
                .end(BasicOrderInfoState.ERROR);
    }

    @Override
    public void configure(StateMachineTransitionConfigurer<BasicOrderInfoState, BasicOrderInfoEvent> transitions)
            throws Exception {
        transitions
                        // Ініціалізація
            .withExternal()
                .source(BasicOrderInfoState.INIT)
                .target(BasicOrderInfoState.GENERATING_RECEIPT_NUMBER)
                .event(BasicOrderInfoEvent.START_BASIC_INFO_PROCESS)
                .action(initializeAction)
            .and()

            // Генерація номера квитанції
            .withExternal()
                .source(BasicOrderInfoState.GENERATING_RECEIPT_NUMBER)
                .target(BasicOrderInfoState.RECEIPT_NUMBER_GENERATED)
                .event(BasicOrderInfoEvent.RECEIPT_NUMBER_GENERATED_SUCCESS)
            .and()

            .withExternal()
                .source(BasicOrderInfoState.GENERATING_RECEIPT_NUMBER)
                .target(BasicOrderInfoState.ERROR)
                .event(BasicOrderInfoEvent.RECEIPT_NUMBER_GENERATION_FAILED)
            .and()

            // Введення унікальної мітки
            .withExternal()
                .source(BasicOrderInfoState.RECEIPT_NUMBER_GENERATED)
                .target(BasicOrderInfoState.ENTERING_UNIQUE_TAG)
                .event(BasicOrderInfoEvent.ENTER_UNIQUE_TAG)
            .and()

            .withExternal()
                .source(BasicOrderInfoState.ENTERING_UNIQUE_TAG)
                .target(BasicOrderInfoState.UNIQUE_TAG_ENTERED)
                .event(BasicOrderInfoEvent.UNIQUE_TAG_VALIDATED)
                .guard(validGuard)
            .and()

            .withExternal()
                .source(BasicOrderInfoState.ENTERING_UNIQUE_TAG)
                .target(BasicOrderInfoState.ERROR)
                .event(BasicOrderInfoEvent.UNIQUE_TAG_INVALID)
            .and()

            // Вибір філії
            .withExternal()
                .source(BasicOrderInfoState.UNIQUE_TAG_ENTERED)
                .target(BasicOrderInfoState.SELECTING_BRANCH)
                .event(BasicOrderInfoEvent.SELECT_BRANCH)
            .and()

            .withExternal()
                .source(BasicOrderInfoState.RECEIPT_NUMBER_GENERATED)
                .target(BasicOrderInfoState.SELECTING_BRANCH)
                .event(BasicOrderInfoEvent.SELECT_BRANCH)
            .and()

            .withExternal()
                .source(BasicOrderInfoState.SELECTING_BRANCH)
                .target(BasicOrderInfoState.BRANCH_SELECTED)
                .event(BasicOrderInfoEvent.BRANCH_SELECTED)
                .guard(validGuard)
            .and()

            // Встановлення дати створення
            .withExternal()
                .source(BasicOrderInfoState.BRANCH_SELECTED)
                .target(BasicOrderInfoState.SETTING_CREATION_DATE)
                .event(BasicOrderInfoEvent.SET_CREATION_DATE)
            .and()

            .withExternal()
                .source(BasicOrderInfoState.UNIQUE_TAG_ENTERED)
                .target(BasicOrderInfoState.SETTING_CREATION_DATE)
                .event(BasicOrderInfoEvent.SET_CREATION_DATE)
            .and()

            .withExternal()
                .source(BasicOrderInfoState.SETTING_CREATION_DATE)
                .target(BasicOrderInfoState.CREATION_DATE_SET)
                .event(BasicOrderInfoEvent.CREATION_DATE_SET)
                .guard(validGuard)
            .and()

            // Завершення процесу
            .withExternal()
                .source(BasicOrderInfoState.CREATION_DATE_SET)
                .target(BasicOrderInfoState.COMPLETED)
                .event(BasicOrderInfoEvent.COMPLETE_BASIC_INFO)
                .guard(readyGuard)
                .action(completeAction)
            .and()

            // Повернення до попередніх станів
            .withExternal()
                .source(BasicOrderInfoState.ENTERING_UNIQUE_TAG)
                .target(BasicOrderInfoState.RECEIPT_NUMBER_GENERATED)
                .event(BasicOrderInfoEvent.GO_BACK)
            .and()

            .withExternal()
                .source(BasicOrderInfoState.SELECTING_BRANCH)
                .target(BasicOrderInfoState.UNIQUE_TAG_ENTERED)
                .event(BasicOrderInfoEvent.GO_BACK)
            .and()

            .withExternal()
                .source(BasicOrderInfoState.SETTING_CREATION_DATE)
                .target(BasicOrderInfoState.BRANCH_SELECTED)
                .event(BasicOrderInfoEvent.GO_BACK)
            .and()

            // Глобальні переходи - скасування
            .withExternal()
                .source(BasicOrderInfoState.GENERATING_RECEIPT_NUMBER)
                .target(BasicOrderInfoState.ERROR)
                .event(BasicOrderInfoEvent.CANCEL)
            .and()

            .withExternal()
                .source(BasicOrderInfoState.ENTERING_UNIQUE_TAG)
                .target(BasicOrderInfoState.ERROR)
                .event(BasicOrderInfoEvent.CANCEL)
            .and()

            .withExternal()
                .source(BasicOrderInfoState.SELECTING_BRANCH)
                .target(BasicOrderInfoState.ERROR)
                .event(BasicOrderInfoEvent.CANCEL)
            .and()

            // Очищення та скидання
            .withExternal()
                .source(BasicOrderInfoState.ERROR)
                .target(BasicOrderInfoState.INIT)
                .event(BasicOrderInfoEvent.CLEAR_BASIC_INFO);
    }
}
