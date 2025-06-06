package com.aksi.domain.order.statemachine.stage4.adapter;

import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage4.service.Stage4CoordinationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Адаптер для інтеграції Stage 4 координатора з State Machine.
 *
 * Відокремлює логіку State Machine від основної бізнес-логіки координації,
 * дотримуючись принципу Single Responsibility.
 *
 * Етап: 4 (Підтвердження та завершення з формуванням квитанції)
 * Підетапи: 4.1 Перегляд замовлення, 4.2 Юридичні аспекти, 4.3 Формування квитанції, 4.4 Завершення процесу
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class Stage4StateMachineAdapter {

    private final Stage4CoordinationService coordinationService;
    private final OrderSummaryStateMachineAdapter orderSummaryAdapter;
    private final LegalAspectsStateMachineAdapter legalAspectsAdapter;
    private final ReceiptGenerationStateMachineAdapter receiptGenerationAdapter;
    private final WizardCompletionStateMachineAdapter wizardCompletionAdapter;

    /**
     * Ініціалізує етап 4 з усіма підетапами.
     */
    public void initializeStage4(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Ініціалізація етапу 4 - Підтвердження та завершення");

        UUID orderId = extractOrderId(context);
        coordinationService.initializeStage4(orderId, context);
    }

    /**
     * Завершує підетап перегляду замовлення та переходить до юридичних аспектів.
     */
    public void finishOrderSummaryAndStartLegalAspects(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Перехід від перегляду замовлення до юридичних аспектів");

        UUID orderId = extractOrderId(context);
        coordinationService.finishOrderSummaryAndStartLegalAspects(orderId, context);
    }

    /**
     * Завершує підетап юридичних аспектів та переходить до формування квитанції.
     */
    public void finishLegalAspectsAndStartReceiptGeneration(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Перехід від юридичних аспектів до формування квитанції");

        UUID orderId = extractOrderId(context);
        coordinationService.finishLegalAspectsAndStartReceiptGeneration(orderId, context);
    }

    /**
     * Завершує підетап формування квитанції та переходить до завершення процесу.
     */
    public void finishReceiptGenerationAndStartWizardCompletion(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Перехід від формування квитанції до завершення процесу");

        UUID orderId = extractOrderId(context);
        coordinationService.finishReceiptGenerationAndStartWizardCompletion(orderId, context);
    }

    /**
     * Фіналізує весь етап 4 та завершує Order Wizard.
     */
    public void finalizeStage4(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Фіналізація етапу 4 та завершення Order Wizard");

        UUID orderId = extractOrderId(context);
        coordinationService.finalizeStage4(orderId, context);
    }

    /**
     * Валідує чи етап 4 готовий до завершення.
     */
    public boolean validateStage4Completion(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Валідація готовності етапу 4");

        return coordinationService.isStage4Completed(context);
    }

    /**
     * Перевіряє чи завершено підетап перегляду замовлення.
     */
    public boolean isOrderSummaryCompleted(StateContext<OrderState, OrderEvent> context) {
        return coordinationService.isOrderSummaryCompleted(context);
    }

    /**
     * Перевіряє чи завершено підетап юридичних аспектів.
     */
    public boolean isLegalAspectsCompleted(StateContext<OrderState, OrderEvent> context) {
        return coordinationService.isLegalAspectsCompleted(context);
    }

    /**
     * Перевіряє чи завершено підетап формування квитанції.
     */
    public boolean isReceiptGenerationCompleted(StateContext<OrderState, OrderEvent> context) {
        return coordinationService.isReceiptGenerationCompleted(context);
    }

    /**
     * Перевіряє чи завершено підетап завершення процесу.
     */
    public boolean isWizardCompletionCompleted(StateContext<OrderState, OrderEvent> context) {
        return coordinationService.isWizardCompletionCompleted(context);
    }

    /**
     * Перевіряє чи завершено весь Order Wizard.
     */
    public boolean isOrderWizardCompleted(StateContext<OrderState, OrderEvent> context) {
        return coordinationService.isOrderWizardCompleted(context);
    }

    /**
     * Очищує дані етапу 4.
     */
    public void clearStage4Data(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Очищення даних етапу 4");

        UUID orderId = extractOrderId(context);
        coordinationService.resetStage4State(orderId, context);
    }

    /**
     * Отримує поточний підетап етапу 4.
     */
    public Stage4CoordinationService.Stage4CurrentStep getCurrentStep(StateContext<OrderState, OrderEvent> context) {
        return coordinationService.getCurrentStep(context);
    }

    /**
     * Отримує orderId з контексту State Machine.
     */
    private UUID extractOrderId(StateContext<OrderState, OrderEvent> context) {
        Object orderIdObj = context.getExtendedState().getVariables().get("orderId");
        if (orderIdObj instanceof UUID) {
            return (UUID) orderIdObj;
        } else if (orderIdObj instanceof String) {
            return UUID.fromString((String) orderIdObj);
        }
        throw new IllegalStateException("OrderId не знайдено в контексті State Machine");
    }
}
