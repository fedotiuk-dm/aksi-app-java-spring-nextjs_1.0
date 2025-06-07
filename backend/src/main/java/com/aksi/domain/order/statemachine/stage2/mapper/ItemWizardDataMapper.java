package com.aksi.domain.order.statemachine.stage2.mapper;

import java.math.BigDecimal;
import java.util.List;

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
 * - Розбір OrderItemDTO на дані підетапів для редагування
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
    @Mapping(target = "name", source = ".", qualifiedByName = "extractItemName")
    @Mapping(target = "category", source = ".", qualifiedByName = "extractItemCategory")
    @Mapping(target = "quantity", source = ".", qualifiedByName = "extractQuantity")
    @Mapping(target = "unitOfMeasure", source = ".", qualifiedByName = "extractUnitOfMeasure")
    @Mapping(target = "unitPrice", source = ".", qualifiedByName = "extractUnitPrice")
    @Mapping(target = "totalPrice", source = ".", qualifiedByName = "extractTotalPrice")
    @Mapping(target = "material", source = ".", qualifiedByName = "extractMaterial")
    @Mapping(target = "color", source = ".", qualifiedByName = "extractColor")
    @Mapping(target = "stains", source = ".", qualifiedByName = "extractStains")
    @Mapping(target = "defects", source = ".", qualifiedByName = "extractDefects")
    @Mapping(target = "modifiers", source = ".", qualifiedByName = "extractModifiers")
    @Mapping(target = "photos", source = ".", qualifiedByName = "extractPhotos")
    @Mapping(target = "notes", source = ".", qualifiedByName = "extractNotes")
    OrderItemDTO buildCompleteOrderItem(ItemWizardSessionDTO session);

    /**
     * Розбирає OrderItemDTO на дані кроків для редагування
     *
     * @param orderItem існуючий предмет замовлення
     * @param session сесія для заповнення даними
     */
    void populateSessionFromOrderItem(OrderItemDTO orderItem, ItemWizardSessionDTO session);

    // ========== Методи витягування даних з кроків ==========

    /**
     * Витягує назву предмета з Basic Info
     */
    @Named("extractItemName")
    default String extractItemName(ItemWizardSessionDTO session) {
        try {
            // Припускаємо BasicInfoDTO з полем itemName
            Object basicInfo = session.getStepData(ItemWizardStep.BASIC_INFO, Object.class);
            if (basicInfo instanceof java.util.Map) {
                @SuppressWarnings("unchecked")
                java.util.Map<String, Object> data = (java.util.Map<String, Object>) basicInfo;
                return (String) data.get("itemName");
            }
            return "Невизначений предмет";
        } catch (Exception e) {
            return "Невизначений предмет";
        }
    }

    /**
     * Витягує категорію предмета з Basic Info
     */
    @Named("extractItemCategory")
    default String extractItemCategory(ItemWizardSessionDTO session) {
        try {
            Object basicInfo = session.getStepData(ItemWizardStep.BASIC_INFO, Object.class);
            if (basicInfo instanceof java.util.Map) {
                @SuppressWarnings("unchecked")
                java.util.Map<String, Object> data = (java.util.Map<String, Object>) basicInfo;
                return (String) data.get("categoryName");
            }
            return "Невизначена категорія";
        } catch (Exception e) {
            return "Невизначена категорія";
        }
    }

    /**
     * Витягує кількість з Basic Info
     */
    @Named("extractQuantity")
    default Integer extractQuantity(ItemWizardSessionDTO session) {
        try {
            Object basicInfo = session.getStepData(ItemWizardStep.BASIC_INFO, Object.class);
            if (basicInfo instanceof java.util.Map) {
                @SuppressWarnings("unchecked")
                java.util.Map<String, Object> data = (java.util.Map<String, Object>) basicInfo;
                Object quantity = data.get("quantity");
                if (quantity instanceof Integer) {
                    return (Integer) quantity;
                } else if (quantity instanceof String) {
                    return Integer.parseInt((String) quantity);
                }
            }
            return 1; // За замовчуванням
        } catch (Exception e) {
            return 1;
        }
    }

    /**
     * Витягує одиницю виміру з Basic Info
     */
    @Named("extractUnitOfMeasure")
    default String extractUnitOfMeasure(ItemWizardSessionDTO session) {
        try {
            Object basicInfo = session.getStepData(ItemWizardStep.BASIC_INFO, Object.class);
            if (basicInfo instanceof java.util.Map) {
                @SuppressWarnings("unchecked")
                java.util.Map<String, Object> data = (java.util.Map<String, Object>) basicInfo;
                return (String) data.get("unitOfMeasure");
            }
            return "шт"; // За замовчуванням
        } catch (Exception e) {
            return "шт";
        }
    }

    /**
     * Витягує ціну за одиницю з Pricing
     */
    @Named("extractUnitPrice")
    default BigDecimal extractUnitPrice(ItemWizardSessionDTO session) {
        try {
            Object pricingInfo = session.getStepData(ItemWizardStep.PRICING, Object.class);
            if (pricingInfo instanceof java.util.Map) {
                @SuppressWarnings("unchecked")
                java.util.Map<String, Object> data = (java.util.Map<String, Object>) pricingInfo;
                Object price = data.get("unitPrice");
                if (price instanceof BigDecimal) {
                    return (BigDecimal) price;
                } else if (price instanceof String) {
                    return new BigDecimal((String) price);
                } else if (price instanceof Number) {
                    return BigDecimal.valueOf(((Number) price).doubleValue());
                }
            }
            return BigDecimal.ZERO;
        } catch (Exception e) {
            return BigDecimal.ZERO;
        }
    }

    /**
     * Витягує загальну ціну з Pricing
     */
    @Named("extractTotalPrice")
    default BigDecimal extractTotalPrice(ItemWizardSessionDTO session) {
        try {
            Object pricingInfo = session.getStepData(ItemWizardStep.PRICING, Object.class);
            if (pricingInfo instanceof java.util.Map) {
                @SuppressWarnings("unchecked")
                java.util.Map<String, Object> data = (java.util.Map<String, Object>) pricingInfo;
                Object price = data.get("finalPrice");
                if (price instanceof BigDecimal) {
                    return (BigDecimal) price;
                } else if (price instanceof String) {
                    return new BigDecimal((String) price);
                } else if (price instanceof Number) {
                    return BigDecimal.valueOf(((Number) price).doubleValue());
                }
            }

            // Fallback: розрахувати як unitPrice * quantity
            BigDecimal unitPrice = extractUnitPrice(session);
            Integer quantity = extractQuantity(session);
            return unitPrice.multiply(BigDecimal.valueOf(quantity));

        } catch (Exception e) {
            return BigDecimal.ZERO;
        }
    }

    /**
     * Витягує матеріал з Characteristics
     */
    @Named("extractMaterial")
    default String extractMaterial(ItemWizardSessionDTO session) {
        try {
            Object characteristics = session.getStepData(ItemWizardStep.CHARACTERISTICS, Object.class);
            if (characteristics instanceof java.util.Map) {
                @SuppressWarnings("unchecked")
                java.util.Map<String, Object> data = (java.util.Map<String, Object>) characteristics;
                return (String) data.get("material");
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Витягує колір з Characteristics
     */
    @Named("extractColor")
    default String extractColor(ItemWizardSessionDTO session) {
        try {
            Object characteristics = session.getStepData(ItemWizardStep.CHARACTERISTICS, Object.class);
            if (characteristics instanceof java.util.Map) {
                @SuppressWarnings("unchecked")
                java.util.Map<String, Object> data = (java.util.Map<String, Object>) characteristics;
                return (String) data.get("color");
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Витягує плями з Defects & Stains
     */
    @Named("extractStains")
    default List<String> extractStains(ItemWizardSessionDTO session) {
        try {
            Object defectsStains = session.getStepData(ItemWizardStep.DEFECTS_STAINS, Object.class);
            if (defectsStains instanceof java.util.Map) {
                @SuppressWarnings("unchecked")
                java.util.Map<String, Object> data = (java.util.Map<String, Object>) defectsStains;
                @SuppressWarnings("unchecked")
                List<String> stains = (List<String>) data.get("selectedStains");
                return stains;
            }
            return List.of();
        } catch (Exception e) {
            return List.of();
        }
    }

    /**
     * Витягує дефекти з Defects & Stains
     */
    @Named("extractDefects")
    default List<String> extractDefects(ItemWizardSessionDTO session) {
        try {
            Object defectsStains = session.getStepData(ItemWizardStep.DEFECTS_STAINS, Object.class);
            if (defectsStains instanceof java.util.Map) {
                @SuppressWarnings("unchecked")
                java.util.Map<String, Object> data = (java.util.Map<String, Object>) defectsStains;
                @SuppressWarnings("unchecked")
                List<String> defects = (List<String>) data.get("selectedDefects");
                return defects;
            }
            return List.of();
        } catch (Exception e) {
            return List.of();
        }
    }

    /**
     * Витягує модифікатори з Pricing
     */
    @Named("extractModifiers")
    default List<String> extractModifiers(ItemWizardSessionDTO session) {
        try {
            Object pricingInfo = session.getStepData(ItemWizardStep.PRICING, Object.class);
            if (pricingInfo instanceof java.util.Map) {
                @SuppressWarnings("unchecked")
                java.util.Map<String, Object> data = (java.util.Map<String, Object>) pricingInfo;
                @SuppressWarnings("unchecked")
                List<String> modifiers = (List<String>) data.get("selectedModifiers");
                return modifiers;
            }
            return List.of();
        } catch (Exception e) {
            return List.of();
        }
    }

    /**
     * Витягує фото з Photos
     */
    @Named("extractPhotos")
    default List<String> extractPhotos(ItemWizardSessionDTO session) {
        try {
            Object photosInfo = session.getStepData(ItemWizardStep.PHOTOS, Object.class);
            if (photosInfo instanceof java.util.Map) {
                @SuppressWarnings("unchecked")
                java.util.Map<String, Object> data = (java.util.Map<String, Object>) photosInfo;
                @SuppressWarnings("unchecked")
                List<String> photoUrls = (List<String>) data.get("photoUrls");
                return photoUrls;
            }
            return List.of();
        } catch (Exception e) {
            return List.of();
        }
    }

    /**
     * Витягує примітки з різних кроків
     */
    @Named("extractNotes")
    default String extractNotes(ItemWizardSessionDTO session) {
        try {
            StringBuilder notes = new StringBuilder();

            // Примітки з Characteristics
            Object characteristics = session.getStepData(ItemWizardStep.CHARACTERISTICS, Object.class);
            if (characteristics instanceof java.util.Map) {
                @SuppressWarnings("unchecked")
                java.util.Map<String, Object> data = (java.util.Map<String, Object>) characteristics;
                String charNotes = (String) data.get("notes");
                if (charNotes != null && !charNotes.trim().isEmpty()) {
                    notes.append("Характеристики: ").append(charNotes).append("; ");
                }
            }

            // Примітки з Defects & Stains
            Object defectsStains = session.getStepData(ItemWizardStep.DEFECTS_STAINS, Object.class);
            if (defectsStains instanceof java.util.Map) {
                @SuppressWarnings("unchecked")
                java.util.Map<String, Object> data = (java.util.Map<String, Object>) defectsStains;
                String defectNotes = (String) data.get("defectNotes");
                if (defectNotes != null && !defectNotes.trim().isEmpty()) {
                    notes.append("Дефекти: ").append(defectNotes).append("; ");
                }
            }

            String result = notes.toString();
            return result.isEmpty() ? null : result.trim();

        } catch (Exception e) {
            return null;
        }
    }
}
