package com.aksi.domain.order.statemachine.stage2.substep2.config;

import java.util.EnumSet;

import org.springframework.context.annotation.Configuration;
import org.springframework.statemachine.config.EnableStateMachine;
import org.springframework.statemachine.config.EnumStateMachineConfigurerAdapter;
import org.springframework.statemachine.config.builders.StateMachineStateConfigurer;
import org.springframework.statemachine.config.builders.StateMachineTransitionConfigurer;

import com.aksi.domain.order.statemachine.stage2.substep2.actions.CompleteCharacteristicsAction;
import com.aksi.domain.order.statemachine.stage2.substep2.actions.InitializeCharacteristicsAction;
import com.aksi.domain.order.statemachine.stage2.substep2.actions.UpdateCharacteristicsAction;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.ItemCharacteristicsEvent;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.ItemCharacteristicsState;
import com.aksi.domain.order.statemachine.stage2.substep2.guards.CharacteristicsCompleteGuard;
import com.aksi.domain.order.statemachine.stage2.substep2.guards.ColorSelectedGuard;
import com.aksi.domain.order.statemachine.stage2.substep2.guards.MaterialSelectedGuard;

/**
 * Конфігурація Spring State Machine для підетапу 2.2 "Характеристики предмета".
 * Згідно з архітектурними правилами імпортує ТІЛЬКИ Enums, Actions та Guards.
 */
@Configuration
@EnableStateMachine(name = "itemCharacteristicsStateMachine")
public class ItemCharacteristicsStateMachineConfig
        extends EnumStateMachineConfigurerAdapter<ItemCharacteristicsState, ItemCharacteristicsEvent> {

    private final InitializeCharacteristicsAction initializeAction;
    private final UpdateCharacteristicsAction updateAction;
    private final CompleteCharacteristicsAction completeAction;

    private final MaterialSelectedGuard materialSelectedGuard;
    private final ColorSelectedGuard colorSelectedGuard;
    private final CharacteristicsCompleteGuard characteristicsCompleteGuard;

    public ItemCharacteristicsStateMachineConfig(
            final InitializeCharacteristicsAction initializeAction,
            final UpdateCharacteristicsAction updateAction,
            final CompleteCharacteristicsAction completeAction,
            final MaterialSelectedGuard materialSelectedGuard,
            final ColorSelectedGuard colorSelectedGuard,
            final CharacteristicsCompleteGuard characteristicsCompleteGuard) {
        this.initializeAction = initializeAction;
        this.updateAction = updateAction;
        this.completeAction = completeAction;
        this.materialSelectedGuard = materialSelectedGuard;
        this.colorSelectedGuard = colorSelectedGuard;
        this.characteristicsCompleteGuard = characteristicsCompleteGuard;
    }

    @Override
    public void configure(final StateMachineStateConfigurer<ItemCharacteristicsState, ItemCharacteristicsEvent> states)
            throws Exception {
        states
                .withStates()
                .initial(ItemCharacteristicsState.NOT_STARTED)
                .states(EnumSet.allOf(ItemCharacteristicsState.class))
                .end(ItemCharacteristicsState.COMPLETED)
                .end(ItemCharacteristicsState.ERROR);
    }

    @Override
    public void configure(final StateMachineTransitionConfigurer<ItemCharacteristicsState, ItemCharacteristicsEvent> transitions)
            throws Exception {
        transitions
                // Початок процесу
                .withExternal()
                .source(ItemCharacteristicsState.NOT_STARTED)
                .target(ItemCharacteristicsState.SELECTING_MATERIAL)
                .event(ItemCharacteristicsEvent.START_SUBSTEP)
                .action(initializeAction)

                // Вибір матеріалу
                .and()
                .withExternal()
                .source(ItemCharacteristicsState.SELECTING_MATERIAL)
                .target(ItemCharacteristicsState.SELECTING_COLOR)
                .event(ItemCharacteristicsEvent.MATERIAL_SELECTED)
                .guard(materialSelectedGuard)
                .action(updateAction)

                // Вибір кольору
                .and()
                .withExternal()
                .source(ItemCharacteristicsState.SELECTING_COLOR)
                .target(ItemCharacteristicsState.SELECTING_FILLER)
                .event(ItemCharacteristicsEvent.COLOR_SELECTED)
                .guard(colorSelectedGuard)
                .action(updateAction)

                // Вибір наповнювача (опціонально)
                .and()
                .withExternal()
                .source(ItemCharacteristicsState.SELECTING_FILLER)
                .target(ItemCharacteristicsState.SELECTING_WEAR_DEGREE)
                .event(ItemCharacteristicsEvent.FILLER_SELECTED)
                .action(updateAction)

                // Пропуск наповнювача (прямо до ступеня зносу)
                .and()
                .withExternal()
                .source(ItemCharacteristicsState.SELECTING_COLOR)
                .target(ItemCharacteristicsState.SELECTING_WEAR_DEGREE)
                .event(ItemCharacteristicsEvent.WEAR_DEGREE_SELECTED)
                .action(updateAction)

                // Вибір ступеня зносу
                .and()
                .withExternal()
                .source(ItemCharacteristicsState.SELECTING_WEAR_DEGREE)
                .target(ItemCharacteristicsState.VALIDATING_DATA)
                .event(ItemCharacteristicsEvent.WEAR_DEGREE_SELECTED)
                .action(updateAction)

                // Валідація даних
                .and()
                .withExternal()
                .source(ItemCharacteristicsState.VALIDATING_DATA)
                .target(ItemCharacteristicsState.COMPLETED)
                .event(ItemCharacteristicsEvent.DATA_VALID)
                .guard(characteristicsCompleteGuard)
                .action(completeAction)

                // Завершення процесу альтернативним способом
                .and()
                .withExternal()
                .source(ItemCharacteristicsState.SELECTING_WEAR_DEGREE)
                .target(ItemCharacteristicsState.COMPLETED)
                .event(ItemCharacteristicsEvent.COMPLETE_SUBSTEP)
                .guard(characteristicsCompleteGuard)
                .action(completeAction)

                // Переходи в стан помилки через валідацію
                .and()
                .withExternal()
                .source(ItemCharacteristicsState.VALIDATING_DATA)
                .target(ItemCharacteristicsState.ERROR)
                .event(ItemCharacteristicsEvent.VALIDATION_ERROR)

                // Системні помилки з будь-якого стану
                .and()
                .withExternal()
                .source(ItemCharacteristicsState.SELECTING_MATERIAL)
                .target(ItemCharacteristicsState.ERROR)
                .event(ItemCharacteristicsEvent.SYSTEM_ERROR)

                .and()
                .withExternal()
                .source(ItemCharacteristicsState.SELECTING_COLOR)
                .target(ItemCharacteristicsState.ERROR)
                .event(ItemCharacteristicsEvent.SYSTEM_ERROR)

                .and()
                .withExternal()
                .source(ItemCharacteristicsState.SELECTING_FILLER)
                .target(ItemCharacteristicsState.ERROR)
                .event(ItemCharacteristicsEvent.SYSTEM_ERROR)

                .and()
                .withExternal()
                .source(ItemCharacteristicsState.SELECTING_WEAR_DEGREE)
                .target(ItemCharacteristicsState.ERROR)
                .event(ItemCharacteristicsEvent.SYSTEM_ERROR)

                // Скидання процесу з будь-якого стану
                .and()
                .withExternal()
                .source(ItemCharacteristicsState.SELECTING_MATERIAL)
                .target(ItemCharacteristicsState.NOT_STARTED)
                .event(ItemCharacteristicsEvent.RESET_SUBSTEP)

                .and()
                .withExternal()
                .source(ItemCharacteristicsState.SELECTING_COLOR)
                .target(ItemCharacteristicsState.NOT_STARTED)
                .event(ItemCharacteristicsEvent.RESET_SUBSTEP)

                .and()
                .withExternal()
                .source(ItemCharacteristicsState.SELECTING_FILLER)
                .target(ItemCharacteristicsState.NOT_STARTED)
                .event(ItemCharacteristicsEvent.RESET_SUBSTEP)

                .and()
                .withExternal()
                .source(ItemCharacteristicsState.SELECTING_WEAR_DEGREE)
                .target(ItemCharacteristicsState.NOT_STARTED)
                .event(ItemCharacteristicsEvent.RESET_SUBSTEP)

                .and()
                .withExternal()
                .source(ItemCharacteristicsState.VALIDATING_DATA)
                .target(ItemCharacteristicsState.NOT_STARTED)
                .event(ItemCharacteristicsEvent.RESET_SUBSTEP);
    }
}
