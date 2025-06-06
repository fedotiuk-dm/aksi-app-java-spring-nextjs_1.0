package com.aksi.domain.order.statemachine.stage4.service;

import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Координаційний сервіс для управління життєвим циклом Stage 4.
 *
 * Етап: 4 - Підтвердження та завершення з формуванням квитанції
 * Призначення: Управління життєвим циклом та координація підетапів
 *
 * Підетапи Stage 4:
 * - 4.1: Перегляд замовлення з детальним розрахунком
 * - 4.2: Юридичні аспекти (підпис, згода з умовами)
 * - 4.3: Формування та друк квитанції
 * - 4.4: Завершення процесу
 *
 * Відповідальності:
 * - Ініціалізація та завершення Stage 4
 * - Координація переходів між підетапами
 * - Управління станом всього етапу
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class Stage4CoordinationService {

    /**
     * Поточний підетап Stage 4.
     */
    public enum Stage4CurrentStep {
        ORDER_SUMMARY,      // 4.1: Перегляд замовлення з детальним розрахунком
        LEGAL_ASPECTS,      // 4.2: Юридичні аспекти
        RECEIPT_GENERATION, // 4.3: Формування та друк квитанції
        WIZARD_COMPLETION   // 4.4: Завершення процесу
    }

    /**
     * Ініціалізує весь Stage 4.
     *
     * @param orderId ID замовлення
     * @param context контекст State Machine
     */
    public void initializeStage4(UUID orderId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Ініціалізація Stage 4 для замовлення: {}", orderId);

        try {
            // Встановлюємо початковий підетап
            setCurrentStep(Stage4CurrentStep.ORDER_SUMMARY, context);

            // Позначаємо Stage 4 як ініціалізований
            context.getExtendedState().getVariables().put("stage4Initialized", true);
            context.getExtendedState().getVariables().put("stage4InitializationTime", System.currentTimeMillis());

            // Очищуємо попередні помилки
            context.getExtendedState().getVariables().remove("stage4Error");

            log.info("Stage 4 ініціалізовано для замовлення: {}", orderId);

        } catch (Exception e) {
            log.error("Помилка ініціалізації Stage 4 для замовлення {}: {}", orderId, e.getMessage(), e);
            context.getExtendedState().getVariables().put("stage4Error", "Помилка ініціалізації: " + e.getMessage());
            throw e;
        }
    }

    /**
     * Завершує підетап 4.1 та переходить до 4.2.
     */
    public void finishOrderSummaryAndStartLegalAspects(UUID orderId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Перехід від підетапу 4.1 до 4.2 для замовлення: {}", orderId);

        try {
            setCurrentStep(Stage4CurrentStep.LEGAL_ASPECTS, context);
            context.getExtendedState().getVariables().put("orderSummaryCompleted", true);

            log.info("Перехід до підетапу юридичних аспектів завершено для замовлення: {}", orderId);

        } catch (Exception e) {
            log.error("Помилка переходу до підетапу юридичних аспектів для замовлення {}: {}", orderId, e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Завершує підетап 4.2 та переходить до 4.3.
     */
    public void finishLegalAspectsAndStartReceiptGeneration(UUID orderId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Перехід від підетапу 4.2 до 4.3 для замовлення: {}", orderId);

        try {
            setCurrentStep(Stage4CurrentStep.RECEIPT_GENERATION, context);
            context.getExtendedState().getVariables().put("legalAspectsCompleted", true);

            log.info("Перехід до підетапу формування квитанції завершено для замовлення: {}", orderId);

        } catch (Exception e) {
            log.error("Помилка переходу до підетапу формування квитанції для замовлення {}: {}", orderId, e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Завершує підетап 4.3 та переходить до 4.4.
     */
    public void finishReceiptGenerationAndStartWizardCompletion(UUID orderId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Перехід від підетапу 4.3 до 4.4 для замовлення: {}", orderId);

        try {
            setCurrentStep(Stage4CurrentStep.WIZARD_COMPLETION, context);
            context.getExtendedState().getVariables().put("receiptGenerationCompleted", true);

            log.info("Перехід до підетапу завершення процесу завершено для замовлення: {}", orderId);

        } catch (Exception e) {
            log.error("Помилка переходу до підетапу завершення процесу для замовлення {}: {}", orderId, e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Завершує весь Stage 4 та Order Wizard.
     */
    public void finalizeStage4(UUID orderId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Фіналізація Stage 4 для замовлення: {}", orderId);

        try {
            // Позначаємо завершення всіх підетапів
            context.getExtendedState().getVariables().put("wizardCompletionCompleted", true);
            context.getExtendedState().getVariables().put("stage4Completed", true);
            context.getExtendedState().getVariables().put("stage4CompletionTime", System.currentTimeMillis());

            // Позначаємо завершення всього Order Wizard
            context.getExtendedState().getVariables().put("orderWizardCompleted", true);
            context.getExtendedState().getVariables().put("orderWizardCompletionTime", System.currentTimeMillis());

            // Очищуємо поточний підетап
            context.getExtendedState().getVariables().remove("currentStage4Step");

            log.info("Stage 4 та Order Wizard завершено для замовлення: {}", orderId);

        } catch (Exception e) {
            log.error("Помилка фіналізації Stage 4 для замовлення {}: {}", orderId, e.getMessage(), e);
            context.getExtendedState().getVariables().put("stage4Error", "Помилка фіналізації: " + e.getMessage());
            throw e;
        }
    }

    /**
     * Скидає стан всього Stage 4.
     */
    public void resetStage4State(UUID orderId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Скидання стану Stage 4 для замовлення: {}", orderId);

        try {
            // Очищуємо всі прапорці завершення
            context.getExtendedState().getVariables().remove("stage4Initialized");
            context.getExtendedState().getVariables().remove("stage4Completed");
            context.getExtendedState().getVariables().remove("orderSummaryCompleted");
            context.getExtendedState().getVariables().remove("legalAspectsCompleted");
            context.getExtendedState().getVariables().remove("receiptGenerationCompleted");
            context.getExtendedState().getVariables().remove("wizardCompletionCompleted");

            // Очищуємо часові мітки
            context.getExtendedState().getVariables().remove("stage4InitializationTime");
            context.getExtendedState().getVariables().remove("stage4CompletionTime");

            // Очищуємо Order Wizard прапорці
            context.getExtendedState().getVariables().remove("orderWizardCompleted");
            context.getExtendedState().getVariables().remove("orderWizardCompletionTime");

            // Очищуємо поточний підетап
            context.getExtendedState().getVariables().remove("currentStage4Step");

            // Очищуємо помилки
            context.getExtendedState().getVariables().remove("stage4Error");

            log.info("Стан Stage 4 скинуто для замовлення: {}", orderId);

        } catch (Exception e) {
            log.error("Помилка скидання стану Stage 4 для замовлення {}: {}", orderId, e.getMessage(), e);
            throw e;
        }
    }

    // ========== ПЕРЕВІРКИ СТАНУ ==========

    /**
     * Перевіряє чи ініціалізовано Stage 4.
     */
    public boolean isStage4Initialized(StateContext<OrderState, OrderEvent> context) {
        return Boolean.TRUE.equals(context.getExtendedState().getVariables().get("stage4Initialized"));
    }

    /**
     * Перевіряє чи завершено Stage 4.
     */
    public boolean isStage4Completed(StateContext<OrderState, OrderEvent> context) {
        return Boolean.TRUE.equals(context.getExtendedState().getVariables().get("stage4Completed"));
    }

    /**
     * Перевіряє чи завершено підетап перегляду замовлення.
     */
    public boolean isOrderSummaryCompleted(StateContext<OrderState, OrderEvent> context) {
        return Boolean.TRUE.equals(context.getExtendedState().getVariables().get("orderSummaryCompleted"));
    }

    /**
     * Перевіряє чи завершено підетап юридичних аспектів.
     */
    public boolean isLegalAspectsCompleted(StateContext<OrderState, OrderEvent> context) {
        return Boolean.TRUE.equals(context.getExtendedState().getVariables().get("legalAspectsCompleted"));
    }

    /**
     * Перевіряє чи завершено підетап формування квитанції.
     */
    public boolean isReceiptGenerationCompleted(StateContext<OrderState, OrderEvent> context) {
        return Boolean.TRUE.equals(context.getExtendedState().getVariables().get("receiptGenerationCompleted"));
    }

    /**
     * Перевіряє чи завершено підетап завершення процесу.
     */
    public boolean isWizardCompletionCompleted(StateContext<OrderState, OrderEvent> context) {
        return Boolean.TRUE.equals(context.getExtendedState().getVariables().get("wizardCompletionCompleted"));
    }

    /**
     * Перевіряє чи завершено весь Order Wizard.
     */
    public boolean isOrderWizardCompleted(StateContext<OrderState, OrderEvent> context) {
        return Boolean.TRUE.equals(context.getExtendedState().getVariables().get("orderWizardCompleted"));
    }

    /**
     * Отримує поточний підетап Stage 4.
     */
    public Stage4CurrentStep getCurrentStep(StateContext<OrderState, OrderEvent> context) {
        Object step = context.getExtendedState().getVariables().get("currentStage4Step");
        if (step instanceof Stage4CurrentStep) {
            return (Stage4CurrentStep) step;
        }
        return Stage4CurrentStep.ORDER_SUMMARY; // За замовчуванням
    }

    /**
     * Встановлює поточний підетап Stage 4.
     */
    private void setCurrentStep(Stage4CurrentStep step, StateContext<OrderState, OrderEvent> context) {
        context.getExtendedState().getVariables().put("currentStage4Step", step);
        log.debug("Встановлено поточний підетап Stage 4: {}", step);
    }
}
