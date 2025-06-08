package com.aksi.domain.order.statemachine.stage3.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.aksi.domain.order.dto.CompletionDateCalculationRequest;
import com.aksi.domain.order.dto.CompletionDateResponse;
import com.aksi.domain.order.model.ExpediteType;
import com.aksi.domain.order.service.CompletionDateService;
import com.aksi.domain.order.statemachine.service.OrderWizardPersistenceService;
import com.aksi.domain.order.statemachine.stage3.dto.ExecutionParametersDTO;
import com.aksi.domain.order.statemachine.stage3.mapper.ExecutionParametersMapper;
import com.aksi.domain.order.statemachine.stage3.validator.ExecutionParametersValidator;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Сервіс для управління підетапом 3.1 "Параметри виконання".
 *
 * Відповідає за:
 * - Розрахунок дат виконання через CompletionDateService
 * - Розрахунок надбавок за терміновість
 * - Валідацію параметрів виконання
 * - Збереження стану через OrderWizardPersistenceService
 */
@Service
public class ExecutionParametersStepService {

    private static final Logger logger = LoggerFactory.getLogger(ExecutionParametersStepService.class);

    // Ключі для wizard persistence
    private static final String EXECUTION_PARAMS_KEY = "executionParameters";

    // Stage та step номери для persistence
    private static final int STAGE_NUMBER = 3;
    private static final int STEP_NUMBER = 1;

    private final OrderWizardPersistenceService persistenceService;
    private final CompletionDateService completionDateService;
    private final ExecutionParametersValidator validator;
    private final ExecutionParametersMapper mapper;
    private final ObjectMapper objectMapper;

    public ExecutionParametersStepService(
            OrderWizardPersistenceService persistenceService,
            CompletionDateService completionDateService,
            ExecutionParametersValidator validator,
            ExecutionParametersMapper mapper,
            ObjectMapper objectMapper) {
        this.persistenceService = persistenceService;
        this.completionDateService = completionDateService;
        this.validator = validator;
        this.mapper = mapper;
        this.objectMapper = objectMapper;
    }

    /**
     * Завантажує дані підетапу 3.1 "Параметри виконання".
     */
    public ExecutionParametersDTO loadExecutionParameters(String wizardId) {
        logger.debug("Завантаження параметрів виконання для wizard: {}", wizardId);

        try {
            Map<String, Object> wizardData = persistenceService.loadWizardData(wizardId);
            ExecutionParametersDTO dto = loadSavedExecutionParameters(wizardData);

            if (dto == null) {
                dto = createFromOrderData(wizardData);
            }

            if (dto == null) {
                dto = createDefaultExecutionParameters();
            }

            // Завантажуємо/оновлюємо розрахунки дат
            loadDateCalculations(dto, wizardData);

            // Оновлюємо розрахунки вартості
            updateCostCalculations(dto, wizardData);

            return dto;

        } catch (Exception e) {
            logger.error("Помилка завантаження параметрів виконання для wizard {}: {}", wizardId, e.getMessage(), e);
            return createErrorExecutionParameters("Помилка завантаження даних: " + e.getMessage());
        }
    }

    /**
     * Зберігає параметри виконання.
     */
    public ExecutionParametersDTO saveExecutionParameters(String wizardId, ExecutionParametersDTO executionParams) {
        logger.debug("Збереження параметрів виконання для wizard: {}", wizardId);

        try {
            List<String> validationErrors = validator.validate(executionParams);
            if (!validationErrors.isEmpty()) {
                executionParams.clearErrors();
                validationErrors.forEach(executionParams::addError);
                return executionParams;
            }

            // Перерахунок надбавок за терміновість
            recalculateExpediteCharges(executionParams);

            // Оновлюємо timestamp
            executionParams.updateTimestamp();

            // Зберігаємо дані
            persistenceService.saveWizardData(wizardId, EXECUTION_PARAMS_KEY, executionParams, STAGE_NUMBER, STEP_NUMBER);

            executionParams.setIsCompleted(true);
            executionParams.clearErrors();

            logger.info("Параметри виконання збережено для wizard: {}", wizardId);
            return executionParams;

        } catch (Exception e) {
            logger.error("Помилка збереження параметрів виконання для wizard {}: {}", wizardId, e.getMessage(), e);
            executionParams.setError("Помилка збереження: " + e.getMessage());
            return executionParams;
        }
    }

    /**
     * Оновлює тип терміновості та перераховує дати і вартість.
     */
    public ExecutionParametersDTO updateExpediteType(String wizardId, ExpediteType expediteType) {
        logger.debug("Оновлення типу терміновості для wizard: {} на {}", wizardId, expediteType);

        try {
            ExecutionParametersDTO dto = loadExecutionParameters(wizardId);
            dto.setExpediteType(expediteType);

            // Перерахунок дат на основі нового типу терміновості
            recalculateDatesForExpediteType(dto);

            // Перерахунок надбавок
            recalculateExpediteCharges(dto);

            // Валідація після змін
            List<String> errors = validator.validate(dto);
            if (!errors.isEmpty()) {
                dto.clearErrors();
                errors.forEach(dto::addError);
            }

            return saveExecutionParameters(wizardId, dto);

        } catch (Exception e) {
            logger.error("Помилка оновлення типу терміновості для wizard {}: {}", wizardId, e.getMessage(), e);
            ExecutionParametersDTO errorDto = createErrorExecutionParameters("Помилка оновлення типу терміновості");
            errorDto.setExpediteType(expediteType);
            return errorDto;
        }
    }

    /**
     * Перевіряє чи можна перейти до наступного кроку.
     */
    public boolean canProceedToNextStep(String wizardId) {
        try {
            Map<String, Object> wizardData = persistenceService.loadWizardData(wizardId);
            ExecutionParametersDTO dto = loadSavedExecutionParameters(wizardData);

            return dto != null && validator.canProceedToNext(dto);
        } catch (Exception e) {
            logger.error("Помилка перевірки готовності для wizard {}: {}", wizardId, e.getMessage(), e);
            return false;
        }
    }

    // Приватні методи helper

    private ExecutionParametersDTO loadSavedExecutionParameters(Map<String, Object> wizardData) {
        try {
            Object data = wizardData.get(EXECUTION_PARAMS_KEY);
            if (data == null) return null;

            if (data instanceof ExecutionParametersDTO) {
                return (ExecutionParametersDTO) data;
            } else {
                return objectMapper.convertValue(data, ExecutionParametersDTO.class);
            }
        } catch (Exception e) {
            logger.error("Помилка завантаження збережених параметрів виконання: {}", e.getMessage(), e);
            return null;
        }
    }

        private ExecutionParametersDTO createFromOrderData(Map<String, Object> wizardData) {
        try {
            // Створюємо пустий DTO через існуючий метод
            ExecutionParametersDTO dto = createDefaultExecutionParameters();

            // Завантажуємо розрахунки дат на основі категорій з попередніх етапів
            loadDateCalculations(dto, wizardData);

            // Оновлюємо розрахунки вартості на основі предметів з попередніх етапів
            updateCostCalculations(dto, wizardData);

            logger.debug("Інтегровано дані з попередніх етапів wizard: {}", wizardData.keySet());
            return dto;

        } catch (Exception e) {
            logger.error("Помилка створення з даних замовлення: {}", e.getMessage(), e);
            return null;
        }
    }

    private void loadDateCalculations(ExecutionParametersDTO dto, Map<String, Object> wizardData) {
        try {
            // Отримуємо категорії з попередніх етапів
            List<UUID> categoryIds = extractCategoryIdsFromWizardData(wizardData);

            if (categoryIds != null && !categoryIds.isEmpty()) {
                CompletionDateCalculationRequest request = CompletionDateCalculationRequest.builder()
                        .serviceCategoryIds(categoryIds)
                        .expediteType(dto.getExpediteType())
                        .build();

                CompletionDateResponse response = completionDateService.calculateExpectedCompletionDate(request);
                mapper.updateWithDateCalculations(dto, response);
            }
        } catch (Exception e) {
            logger.error("Помилка завантаження розрахунків дат: {}", e.getMessage(), e);
            dto.addError("Помилка розрахунку дат виконання");
        }
    }

    private void updateCostCalculations(ExecutionParametersDTO dto, Map<String, Object> wizardData) {
        try {
            // Отримуємо базову вартість з попередніх етапів
            BigDecimal baseTotal = extractBaseTotalFromWizardData(wizardData);

            if (baseTotal != null) {
                dto.setBaseOrderTotal(baseTotal);
                recalculateExpediteCharges(dto);
            }
        } catch (Exception e) {
            logger.error("Помилка оновлення розрахунків вартості: {}", e.getMessage(), e);
        }
    }

    private void recalculateExpediteCharges(ExecutionParametersDTO dto) {
        if (dto.getBaseOrderTotal() == null || dto.getExpediteType() == null) {
            return;
        }

        BigDecimal expeditePercentage = dto.getExpeditePercentage();
        BigDecimal expediteCharge = dto.getBaseOrderTotal().multiply(expeditePercentage);
        BigDecimal finalTotal = dto.getBaseOrderTotal().add(expediteCharge);

        dto.setExpediteChargeAmount(expediteCharge);
        dto.setFinalOrderTotal(finalTotal);
    }

    private void recalculateDatesForExpediteType(ExecutionParametersDTO dto) {
        try {
            // Можна викликати CompletionDateService з новим типом терміновості
            // Поки залишаємо базову логіку
            if (dto.getExpediteType() == ExpediteType.EXPRESS_24H) {
                dto.addExpediteWarning("Виконання за 24 години може вплинути на якість");
            } else if (dto.getExpediteType() == ExpediteType.EXPRESS_48H) {
                dto.addExpediteWarning("Виконання за 48 годин вимагає додаткової оплати");
            }
        } catch (Exception e) {
            logger.error("Помилка перерахунку дат: {}", e.getMessage(), e);
        }
    }

    private List<UUID> extractCategoryIdsFromWizardData(Map<String, Object> wizardData) {
        try {
            List<UUID> categoryIds = new java.util.ArrayList<>();

            // Отримуємо предмети з етапу 2
            Object itemsData = wizardData.get("items");
            if (itemsData instanceof List<?> itemsList) {
                for (Object itemObj : itemsList) {
                    if (itemObj instanceof Map<?, ?> itemMap) {
                        // Витягуємо categoryId з кожного предмета
                        Object categoryId = itemMap.get("categoryId");
                        if (categoryId instanceof String categoryIdStr) {
                            try {
                                categoryIds.add(UUID.fromString(categoryIdStr));
                            } catch (IllegalArgumentException e) {
                                logger.warn("Неправильний формат categoryId: {}", categoryIdStr);
                            }
                        }

                        // Альтернативно можемо шукати за category (назва категорії)
                        Object categoryName = itemMap.get("category");
                        if (categoryName instanceof String categoryNameStr && categoryId == null) {
                            logger.debug("Знайдено категорію за назвою: {}", categoryNameStr);
                            // TODO: Можна додати мапінг назви категорії в UUID через service
                        }
                    }
                }
            }

            logger.debug("Витягнуто {} категорій з wizard даних", categoryIds.size());
            return categoryIds;

        } catch (Exception e) {
            logger.error("Помилка витягування категорій з wizard даних: {}", e.getMessage(), e);
            return List.of();
        }
    }

    private BigDecimal extractBaseTotalFromWizardData(Map<String, Object> wizardData) {
        try {
            BigDecimal total = BigDecimal.ZERO;

            // Отримуємо предмети з етапу 2
            Object itemsData = wizardData.get("items");
            if (itemsData instanceof List<?> itemsList) {
                for (Object itemObj : itemsList) {
                    if (itemObj instanceof Map<?, ?> itemMap) {
                        // Витягуємо ціну кожного предмета
                        Object totalPrice = itemMap.get("totalPrice");
                        Object finalPrice = itemMap.get("finalTotalPrice");
                        Object unitPrice = itemMap.get("unitPrice");
                        Object quantity = itemMap.get("quantity");

                        BigDecimal itemTotal = null;

                        // Пріоритет: finalTotalPrice -> totalPrice -> unitPrice * quantity
                        if (finalPrice instanceof Number) {
                            itemTotal = BigDecimal.valueOf(((Number) finalPrice).doubleValue());
                        } else if (totalPrice instanceof Number) {
                            itemTotal = BigDecimal.valueOf(((Number) totalPrice).doubleValue());
                        } else if (unitPrice instanceof Number && quantity instanceof Number) {
                            BigDecimal unit = BigDecimal.valueOf(((Number) unitPrice).doubleValue());
                            BigDecimal qty = BigDecimal.valueOf(((Number) quantity).doubleValue());
                            itemTotal = unit.multiply(qty);
                        }

                        if (itemTotal != null && itemTotal.compareTo(BigDecimal.ZERO) > 0) {
                            total = total.add(itemTotal);
                            logger.debug("Додано до загальної суми: {} (загалом: {})", itemTotal, total);
                        }
                    }
                }
            }

            logger.debug("Витягнуто базову суму з wizard даних: {}", total);
            return total.compareTo(BigDecimal.ZERO) > 0 ? total : null;

        } catch (Exception e) {
            logger.error("Помилка витягування базової суми з wizard даних: {}", e.getMessage(), e);
            return null;
        }
    }

    private ExecutionParametersDTO createDefaultExecutionParameters() {
        return ExecutionParametersDTO.builder()
                .expediteType(ExpediteType.STANDARD)
                .completionTime("14:00")
                .lastUpdated(LocalDateTime.now())
                .build();
    }

    private ExecutionParametersDTO createErrorExecutionParameters(String errorMessage) {
        return ExecutionParametersDTO.builder()
                .expediteType(ExpediteType.STANDARD)
                .hasErrors(true)
                .errorMessage(errorMessage)
                .isLoading(false)
                .build();
    }
}
