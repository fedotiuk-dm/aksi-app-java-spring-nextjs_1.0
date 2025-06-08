package com.aksi.domain.order.statemachine.stage4.guards;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.service.OrderWizardPersistenceService;
import com.aksi.domain.order.statemachine.stage4.dto.ReceiptGenerationDTO;
import com.aksi.domain.order.statemachine.stage4.dto.WizardCompletionDTO;
import com.aksi.domain.order.statemachine.stage4.service.ReceiptGenerationStepService;
import com.aksi.domain.order.statemachine.stage4.service.WizardCompletionStepService;
import com.aksi.domain.order.statemachine.stage4.validator.WizardCompletionValidator;

/**
 * Guards для етапу 4.4 "Завершення процесу".
 */
@Component
public class WizardCompletionGuards {

    private static final Logger logger = LoggerFactory.getLogger(WizardCompletionGuards.class);

    private final OrderWizardPersistenceService persistenceService;
    private final WizardCompletionStepService wizardCompletionService;
    private final ReceiptGenerationStepService receiptGenerationService;
    private final WizardCompletionValidator validator;

    public WizardCompletionGuards(
            OrderWizardPersistenceService persistenceService,
            WizardCompletionStepService wizardCompletionService,
            ReceiptGenerationStepService receiptGenerationService,
            WizardCompletionValidator validator) {
        this.persistenceService = persistenceService;
        this.wizardCompletionService = wizardCompletionService;
        this.receiptGenerationService = receiptGenerationService;
        this.validator = validator;
    }

    /**
     * Перевіряє чи можна перейти до етапу 4.4 "Завершення процесу".
     */
    public boolean canProceedToWizardCompletionStep(String wizardId) {
        logger.debug("Перевірка можливості переходу до завершення wizard для: {}", wizardId);

        try {
            // Перевіряємо наявність wizard data
            Map<String, Object> wizardData = persistenceService.loadWizardData(wizardId);
            if (wizardData == null || wizardData.isEmpty()) {
                logger.warn("Відсутні wizard data для: {}", wizardId);
                return false;
            }

            // Перевіряємо завершення етапу 4.3 (генерація квитанції)
            if (!isReceiptGenerationCompleted(wizardId)) {
                logger.warn("Етап генерації квитанції не завершено для wizard: {}", wizardId);
                return false;
            }

            // Перевіряємо наявність базових даних
            if (!hasRequiredOrderData(wizardData)) {
                logger.warn("Відсутні обов'язкові дані замовлення для wizard: {}", wizardId);
                return false;
            }

            logger.debug("Можна переходити до завершення wizard: {}", wizardId);
            return true;

        } catch (Exception e) {
            logger.error("Помилка перевірки можливості переходу до завершення для wizard {}: {}", wizardId, e.getMessage(), e);
            return false;
        }
    }

    /**
     * Перевіряє чи можна завершити wizard повністю.
     */
    public boolean canCompleteWizard(String wizardId) {
        logger.debug("Перевірка можливості завершення wizard: {}", wizardId);

        try {
            WizardCompletionDTO completion = wizardCompletionService.loadWizardCompletion(wizardId);

            if (completion == null) {
                logger.warn("Відсутні дані завершення для wizard: {}", wizardId);
                return false;
            }

            // Використовуємо validator для перевірки
            if (!validator.canCompleteWizard(completion)) {
                logger.warn("Валідація завершення wizard не пройдена для: {}", wizardId);
                return false;
            }

            logger.debug("Wizard може бути завершений: {}", wizardId);
            return true;

        } catch (Exception e) {
            logger.error("Помилка перевірки можливості завершення wizard {}: {}", wizardId, e.getMessage(), e);
            return false;
        }
    }

    /**
     * Перевіряє чи замовлення фіналізовано.
     */
    public boolean isOrderFinalized(String wizardId) {
        try {
            WizardCompletionDTO completion = wizardCompletionService.loadWizardCompletion(wizardId);
            return completion != null && completion.isOrderFinalized();

        } catch (Exception e) {
            logger.error("Помилка перевірки фіналізації замовлення для wizard {}: {}", wizardId, e.getMessage(), e);
            return false;
        }
    }

    /**
     * Перевіряє чи PDF згенеровано.
     */
    public boolean isPdfGenerated(String wizardId) {
        try {
            WizardCompletionDTO completion = wizardCompletionService.loadWizardCompletion(wizardId);
            return completion != null && completion.isPdfGenerated();

        } catch (Exception e) {
            logger.error("Помилка перевірки генерації PDF для wizard {}: {}", wizardId, e.getMessage(), e);
            return false;
        }
    }

    /**
     * Перевіряє чи wizard повністю завершено.
     */
    public boolean isWizardFullyCompleted(String wizardId) {
        try {
            WizardCompletionDTO completion = wizardCompletionService.loadWizardCompletion(wizardId);
            return validator.isFullyCompleted(completion);

        } catch (Exception e) {
            logger.error("Помилка перевірки повного завершення wizard {}: {}", wizardId, e.getMessage(), e);
            return false;
        }
    }

    /**
     * Перевіряє чи можна створити нове замовлення.
     */
    public boolean canCreateNewOrder(String wizardId) {
        try {
            WizardCompletionDTO completion = wizardCompletionService.loadWizardCompletion(wizardId);
            return completion != null &&
                   completion.isWizardCompleted() &&
                   completion.isCanCreateNewOrder();

        } catch (Exception e) {
            logger.error("Помилка перевірки можливості створення нового замовлення для wizard {}: {}", wizardId, e.getMessage(), e);
            return false;
        }
    }

    /**
     * Перевіряє чи можна перейти до списку замовлень.
     */
    public boolean canReturnToOrderList(String wizardId) {
        try {
            WizardCompletionDTO completion = wizardCompletionService.loadWizardCompletion(wizardId);
            return completion != null &&
                   completion.isWizardCompleted() &&
                   completion.isCanReturnToOrderList();

        } catch (Exception e) {
            logger.error("Помилка перевірки можливості переходу до списку замовлень для wizard {}: {}", wizardId, e.getMessage(), e);
            return false;
        }
    }

    /**
     * Перевіряє чи можна повторно надрукувати квитанцію.
     */
    public boolean canPrintAgain(String wizardId) {
        try {
            WizardCompletionDTO completion = wizardCompletionService.loadWizardCompletion(wizardId);
            return completion != null && completion.isCanPrintAgain();

        } catch (Exception e) {
            logger.error("Помилка перевірки можливості повторного друку для wizard {}: {}", wizardId, e.getMessage(), e);
            return false;
        }
    }

    /**
     * Перевіряє чи можна повторно відправити email.
     */
    public boolean canResendEmail(String wizardId) {
        try {
            WizardCompletionDTO completion = wizardCompletionService.loadWizardCompletion(wizardId);
            return completion != null && completion.isCanResendEmail();

        } catch (Exception e) {
            logger.error("Помилка перевірки можливості повторного відправлення email для wizard {}: {}", wizardId, e.getMessage(), e);
            return false;
        }
    }

    // Приватні методи для внутрішніх перевірок

    private boolean isReceiptGenerationCompleted(String wizardId) {
        try {
            ReceiptGenerationDTO receiptGeneration = receiptGenerationService.loadReceiptGeneration(wizardId);

            if (receiptGeneration == null) {
                return false;
            }

            // Квитанція повинна бути згенерована
            if (!receiptGeneration.isPdfGenerated()) {
                return false;
            }

            // Не повинно бути помилок
            return !receiptGeneration.isHasErrors();

        } catch (Exception e) {
            logger.error("Помилка перевірки завершення генерації квитанції для wizard {}: {}", wizardId, e.getMessage(), e);
            return false;
        }
    }

    private boolean hasRequiredOrderData(Map<String, Object> wizardData) {
        // Перевіряємо наявність основних даних

        // Клієнт
        if (!wizardData.containsKey("finalSelectedClient")) {
            logger.warn("Відсутні дані клієнта");
            return false;
        }

        // Номер квитанції
        if (!wizardData.containsKey("finalReceiptNumber")) {
            logger.warn("Відсутній номер квитанції");
            return false;
        }

        // Предмети
        Object items = wizardData.get("items");
        if (items == null || !(items instanceof java.util.List<?> itemsList) || itemsList.isEmpty()) {
            logger.warn("Відсутні предмети замовлення");
            return false;
        }

        // Фінансова інформація
        if (!wizardData.containsKey("orderPayment")) {
            logger.warn("Відсутня фінансова інформація");
            return false;
        }

        return true;
    }
}
