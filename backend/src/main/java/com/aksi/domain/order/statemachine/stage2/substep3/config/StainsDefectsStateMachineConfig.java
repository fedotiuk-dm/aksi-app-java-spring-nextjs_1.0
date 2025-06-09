package com.aksi.domain.order.statemachine.stage2.substep3.config;

import java.util.EnumSet;

import org.springframework.context.annotation.Configuration;
import org.springframework.statemachine.config.EnableStateMachine;
import org.springframework.statemachine.config.StateMachineConfigurerAdapter;
import org.springframework.statemachine.config.builders.StateMachineStateConfigurer;
import org.springframework.statemachine.config.builders.StateMachineTransitionConfigurer;

import com.aksi.domain.order.statemachine.stage2.substep3.actions.CompleteStainsDefectsAction;
import com.aksi.domain.order.statemachine.stage2.substep3.actions.DefectsSelectedAction;
import com.aksi.domain.order.statemachine.stage2.substep3.actions.InitializeStainsDefectsAction;
import com.aksi.domain.order.statemachine.stage2.substep3.actions.NotesEnteredAction;
import com.aksi.domain.order.statemachine.stage2.substep3.actions.StainsSelectedAction;
import com.aksi.domain.order.statemachine.stage2.substep3.enums.StainsDefectsEvent;
import com.aksi.domain.order.statemachine.stage2.substep3.enums.StainsDefectsState;
import com.aksi.domain.order.statemachine.stage2.substep3.guards.DataValidGuard;
import com.aksi.domain.order.statemachine.stage2.substep3.guards.DefectsSelectedGuard;
import com.aksi.domain.order.statemachine.stage2.substep3.guards.StainsDefectsCompleteGuard;
import com.aksi.domain.order.statemachine.stage2.substep3.guards.StainsSelectedGuard;

/**
 * Конфігурація Spring State Machine для підетапу 2.3 "Забруднення, дефекти та ризики".
 * Фінальна інтеграція всіх компонентів (згідно архітектурних правил).
 * ЗАБОРОНЕНО: Services, Validators, DTO, Mappers, Adapters.
 */
@Configuration
@EnableStateMachine(name = "stainsDefectsStateMachine")
public class StainsDefectsStateMachineConfig
        extends StateMachineConfigurerAdapter<StainsDefectsState, StainsDefectsEvent> {

    private final InitializeStainsDefectsAction initializeAction;
    private final StainsSelectedAction stainsSelectedAction;
    private final DefectsSelectedAction defectsSelectedAction;
    private final NotesEnteredAction notesEnteredAction;
    private final CompleteStainsDefectsAction completeAction;

    private final StainsSelectedGuard stainsSelectedGuard;
    private final DefectsSelectedGuard defectsSelectedGuard;
    private final DataValidGuard dataValidGuard;
    private final StainsDefectsCompleteGuard completeGuard;

    public StainsDefectsStateMachineConfig(
            final InitializeStainsDefectsAction initializeAction,
            final StainsSelectedAction stainsSelectedAction,
            final DefectsSelectedAction defectsSelectedAction,
            final NotesEnteredAction notesEnteredAction,
            final CompleteStainsDefectsAction completeAction,
            final StainsSelectedGuard stainsSelectedGuard,
            final DefectsSelectedGuard defectsSelectedGuard,
            final DataValidGuard dataValidGuard,
            final StainsDefectsCompleteGuard completeGuard) {

        this.initializeAction = initializeAction;
        this.stainsSelectedAction = stainsSelectedAction;
        this.defectsSelectedAction = defectsSelectedAction;
        this.notesEnteredAction = notesEnteredAction;
        this.completeAction = completeAction;
        this.stainsSelectedGuard = stainsSelectedGuard;
        this.defectsSelectedGuard = defectsSelectedGuard;
        this.dataValidGuard = dataValidGuard;
        this.completeGuard = completeGuard;
    }

    @Override
    public void configure(final StateMachineStateConfigurer<StainsDefectsState, StainsDefectsEvent> states)
            throws Exception {
        states
                .withStates()
                .initial(StainsDefectsState.NOT_STARTED)
                .states(EnumSet.allOf(StainsDefectsState.class))
                .end(StainsDefectsState.COMPLETED)
                .end(StainsDefectsState.ERROR);
    }

    @Override
    public void configure(final StateMachineTransitionConfigurer<StainsDefectsState, StainsDefectsEvent> transitions)
            throws Exception {
        transitions
                // Ініціалізація підетапу
                .withExternal()
                .source(StainsDefectsState.NOT_STARTED)
                .target(StainsDefectsState.SELECTING_STAINS)
                .event(StainsDefectsEvent.START_SUBSTEP)
                .action(initializeAction)

                // Вибір плям
                .and()
                .withExternal()
                .source(StainsDefectsState.SELECTING_STAINS)
                .target(StainsDefectsState.SELECTING_DEFECTS)
                .event(StainsDefectsEvent.STAINS_SELECTED)
                .guard(stainsSelectedGuard)
                .action(stainsSelectedAction)

                // Вибір дефектів
                .and()
                .withExternal()
                .source(StainsDefectsState.SELECTING_DEFECTS)
                .target(StainsDefectsState.ENTERING_NOTES)
                .event(StainsDefectsEvent.DEFECTS_SELECTED)
                .guard(defectsSelectedGuard)
                .action(defectsSelectedAction)

                // Введення приміток
                .and()
                .withExternal()
                .source(StainsDefectsState.ENTERING_NOTES)
                .target(StainsDefectsState.VALIDATING_DATA)
                .event(StainsDefectsEvent.NOTES_ENTERED)
                .action(notesEnteredAction)

                // Валідація даних
                .and()
                .withExternal()
                .source(StainsDefectsState.VALIDATING_DATA)
                .target(StainsDefectsState.COMPLETED)
                .event(StainsDefectsEvent.DATA_VALID)
                .guard(dataValidGuard)

                // Завершення підетапу
                .and()
                .withExternal()
                .source(StainsDefectsState.VALIDATING_DATA)
                .target(StainsDefectsState.COMPLETED)
                .event(StainsDefectsEvent.COMPLETE_SUBSTEP)
                .guard(completeGuard)
                .action(completeAction)

                // Можливість повернення назад (GO_BACK)
                .and()
                .withExternal()
                .source(StainsDefectsState.SELECTING_DEFECTS)
                .target(StainsDefectsState.SELECTING_STAINS)
                .event(StainsDefectsEvent.GO_BACK)

                .and()
                .withExternal()
                .source(StainsDefectsState.ENTERING_NOTES)
                .target(StainsDefectsState.SELECTING_DEFECTS)
                .event(StainsDefectsEvent.GO_BACK)

                .and()
                .withExternal()
                .source(StainsDefectsState.VALIDATING_DATA)
                .target(StainsDefectsState.ENTERING_NOTES)
                .event(StainsDefectsEvent.GO_BACK)

                // Скидання підетапу
                .and()
                .withExternal()
                .source(StainsDefectsState.SELECTING_STAINS)
                .target(StainsDefectsState.NOT_STARTED)
                .event(StainsDefectsEvent.RESET_SUBSTEP)

                .and()
                .withExternal()
                .source(StainsDefectsState.SELECTING_DEFECTS)
                .target(StainsDefectsState.NOT_STARTED)
                .event(StainsDefectsEvent.RESET_SUBSTEP)

                .and()
                .withExternal()
                .source(StainsDefectsState.ENTERING_NOTES)
                .target(StainsDefectsState.NOT_STARTED)
                .event(StainsDefectsEvent.RESET_SUBSTEP)

                .and()
                .withExternal()
                .source(StainsDefectsState.VALIDATING_DATA)
                .target(StainsDefectsState.NOT_STARTED)
                .event(StainsDefectsEvent.RESET_SUBSTEP)

                                // Обробка помилок валідації
                .and()
                .withExternal()
                .source(StainsDefectsState.VALIDATING_DATA)
                .target(StainsDefectsState.ERROR)
                .event(StainsDefectsEvent.VALIDATION_ERROR)

                // Повторна спроба після помилки через скидання
                .and()
                .withExternal()
                .source(StainsDefectsState.ERROR)
                .target(StainsDefectsState.NOT_STARTED)
                .event(StainsDefectsEvent.RESET_SUBSTEP)

                // Додатковий перехід для валідації даних
                .and()
                .withExternal()
                .source(StainsDefectsState.ENTERING_NOTES)
                .target(StainsDefectsState.VALIDATING_DATA)
                .event(StainsDefectsEvent.VALIDATE_DATA);
    }
}
