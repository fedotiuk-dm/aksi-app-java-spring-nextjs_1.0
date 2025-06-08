package com.aksi.domain.order.statemachine.stage2.mapper;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.statemachine.stage2.dto.ItemWizardSessionDTO;
import com.aksi.domain.order.statemachine.stage2.enums.ItemWizardStep;

/**
 * MapStruct маппер для збірки даних Item Wizard в OrderItemDTO
 *
 * Відповідає за:
 * - Збірку даних з усіх підетапів у повний OrderItemDTO
 * - Трансформацію між внутрішніми та доменними DTO
 */
@Mapper(componentModel = "spring")
public interface ItemWizardDataMapper {

    /**
     * Збирає повний OrderItemDTO з даних усіх кроків Item Wizard
     *
     * @param session сесія підвізарда з даними всіх кроків
     * @return повний OrderItemDTO готовий для збереження
     */
    @Mapping(target = "id", ignore = true) // Встановлюється при збереженні
    @Mapping(target = "orderId", ignore = true) // Встановлюється при збереженні
    @Mapping(target = "name", source = ".", qualifiedByName = "extractItemName")
    @Mapping(target = "category", source = ".", qualifiedByName = "extractItemCategory")
    @Mapping(target = "description", source = ".", qualifiedByName = "extractDescription")
    @Mapping(target = "quantity", source = ".", qualifiedByName = "extractQuantity")
    @Mapping(target = "unitOfMeasure", source = ".", qualifiedByName = "extractUnitOfMeasure")
    @Mapping(target = "unitPrice", source = ".", qualifiedByName = "extractUnitPrice")
    @Mapping(target = "totalPrice", source = ".", qualifiedByName = "extractTotalPrice")
    @Mapping(target = "material", source = ".", qualifiedByName = "extractMaterial")
    @Mapping(target = "color", source = ".", qualifiedByName = "extractColor")
    @Mapping(target = "defects", source = ".", qualifiedByName = "extractDefectsString")
    @Mapping(target = "specialInstructions", source = ".", qualifiedByName = "extractSpecialInstructions")
    @Mapping(target = "fillerType", source = ".", qualifiedByName = "extractFillerType")
    @Mapping(target = "fillerCompressed", source = ".", qualifiedByName = "extractFillerCompressed")
    @Mapping(target = "wearDegree", source = ".", qualifiedByName = "extractWearDegree")
    @Mapping(target = "stains", source = ".", qualifiedByName = "extractStainsString")
    @Mapping(target = "otherStains", source = ".", qualifiedByName = "extractOtherStains")
    @Mapping(target = "defectsAndRisks", source = ".", qualifiedByName = "extractDefectsAndRisks")
    @Mapping(target = "noGuaranteeReason", source = ".", qualifiedByName = "extractNoGuaranteeReason")
    @Mapping(target = "defectsNotes", source = ".", qualifiedByName = "extractDefectsNotes")
    OrderItemDTO buildCompleteOrderItem(ItemWizardSessionDTO session);

    // ========== Утиліти для роботи з даними ==========

    /**
     * Безпечно отримує дані з кроку як Map
     */
    default Map<String, Object> getStepDataAsMap(ItemWizardSessionDTO session, ItemWizardStep step) {
        try {
            Object data = session.getStepData(step, Object.class);
            if (data instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> mapData = (Map<String, Object>) data;
                return mapData;
            }
            return new HashMap<>();
        } catch (ClassCastException e) {
            return new HashMap<>();
        }
    }

    /**
     * Безпечно отримує значення з Map
     */
    default <T> T getValueSafely(Map<String, Object> data, String key, Class<T> clazz, T defaultValue) {
        try {
            Object value = data.get(key);
            if (clazz.isInstance(value)) {
                return clazz.cast(value);
            }
            // Спроба конвертації для базових типів
            if (clazz == String.class && value != null) {
                return clazz.cast(value.toString());
            }
            if (clazz == Integer.class && value != null) {
                if (value instanceof String str) {
                    return clazz.cast(Integer.valueOf(str));
                }
                if (value instanceof Number number) {
                    return clazz.cast(number.intValue());
                }
            }
            if (clazz == BigDecimal.class && value != null) {
                if (value instanceof String str) {
                    return clazz.cast(new BigDecimal(str));
                }
                if (value instanceof Number number) {
                    return clazz.cast(BigDecimal.valueOf(number.doubleValue()));
                }
            }
            return defaultValue;
                 } catch (IllegalArgumentException | ClassCastException e) {
             return defaultValue;
         }
    }

    /**
     * Конвертує список у рядок для збереження
     */
    default String listToString(List<String> list) {
        if (list == null || list.isEmpty()) {
            return null;
        }
        return String.join(", ", list);
    }

    /**
     * Конвертує рядок у список для редагування
     */
    default List<String> parseStringToList(String str) {
        if (str == null || str.trim().isEmpty()) {
            return List.of();
        }
        return List.of(str.split(",\\s*"));
    }

    // ========== Методи витягування даних з кроків ==========

    /**
     * Витягує назву предмета з Basic Info
     */
    @Named("extractItemName")
    default String extractItemName(ItemWizardSessionDTO session) {
        Map<String, Object> data = getStepDataAsMap(session, ItemWizardStep.BASIC_INFO);
        return getValueSafely(data, "itemName", String.class, "Невизначений предмет");
    }

    /**
     * Витягує категорію предмета з Basic Info
     */
    @Named("extractItemCategory")
    default String extractItemCategory(ItemWizardSessionDTO session) {
        Map<String, Object> data = getStepDataAsMap(session, ItemWizardStep.BASIC_INFO);
        return getValueSafely(data, "categoryName", String.class, "Невизначена категорія");
    }

    /**
     * Витягує опис предмета з Basic Info
     */
    @Named("extractDescription")
    default String extractDescription(ItemWizardSessionDTO session) {
        Map<String, Object> data = getStepDataAsMap(session, ItemWizardStep.BASIC_INFO);
        return getValueSafely(data, "description", String.class, null);
    }

    /**
     * Витягує кількість з Basic Info
     */
    @Named("extractQuantity")
    default Integer extractQuantity(ItemWizardSessionDTO session) {
        Map<String, Object> data = getStepDataAsMap(session, ItemWizardStep.BASIC_INFO);
        return getValueSafely(data, "quantity", Integer.class, 1);
    }

    /**
     * Витягує одиницю виміру з Basic Info
     */
    @Named("extractUnitOfMeasure")
    default String extractUnitOfMeasure(ItemWizardSessionDTO session) {
        Map<String, Object> data = getStepDataAsMap(session, ItemWizardStep.BASIC_INFO);
        return getValueSafely(data, "unitOfMeasure", String.class, "шт");
    }

    /**
     * Витягує ціну за одиницю з Pricing
     */
    @Named("extractUnitPrice")
    default BigDecimal extractUnitPrice(ItemWizardSessionDTO session) {
        Map<String, Object> data = getStepDataAsMap(session, ItemWizardStep.PRICING);
        return getValueSafely(data, "unitPrice", BigDecimal.class, BigDecimal.ZERO);
    }

    /**
     * Витягує загальну ціну з Pricing
     */
    @Named("extractTotalPrice")
    default BigDecimal extractTotalPrice(ItemWizardSessionDTO session) {
        Map<String, Object> data = getStepDataAsMap(session, ItemWizardStep.PRICING);
        BigDecimal totalPrice = getValueSafely(data, "finalPrice", BigDecimal.class, null);

        if (totalPrice != null) {
            return totalPrice;
        }

        // Fallback: розрахувати як unitPrice * quantity
        BigDecimal unitPrice = extractUnitPrice(session);
        Integer quantity = extractQuantity(session);
        return unitPrice.multiply(BigDecimal.valueOf(quantity));
    }

    /**
     * Витягує матеріал з Characteristics
     */
    @Named("extractMaterial")
    default String extractMaterial(ItemWizardSessionDTO session) {
        Map<String, Object> data = getStepDataAsMap(session, ItemWizardStep.CHARACTERISTICS);
        return getValueSafely(data, "material", String.class, null);
    }

    /**
     * Витягує колір з Characteristics
     */
    @Named("extractColor")
    default String extractColor(ItemWizardSessionDTO session) {
        Map<String, Object> data = getStepDataAsMap(session, ItemWizardStep.CHARACTERISTICS);
        return getValueSafely(data, "color", String.class, null);
    }

    /**
     * Витягує тип наповнювача з Characteristics
     */
    @Named("extractFillerType")
    default String extractFillerType(ItemWizardSessionDTO session) {
        Map<String, Object> data = getStepDataAsMap(session, ItemWizardStep.CHARACTERISTICS);
        return getValueSafely(data, "fillerType", String.class, null);
    }

    /**
     * Витягує чи збитий наповнювач з Characteristics
     */
    @Named("extractFillerCompressed")
    default Boolean extractFillerCompressed(ItemWizardSessionDTO session) {
        Map<String, Object> data = getStepDataAsMap(session, ItemWizardStep.CHARACTERISTICS);
        return getValueSafely(data, "fillerCompressed", Boolean.class, false);
    }

    /**
     * Витягує ступінь зносу з Characteristics
     */
    @Named("extractWearDegree")
    default String extractWearDegree(ItemWizardSessionDTO session) {
        Map<String, Object> data = getStepDataAsMap(session, ItemWizardStep.CHARACTERISTICS);
        return getValueSafely(data, "wearDegree", String.class, null);
    }

    /**
     * Витягує спеціальні інструкції з Characteristics
     */
    @Named("extractSpecialInstructions")
    default String extractSpecialInstructions(ItemWizardSessionDTO session) {
        Map<String, Object> data = getStepDataAsMap(session, ItemWizardStep.CHARACTERISTICS);
        return getValueSafely(data, "specialInstructions", String.class, null);
    }

    /**
     * Витягує плями як рядок з Defects & Stains
     */
    @Named("extractStainsString")
    default String extractStainsString(ItemWizardSessionDTO session) {
        Map<String, Object> data = getStepDataAsMap(session, ItemWizardStep.DEFECTS_STAINS);
        @SuppressWarnings("unchecked")
        List<String> stains = (List<String>) data.get("selectedStains");
        return listToString(stains);
    }

    /**
     * Витягує інші плями з Defects & Stains
     */
    @Named("extractOtherStains")
    default String extractOtherStains(ItemWizardSessionDTO session) {
        Map<String, Object> data = getStepDataAsMap(session, ItemWizardStep.DEFECTS_STAINS);
        return getValueSafely(data, "otherStains", String.class, null);
    }

    /**
     * Витягує дефекти як рядок з Defects & Stains
     */
    @Named("extractDefectsString")
    default String extractDefectsString(ItemWizardSessionDTO session) {
        Map<String, Object> data = getStepDataAsMap(session, ItemWizardStep.DEFECTS_STAINS);
        @SuppressWarnings("unchecked")
        List<String> defects = (List<String>) data.get("selectedDefects");
        return listToString(defects);
    }

    /**
     * Витягує дефекти та ризики з Defects & Stains
     */
    @Named("extractDefectsAndRisks")
    default String extractDefectsAndRisks(ItemWizardSessionDTO session) {
        Map<String, Object> data = getStepDataAsMap(session, ItemWizardStep.DEFECTS_STAINS);
        return getValueSafely(data, "defectsAndRisks", String.class, null);
    }

    /**
     * Витягує причину "без гарантій" з Defects & Stains
     */
    @Named("extractNoGuaranteeReason")
    default String extractNoGuaranteeReason(ItemWizardSessionDTO session) {
        Map<String, Object> data = getStepDataAsMap(session, ItemWizardStep.DEFECTS_STAINS);
        return getValueSafely(data, "noGuaranteeReason", String.class, null);
    }

    /**
     * Витягує примітки щодо дефектів з Defects & Stains
     */
    @Named("extractDefectsNotes")
    default String extractDefectsNotes(ItemWizardSessionDTO session) {
        Map<String, Object> data = getStepDataAsMap(session, ItemWizardStep.DEFECTS_STAINS);
        return getValueSafely(data, "defectsNotes", String.class, null);
    }
}
