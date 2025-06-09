package com.aksi.domain.order.statemachine.stage2.substep2.config;

import java.util.EnumSet;

import org.springframework.context.annotation.Configuration;
import org.springframework.statemachine.config.EnableStateMachine;
import org.springframework.statemachine.config.StateMachineConfigurerAdapter;
import org.springframework.statemachine.config.builders.StateMachineStateConfigurer;
import org.springframework.statemachine.config.builders.StateMachineTransitionConfigurer;

import com.aksi.domain.order.statemachine.stage2.substep2.actions.CompleteSubstepAction;
import com.aksi.domain.order.statemachine.stage2.substep2.actions.InitializeCharacteristicsAction;
import com.aksi.domain.order.statemachine.stage2.substep2.actions.MaterialSelectedAction;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.ItemCharacteristicsEvent;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.ItemCharacteristicsState;
import com.aksi.domain.order.statemachine.stage2.substep2.guards.CharacteristicsDataValidGuard;
import com.aksi.domain.order.statemachine.stage2.substep2.guards.ColorSelectedGuard;
import com.aksi.domain.order.statemachine.stage2.substep2.guards.MaterialSelectedGuard;

/**
 * Конфігурація Spring State Machine для підетапу характеристик предмета
 */
@Configuration
@EnableStateMachine(name = "itemCharacteristicsStateMachine")
public class ItemCharacteristicsStateMachineConfig
        extends StateMachineConfigurerAdapter<ItemCharacteristicsState, ItemCharacteristicsEvent> {

    private final InitializeCharacteristicsAction initializeCharacteristicsAction;
    private final MaterialSelectedAction materialSelectedAction;
    private final CompleteSubstepAction completeSubstepAction;
    private final MaterialSelectedGuard materialSelectedGuard;
    private final ColorSelectedGuard colorSelectedGuard;
    private final CharacteristicsDataValidGuard characteristicsDataValidGuard;

    public ItemCharacteristicsStateMachineConfig(
            InitializeCharacteristicsAction initializeCharacteristicsAction,
            MaterialSelectedAction materialSelectedAction,
            CompleteSubstepAction completeSubstepAction,
            MaterialSelectedGuard materialSelectedGuard,
            ColorSelectedGuard colorSelectedGuard,
            CharacteristicsDataValidGuard characteristicsDataValidGuard) {
        this.initializeCharacteristicsAction = initializeCharacteristicsAction;
        this.materialSelectedAction = materialSelectedAction;
        this.completeSubstepAction = completeSubstepAction;
        this.materialSelectedGuard = materialSelectedGuard;
        this.colorSelectedGuard = colorSelectedGuard;
        this.characteristicsDataValidGuard = characteristicsDataValidGuard;
    }

    @Override
    public void configure(StateMachineStateConfigurer<ItemCharacteristicsState, ItemCharacteristicsEvent> states)
            throws Exception {
        states
            .withStates()
                .initial(ItemCharacteristicsState.NOT_STARTED)
                .states(EnumSet.allOf(ItemCharacteristicsState.class))
                .end(ItemCharacteristicsState.COMPLETED)
                .end(ItemCharacteristicsState.ERROR);
    }

    @Override
    public void configure(StateMachineTransitionConfigurer<ItemCharacteristicsState, ItemCharacteristicsEvent> transitions)
            throws Exception {
        transitions
            // Початок підетапу
            .withExternal()
                .source(ItemCharacteristicsState.NOT_STARTED)
                .target(ItemCharacteristicsState.SELECTING_MATERIAL)
                .event(ItemCharacteristicsEvent.START_SUBSTEP)
                .action(initializeCharacteristicsAction)
                .and()

            // Вибір матеріалу
            .withExternal()
                .source(ItemCharacteristicsState.SELECTING_MATERIAL)
                .target(ItemCharacteristicsState.SELECTING_COLOR)
                .event(ItemCharacteristicsEvent.MATERIAL_SELECTED)
                .action(materialSelectedAction)
                .guard(materialSelectedGuard)
                .and()

            // Вибір кольору
            .withExternal()
                .source(ItemCharacteristicsState.SELECTING_COLOR)
                .target(ItemCharacteristicsState.SELECTING_WEAR_DEGREE)
                .event(ItemCharacteristicsEvent.COLOR_SELECTED)
                .guard(colorSelectedGuard)
                .and()

            // Вибір кольору з переходом до наповнювача (якщо потрібно)
            .withExternal()
                .source(ItemCharacteristicsState.SELECTING_COLOR)
                .target(ItemCharacteristicsState.SELECTING_FILLER)
                .event(ItemCharacteristicsEvent.COLOR_SELECTED)
                .guard(colorSelectedGuard)
                .and()

            // Вибір наповнювача
            .withExternal()
                .source(ItemCharacteristicsState.SELECTING_FILLER)
                .target(ItemCharacteristicsState.SELECTING_WEAR_DEGREE)
                .event(ItemCharacteristicsEvent.FILLER_SELECTED)
                .and()

            // Вибір ступеню зносу
            .withExternal()
                .source(ItemCharacteristicsState.SELECTING_WEAR_DEGREE)
                .target(ItemCharacteristicsState.VALIDATING_DATA)
                .event(ItemCharacteristicsEvent.WEAR_DEGREE_SELECTED)
                .and()

            // Валідація даних
            .withExternal()
                .source(ItemCharacteristicsState.VALIDATING_DATA)
                .target(ItemCharacteristicsState.COMPLETED)
                .event(ItemCharacteristicsEvent.DATA_VALID)
                .action(completeSubstepAction)
                .guard(characteristicsDataValidGuard)
                .and()

            // Помилка валідації
            .withExternal()
                .source(ItemCharacteristicsState.VALIDATING_DATA)
                .target(ItemCharacteristicsState.ERROR)
                .event(ItemCharacteristicsEvent.VALIDATION_ERROR)
                .and()

            // Скидання підетапу
            .withExternal()
                .source(ItemCharacteristicsState.ERROR)
                .target(ItemCharacteristicsState.NOT_STARTED)
                .event(ItemCharacteristicsEvent.RESET_SUBSTEP)
                .and()

            // Повернення назад з будь-якого стану
            .withExternal()
                .source(ItemCharacteristicsState.SELECTING_COLOR)
                .target(ItemCharacteristicsState.SELECTING_MATERIAL)
                .event(ItemCharacteristicsEvent.GO_BACK)
                .and()

            .withExternal()
                .source(ItemCharacteristicsState.SELECTING_FILLER)
                .target(ItemCharacteristicsState.SELECTING_COLOR)
                .event(ItemCharacteristicsEvent.GO_BACK)
                .and()

            .withExternal()
                .source(ItemCharacteristicsState.SELECTING_WEAR_DEGREE)
                .target(ItemCharacteristicsState.SELECTING_COLOR)
                .event(ItemCharacteristicsEvent.GO_BACK);
    }
}
