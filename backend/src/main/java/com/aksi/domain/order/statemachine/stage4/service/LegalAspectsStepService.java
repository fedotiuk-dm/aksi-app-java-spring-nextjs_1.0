package com.aksi.domain.order.statemachine.stage4.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.aksi.domain.order.dto.CustomerSignatureRequest;
import com.aksi.domain.order.dto.CustomerSignatureResponse;
import com.aksi.domain.order.service.CustomerSignatureService;
import com.aksi.domain.order.statemachine.service.OrderWizardPersistenceService;
import com.aksi.domain.order.statemachine.stage4.dto.LegalAspectsDTO;
import com.aksi.domain.order.statemachine.stage4.mapper.LegalAspectsMapper;
import com.aksi.domain.order.statemachine.stage4.validator.LegalAspectsValidator;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Сервіс для підетапу 4.2 "Юридичні аспекти".
 *
 * Відповідає за:
 * - Управління прийняттям умов послуг
 * - Збереження та завантаження цифрових підписів
 * - Валідацію юридичних аспектів замовлення
 * - Інтеграцію з CustomerSignatureService
 */
@Service
public class LegalAspectsStepService {

    private static final Logger logger = LoggerFactory.getLogger(LegalAspectsStepService.class);

    private static final String LEGAL_ASPECTS_KEY = "legalAspects";
    private static final int STAGE_NUMBER = 4;
    private static final int STEP_NUMBER = 2;

    private final OrderWizardPersistenceService persistenceService;
    private final CustomerSignatureService signatureService;
    private final LegalAspectsValidator validator;
    private final LegalAspectsMapper mapper;
    private final ObjectMapper objectMapper;

    public LegalAspectsStepService(
            OrderWizardPersistenceService persistenceService,
            CustomerSignatureService signatureService,
            LegalAspectsValidator validator,
            LegalAspectsMapper mapper,
            ObjectMapper objectMapper) {
        this.persistenceService = persistenceService;
        this.signatureService = signatureService;
        this.validator = validator;
        this.mapper = mapper;
        this.objectMapper = objectMapper;
    }

    /**
     * Завантажує дані юридичних аспектів для wizard'а.
     */
    public LegalAspectsDTO loadLegalAspects(String wizardId) {
        logger.debug("Завантаження юридичних аспектів для wizard: {}", wizardId);

        try {
            Map<String, Object> wizardData = persistenceService.loadWizardData(wizardId);
            LegalAspectsDTO dto = loadSavedLegalAspects(wizardData);

            if (dto == null) {
                // Створюємо новий на основі базових даних wizard'а
                dto = createFromWizardData(wizardData);
            }

            // Завантажуємо існуючий підпис якщо є
            loadExistingSignature(dto);

            return dto;

        } catch (Exception e) {
            logger.error("Помилка завантаження юридичних аспектів для wizard {}: {}", wizardId, e.getMessage(), e);
            return createErrorDTO("Помилка завантаження: " + e.getMessage());
        }
    }

    /**
     * Зберігає дані юридичних аспектів.
     */
    public LegalAspectsDTO saveLegalAspects(String wizardId, LegalAspectsDTO legalAspects) {
        logger.debug("Збереження юридичних аспектів для wizard: {}", wizardId);

        try {
            // Валідуємо дані
            List<String> validationErrors = validator.validate(legalAspects);
            if (!validationErrors.isEmpty()) {
                legalAspects.clearErrors();
                validationErrors.forEach(legalAspects::addError);
                return legalAspects;
            }

            // Оновлюємо timestamp
            legalAspects.updateTimestamp();

            // Зберігаємо дані в wizard persistence
            persistenceService.saveWizardData(wizardId, LEGAL_ASPECTS_KEY, legalAspects, STAGE_NUMBER, STEP_NUMBER);

            legalAspects.clearErrors();

            logger.info("Юридичні аспекти збережено для wizard: {}", wizardId);
            return legalAspects;

        } catch (Exception e) {
            logger.error("Помилка збереження юридичних аспектів для wizard {}: {}", wizardId, e.getMessage(), e);
            legalAspects.setError("Помилка збереження: " + e.getMessage());
            return legalAspects;
        }
    }

        /**
     * Зберігає цифровий підпис клієнта.
     */
    public LegalAspectsDTO saveCustomerSignature(String wizardId, LegalAspectsDTO legalAspects) {
        logger.debug("Збереження підпису клієнта для wizard: {}", wizardId);

        try {
            if (!legalAspects.needsSignatureSave()) {
                logger.debug("Підпис не потребує збереження для wizard: {}", wizardId);
                return legalAspects;
            }

            // Створюємо запит для збереження підпису
            CustomerSignatureRequest signatureRequest = legalAspects.toSignatureRequest();

            // Зберігаємо підпис через CustomerSignatureService
            CustomerSignatureResponse savedSignature = signatureService.saveSignature(signatureRequest);

            // Оновлюємо DTO з збереженим підписом
            legalAspects.updateFromExistingSignature(savedSignature);

            // Зберігаємо оновлені дані
            return saveLegalAspects(wizardId, legalAspects);

        } catch (Exception e) {
            logger.error("Помилка збереження підпису для wizard {}: {}", wizardId, e.getMessage(), e);
            legalAspects.setError("Помилка збереження підпису: " + e.getMessage());
            return legalAspects;
        }
    }

    /**
     * Очищає підпис клієнта.
     */
    public LegalAspectsDTO clearSignature(String wizardId, LegalAspectsDTO legalAspects) {
        logger.debug("Очищення підпису для wizard: {}", wizardId);

        try {
            legalAspects.clearSignature();
            return saveLegalAspects(wizardId, legalAspects);

        } catch (Exception e) {
            logger.error("Помилка очищення підпису для wizard {}: {}", wizardId, e.getMessage(), e);
            legalAspects.setError("Помилка очищення підпису: " + e.getMessage());
            return legalAspects;
        }
    }

    /**
     * Перевіряє чи можна перейти до наступного кроку.
     */
    public boolean canProceedToNextStep(String wizardId) {
        try {
            Map<String, Object> wizardData = persistenceService.loadWizardData(wizardId);
            LegalAspectsDTO dto = loadSavedLegalAspects(wizardData);

            return dto != null && validator.canProceedToNext(dto);
        } catch (Exception e) {
            logger.error("Помилка перевірки готовності для wizard {}: {}", wizardId, e.getMessage(), e);
            return false;
        }
    }

    // Приватні методи helper

    private LegalAspectsDTO loadSavedLegalAspects(Map<String, Object> wizardData) {
        try {
            Object data = wizardData.get(LEGAL_ASPECTS_KEY);
            if (data == null) return null;

            if (data instanceof LegalAspectsDTO) {
                return (LegalAspectsDTO) data;
            } else {
                return objectMapper.convertValue(data, LegalAspectsDTO.class);
            }
        } catch (Exception e) {
            logger.error("Помилка завантаження збережених юридичних аспектів: {}", e.getMessage(), e);
            return null;
        }
    }

    private LegalAspectsDTO createFromWizardData(Map<String, Object> wizardData) {
        try {
            // Отримуємо базові дані для створення нового DTO
            UUID orderId = extractOrderId(wizardData);
            String receiptNumber = extractReceiptNumber(wizardData);

            return LegalAspectsDTO.builder()
                    .orderId(orderId)
                    .receiptNumber(receiptNumber)
                    .termsAccepted(false)
                    .signatureCompleted(false)
                    .hasErrors(false)
                    .isLoading(false)
                    .lastUpdated(LocalDateTime.now())
                    .build();

        } catch (Exception e) {
            logger.error("Помилка створення LegalAspectsDTO з wizard data: {}", e.getMessage(), e);
            return createErrorDTO("Помилка створення даних: " + e.getMessage());
        }
    }

    private void loadExistingSignature(LegalAspectsDTO dto) {
        try {
            if (dto.getOrderId() == null) {
                return;
            }

            // Шукаємо існуючий підпис для замовлення типу CUSTOMER_ACCEPTANCE
            Optional<CustomerSignatureResponse> existingSignatureOpt =
                signatureService.getSignatureByOrderIdAndType(dto.getOrderId(), "CUSTOMER_ACCEPTANCE");

            if (existingSignatureOpt.isPresent()) {
                CustomerSignatureResponse existingSignature = existingSignatureOpt.get();
                dto.updateFromExistingSignature(existingSignature);
                logger.debug("Завантажено існуючий підпис для замовлення: {}", dto.getOrderId());
            }

        } catch (Exception e) {
            logger.error("Помилка завантаження існуючого підпису для замовлення {}: {}", dto.getOrderId(), e.getMessage(), e);
            dto.addError("Помилка завантаження існуючого підпису");
        }
    }

    private UUID extractOrderId(Map<String, Object> wizardData) {
        try {
            // Спробуємо знайти orderId в різних можливих місцях
            Object orderIdValue = wizardData.get("orderId");
            if (orderIdValue instanceof UUID) {
                return (UUID) orderIdValue;
            } else if (orderIdValue instanceof String) {
                return UUID.fromString((String) orderIdValue);
            }

            // Спробуємо отримати з finalizedOrder якщо є
            Object finalizedOrderValue = wizardData.get("finalizedOrder");
            if (finalizedOrderValue instanceof Map<?, ?> orderMap) {
                Object orderMapOrderId = ((Map<?, ?>) orderMap).get("id");
                if (orderMapOrderId instanceof UUID) {
                    return (UUID) orderMapOrderId;
                } else if (orderMapOrderId instanceof String) {
                    return UUID.fromString((String) orderMapOrderId);
                }
            }

            // Генеруємо тимчасовий UUID якщо не знайшли
            UUID tempId = UUID.randomUUID();
            logger.warn("Не знайдено orderId в wizard data, генерую тимчасовий: {}", tempId);
            return tempId;

        } catch (Exception e) {
            logger.warn("Не вдалося витягти orderId з wizard data: {}", e.getMessage());
            return UUID.randomUUID();
        }
    }

    private String extractReceiptNumber(Map<String, Object> wizardData) {
        try {
            // Спробуємо отримати з finalReceiptNumber (Stage1)
            Object receiptNumberValue = wizardData.get("finalReceiptNumber");
            if (receiptNumberValue instanceof String) {
                return (String) receiptNumberValue;
            }

            // Спробуємо отримати з receiptNumber
            receiptNumberValue = wizardData.get("receiptNumber");
            if (receiptNumberValue instanceof String) {
                return (String) receiptNumberValue;
            }

            // Спробуємо отримати з finalizedOrder якщо є
            Object finalizedOrderValue = wizardData.get("finalizedOrder");
            if (finalizedOrderValue instanceof Map<?, ?> orderMap) {
                Object orderReceiptNumber = ((Map<?, ?>) orderMap).get("receiptNumber");
                if (orderReceiptNumber instanceof String) {
                    return (String) orderReceiptNumber;
                }
            }

            // Генеруємо тимчасовий номер якщо не знайшли
            String tempReceipt = "TEMP-" + System.currentTimeMillis();
            logger.warn("Не знайдено receiptNumber в wizard data, генерую тимчасовий: {}", tempReceipt);
            return tempReceipt;

        } catch (Exception e) {
            logger.warn("Не вдалося витягти receiptNumber з wizard data: {}", e.getMessage());
            return "ERROR-" + System.currentTimeMillis();
        }
    }

    private LegalAspectsDTO createErrorDTO(String errorMessage) {
        return LegalAspectsDTO.builder()
                .hasErrors(true)
                .errorMessage(errorMessage)
                .isLoading(false)
                .termsAccepted(false)
                .signatureCompleted(false)
                .lastUpdated(LocalDateTime.now())
                .build();
    }
}
