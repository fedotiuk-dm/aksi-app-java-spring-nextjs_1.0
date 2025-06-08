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

    // ========== ОПЕРАЦІЇ З КОНТЕКСТОМ STATE MACHINE ==========

    /**
     * Зберегти підсумок замовлення в контексті State Machine.
     */
    public void saveOrderSummaryToContext(StateContext<OrderState, OrderEvent> context,
                                        com.aksi.domain.order.statemachine.stage4.dto.OrderSummaryDTO orderSummary) {
        if (orderSummary == null) {
            log.warn("Спроба збереження null підсумку замовлення");
            return;
        }

        context.getExtendedState().getVariables().put("stage4OrderSummary", orderSummary);
        log.debug("Підсумок замовлення збережено в контексті: загальна сума {}, кількість позицій {}",
                 orderSummary.getFinalAmount(), orderSummary.getItemsCount());
    }

    /**
     * Завантажити підсумок замовлення з контексту State Machine.
     */
    public com.aksi.domain.order.statemachine.stage4.dto.OrderSummaryDTO loadOrderSummaryFromContext(
            StateContext<OrderState, OrderEvent> context) {
        Object data = context.getExtendedState().getVariables().get("stage4OrderSummary");
        if (data instanceof com.aksi.domain.order.statemachine.stage4.dto.OrderSummaryDTO orderSummaryData) {
            return orderSummaryData;
        }

        log.debug("Підсумок замовлення не знайдено в контексті State Machine");
        return null;
    }

    /**
     * Зберегти юридичні аспекти в контексті State Machine.
     */
    public void saveLegalAspectsToContext(StateContext<OrderState, OrderEvent> context,
                                        com.aksi.domain.order.statemachine.stage4.dto.LegalAspectsDTO legalAspects) {
        if (legalAspects == null) {
            log.warn("Спроба збереження null юридичних аспектів");
            return;
        }

        context.getExtendedState().getVariables().put("stage4LegalAspects", legalAspects);
        log.debug("Юридичні аспекти збережено в контексті: умови прийнято {}, підпис завершено {}",
                 legalAspects.getTermsAccepted(), legalAspects.getSignatureCompleted());
    }

    /**
     * Завантажити юридичні аспекти з контексту State Machine.
     */
    public com.aksi.domain.order.statemachine.stage4.dto.LegalAspectsDTO loadLegalAspectsFromContext(
            StateContext<OrderState, OrderEvent> context) {
        Object data = context.getExtendedState().getVariables().get("stage4LegalAspects");
        if (data instanceof com.aksi.domain.order.statemachine.stage4.dto.LegalAspectsDTO legalAspectsData) {
            return legalAspectsData;
        }

        log.debug("Юридичні аспекти не знайдено в контексті State Machine");
        return null;
    }

    /**
     * Зберегти дані генерації квитанції в контексті State Machine.
     */
    public void saveReceiptGenerationToContext(StateContext<OrderState, OrderEvent> context,
                                             com.aksi.domain.order.statemachine.stage4.dto.ReceiptGenerationDTO receiptGeneration) {
        if (receiptGeneration == null) {
            log.warn("Спроба збереження null даних генерації квитанції");
            return;
        }

        context.getExtendedState().getVariables().put("stage4ReceiptGeneration", receiptGeneration);
        log.debug("Дані генерації квитанції збережено в контексті: PDF згенеровано {}, email відправлено {}",
                 receiptGeneration.isGenerated(), receiptGeneration.isEmailSent());
    }

    /**
     * Завантажити дані генерації квитанції з контексту State Machine.
     */
    public com.aksi.domain.order.statemachine.stage4.dto.ReceiptGenerationDTO loadReceiptGenerationFromContext(
            StateContext<OrderState, OrderEvent> context) {
        Object data = context.getExtendedState().getVariables().get("stage4ReceiptGeneration");
        if (data instanceof com.aksi.domain.order.statemachine.stage4.dto.ReceiptGenerationDTO receiptGenerationData) {
            return receiptGenerationData;
        }

        log.debug("Дані генерації квитанції не знайдено в контексті State Machine");
        return null;
    }

    /**
     * Зберегти дані завершення візарда в контексті State Machine.
     */
    public void saveWizardCompletionToContext(StateContext<OrderState, OrderEvent> context,
                                            com.aksi.domain.order.statemachine.stage4.dto.WizardCompletionDTO wizardCompletion) {
        if (wizardCompletion == null) {
            log.warn("Спроба збереження null даних завершення візарда");
            return;
        }

        context.getExtendedState().getVariables().put("stage4WizardCompletion", wizardCompletion);
        log.debug("Дані завершення візарда збережено в контексті: завершено {}, час {}",
                 wizardCompletion.isWizardCompleted(), wizardCompletion.getCompletedAt());
    }

    /**
     * Завантажити дані завершення візарда з контексту State Machine.
     */
    public com.aksi.domain.order.statemachine.stage4.dto.WizardCompletionDTO loadWizardCompletionFromContext(
            StateContext<OrderState, OrderEvent> context) {
        Object data = context.getExtendedState().getVariables().get("stage4WizardCompletion");
        if (data instanceof com.aksi.domain.order.statemachine.stage4.dto.WizardCompletionDTO wizardCompletionData) {
            return wizardCompletionData;
        }

        log.debug("Дані завершення візарда не знайдено в контексті State Machine");
        return null;
    }

    /**
     * Перевірити завершеність етапу 4 через контекст State Machine.
     */
    public boolean isStage4CompleteFromContext(StateContext<OrderState, OrderEvent> context) {
        var orderSummary = loadOrderSummaryFromContext(context);
        var legalAspects = loadLegalAspectsFromContext(context);
        var receiptGeneration = loadReceiptGenerationFromContext(context);
        var wizardCompletion = loadWizardCompletionFromContext(context);

        boolean complete = orderSummary != null && orderSummary.getFinalAmount() != null &&
                          legalAspects != null && Boolean.TRUE.equals(legalAspects.getTermsAccepted()) &&
                          receiptGeneration != null && receiptGeneration.isGenerated() &&
                          wizardCompletion != null && wizardCompletion.isWizardCompleted();

        log.debug("Перевірка завершеності етапу 4 через контекст: {}", complete);
        return complete;
    }

    /**
     * Очистити дані етапу 4 з контексту State Machine.
     */
    public void clearStage4DataFromContext(StateContext<OrderState, OrderEvent> context) {
        context.getExtendedState().getVariables().remove("stage4OrderSummary");
        context.getExtendedState().getVariables().remove("stage4LegalAspects");
        context.getExtendedState().getVariables().remove("stage4ReceiptGeneration");
        context.getExtendedState().getVariables().remove("stage4WizardCompletion");

        // Очищуємо також прапорці стану
        context.getExtendedState().getVariables().remove("stage4Initialized");
        context.getExtendedState().getVariables().remove("stage4Completed");
        context.getExtendedState().getVariables().remove("orderSummaryCompleted");
        context.getExtendedState().getVariables().remove("legalAspectsCompleted");
        context.getExtendedState().getVariables().remove("receiptGenerationCompleted");
        context.getExtendedState().getVariables().remove("wizardCompletionCompleted");
        context.getExtendedState().getVariables().remove("currentStage4Step");
        context.getExtendedState().getVariables().remove("orderWizardCompleted");

        log.debug("Дані етапу 4 очищено з контексту State Machine");
    }
}
