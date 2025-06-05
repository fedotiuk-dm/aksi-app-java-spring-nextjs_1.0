package com.aksi.domain.order.statemachine.stage2.mapper;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.aksi.domain.order.statemachine.stage2.dto.ItemPricingDTO;
import com.aksi.domain.order.statemachine.stage2.dto.TempOrderItemDTO;
import com.aksi.domain.pricing.dto.CalculationDetailsDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Mapper для конвертації між ItemPricingDTO та TempOrderItemDTO.
 *
 * Відповідає за:
 * - Створення ItemPricingDTO з TempOrderItemDTO
 * - Оновлення TempOrderItemDTO з результатами pricing
 * - Серіалізація/десеріалізація складних полів
 */
@Component
public class ItemPricingMapper {

    private static final Logger logger = LoggerFactory.getLogger(ItemPricingMapper.class);

    private final ObjectMapper objectMapper;

    public ItemPricingMapper(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    /**
     * Створює ItemPricingDTO з TempOrderItemDTO.
     *
     * @param tempItem тимчасовий предмет з попередніх кроків
     * @return DTO для підетапу pricing
     */
    public ItemPricingDTO fromTempOrderItem(TempOrderItemDTO tempItem) {
        if (tempItem == null) {
            logger.warn("Тимчасовий предмет null - повертаємо порожні дані pricing");
            return createEmptyPricingDTO();
        }

        logger.debug("Конвертація TempOrderItemDTO в ItemPricingDTO");

        try {
            ItemPricingDTO.ItemPricingDTOBuilder builder = ItemPricingDTO.builder()
                // Базова інформація з попередніх кроків
                .categoryCode(tempItem.getCategory())
                .itemName(tempItem.getName())
                .color(tempItem.getColor())
                .material(tempItem.getMaterial())
                .quantity(tempItem.getQuantity())
                .unitOfMeasure(tempItem.getUnitOfMeasure())

                                // Плями і дефекти для рекомендацій
                .stains(parseStringToList(tempItem.getStains()))
                .defects(parseStringToList(tempItem.getDefectsAndRisks()))

                // Ціни (якщо вже розраховані)
                .baseUnitPrice(tempItem.getUnitPrice())
                .finalTotalPrice(tempItem.getTotalPrice())

                // Застосовані модифікатори (якщо є)
                .selectedModifierCodes(tempItem.getAppliedModifiers())

                // Деталізація розрахунку (якщо є)
                .calculationDetails(parseCalculationDetails(tempItem.getPriceCalculationDetails()))

                // Стан
                .isLoading(false)
                .hasErrors(false)
                .priceCalculated(tempItem.hasPrice())
                .showCalculationDetails(false);

            // Розраховуємо базову загальну ціну якщо є базова ціна
            if (tempItem.getUnitPrice() != null && tempItem.getQuantity() != null) {
                BigDecimal baseTotalPrice = tempItem.getUnitPrice().multiply(BigDecimal.valueOf(tempItem.getQuantity()));
                builder.baseTotalPrice(baseTotalPrice);

                // Якщо є фінальна ціна, розраховуємо фінальну ціну за одиницю
                if (tempItem.getTotalPrice() != null) {
                    BigDecimal finalUnitPrice = tempItem.getTotalPrice().divide(BigDecimal.valueOf(tempItem.getQuantity()), 2, java.math.RoundingMode.HALF_UP);
                    builder.finalUnitPrice(finalUnitPrice);
                }
            }

            ItemPricingDTO result = builder.build();

            logger.debug("Конвертацію завершено: категорія={}, предмет={}, ціна={}",
                        result.getCategoryCode(), result.getItemName(), result.getBaseUnitPrice());

            return result;

        } catch (Exception e) {
            logger.error("Помилка конвертації TempOrderItemDTO в ItemPricingDTO: {}", e.getMessage(), e);
            return createErrorPricingDTO("Помилка конвертації даних: " + e.getMessage());
        }
    }

    /**
     * Оновлює TempOrderItemDTO з результатами pricing.
     *
     * @param tempItem тимчасовий предмет для оновлення
     * @param pricingData результати розрахунку ціни
     */
    public void updateTempOrderItem(TempOrderItemDTO tempItem, ItemPricingDTO pricingData) {
        if (tempItem == null || pricingData == null) {
            logger.warn("Неможливо оновити null об'єкти");
            return;
        }

        logger.debug("Оновлення TempOrderItemDTO з результатами pricing");

        try {
            // Оновлюємо ціни
            tempItem.setUnitPrice(pricingData.getBaseUnitPrice());
            tempItem.setTotalPrice(pricingData.getFinalTotalPrice());

            // Оновлюємо одиницю виміру якщо отримана з pricing
            if (StringUtils.hasText(pricingData.getUnitOfMeasure())) {
                tempItem.setUnitOfMeasure(pricingData.getUnitOfMeasure());
            }

            // Серіалізуємо застосовані модифікатори
            if (pricingData.getSelectedModifierCodes() != null) {
                tempItem.setAppliedModifiers(pricingData.getSelectedModifierCodes());
            }

            // Серіалізуємо деталізацію розрахунку
            if (pricingData.getCalculationDetails() != null) {
                tempItem.setPriceCalculationDetails(serializeCalculationDetails(pricingData.getCalculationDetails()));
            }

            // Оновлюємо валідність
            tempItem.setIsValid(pricingData.isPriceCalculated() && !pricingData.getHasErrors());

            // Оновлюємо крок візарда (2.4 = 4-й підкрок)
            tempItem.setWizardStep(4);

            logger.debug("TempOrderItemDTO оновлено: ціна={}, модифікаторів={}",
                        tempItem.getTotalPrice(),
                        pricingData.getSelectedModifierCodes() != null ? pricingData.getSelectedModifierCodes().size() : 0);

        } catch (Exception e) {
            logger.error("Помилка оновлення TempOrderItemDTO: {}", e.getMessage(), e);
            // Встановлюємо помилку валідації
            tempItem.setIsValid(false);
            tempItem.setValidationErrors("Помилка збереження даних pricing: " + e.getMessage());
        }
    }

    /**
     * Створює порожній DTO для pricing.
     */
    public ItemPricingDTO createEmptyPricingDTO() {
        return ItemPricingDTO.builder()
                .isLoading(false)
                .hasErrors(false)
                .priceCalculated(false)
                .showCalculationDetails(false)
                .selectedModifierCodes(new ArrayList<>())
                .rangeModifierValues(new ArrayList<>())
                .fixedModifierQuantities(new ArrayList<>())
                .build();
    }

    /**
     * Створює DTO з помилкою.
     */
    public ItemPricingDTO createErrorPricingDTO(String errorMessage) {
        return ItemPricingDTO.builder()
                .hasErrors(true)
                .errorMessage(errorMessage)
                .isLoading(false)
                .priceCalculated(false)
                .build();
    }

    /**
     * Конвертує ItemPricingDTO назад в поля TempOrderItemDTO (якщо потрібно).
     */
    public void copyBasicDataToTempItem(TempOrderItemDTO tempItem, ItemPricingDTO pricingData) {
        if (tempItem == null || pricingData == null) {
            return;
        }

        // Копіюємо базові дані (зазвичай вони вже є, але на всякий випадок)
        if (StringUtils.hasText(pricingData.getCategoryCode())) {
            tempItem.setCategory(pricingData.getCategoryCode());
        }

        if (StringUtils.hasText(pricingData.getItemName())) {
            tempItem.setName(pricingData.getItemName());
        }

        if (pricingData.getQuantity() != null) {
            tempItem.setQuantity(pricingData.getQuantity());
        }

        if (StringUtils.hasText(pricingData.getColor())) {
            tempItem.setColor(pricingData.getColor());
        }

        if (StringUtils.hasText(pricingData.getMaterial())) {
            tempItem.setMaterial(pricingData.getMaterial());
        }
    }

    // === Приватні helper методи ===

    /**
     * Парсить рядок в список.
     */
    private List<String> parseStringToList(String value) {
        if (!StringUtils.hasText(value)) {
            return new ArrayList<>();
        }

        try {
            // Спробуємо спарсити як JSON
            if (value.trim().startsWith("[")) {
                String[] array = objectMapper.readValue(value, String[].class);
                return Arrays.asList(array);
            } else {
                // Інакше розділяємо по комах
                return Arrays.stream(value.split(","))
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .collect(Collectors.toList());
            }
        } catch (Exception e) {
            logger.warn("Помилка парсингу списку з рядка '{}': {}", value, e.getMessage());
            return new ArrayList<>();
        }
    }



    /**
     * Парсить деталізацію розрахунку.
     */
    private List<CalculationDetailsDTO> parseCalculationDetails(String value) {
        if (!StringUtils.hasText(value)) {
            return new ArrayList<>();
        }

        try {
            CalculationDetailsDTO[] array = objectMapper.readValue(value, CalculationDetailsDTO[].class);
            return Arrays.asList(array);
        } catch (Exception e) {
            logger.warn("Помилка парсингу деталізації розрахунку: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    /**
     * Серіалізує деталізацію розрахунку.
     */
    private String serializeCalculationDetails(List<CalculationDetailsDTO> details) {
        if (details == null || details.isEmpty()) {
            return null;
        }

        try {
            return objectMapper.writeValueAsString(details);
        } catch (JsonProcessingException e) {
            logger.warn("Помилка серіалізації деталізації розрахунку: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Конвертує діапазонні модифікатори з TempOrderItemDTO.
     */
    public List<ItemPricingDTO.RangeModifierValue> parseRangeModifiers(String value) {
        if (!StringUtils.hasText(value)) {
            return new ArrayList<>();
        }

        try {
            ItemPricingDTO.RangeModifierValue[] array = objectMapper.readValue(value, ItemPricingDTO.RangeModifierValue[].class);
            return Arrays.asList(array);
        } catch (Exception e) {
            logger.warn("Помилка парсингу діапазонних модифікаторів: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    /**
     * Серіалізує діапазонні модифікатори для TempOrderItemDTO.
     */
    public String serializeRangeModifiers(List<ItemPricingDTO.RangeModifierValue> rangeModifiers) {
        if (rangeModifiers == null || rangeModifiers.isEmpty()) {
            return null;
        }

        try {
            return objectMapper.writeValueAsString(rangeModifiers);
        } catch (JsonProcessingException e) {
            logger.warn("Помилка серіалізації діапазонних модифікаторів: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Конвертує фіксовані модифікатори з TempOrderItemDTO.
     */
    public List<ItemPricingDTO.FixedModifierQuantity> parseFixedModifiers(String value) {
        if (!StringUtils.hasText(value)) {
            return new ArrayList<>();
        }

        try {
            ItemPricingDTO.FixedModifierQuantity[] array = objectMapper.readValue(value, ItemPricingDTO.FixedModifierQuantity[].class);
            return Arrays.asList(array);
        } catch (Exception e) {
            logger.warn("Помилка парсингу фіксованих модифікаторів: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    /**
     * Серіалізує фіксовані модифікатори для TempOrderItemDTO.
     */
    public String serializeFixedModifiers(List<ItemPricingDTO.FixedModifierQuantity> fixedModifiers) {
        if (fixedModifiers == null || fixedModifiers.isEmpty()) {
            return null;
        }

        try {
            return objectMapper.writeValueAsString(fixedModifiers);
        } catch (JsonProcessingException e) {
            logger.warn("Помилка серіалізації фіксованих модифікаторів: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Створює підсумок pricing для відображення.
     */
    public String createPricingSummary(ItemPricingDTO pricingData) {
        if (pricingData == null || !pricingData.isPriceCalculated()) {
            return "Ціна не розрахована";
        }

        StringBuilder summary = new StringBuilder();

        if (pricingData.getBaseUnitPrice() != null) {
            summary.append("Базова ціна: ").append(pricingData.getBaseUnitPrice()).append(" грн");
        }

        if (pricingData.hasSelectedModifiers()) {
            summary.append(", Модифікаторів: ").append(pricingData.getSelectedModifierCodes().size());
        }

        if (pricingData.isExpeditedOrder()) {
            summary.append(", Терміново: +").append(pricingData.getExpediteFactor()).append("%");
        }

        if (pricingData.hasAppliedDiscount()) {
            summary.append(", Знижка: -").append(pricingData.getDiscountPercent()).append("%");
        }

        if (pricingData.getFinalTotalPrice() != null) {
            summary.append(" → ").append(pricingData.getFinalTotalPrice()).append(" грн");
        }

        return summary.toString();
    }

    /**
     * Перевіряє чи потрібно оновлювати TempOrderItemDTO.
     */
    public boolean needsUpdate(TempOrderItemDTO tempItem, ItemPricingDTO pricingData) {
        if (tempItem == null || pricingData == null) {
            return false;
        }

        // Перевіряємо чи відрізняються ціни
        if (!java.util.Objects.equals(tempItem.getTotalPrice(), pricingData.getFinalTotalPrice())) {
            return true;
        }

                // Перевіряємо чи відрізняються модифікатори
        List<String> tempModifiers = tempItem.getAppliedModifiers();
        List<String> pricingModifiers = pricingData.getSelectedModifierCodes();

        return !java.util.Objects.equals(tempModifiers, pricingModifiers);
    }
}
