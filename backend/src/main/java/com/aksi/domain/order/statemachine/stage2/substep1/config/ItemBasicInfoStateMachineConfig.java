package com.aksi.domain.order.statemachine.stage2.substep1.config;

import java.util.EnumSet;

import org.springframework.context.annotation.Configuration;
import org.springframework.statemachine.config.EnableStateMachine;
import org.springframework.statemachine.config.StateMachineConfigurerAdapter;
import org.springframework.statemachine.config.builders.StateMachineStateConfigurer;
import org.springframework.statemachine.config.builders.StateMachineTransitionConfigurer;

import com.aksi.domain.order.statemachine.stage2.substep1.actions.CategorySelectedAction;
import com.aksi.domain.order.statemachine.stage2.substep1.actions.InitializeBasicInfoAction;
import com.aksi.domain.order.statemachine.stage2.substep1.enums.ItemBasicInfoEvent;
import com.aksi.domain.order.statemachine.stage2.substep1.enums.ItemBasicInfoState;
import com.aksi.domain.order.statemachine.stage2.substep1.guards.BasicInfoDataValidGuard;
import com.aksi.domain.order.statemachine.stage2.substep1.guards.ItemNameSelectedGuard;
import com.aksi.domain.order.statemachine.stage2.substep1.guards.QuantityEnteredGuard;
import com.aksi.domain.order.statemachine.stage2.substep1.guards.ServiceCategorySelectedGuard;

/**
 * Конфігурація Spring State Machine для підетапу основної інформації про предмет
 */
@Configuration
@EnableStateMachine(name = "itemBasicInfoStateMachine")
public class ItemBasicInfoStateMachineConfig
        extends StateMachineConfigurerAdapter<ItemBasicInfoState, ItemBasicInfoEvent> {

    private final InitializeBasicInfoAction initializeBasicInfoAction;
    private final CategorySelectedAction categorySelectedAction;
    private final ServiceCategorySelectedGuard serviceCategorySelectedGuard;
    private final ItemNameSelectedGuard itemNameSelectedGuard;
    private final QuantityEnteredGuard quantityEnteredGuard;
    private final BasicInfoDataValidGuard basicInfoDataValidGuard;

    public ItemBasicInfoStateMachineConfig(
            InitializeBasicInfoAction initializeBasicInfoAction,
            CategorySelectedAction categorySelectedAction,
            ServiceCategorySelectedGuard serviceCategorySelectedGuard,
            ItemNameSelectedGuard itemNameSelectedGuard,
            QuantityEnteredGuard quantityEnteredGuard,
            BasicInfoDataValidGuard basicInfoDataValidGuard) {
        this.initializeBasicInfoAction = initializeBasicInfoAction;
        this.categorySelectedAction = categorySelectedAction;
        this.serviceCategorySelectedGuard = serviceCategorySelectedGuard;
        this.itemNameSelectedGuard = itemNameSelectedGuard;
        this.quantityEnteredGuard = quantityEnteredGuard;
        this.basicInfoDataValidGuard = basicInfoDataValidGuard;
    }

    @Override
    public void configure(StateMachineStateConfigurer<ItemBasicInfoState, ItemBasicInfoEvent> states)
            throws Exception {
        states
            .withStates()
                .initial(ItemBasicInfoState.NOT_STARTED)
                .states(EnumSet.allOf(ItemBasicInfoState.class))
                .end(ItemBasicInfoState.COMPLETED)
                .end(ItemBasicInfoState.VALIDATION_ERROR);
    }

    @Override
    public void configure(StateMachineTransitionConfigurer<ItemBasicInfoState, ItemBasicInfoEvent> transitions)
            throws Exception {
                transitions
            // Початок підетапу
            .withExternal()
                .source(ItemBasicInfoState.NOT_STARTED)
                .target(ItemBasicInfoState.SELECTING_SERVICE_CATEGORY)
                .event(ItemBasicInfoEvent.START_SUBSTEP)
                .action(initializeBasicInfoAction)
                .and()

            // Вибір категорії послуги
            .withExternal()
                .source(ItemBasicInfoState.SELECTING_SERVICE_CATEGORY)
                .target(ItemBasicInfoState.SELECTING_ITEM_NAME)
                .event(ItemBasicInfoEvent.SERVICE_CATEGORY_SELECTED)
                .action(categorySelectedAction)
                .guard(serviceCategorySelectedGuard)
                .and()

            // Вибір найменування предмета
            .withExternal()
                .source(ItemBasicInfoState.SELECTING_ITEM_NAME)
                .target(ItemBasicInfoState.ENTERING_QUANTITY)
                .event(ItemBasicInfoEvent.ITEM_NAME_SELECTED)
                .guard(itemNameSelectedGuard)
                .and()

            // Введення кількості
            .withExternal()
                .source(ItemBasicInfoState.ENTERING_QUANTITY)
                .target(ItemBasicInfoState.VALIDATING)
                .event(ItemBasicInfoEvent.QUANTITY_ENTERED)
                .guard(quantityEnteredGuard)
                .and()

            // Валідація даних успішна
            .withExternal()
                .source(ItemBasicInfoState.VALIDATING)
                .target(ItemBasicInfoState.COMPLETED)
                .event(ItemBasicInfoEvent.VALIDATION_SUCCESS)
                .guard(basicInfoDataValidGuard)
                .and()

            // Валідація неуспішна
            .withExternal()
                .source(ItemBasicInfoState.VALIDATING)
                .target(ItemBasicInfoState.VALIDATION_ERROR)
                .event(ItemBasicInfoEvent.VALIDATION_FAILED)
                .and()

            // Скидання підетапу
            .withExternal()
                .source(ItemBasicInfoState.VALIDATION_ERROR)
                .target(ItemBasicInfoState.NOT_STARTED)
                .event(ItemBasicInfoEvent.RESET);
    }
}
