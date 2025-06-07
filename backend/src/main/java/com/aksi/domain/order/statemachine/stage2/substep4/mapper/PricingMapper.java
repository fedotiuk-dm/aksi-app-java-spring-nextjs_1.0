package com.aksi.domain.order.statemachine.stage2.substep4.mapper;

import java.math.BigDecimal;
import java.util.Map;

import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.dto.ModifierImpactDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.dto.ModifierSelectionDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.dto.PriceBreakdownDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.dto.PricingCalculationDTO;
import com.aksi.domain.pricing.dto.CalculationDetailsDTO;
import com.aksi.domain.pricing.dto.PriceCalculationResponseDTO;
import com.aksi.domain.pricing.dto.PriceModifierDTO;

/**
 * MapStruct маппер для підетапу 2.4: Розрахунок ціни.
 * Забезпечує трансформацію між Pricing Domain DTO та підетапом 2.4 DTO.
 */
@Mapper(componentModel = "spring")
public interface PricingMapper {

    // ===== ТРАНСФОРМАЦІЯ МОДИФІКАТОРІВ =====

    /**
     * Трансформація PriceModifierDTO в ModifierSelectionDTO
     */
    @Mapping(target = "selectedValue", ignore = true)
    @Mapping(target = "quantity", ignore = true)
    @Mapping(target = "impactAmount", ignore = true)
    @Mapping(target = "isSelected", constant = "false")
    @Mapping(target = "isRecommended", constant = "false")
    @Mapping(target = "isRequired", constant = "false")
    @Mapping(target = "isAvailable", constant = "true")
    @Mapping(target = "displayText", ignore = true)
    @Mapping(target = "displayValue", ignore = true)
    @Mapping(target = "tooltip", source = "description")
    @Mapping(target = "warning", ignore = true)
    @Mapping(target = "cssClass", ignore = true)
    @Mapping(target = "icon", ignore = true)
    ModifierSelectionDTO toModifierSelectionDTO(PriceModifierDTO priceModifierDTO);

    /**
     * Трансформація CalculationDetailsDTO в ModifierImpactDTO
     */
    @Mapping(target = "modifierId", ignore = true)
    @Mapping(target = "modifierCode", ignore = true)
    @Mapping(target = "modifierName", ignore = true)
    @Mapping(target = "modifierType", ignore = true)
    @Mapping(target = "baseAmount", ignore = true)
    @Mapping(target = "modifierValue", ignore = true)
    @Mapping(target = "quantity", ignore = true)
    @Mapping(target = "impactAmount", ignore = true)
    @Mapping(target = "resultAmount", ignore = true)
    @Mapping(target = "impactPercentage", ignore = true)
    @Mapping(target = "displayText", ignore = true)
    @Mapping(target = "calculationFormula", ignore = true)
    @Mapping(target = "impactDescription", ignore = true)
    ModifierImpactDTO toModifierImpactDTO(CalculationDetailsDTO calculationDetailsDTO);

    // ===== ВИТЯГУВАННЯ ДАНИХ З WIZARD DATA =====

    /**
     * Створення PricingCalculationDTO з даних візарда
     */
    @Named("fromWizardData")
    default PricingCalculationDTO fromWizardData(Map<String, Object> wizardData) {
        if (wizardData == null) {
            return PricingCalculationDTO.builder().build();
        }

        @SuppressWarnings("unchecked")
        Map<String, Object> pricingData = (Map<String, Object>) wizardData.get("pricing");

        if (pricingData == null) {
            return PricingCalculationDTO.builder().build();
        }

        PricingCalculationDTO.PricingCalculationDTOBuilder builder = PricingCalculationDTO.builder();

        // Базова інформація
        extractBigDecimal(pricingData, "baseUnitPrice").ifPresent(builder::baseUnitPrice);
        extractInteger(pricingData, "quantity").ifPresent(builder::quantity);
        extractString(pricingData, "unitOfMeasure").ifPresent(builder::unitOfMeasure);
        extractBigDecimal(pricingData, "baseTotal").ifPresent(builder::baseTotal);

        // Терміновість
        extractBoolean(pricingData, "isExpedited").ifPresent(builder::isExpedited);
        extractBigDecimal(pricingData, "expediteFactor").ifPresent(builder::expediteFactor);
        extractBigDecimal(pricingData, "expediteAmount").ifPresent(builder::expediteAmount);

        // Знижки
        extractBigDecimal(pricingData, "discountPercent").ifPresent(builder::discountPercent);
        extractBigDecimal(pricingData, "discountAmount").ifPresent(builder::discountAmount);
        extractBoolean(pricingData, "discountApplicable").ifPresent(builder::discountApplicable);

        // Кінцеві ціни
        extractBigDecimal(pricingData, "finalUnitPrice").ifPresent(builder::finalUnitPrice);
        extractBigDecimal(pricingData, "finalTotalPrice").ifPresent(builder::finalTotalPrice);

        // Валідація
        extractBoolean(pricingData, "isValid").ifPresent(builder::isValid);

        return builder.build();
    }

        /**
     * Перетворення PricingCalculationDTO в поля OrderItemDTO
     */
    @Named("toOrderItemFields")
    default void toOrderItemFields(PricingCalculationDTO pricing, OrderItemDTO.OrderItemDTOBuilder orderBuilder) {
        if (pricing == null) return;

        // Базові ціни
        if (pricing.getFinalUnitPrice() != null) {
            orderBuilder.unitPrice(pricing.getFinalUnitPrice());
        }

        if (pricing.getFinalTotalPrice() != null) {
            orderBuilder.totalPrice(pricing.getFinalTotalPrice());
        }

        // Модифікатори (зберігаємо в спеціальних інструкціях)
        if (pricing.hasSelectedModifiers()) {
            String modifiersDescription = pricing.getSelectedModifiersDescription();
            orderBuilder.specialInstructions(appendToNotes("", "Модифікатори: " + modifiersDescription));
        }
    }

    /**
     * Заповнення PricingCalculationDTO з OrderItemDTO для редагування
     */
    @Named("fromOrderItem")
    default PricingCalculationDTO fromOrderItem(OrderItemDTO orderItem) {
        if (orderItem == null) {
            return PricingCalculationDTO.builder().build();
        }

        return PricingCalculationDTO.builder()
                .baseUnitPrice(orderItem.getBasePrice())
                .quantity(orderItem.getQuantity())
                .unitOfMeasure(orderItem.getUnitOfMeasure())
                .finalUnitPrice(orderItem.getUnitPrice())
                .finalTotalPrice(orderItem.getTotalPrice())
                .isExpedited(orderItem.getIsExpedited() != null ? orderItem.getIsExpedited() : false)
                .expediteFactor(orderItem.getExpediteFactor())
                .discountPercent(orderItem.getDiscountPercent())
                .isValid(true)
                .build();
    }

    // ===== HELPER METHODS =====

    /**
     * Безпечне витягування String значення
     */
    @Named("extractString")
    default java.util.Optional<String> extractString(Map<String, Object> data, String key) {
        Object value = data.get(key);
        return value instanceof String ? java.util.Optional.of((String) value) : java.util.Optional.empty();
    }

    /**
     * Безпечне витягування Integer значення
     */
    @Named("extractInteger")
    default java.util.Optional<Integer> extractInteger(Map<String, Object> data, String key) {
        Object value = data.get(key);
        if (value instanceof Integer) {
            return java.util.Optional.of((Integer) value);
        } else if (value instanceof Number) {
            return java.util.Optional.of(((Number) value).intValue());
        }
        return java.util.Optional.empty();
    }

    /**
     * Безпечне витягування BigDecimal значення
     */
    @Named("extractBigDecimal")
    default java.util.Optional<BigDecimal> extractBigDecimal(Map<String, Object> data, String key) {
        Object value = data.get(key);
        if (value instanceof BigDecimal) {
            return java.util.Optional.of((BigDecimal) value);
        } else if (value instanceof Number) {
            return java.util.Optional.of(BigDecimal.valueOf(((Number) value).doubleValue()));
        } else if (value instanceof String) {
            try {
                return java.util.Optional.of(new BigDecimal((String) value));
            } catch (NumberFormatException e) {
                return java.util.Optional.empty();
            }
        }
        return java.util.Optional.empty();
    }

    /**
     * Безпечне витягування Boolean значення
     */
    @Named("extractBoolean")
    default java.util.Optional<Boolean> extractBoolean(Map<String, Object> data, String key) {
        Object value = data.get(key);
        return value instanceof Boolean ? java.util.Optional.of((Boolean) value) : java.util.Optional.empty();
    }

    /**
     * Додавання тексту до існуючих нотаток
     */
    @Named("appendToNotes")
    default String appendToNotes(String existingNotes, String newNote) {
        if (existingNotes == null || existingNotes.trim().isEmpty()) {
            return newNote;
        }
        return existingNotes + "; " + newNote;
    }

    // ===== ТРАНСФОРМАЦІЯ ДЛЯ STATE MACHINE =====

    /**
     * Збереження PricingCalculationDTO в Map для State Machine контексту
     */
    @Named("toStateContextMap")
    default Map<String, Object> toStateContextMap(PricingCalculationDTO pricing) {
        Map<String, Object> contextMap = new java.util.HashMap<>();

        if (pricing == null) return contextMap;

        // Базова інформація
        putIfNotNull(contextMap, "baseUnitPrice", pricing.getBaseUnitPrice());
        putIfNotNull(contextMap, "quantity", pricing.getQuantity());
        putIfNotNull(contextMap, "unitOfMeasure", pricing.getUnitOfMeasure());
        putIfNotNull(contextMap, "baseTotal", pricing.getBaseTotal());

        // Модифікатори
        putIfNotNull(contextMap, "selectedModifiersCount", pricing.getSelectedModifiersCount());
        putIfNotNull(contextMap, "hasRecommendedModifiers", pricing.hasRecommendedModifiers());

        // Терміновість
        putIfNotNull(contextMap, "isExpedited", pricing.getIsExpedited());
        putIfNotNull(contextMap, "expediteFactor", pricing.getExpedditeFactor());
        putIfNotNull(contextMap, "expediteAmount", pricing.getExpediteAmount());

        // Знижки
        putIfNotNull(contextMap, "discountPercent", pricing.getDiscountPercent());
        putIfNotNull(contextMap, "discountAmount", pricing.getDiscountAmount());
        putIfNotNull(contextMap, "discountApplicable", pricing.getDiscountApplicable());

        // Кінцеві результати
        putIfNotNull(contextMap, "finalUnitPrice", pricing.getFinalUnitPrice());
        putIfNotNull(contextMap, "finalTotalPrice", pricing.getFinalTotalPrice());

        // Валідація та стан
        putIfNotNull(contextMap, "isValid", pricing.getIsValid());
        putIfNotNull(contextMap, "isCalculationComplete", pricing.isCalculationComplete());
        putIfNotNull(contextMap, "hasRiskWarnings", pricing.hasRiskWarnings());

        // Текстові описи
        putIfNotNull(contextMap, "calculationSummary", pricing.getCalculationSummary());
        putIfNotNull(contextMap, "selectedModifiersDescription", pricing.getSelectedModifiersDescription());

        return contextMap;
    }

    /**
     * Відновлення PricingCalculationDTO з Map State Machine контексту
     */
    @Named("fromStateContextMap")
    default PricingCalculationDTO fromStateContextMap(Map<String, Object> contextMap) {
        if (contextMap == null) {
            return PricingCalculationDTO.builder().build();
        }

        return fromWizardData(Map.of("pricing", contextMap));
    }

    /**
     * Утілітарний метод для додавання значення в Map, якщо воно не null
     */
    @Named("putIfNotNull")
    default void putIfNotNull(Map<String, Object> map, String key, Object value) {
        if (value != null) {
            map.put(key, value);
        }
    }

    // ===== ВАЛІДАЦІЯ ТА ДІАГНОСТИКА =====

    /**
     * Створення діагностичної інформації про маппінг
     */
    @Named("createMappingDiagnostics")
    default Map<String, Object> createMappingDiagnostics(PricingCalculationDTO pricing) {
        Map<String, Object> diagnostics = new java.util.HashMap<>();

        if (pricing == null) {
            diagnostics.put("status", "NULL_INPUT");
            return diagnostics;
        }

        diagnostics.put("status", "SUCCESS");
        diagnostics.put("hasBasePrice", pricing.getBaseUnitPrice() != null);
        diagnostics.put("hasQuantity", pricing.getQuantity() != null);
        diagnostics.put("hasModifiers", pricing.hasSelectedModifiers());
        diagnostics.put("isExpedited", pricing.hasExpediteCharge());
        diagnostics.put("hasDiscount", pricing.hasDiscount());
        diagnostics.put("isComplete", pricing.isCalculationComplete());
        diagnostics.put("isValid", pricing.getIsValid());
        diagnostics.put("finalTotalPrice", pricing.getFinalTotalPrice());

        return diagnostics;
    }
}
