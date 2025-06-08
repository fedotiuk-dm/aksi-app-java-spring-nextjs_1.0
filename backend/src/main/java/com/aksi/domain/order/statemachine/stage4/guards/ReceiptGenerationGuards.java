package com.aksi.domain.order.statemachine.stage4.guards;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage4.dto.ReceiptGenerationDTO;
import com.aksi.domain.order.statemachine.stage4.service.ReceiptGenerationStepService;
import com.aksi.domain.order.statemachine.stage4.validator.ReceiptGenerationValidator;

/**
 * Guards для підетапу 4.3 генерації квитанції.
 *
 * Перевіряє умови переходів між станами для процесу генерації PDF.
 */
@Component
public class ReceiptGenerationGuards {

    private static final Logger logger = LoggerFactory.getLogger(ReceiptGenerationGuards.class);

    private final ReceiptGenerationStepService service;
    private final ReceiptGenerationValidator validator;

    public ReceiptGenerationGuards(
            ReceiptGenerationStepService service,
            ReceiptGenerationValidator validator) {
        this.service = service;
        this.validator = validator;
    }

    /**
     * Перевіряє чи можна перейти до підетапу 4.3.
     */
    public boolean canProceedToReceiptGenerationStep(String wizardId, Map<String, Object> wizardData) {
        try {
            logger.debug("Перевірка переходу до генерації квитанції для wizard: {}", wizardId);

            // Перевіряємо наявність необхідних даних з попередніх етапів
            if (!hasRequiredWizardData(wizardData)) {
                logger.warn("Відсутні необхідні дані wizard для генерації квитанції: {}", wizardId);
                return false;
            }

            // Перевіряємо завершеність етапу 4.2 (Legal Aspects)
            if (!isLegalAspectsCompleted(wizardData)) {
                logger.warn("Етап 4.2 (Legal Aspects) не завершено для wizard: {}", wizardId);
                return false;
            }

            return true;

        } catch (Exception e) {
            logger.error("Помилка перевірки переходу до генерації квитанції для wizard {}: {}", wizardId, e.getMessage(), e);
            return false;
        }
    }

    /**
     * Перевіряє чи можна піти з підетапу 4.3.
     */
    public boolean canProceedFromReceiptGenerationStep(String wizardId, Map<String, Object> wizardData) {
        try {
            logger.debug("Перевірка виходу з генерації квитанції для wizard: {}", wizardId);

            ReceiptGenerationDTO receiptGeneration = service.loadReceiptGeneration(wizardId);

            if (receiptGeneration == null) {
                logger.warn("Не знайдено дані генерації квитанції для wizard: {}", wizardId);
                return false;
            }

            return validator.canProceedToNext(receiptGeneration);

        } catch (Exception e) {
            logger.error("Помилка перевірки виходу з генерації квитанції для wizard {}: {}", wizardId, e.getMessage(), e);
            return false;
        }
    }

    /**
     * Перевіряє чи готові дані для генерації PDF.
     */
    public boolean isReadyForPdfGeneration(String wizardId) {
        try {
            ReceiptGenerationDTO receiptGeneration = service.loadReceiptGeneration(wizardId);
            return receiptGeneration != null && receiptGeneration.isReadyForGeneration();

        } catch (Exception e) {
            logger.error("Помилка перевірки готовності для генерації PDF wizard {}: {}", wizardId, e.getMessage(), e);
            return false;
        }
    }

    /**
     * Перевіряє чи PDF згенеровано.
     */
    public boolean isPdfGenerated(String wizardId) {
        try {
            ReceiptGenerationDTO receiptGeneration = service.loadReceiptGeneration(wizardId);
            return receiptGeneration != null && receiptGeneration.isPdfGenerated();

        } catch (Exception e) {
            logger.error("Помилка перевірки генерації PDF wizard {}: {}", wizardId, e.getMessage(), e);
            return false;
        }
    }

    /**
     * Перевіряє чи можна надіслати email.
     */
    public boolean canSendEmail(String wizardId) {
        try {
            ReceiptGenerationDTO receiptGeneration = service.loadReceiptGeneration(wizardId);
            return receiptGeneration != null && receiptGeneration.canSendEmail();

        } catch (Exception e) {
            logger.error("Помилка перевірки можливості надсилання email wizard {}: {}", wizardId, e.getMessage(), e);
            return false;
        }
    }

    /**
     * Перевіряє чи процес повністю завершено.
     */
    public boolean isReceiptGenerationCompleted(String wizardId) {
        try {
            ReceiptGenerationDTO receiptGeneration = service.loadReceiptGeneration(wizardId);
            return receiptGeneration != null && receiptGeneration.isCompleted();

        } catch (Exception e) {
            logger.error("Помилка перевірки завершення генерації квитанції wizard {}: {}", wizardId, e.getMessage(), e);
            return false;
        }
    }

    /**
     * Перевіряє чи можна завершити весь wizard.
     */
    public boolean canCompleteWizard(String wizardId) {
        try {
            return service.canCompleteWizard(wizardId);

        } catch (Exception e) {
            logger.error("Помилка перевірки завершення wizard {}: {}", wizardId, e.getMessage(), e);
            return false;
        }
    }

    // Приватні методи перевірки

    private boolean hasRequiredWizardData(Map<String, Object> wizardData) {
        if (wizardData == null || wizardData.isEmpty()) {
            return false;
        }

        // Перевіряємо наявність базових даних
        boolean hasBasicData = wizardData.containsKey("finalReceiptNumber") &&
                              wizardData.containsKey("finalSelectedClient") &&
                              wizardData.containsKey("finalBranch");

        // Перевіряємо наявність предметів
        boolean hasItems = wizardData.containsKey("items") &&
                          wizardData.get("items") instanceof java.util.List<?> &&
                          !((java.util.List<?>) wizardData.get("items")).isEmpty();

        // Перевіряємо фінансові дані
        boolean hasFinancialData = wizardData.containsKey("orderPayment");

        return hasBasicData && hasItems && hasFinancialData;
    }

    private boolean isLegalAspectsCompleted(Map<String, Object> wizardData) {
        Object legalAspectsData = wizardData.get("legalAspects");
        if (!(legalAspectsData instanceof Map<?, ?>)) {
            return false;
        }

        Map<?, ?> legalAspects = (Map<?, ?>) legalAspectsData;

        // Перевіряємо прийняття умов
        Object termsAccepted = legalAspects.get("termsAccepted");
        if (!(termsAccepted instanceof Boolean) || !((Boolean) termsAccepted)) {
            return false;
        }

        // Перевіряємо наявність підпису
        Object signatureData = legalAspects.get("signatureData");
        return signatureData instanceof String &&
               !((String) signatureData).trim().isEmpty();
    }
}
