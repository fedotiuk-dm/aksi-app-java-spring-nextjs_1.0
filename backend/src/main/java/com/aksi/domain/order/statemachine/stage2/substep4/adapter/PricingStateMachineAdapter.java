package com.aksi.domain.order.statemachine.stage2.substep4.adapter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage2.substep1.dto.BasicInfoDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.dto.CharacteristicsDTO;
import com.aksi.domain.order.statemachine.stage2.substep3.dto.DefectsStainsDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.dto.ModifierSelectionDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.dto.PricingCalculationDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.mapper.PricingMapper;
import com.aksi.domain.order.statemachine.stage2.substep4.service.PriceCalculationCoordinatorService;
import com.aksi.domain.order.statemachine.stage2.substep4.validator.PricingValidator;
import com.aksi.domain.pricing.dto.PriceModifierDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * State Machine адаптер для підетапу 2.4: Розрахунок ціни.
 *
 * ПРИНЦИП: Тонкий адаптаційний шар між State Machine та бізнес-логікою підетапу.
 * Управляє станом розрахунку ціни в контексті Order Wizard.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class PricingStateMachineAdapter {

    private final PriceCalculationCoordinatorService coordinatorService;
    private final PricingValidator pricingValidator;
    private final PricingMapper pricingMapper;

    // ===== ІНІЦІАЛІЗАЦІЯ ПІДЕТАПУ =====

    /**
     * Ініціалізація підетапу розрахунку ціни
     */
    public Map<String, Object> initializePricingStep(String wizardId, Map<String, Object> wizardData) {
        log.debug("Initializing pricing step for wizard: {}", wizardId);

        try {
            // Витягуємо дані з попередніх підетапів
            BasicInfoDTO basicInfo = extractBasicInfo(wizardData);
            CharacteristicsDTO characteristics = extractCharacteristics(wizardData);

            // Створюємо початковий розрахунок через координатор
            PricingCalculationDTO initialCalculation = coordinatorService
                    .createInitialCalculation(basicInfo, characteristics);

            // Зберігаємо в контексті State Machine
            return pricingMapper.toStateContextMap(initialCalculation);

        } catch (Exception e) {
            log.error("Error initializing pricing step: {}", e.getMessage(), e);
            return createErrorContext("Помилка ініціалізації розрахунку ціни: " + e.getMessage());
        }
    }

    // ===== РОБОТА З РОЗРАХУНКАМИ =====

    /**
     * Оновлення розрахунку ціни з новими даними
     */
    public Map<String, Object> updatePricingCalculation(
            String wizardId,
            Map<String, Object> wizardData,
            PricingCalculationDTO updatedCalculation) {

        log.debug("Updating pricing calculation for wizard: {}", wizardId);

        try {
            // Валідуємо оновлений розрахунок
            PricingValidator.ValidationResult validation = pricingValidator
                    .validatePricingCalculation(updatedCalculation);

            if (!validation.isValid()) {
                log.warn("Invalid pricing calculation: {}", validation.getErrorMessage());
                updatedCalculation = updatedCalculation.toBuilder()
                        .isValid(false)
                        .validationErrors(validation.getErrors())
                        .riskWarnings(validation.getWarnings())
                        .build();
            }

            // Зберігаємо оновлений розрахунок
            return pricingMapper.toStateContextMap(updatedCalculation);

        } catch (Exception e) {
            log.error("Error updating pricing calculation: {}", e.getMessage(), e);
            return createErrorContext("Помилка оновлення розрахунку: " + e.getMessage());
        }
    }

    /**
     * Застосування модифікаторів до розрахунку
     */
    public Map<String, Object> applyModifiers(
            String wizardId,
            Map<String, Object> wizardData,
            List<ModifierSelectionDTO> selectedModifiers) {

        log.debug("Applying modifiers for wizard: {}", wizardId);

        try {
            // Витягуємо поточний розрахунок
            PricingCalculationDTO currentCalculation = pricingMapper.fromStateContextMap(wizardData);

            // Застосовуємо модифікатори через координатор
            PricingCalculationDTO updatedCalculation = coordinatorService
                    .applyModifiers(currentCalculation, selectedModifiers);

            return pricingMapper.toStateContextMap(updatedCalculation);

        } catch (Exception e) {
            log.error("Error applying modifiers: {}", e.getMessage(), e);
            return createErrorContext("Помилка застосування модифікаторів: " + e.getMessage());
        }
    }

    /**
     * Застосування терміновості
     */
    public Map<String, Object> applyExpedite(
            String wizardId,
            Map<String, Object> wizardData,
            boolean isExpedited,
            BigDecimal expediteFactor) {

        log.debug("Applying expedite for wizard: {}", wizardId);

        try {
            // Витягуємо поточний розрахунок
            PricingCalculationDTO currentCalculation = pricingMapper.fromStateContextMap(wizardData);

            // Застосовуємо терміновість через координатор
            PricingCalculationDTO updatedCalculation = coordinatorService
                    .applyExpedite(currentCalculation, isExpedited, expediteFactor);

            return pricingMapper.toStateContextMap(updatedCalculation);

        } catch (Exception e) {
            log.error("Error applying expedite: {}", e.getMessage(), e);
            return createErrorContext("Помилка застосування терміновості: " + e.getMessage());
        }
    }

    /**
     * Застосування знижки
     */
    public Map<String, Object> applyDiscount(
            String wizardId,
            Map<String, Object> wizardData,
            BigDecimal discountPercent) {

        log.debug("Applying discount for wizard: {}", wizardId);

        try {
            // Витягуємо поточний розрахунок
            PricingCalculationDTO currentCalculation = pricingMapper.fromStateContextMap(wizardData);

            // Застосовуємо знижку через координатор
            PricingCalculationDTO updatedCalculation = coordinatorService
                    .applyDiscount(currentCalculation, discountPercent);

            return pricingMapper.toStateContextMap(updatedCalculation);

        } catch (Exception e) {
            log.error("Error applying discount: {}", e.getMessage(), e);
            return createErrorContext("Помилка застосування знижки: " + e.getMessage());
        }
    }

    /**
     * Отримання доступних модифікаторів
     */
    public List<PriceModifierDTO> getAvailableModifiers(String categoryCode) {
        log.debug("Getting available modifiers for category: {}", categoryCode);

        try {
            return coordinatorService.getAvailableModifiers(categoryCode);
        } catch (Exception e) {
            log.error("Error getting available modifiers: {}", e.getMessage(), e);
            throw new RuntimeException("Помилка отримання модифікаторів: " + e.getMessage());
        }
    }

    // ===== ЗАВЕРШЕННЯ ПІДЕТАПУ =====

    /**
     * Валідація можливості завершення підетапу
     */
    public boolean canCompletePricingStep(String wizardId, Map<String, Object> wizardData) {
        log.debug("Checking if pricing step can be completed for wizard: {}", wizardId);

        try {
            PricingCalculationDTO calculation = pricingMapper.fromStateContextMap(wizardData);

            if (calculation == null) {
                log.debug("No pricing calculation found");
                return false;
            }

            PricingValidator.ValidationResult validation = pricingValidator
                    .validateCanCompleteStep(calculation);

            boolean canComplete = validation.isValid();
            log.debug("Can complete pricing step: {}", canComplete);

            return canComplete;

        } catch (Exception e) {
            log.error("Error checking pricing step completion: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Завершення підетапу розрахунку ціни
     */
    public Map<String, Object> completePricingStep(String wizardId, Map<String, Object> wizardData) {
        log.debug("Completing pricing step for wizard: {}", wizardId);

        try {
            PricingCalculationDTO calculation = pricingMapper.fromStateContextMap(wizardData);

            // Фінальна валідація
            PricingValidator.ValidationResult validation = pricingValidator
                    .validateCanCompleteStep(calculation);

            if (!validation.isValid()) {
                throw new IllegalStateException("Cannot complete pricing step: " + validation.getErrorMessage());
            }

            // Позначаємо як завершений
            PricingCalculationDTO completedCalculation = calculation.toBuilder()
                    .isValid(true)
                    .build();

            // Зберігаємо результат
            Map<String, Object> result = pricingMapper.toStateContextMap(completedCalculation);
            result.put("stepCompleted", true);
            result.put("completedAt", LocalDateTime.now().toString());

            return result;

        } catch (Exception e) {
            log.error("Error completing pricing step: {}", e.getMessage(), e);
            return createErrorContext("Помилка завершення розрахунку ціни: " + e.getMessage());
        }
    }

    // ===== ДІАГНОСТИКА ТА ДОПОМОГА =====

    /**
     * Створення діагностичної інформації
     */
    public Map<String, Object> createDiagnostics(String wizardId, Map<String, Object> wizardData) {
        log.debug("Creating pricing step diagnostics for wizard: {}", wizardId);

        try {
            PricingCalculationDTO calculation = pricingMapper.fromStateContextMap(wizardData);
            return pricingMapper.createMappingDiagnostics(calculation);

        } catch (Exception e) {
            log.error("Error creating pricing diagnostics: {}", e.getMessage(), e);
            return Map.of("error", e.getMessage());
        }
    }

    /**
     * Отримання поточного стану розрахунку
     */
    public PricingCalculationDTO getCurrentCalculation(String wizardId, Map<String, Object> wizardData) {
        log.debug("Getting current pricing calculation for wizard: {}", wizardId);

        try {
            return pricingMapper.fromStateContextMap(wizardData);
        } catch (Exception e) {
            log.error("Error getting current calculation: {}", e.getMessage(), e);
            return PricingCalculationDTO.builder()
                    .isValid(false)
                    .validationErrors(List.of("Помилка отримання розрахунку: " + e.getMessage()))
                    .build();
        }
    }

    // ===== ДОПОМІЖНІ МЕТОДИ =====

    private BasicInfoDTO extractBasicInfo(Map<String, Object> wizardData) {
        try {
            // Витягуємо дані з basicInfo ключа
            Object basicInfoObj = wizardData.get("basicInfo");
            if (basicInfoObj instanceof BasicInfoDTO) {
                return (BasicInfoDTO) basicInfoObj;
            }

            // Якщо дані у вигляді Map, конвертуємо через маппер
            if (basicInfoObj instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> basicInfoMap = (Map<String, Object>) basicInfoObj;
                return convertMapToBasicInfoDTO(basicInfoMap);
            }

            // Якщо дані відсутні, створюємо дефолтний об'єкт з попередженням
            log.warn("BasicInfo not found in wizard data, creating default");
            return createDefaultBasicInfoDTO();

        } catch (Exception e) {
            log.error("Error extracting BasicInfo: {}", e.getMessage(), e);
            return createDefaultBasicInfoDTO();
        }
    }

    private CharacteristicsDTO extractCharacteristics(Map<String, Object> wizardData) {
        try {
            // Витягуємо дані з characteristics ключа
            Object characteristicsObj = wizardData.get("characteristics");
            if (characteristicsObj instanceof CharacteristicsDTO) {
                return (CharacteristicsDTO) characteristicsObj;
            }

            // Якщо дані у вигляді Map, конвертуємо
            if (characteristicsObj instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> characteristicsMap = (Map<String, Object>) characteristicsObj;
                return convertMapToCharacteristicsDTO(characteristicsMap);
            }

            // Повертаємо null якщо дані відсутні
            return null;

        } catch (Exception e) {
            log.error("Error extracting Characteristics: {}", e.getMessage(), e);
            return null;
        }
    }

    private DefectsStainsDTO extractDefectsStains(Map<String, Object> wizardData) {
        try {
            // Витягуємо дані з defectsStains ключа
            Object defectsStainsObj = wizardData.get("defectsStains");
            if (defectsStainsObj instanceof DefectsStainsDTO) {
                return (DefectsStainsDTO) defectsStainsObj;
            }

            // Якщо дані у вигляді Map, конвертуємо
            if (defectsStainsObj instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> defectsStainsMap = (Map<String, Object>) defectsStainsObj;
                return convertMapToDefectsStainsDTO(defectsStainsMap);
            }

            // Повертаємо null якщо дані відсутні
            return null;

        } catch (Exception e) {
            log.error("Error extracting DefectsStains: {}", e.getMessage(), e);
            return null;
        }
    }

    // Створення дефолтного BasicInfoDTO
    private BasicInfoDTO createDefaultBasicInfoDTO() {
        return BasicInfoDTO.builder()
                .categoryId("DEFAULT")
                .categoryCode("DEFAULT")
                .itemName("Default Item")
                .quantity(1)
                .unitOfMeasure("шт")
                .build();
    }

    private BasicInfoDTO convertMapToBasicInfoDTO(Map<String, Object> basicInfoMap) {
        return BasicInfoDTO.builder()
                .categoryId(getStringValue(basicInfoMap, "categoryId", "DEFAULT"))
                .categoryCode(getStringValue(basicInfoMap, "categoryCode", "DEFAULT"))
                .categoryName(getStringValue(basicInfoMap, "categoryName", ""))
                .itemId(getStringValue(basicInfoMap, "itemId", ""))
                .itemCode(getStringValue(basicInfoMap, "itemCode", ""))
                .itemName(getStringValue(basicInfoMap, "itemName", ""))
                .description(getStringValue(basicInfoMap, "description", ""))
                .quantity(getIntegerValue(basicInfoMap, "quantity", 1))
                .unitOfMeasure(getStringValue(basicInfoMap, "unitOfMeasure", "шт"))
                .basePrice(getBigDecimalValue(basicInfoMap, "basePrice", BigDecimal.ZERO))
                .build();
    }

    private CharacteristicsDTO convertMapToCharacteristicsDTO(Map<String, Object> characteristicsMap) {
        // Базова конверсія для необхідних полів
        return CharacteristicsDTO.builder()
                .color(getStringValue(characteristicsMap, "color", ""))
                .build();
    }

    private DefectsStainsDTO convertMapToDefectsStainsDTO(Map<String, Object> defectsStainsMap) {
        return DefectsStainsDTO.builder()
                .selectedStains(getSetValue(defectsStainsMap, "selectedStains"))
                .customStain(getStringValue(defectsStainsMap, "customStain", ""))
                .selectedDefects(getSetValue(defectsStainsMap, "selectedDefects"))
                .selectedRisks(getSetValue(defectsStainsMap, "selectedRisks"))
                .defectNotes(getStringValue(defectsStainsMap, "defectNotes", ""))
                .noWarranty(getBooleanValue(defectsStainsMap, "noWarranty", false))
                .noWarrantyReason(getStringValue(defectsStainsMap, "noWarrantyReason", ""))
                .build();
    }

    // Допоміжні методи для безпечного отримання значень
    private String getStringValue(Map<String, Object> map, String key, String defaultValue) {
        Object value = map.get(key);
        return value != null ? value.toString() : defaultValue;
    }

    private Integer getIntegerValue(Map<String, Object> map, String key, Integer defaultValue) {
        Object value = map.get(key);
        if (value instanceof Integer) {
            return (Integer) value;
        }
        if (value instanceof Number) {
            return ((Number) value).intValue();
        }
        if (value instanceof String) {
            try {
                return Integer.parseInt((String) value);
            } catch (NumberFormatException e) {
                return defaultValue;
            }
        }
        return defaultValue;
    }

    private BigDecimal getBigDecimalValue(Map<String, Object> map, String key, BigDecimal defaultValue) {
        Object value = map.get(key);
        if (value instanceof BigDecimal) {
            return (BigDecimal) value;
        }
        if (value instanceof Number) {
            return BigDecimal.valueOf(((Number) value).doubleValue());
        }
        if (value instanceof String) {
            try {
                return new BigDecimal((String) value);
            } catch (NumberFormatException e) {
                return defaultValue;
            }
        }
        return defaultValue;
    }

    private Boolean getBooleanValue(Map<String, Object> map, String key, Boolean defaultValue) {
        Object value = map.get(key);
        if (value instanceof Boolean) {
            return (Boolean) value;
        }
        if (value instanceof String) {
            return Boolean.parseBoolean((String) value);
        }
        return defaultValue;
    }

    @SuppressWarnings("unchecked")
    private Set<String> getSetValue(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value instanceof Set) {
            return (Set<String>) value;
        }
        if (value instanceof List) {
            return new HashSet<>((List<String>) value);
        }
        return new HashSet<>();
    }

    private Map<String, Object> createErrorContext(String errorMessage) {
        Map<String, Object> errorContext = new HashMap<>();
        errorContext.put("error", true);
        errorContext.put("errorMessage", errorMessage);
        errorContext.put("timestamp", LocalDateTime.now().toString());
        return errorContext;
    }
}
