package com.aksi.domain.order.statemachine.config;

import org.springframework.statemachine.config.builders.StateMachineTransitionConfigurer;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage2.actions.CompleteItemWizardAction;
import com.aksi.domain.order.statemachine.stage2.actions.DeleteItemAction;
import com.aksi.domain.order.statemachine.stage2.actions.StartItemWizardAction;
import com.aksi.domain.order.statemachine.stage2.guards.CanCompleteStage2Guard;
import com.aksi.domain.order.statemachine.stage2.guards.CanStartItemWizardGuard;
import com.aksi.domain.order.statemachine.stage2.substep1.actions.SaveBasicInfoAction;
import com.aksi.domain.order.statemachine.stage2.substep1.guards.BasicInfoValidGuard;
import com.aksi.domain.order.statemachine.stage2.substep2.actions.SaveCharacteristicsAction;
import com.aksi.domain.order.statemachine.stage2.substep2.guards.CharacteristicsValidGuard;
import com.aksi.domain.order.statemachine.stage2.substep3.actions.SaveDefectsStainsAction;
import com.aksi.domain.order.statemachine.stage2.substep3.guards.DefectsStainsValidGuard;
import com.aksi.domain.order.statemachine.stage2.substep4.actions.CalculatePricingAction;
import com.aksi.domain.order.statemachine.stage2.substep4.guards.PricingValidGuard;
import com.aksi.domain.order.statemachine.stage2.substep5.actions.SavePhotosAction;
import com.aksi.domain.order.statemachine.stage2.substep5.guards.PhotosValidGuard;
import com.aksi.domain.order.statemachine.stage3.actions.OrderParametersActions;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Конфігуратор переходів для Етапу 2: Менеджер предметів.
 *
 * Відповідає за:
 * - Управління списком предметів
 * - Циклічний підвізард додавання предметів (2.1-2.5)
 * - Редагування та видалення предметів
 * - Перехід до етапу 3
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class Stage2TransitionConfigurer implements StageTransitionConfigurer {

    // Main Stage 2 Actions and Guards
    private final StartItemWizardAction startItemWizardAction;
    private final CompleteItemWizardAction completeItemWizardAction;
    private final DeleteItemAction deleteItemAction;
    private final CanCompleteStage2Guard canCompleteStage2Guard;
    private final CanStartItemWizardGuard canStartItemWizardGuard;

    // Substep 2.1 Actions and Guards
    private final SaveBasicInfoAction saveBasicInfoAction;
    private final BasicInfoValidGuard basicInfoValidGuard;

    // Substep 2.2 Actions and Guards
    private final SaveCharacteristicsAction saveCharacteristicsAction;
    private final CharacteristicsValidGuard characteristicsValidGuard;

    // Substep 2.3 Actions and Guards
    private final SaveDefectsStainsAction saveDefectsStainsAction;
    private final DefectsStainsValidGuard defectsStainsValidGuard;

    // Substep 2.4 Actions and Guards
    private final CalculatePricingAction calculatePricingAction;
    private final PricingValidGuard pricingValidGuard;

    // Substep 2.5 Actions and Guards
    private final SavePhotosAction savePhotosAction;
    private final PhotosValidGuard photosValidGuard;

    // Stage 3 initialization
    private final OrderParametersActions.EnterOrderParametersStageAction enterOrderParametersStageAction;

    @Override
    public void configureTransitions(StateMachineTransitionConfigurer<OrderState, OrderEvent> transitions)
            throws Exception {

        log.info("Конфігурація переходів для {}", getStageName());

        transitions
            // === ЕТАП 2: Менеджер предметів ===

            // Запуск підвізарда предметів
            .withExternal()
                .source(OrderState.ITEM_MANAGEMENT)
                .target(OrderState.ITEM_WIZARD_ACTIVE)
                .event(OrderEvent.ADD_ITEM)
                .action(startItemWizardAction)
                .guard(canStartItemWizardGuard)

            // Початок підвізарда - перехід до основної інформації
            .and()
            .withExternal()
                .source(OrderState.ITEM_WIZARD_ACTIVE)
                .target(OrderState.ITEM_BASIC_INFO)
                .event(OrderEvent.START_ITEM_WIZARD)

            // === Циклічний підвізард предметів ===

            // Підвізард: 2.1 -> 2.2
            .and()
            .withExternal()
                .source(OrderState.ITEM_BASIC_INFO)
                .target(OrderState.ITEM_CHARACTERISTICS)
                .event(OrderEvent.BASIC_INFO_COMPLETED)
                .action(saveBasicInfoAction)
                .guard(basicInfoValidGuard)

            // Підвізард: 2.2 -> 2.3
            .and()
            .withExternal()
                .source(OrderState.ITEM_CHARACTERISTICS)
                .target(OrderState.ITEM_DEFECTS_STAINS)
                .event(OrderEvent.CHARACTERISTICS_COMPLETED)
                .action(saveCharacteristicsAction)
                .guard(characteristicsValidGuard)

            // Підвізард: 2.3 -> 2.4
            .and()
            .withExternal()
                .source(OrderState.ITEM_DEFECTS_STAINS)
                .target(OrderState.ITEM_PRICING)
                .event(OrderEvent.DEFECTS_COMPLETED)
                .action(saveDefectsStainsAction)
                .guard(defectsStainsValidGuard)

            // Підвізард: 2.4 -> 2.5
            .and()
            .withExternal()
                .source(OrderState.ITEM_PRICING)
                .target(OrderState.ITEM_PHOTOS)
                .event(OrderEvent.PRICING_COMPLETED)
                .action(calculatePricingAction)
                .guard(pricingValidGuard)

            // Підвізард: 2.5 -> Завершення
            .and()
            .withExternal()
                .source(OrderState.ITEM_PHOTOS)
                .target(OrderState.ITEM_COMPLETED)
                .event(OrderEvent.PHOTOS_COMPLETED)
                .action(savePhotosAction)
                .guard(photosValidGuard)

            // Пропуск фото (необов'язковий крок)
            .and()
            .withExternal()
                .source(OrderState.ITEM_PHOTOS)
                .target(OrderState.ITEM_COMPLETED)
                .event(OrderEvent.SKIP_PHOTOS)
                .action(savePhotosAction)

            // === Завершення підвізарда ===

            // Завершення підвізарда - додавання предмета до замовлення
            .and()
            .withExternal()
                .source(OrderState.ITEM_COMPLETED)
                .target(OrderState.ITEM_MANAGEMENT)
                .event(OrderEvent.ITEM_ADDED)
                .action(completeItemWizardAction)

            // Повернення з ITEM_COMPLETED до ITEM_MANAGEMENT без додавання
            .and()
            .withExternal()
                .source(OrderState.ITEM_COMPLETED)
                .target(OrderState.ITEM_MANAGEMENT)
                .event(OrderEvent.GO_BACK)

            // === Управління предметами ===

            // Видалення предмета (внутрішній перехід в ITEM_MANAGEMENT)
            .and()
            .withInternal()
                .source(OrderState.ITEM_MANAGEMENT)
                .event(OrderEvent.DELETE_ITEM)
                .action(deleteItemAction)

            // Редагування предмета - запуск підвізарда з існуючими даними
            .and()
            .withExternal()
                .source(OrderState.ITEM_MANAGEMENT)
                .target(OrderState.ITEM_WIZARD_ACTIVE)
                .event(OrderEvent.EDIT_ITEM)
                .action(startItemWizardAction)

            // Перерахунок ціни (внутрішній перехід в ITEM_PRICING)
            .and()
            .withInternal()
                .source(OrderState.ITEM_PRICING)
                .event(OrderEvent.RECALCULATE_PRICE)
                .action(calculatePricingAction)

            // === Навігація назад в підвізарді ===

            // 2.2 -> 2.1
            .and()
            .withExternal()
                .source(OrderState.ITEM_CHARACTERISTICS)
                .target(OrderState.ITEM_BASIC_INFO)
                .event(OrderEvent.GO_BACK)

            // 2.3 -> 2.2
            .and()
            .withExternal()
                .source(OrderState.ITEM_DEFECTS_STAINS)
                .target(OrderState.ITEM_CHARACTERISTICS)
                .event(OrderEvent.GO_BACK)

            // 2.4 -> 2.3
            .and()
            .withExternal()
                .source(OrderState.ITEM_PRICING)
                .target(OrderState.ITEM_DEFECTS_STAINS)
                .event(OrderEvent.GO_BACK)

            // 2.5 -> 2.4
            .and()
            .withExternal()
                .source(OrderState.ITEM_PHOTOS)
                .target(OrderState.ITEM_PRICING)
                .event(OrderEvent.GO_BACK)

            // === Скасування підвізарда ===

            .and()
            .withExternal()
                .source(OrderState.ITEM_WIZARD_ACTIVE)
                .target(OrderState.ITEM_MANAGEMENT)
                .event(OrderEvent.CANCEL_ITEM_WIZARD)

            .and()
            .withExternal()
                .source(OrderState.ITEM_BASIC_INFO)
                .target(OrderState.ITEM_MANAGEMENT)
                .event(OrderEvent.CANCEL_ITEM_WIZARD)

            .and()
            .withExternal()
                .source(OrderState.ITEM_CHARACTERISTICS)
                .target(OrderState.ITEM_MANAGEMENT)
                .event(OrderEvent.CANCEL_ITEM_WIZARD)

            .and()
            .withExternal()
                .source(OrderState.ITEM_DEFECTS_STAINS)
                .target(OrderState.ITEM_MANAGEMENT)
                .event(OrderEvent.CANCEL_ITEM_WIZARD)

            .and()
            .withExternal()
                .source(OrderState.ITEM_PRICING)
                .target(OrderState.ITEM_MANAGEMENT)
                .event(OrderEvent.CANCEL_ITEM_WIZARD)

            .and()
            .withExternal()
                .source(OrderState.ITEM_PHOTOS)
                .target(OrderState.ITEM_MANAGEMENT)
                .event(OrderEvent.CANCEL_ITEM_WIZARD)

            // === Перехід до етапу 3 ===

            // Завершення етапу 2 - перехід до етапу 3
            .and()
            .withExternal()
                .source(OrderState.ITEM_MANAGEMENT)
                .target(OrderState.EXECUTION_PARAMS)
                .event(OrderEvent.ITEMS_COMPLETED)
                .action(enterOrderParametersStageAction)
                .guard(canCompleteStage2Guard)

            // Повернення з етапу 3 до етапу 2 (редагування предметів)
            .and()
            .withExternal()
                .source(OrderState.EXECUTION_PARAMS)
                .target(OrderState.ITEM_MANAGEMENT)
                .event(OrderEvent.GO_BACK)

            // === Скасування на етапі 2 ===
            .and()
            .withExternal()
                .source(OrderState.ITEM_MANAGEMENT)
                .target(OrderState.CANCELLED)
                .event(OrderEvent.CANCEL_ORDER);

        log.debug("Конфігурація переходів для {} завершена", getStageName());
    }

    @Override
    public int getStageNumber() {
        return 2;
    }

    @Override
    public String getStageName() {
        return "Етап 2: Менеджер предметів";
    }
}
