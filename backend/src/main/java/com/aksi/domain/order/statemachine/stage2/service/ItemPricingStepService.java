package com.aksi.domain.order.statemachine.stage2.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.service.OrderWizardPersistenceService;
import com.aksi.domain.order.statemachine.stage2.dto.ItemPricingDTO;
import com.aksi.domain.order.statemachine.stage2.dto.TempOrderItemDTO;
import com.aksi.domain.order.statemachine.stage2.mapper.ItemPricingMapper;
import com.aksi.domain.order.statemachine.stage2.validator.ItemPricingValidator;
import com.aksi.domain.pricing.dto.PriceCalculationResponseDTO;
import com.aksi.domain.pricing.dto.PriceModifierDTO;
import com.aksi.domain.pricing.service.CatalogPriceModifierService;
import com.aksi.domain.pricing.service.PriceCalculationService;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Сервіс для управління підетапом 2.4 "Знижки та надбавки (калькулятор ціни)".
 *
 * Відповідає за:
 * - Завантаження базової ціни з прайс-листа
 * - Отримання доступних модифікаторів за категорією
 * - Розрахунок фінальної ціни з урахуванням модифікаторів, терміновості та знижок
 * - Рекомендації модифікаторів на основі плям і дефектів
 * - Збереження результатів розрахунку
 */
@Service
public class ItemPricingStepService {

    private static final Logger logger = LoggerFactory.getLogger(ItemPricingStepService.class);

    // Ключі для wizard persistence
    private static final String TEMP_ITEM_KEY = "tempOrderItem";
    private static final String PRICING_KEY = "itemPricing";

    // Stage та step номери для persistence
    private static final int STAGE_NUMBER = 2;
    private static final int STEP_NUMBER = 4;

    // Константи для категорій знижок
    private static final Set<String> DISCOUNT_EXCLUDED_CATEGORIES = Set.of(
        "прасування", "прання", "фарбування"
    );

    private final OrderWizardPersistenceService persistenceService;
    private final ItemPricingValidator validator;
    private final ItemPricingMapper mapper;
    private final ObjectMapper objectMapper;
    private final PriceCalculationService priceCalculationService;
    private final CatalogPriceModifierService modifierService;

    public ItemPricingStepService(
            OrderWizardPersistenceService persistenceService,
            ItemPricingValidator validator,
            ItemPricingMapper mapper,
            ObjectMapper objectMapper,
            PriceCalculationService priceCalculationService,
            CatalogPriceModifierService modifierService) {
        this.persistenceService = persistenceService;
        this.validator = validator;
        this.mapper = mapper;
        this.objectMapper = objectMapper;
        this.priceCalculationService = priceCalculationService;
        this.modifierService = modifierService;
    }

    /**
     * Завантажує дані для розрахунку ціни підетапу 2.4.
     */
    public ItemPricingDTO loadPricingData(String wizardId) {
        logger.debug("Завантаження даних для розрахунку ціни для wizard: {}", wizardId);

        try {
            Map<String, Object> wizardData = persistenceService.loadWizardData(wizardId);
            ItemPricingDTO dto = loadSavedPricingData(wizardData);

            if (dto == null) {
                dto = createFromTempItem(wizardData);
            }

            if (dto == null) {
                dto = createEmptyPricingData();
            }

            loadBasePrice(dto);
            loadAvailableModifiers(dto);
            loadRecommendedModifiers(dto);
            configureUIByCategory(dto);

            return dto;

        } catch (Exception e) {
            logger.error("Помилка завантаження даних для wizard {}: {}", wizardId, e.getMessage(), e);
            return createErrorPricingData("Помилка завантаження даних: " + e.getMessage());
        }
    }

    /**
     * Розраховує ціну з вибраними модифікаторами.
     */
    public ItemPricingDTO calculatePrice(String wizardId, ItemPricingDTO pricingData) {
        logger.debug("Розрахунок ціни для wizard: {}", wizardId);

        try {
            List<String> validationErrors = validator.validate(pricingData);
            if (!validationErrors.isEmpty()) {
                pricingData.setError("Помилки: " + String.join("; ", validationErrors));
                return pricingData;
            }

            checkDiscountApplicability(pricingData);

            List<PriceCalculationService.RangeModifierValue> rangeValues = convertRangeModifiers(pricingData);
            List<PriceCalculationService.FixedModifierQuantity> fixedQuantities = convertFixedModifiers(pricingData);

            PriceCalculationResponseDTO response = priceCalculationService.calculatePrice(
                pricingData.getCategoryCode(),
                pricingData.getItemName(),
                pricingData.getQuantity(),
                pricingData.getColor(),
                pricingData.getSelectedModifierCodes(),
                rangeValues,
                fixedQuantities,
                pricingData.isExpeditedOrder(),
                pricingData.getExpediteFactor() != null ? pricingData.getExpediteFactor() : BigDecimal.ZERO,
                pricingData.hasAppliedDiscount() ? pricingData.getDiscountPercent() : BigDecimal.ZERO
            );

            updatePricingDataWithResults(pricingData, response);
            savePricingData(wizardId, pricingData);
            updateTempItemWithPricing(wizardId, pricingData);

            return pricingData;

        } catch (Exception e) {
            logger.error("Помилка розрахунку ціни для wizard {}: {}", wizardId, e.getMessage(), e);
            pricingData.setError("Помилка розрахунку: " + e.getMessage());
            return pricingData;
        }
    }

    public boolean canProceedToNextStep(String wizardId) {
        try {
            Map<String, Object> wizardData = persistenceService.loadWizardData(wizardId);
            ItemPricingDTO dto = loadSavedPricingData(wizardData);
            return dto != null && validator.isValid(dto) && dto.isPriceCalculated();
        } catch (Exception e) {
            logger.error("Помилка перевірки валідації для wizard {}: {}", wizardId, e.getMessage(), e);
            return false;
        }
    }

    // Приватні методи helper
    private ItemPricingDTO loadSavedPricingData(Map<String, Object> wizardData) {
        try {
            Object data = wizardData.get(PRICING_KEY);
            if (data == null) return null;

            if (data instanceof ItemPricingDTO) {
                return (ItemPricingDTO) data;
            } else {
                return objectMapper.convertValue(data, ItemPricingDTO.class);
            }
        } catch (Exception e) {
            logger.error("Помилка завантаження збережених даних: {}", e.getMessage(), e);
            return null;
        }
    }

    private ItemPricingDTO createFromTempItem(Map<String, Object> wizardData) {
        TempOrderItemDTO tempItem = loadTempItemFromData(wizardData);
        return tempItem != null ? mapper.fromTempOrderItem(tempItem) : null;
    }

    private TempOrderItemDTO loadTempItemFromData(Map<String, Object> wizardData) {
        try {
            Object data = wizardData.get(TEMP_ITEM_KEY);
            if (data == null) return null;

            if (data instanceof TempOrderItemDTO) {
                return (TempOrderItemDTO) data;
            } else {
                return objectMapper.convertValue(data, TempOrderItemDTO.class);
            }
        } catch (Exception e) {
            logger.error("Помилка завантаження тимчасового предмета: {}", e.getMessage(), e);
            return null;
        }
    }

    private void loadBasePrice(ItemPricingDTO dto) {
        if (!dto.isValid()) return;

        try {
            BigDecimal basePrice = priceCalculationService.getBasePrice(
                dto.getCategoryCode(), dto.getItemName(), dto.getColor());
            dto.setBaseUnitPrice(basePrice);
            dto.setBaseTotalPrice(basePrice.multiply(BigDecimal.valueOf(dto.getQuantity())));

            String unitOfMeasure = priceCalculationService.getRecommendedUnitOfMeasure(
                dto.getCategoryCode(), dto.getItemName());
            dto.setUnitOfMeasure(unitOfMeasure);
        } catch (Exception e) {
            logger.error("Помилка завантаження базової ціни: {}", e.getMessage(), e);
            dto.setError("Помилка завантаження базової ціни");
        }
    }

    private void loadAvailableModifiers(ItemPricingDTO dto) {
        if (dto.getCategoryCode() == null) return;

        try {
            List<PriceModifierDTO> allModifiers = modifierService.getModifiersForServiceCategory(dto.getCategoryCode());
            dto.setAvailableModifiers(allModifiers);

            Map<String, List<PriceModifierDTO>> modifiersByCategory = allModifiers.stream()
                .collect(Collectors.groupingBy(m -> m.getCategory().name()));

            dto.setGeneralModifiers(modifiersByCategory.getOrDefault("GENERAL", List.of()));
            dto.setTextileModifiers(modifiersByCategory.getOrDefault("TEXTILE", List.of()));
            dto.setLeatherModifiers(modifiersByCategory.getOrDefault("LEATHER", List.of()));
        } catch (Exception e) {
            logger.error("Помилка завантаження модифікаторів: {}", e.getMessage(), e);
        }
    }

    private void loadRecommendedModifiers(ItemPricingDTO dto) {
        if (dto.getStains() == null && dto.getDefects() == null) return;

        try {
            Set<String> stains = dto.getStains() != null ? Set.copyOf(dto.getStains()) : Set.of();
            Set<String> defects = dto.getDefects() != null ? Set.copyOf(dto.getDefects()) : Set.of();

            List<PriceModifierDTO> recommended = priceCalculationService.getRecommendedModifiersForItem(
                stains, defects, dto.getCategoryCode(), dto.getMaterial());
            dto.setRecommendedModifiers(recommended);
        } catch (Exception e) {
            logger.error("Помилка отримання рекомендацій: {}", e.getMessage(), e);
        }
    }

    private void configureUIByCategory(ItemPricingDTO dto) {
        if (dto.getCategoryCode() == null) return;

        String categoryLower = dto.getCategoryCode().toLowerCase();
        dto.setShowTextileModifiers(!categoryLower.contains("шкір") && !categoryLower.contains("дублянк"));
        dto.setShowLeatherModifiers(categoryLower.contains("шкір") || categoryLower.contains("дублянк"));
        dto.setCanApplyDiscount(!isDiscountExcludedCategory(categoryLower));
        dto.setShowExpediteOptions(true);
    }

    private void checkDiscountApplicability(ItemPricingDTO dto) {
        if (dto.getHasDiscount() == null || !dto.getHasDiscount()) {
            dto.setDiscountApplicable(true);
            return;
        }
        dto.setDiscountApplicable(!isDiscountExcludedCategory(dto.getCategoryCode().toLowerCase()));
    }

    private boolean isDiscountExcludedCategory(String categoryCode) {
        return DISCOUNT_EXCLUDED_CATEGORIES.stream().anyMatch(categoryCode::contains);
    }

    private List<PriceCalculationService.RangeModifierValue> convertRangeModifiers(ItemPricingDTO dto) {
        if (dto.getRangeModifierValues() == null) return List.of();
        return dto.getRangeModifierValues().stream()
            .map(rv -> new PriceCalculationService.RangeModifierValue(rv.getModifierCode(), rv.getValue()))
            .collect(Collectors.toList());
    }

    private List<PriceCalculationService.FixedModifierQuantity> convertFixedModifiers(ItemPricingDTO dto) {
        if (dto.getFixedModifierQuantities() == null) return List.of();
        return dto.getFixedModifierQuantities().stream()
            .map(fq -> new PriceCalculationService.FixedModifierQuantity(fq.getModifierCode(), fq.getQuantity()))
            .collect(Collectors.toList());
    }

    private void updatePricingDataWithResults(ItemPricingDTO dto, PriceCalculationResponseDTO response) {
        dto.setFinalUnitPrice(response.getFinalUnitPrice());
        dto.setFinalTotalPrice(response.getFinalTotalPrice());
        dto.setCalculationDetails(response.getCalculationDetails());
        dto.setPriceCalculated(true);
        dto.clearErrors();
    }

    private ItemPricingDTO savePricingData(String wizardId, ItemPricingDTO pricingData) {
        try {
            persistenceService.saveWizardData(wizardId, PRICING_KEY, pricingData, STAGE_NUMBER, STEP_NUMBER);
            pricingData.clearErrors();
        } catch (Exception e) {
            logger.error("Помилка збереження для wizard {}: {}", wizardId, e.getMessage(), e);
            pricingData.setError("Помилка збереження: " + e.getMessage());
        }
        return pricingData;
    }

    private void updateTempItemWithPricing(String wizardId, ItemPricingDTO dto) {
        try {
            Map<String, Object> wizardData = persistenceService.loadWizardData(wizardId);
            TempOrderItemDTO tempItem = loadTempItemFromData(wizardData);
            if (tempItem == null) tempItem = new TempOrderItemDTO();

            mapper.updateTempOrderItem(tempItem, dto);
            persistenceService.saveWizardData(wizardId, TEMP_ITEM_KEY, tempItem, STAGE_NUMBER, 1);
        } catch (Exception e) {
            logger.error("Помилка оновлення тимчасового предмета: {}", e.getMessage(), e);
        }
    }

    private ItemPricingDTO createEmptyPricingData() {
        return ItemPricingDTO.builder()
                .isLoading(false).hasErrors(false).priceCalculated(false)
                .showCalculationDetails(false).build();
    }

    private ItemPricingDTO createErrorPricingData(String errorMessage) {
        return ItemPricingDTO.builder()
                .hasErrors(true).errorMessage(errorMessage)
                .isLoading(false).priceCalculated(false).build();
    }
}
