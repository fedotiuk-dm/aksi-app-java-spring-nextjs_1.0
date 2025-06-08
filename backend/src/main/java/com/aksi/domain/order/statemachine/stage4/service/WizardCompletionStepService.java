package com.aksi.domain.order.statemachine.stage4.service;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.aksi.domain.order.dto.OrderDTO;
import com.aksi.domain.order.service.OrderService;
import com.aksi.domain.order.statemachine.service.OrderWizardPersistenceService;
import com.aksi.domain.order.statemachine.stage4.dto.ReceiptGenerationDTO;
import com.aksi.domain.order.statemachine.stage4.dto.WizardCompletionDTO;
import com.aksi.domain.order.statemachine.stage4.mapper.WizardCompletionMapper;
import com.aksi.domain.order.statemachine.stage4.validator.WizardCompletionValidator;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Сервіс для управління підетапом 4.4 "Завершення процесу".
 *
 * Відповідає за:
 * - Фіналізацію замовлення через OrderService
 * - Генерацію completion summary
 * - Очищення wizard data
 * - Підготовку опцій для подальших дій
 */
@Service
public class WizardCompletionStepService {

    private static final Logger logger = LoggerFactory.getLogger(WizardCompletionStepService.class);

    // Ключі для wizard persistence
    private static final String WIZARD_COMPLETION_KEY = "wizardCompletion";

    // Stage та step номери для persistence
    private static final int STAGE_NUMBER = 4;
    private static final int STEP_NUMBER = 4;

    private final OrderWizardPersistenceService persistenceService;
    private final OrderService orderService;
    private final ReceiptGenerationStepService receiptGenerationService;
    private final WizardCompletionValidator validator;
    private final WizardCompletionMapper mapper;
    private final ObjectMapper objectMapper;

    public WizardCompletionStepService(
            OrderWizardPersistenceService persistenceService,
            OrderService orderService,
            ReceiptGenerationStepService receiptGenerationService,
            WizardCompletionValidator validator,
            WizardCompletionMapper mapper,
            ObjectMapper objectMapper) {
        this.persistenceService = persistenceService;
        this.orderService = orderService;
        this.receiptGenerationService = receiptGenerationService;
        this.validator = validator;
        this.mapper = mapper;
        this.objectMapper = objectMapper;
    }

    /**
     * Завантажує дані підетапу 4.4 "Завершення процесу".
     */
    public WizardCompletionDTO loadWizardCompletion(String wizardId) {
        logger.debug("Завантаження завершення wizard для: {}", wizardId);

        try {
            Map<String, Object> wizardData = persistenceService.loadWizardData(wizardId);
            WizardCompletionDTO dto = loadSavedCompletion(wizardData);

            if (dto == null) {
                dto = createFromWizardData(wizardData, wizardId);
            }

            if (dto == null) {
                dto = createDefaultCompletion();
            }

            return dto;

        } catch (Exception e) {
            logger.error("Помилка завантаження завершення wizard {}: {}", wizardId, e.getMessage(), e);
            return createErrorCompletion("Помилка завантаження даних: " + e.getMessage());
        }
    }

    /**
     * Фіналізує замовлення через OrderService.
     */
    public WizardCompletionDTO finalizeOrder(String wizardId, WizardCompletionDTO completion) {
        logger.debug("Фіналізація замовлення для wizard: {}", wizardId);

        try {
            // Перевіряємо чи замовлення вже фіналізовано
            if (completion.isOrderFinalized()) {
                logger.info("Замовлення вже фіналізовано для wizard: {}", wizardId);
                return completion;
            }

            // Отримуємо CreateOrderRequest з wizard data
            Map<String, Object> wizardData = persistenceService.loadWizardData(wizardId);
            com.aksi.domain.order.dto.CreateOrderRequest orderRequest = mapper.extractCreateOrderRequestFromWizardData(wizardData);

            if (orderRequest == null) {
                completion.addError("Не вдалося створити замовлення з wizard data");
                return completion;
            }

            // Створюємо замовлення через OrderService
            OrderDTO createdOrder = orderService.createOrder(orderRequest);

            if (createdOrder == null || createdOrder.getId() == null) {
                completion.addError("Помилка створення замовлення в системі");
                return completion;
            }

            // Позначаємо як фіналізоване
            completion.markOrderFinalized(createdOrder.getId(), createdOrder.getReceiptNumber());

            logger.info("Замовлення фіналізовано для wizard: {} з ID: {}", wizardId, createdOrder.getId());

            return saveWizardCompletion(wizardId, completion);

        } catch (Exception e) {
            logger.error("Помилка фіналізації замовлення для wizard {}: {}", wizardId, e.getMessage(), e);
            completion.addError("Помилка фіналізації замовлення: " + e.getMessage());
            return completion;
        }
    }

    /**
     * Синхронізує стан з етапом 4.3 (генерація квитанції).
     */
    public WizardCompletionDTO syncWithReceiptGeneration(String wizardId, WizardCompletionDTO completion) {
        logger.debug("Синхронізація з генерацією квитанції для wizard: {}", wizardId);

        try {
            ReceiptGenerationDTO receiptGeneration = receiptGenerationService.loadReceiptGeneration(wizardId);

            if (receiptGeneration != null) {
                // Синхронізуємо стан PDF
                if (receiptGeneration.isPdfGenerated() && !completion.isPdfGenerated()) {
                    completion.markPdfGenerated();
                }

                // Синхронізуємо стан друку
                if (receiptGeneration.isPrinted() && !completion.isPrinted()) {
                    completion.markPrinted();
                }

                // Синхронізуємо стан email
                if (receiptGeneration.isEmailSent() && !completion.isEmailSent()) {
                    completion.markEmailSent(receiptGeneration.getClientEmail());
                }
            }

            return saveWizardCompletion(wizardId, completion);

        } catch (Exception e) {
            logger.error("Помилка синхронізації з генерацією квитанції для wizard {}: {}", wizardId, e.getMessage(), e);
            completion.addError("Помилка синхронізації стану: " + e.getMessage());
            return completion;
        }
    }

    /**
     * Завершує wizard повністю.
     */
    public WizardCompletionDTO completeWizard(String wizardId, WizardCompletionDTO completion) {
        logger.debug("Завершення wizard: {}", wizardId);

        try {
            // Валідуємо можливість завершення
            List<String> validationErrors = validator.validateForCompletion(completion);
            if (!validationErrors.isEmpty()) {
                completion.clearErrors();
                validationErrors.forEach(completion::addError);
                return completion;
            }

            // Синхронізуємо з етапом генерації квитанції
            completion = syncWithReceiptGeneration(wizardId, completion);

            // Позначаємо wizard як завершений
            completion.markWizardCompleted();

            // Підготовуємо опції для подальших дій
            completion.prepareForNewOrder();

            logger.info("Wizard завершено для: {}", wizardId);

            return saveWizardCompletion(wizardId, completion);

        } catch (Exception e) {
            logger.error("Помилка завершення wizard {}: {}", wizardId, e.getMessage(), e);
            completion.addError("Помилка завершення: " + e.getMessage());
            return completion;
        }
    }

    /**
     * Очищує дані wizard для нового замовлення.
     */
    public boolean clearWizardForNewOrder(String wizardId) {
        logger.debug("Очищення wizard для нового замовлення: {}", wizardId);

        try {
            // Зберігаємо completion info для історії, якщо потрібно
            WizardCompletionDTO completion = loadWizardCompletion(wizardId);
            if (completion != null && completion.isWizardCompleted()) {
                // Можна зберегти в історію або архів
                logger.info("Збереження завершеного wizard в історію: {}", wizardId);
            }

            // Деактивуємо wizard session
            persistenceService.deactivateWizardSession(wizardId);

            logger.info("Wizard очищено для нового замовлення: {}", wizardId);
            return true;

        } catch (Exception e) {
            logger.error("Помилка очищення wizard {}: {}", wizardId, e.getMessage(), e);
            return false;
        }
    }

    /**
     * Зберігає дані завершення wizard.
     */
    public WizardCompletionDTO saveWizardCompletion(String wizardId, WizardCompletionDTO completion) {
        logger.debug("Збереження завершення wizard: {}", wizardId);

        try {
            // Валідуємо дані
            List<String> validationErrors = validator.validate(completion);
            if (!validationErrors.isEmpty()) {
                completion.clearErrors();
                validationErrors.forEach(completion::addError);
                return completion;
            }

            // Оновлюємо timestamp
            completion.updateTimestamp();

            // Зберігаємо дані в wizard persistence
            persistenceService.saveWizardData(wizardId, WIZARD_COMPLETION_KEY, completion, STAGE_NUMBER, STEP_NUMBER);

            completion.clearErrors();

            logger.info("Завершення wizard збережено для: {}", wizardId);
            return completion;

        } catch (Exception e) {
            logger.error("Помилка збереження завершення wizard {}: {}", wizardId, e.getMessage(), e);
            completion.addError("Помилка збереження: " + e.getMessage());
            return completion;
        }
    }

    /**
     * Перевіряє чи wizard повністю завершено.
     */
    public boolean isWizardFullyCompleted(String wizardId) {
        try {
            WizardCompletionDTO completion = loadWizardCompletion(wizardId);
            return completion != null && completion.isFullyCompleted();

        } catch (Exception e) {
            logger.error("Помилка перевірки завершення wizard {}: {}", wizardId, e.getMessage(), e);
            return false;
        }
    }

    // Приватні методи helper

    private WizardCompletionDTO loadSavedCompletion(Map<String, Object> wizardData) {
        try {
            Object data = wizardData.get(WIZARD_COMPLETION_KEY);
            if (data == null) return null;

            if (data instanceof WizardCompletionDTO) {
                return (WizardCompletionDTO) data;
            } else {
                return objectMapper.convertValue(data, WizardCompletionDTO.class);
            }
        } catch (Exception e) {
            logger.error("Помилка завантаження збереженого завершення: {}", e.getMessage(), e);
            return null;
        }
    }

    private WizardCompletionDTO createFromWizardData(Map<String, Object> wizardData, String wizardId) {
        try {
            // Використовуємо mapper для створення з wizard data
            WizardCompletionDTO dto = mapper.createFromWizardData(wizardData);

            if (dto != null) {
                // Синхронізуємо з етапом генерації квитанції
                syncWithReceiptGeneration(wizardId, dto);
            }

            return dto;

        } catch (Exception e) {
            logger.error("Помилка створення WizardCompletionDTO з wizard data: {}", e.getMessage(), e);
            return null;
        }
    }

    private WizardCompletionDTO createDefaultCompletion() {
        return WizardCompletionDTO.builder()
                .hasErrors(false)
                .build();
    }

    private WizardCompletionDTO createErrorCompletion(String errorMessage) {
        return WizardCompletionDTO.builder()
                .hasErrors(true)
                .errorMessage(errorMessage)
                .build();
    }
}
