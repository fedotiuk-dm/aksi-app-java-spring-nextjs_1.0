package com.aksi.domain.order.statemachine.stage2.substep2.mapper;

import java.util.Map;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.dto.CharacteristicsDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.FillingType;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.MaterialType;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.WearLevel;

/**
 * Mapper для трансформації між доменними типами та DTO характеристик (підетап 2.2)
 *
 * Використовує MapStruct для безпечної трансформації даних
 */
@Mapper(componentModel = "spring")
public interface CharacteristicsMapper {

    /**
     * Трансформує CharacteristicsDTO в дані для OrderItemDTO
     *
     * @param characteristics дані характеристик з підетапу 2.2
     * @return частина даних для OrderItemDTO
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "orderId", ignore = true)
    @Mapping(target = "name", ignore = true)
    @Mapping(target = "description", ignore = true)
    @Mapping(target = "quantity", ignore = true)
    @Mapping(target = "unitPrice", ignore = true)
    @Mapping(target = "totalPrice", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "unitOfMeasure", ignore = true)
    @Mapping(target = "defects", ignore = true)
    @Mapping(target = "specialInstructions", ignore = true)
    @Mapping(target = "stains", ignore = true)
    @Mapping(target = "otherStains", ignore = true)
    @Mapping(target = "defectsAndRisks", ignore = true)
    @Mapping(target = "noGuaranteeReason", ignore = true)
    @Mapping(target = "defectsNotes", ignore = true)
    @Mapping(target = "material", source = "material", qualifiedByName = "materialToString")
    @Mapping(target = "color", source = "color")
    @Mapping(target = "fillerType", source = ".", qualifiedByName = "buildFillingInfo")
    @Mapping(target = "fillerCompressed", source = "isDamagedFilling")
    @Mapping(target = "wearDegree", source = ".", qualifiedByName = "buildWearInfo")
    OrderItemDTO toOrderItemPart(CharacteristicsDTO characteristics);

    /**
     * Витягує характеристики з OrderItemDTO
     *
     * @param orderItem доменний об'єкт замовлення
     * @return DTO характеристик
     */
    @Mapping(target = "material", source = "material", qualifiedByName = "stringToMaterial")
    @Mapping(target = "color", source = "color")
    @Mapping(target = "notes", source = "defectsNotes")
    @Mapping(target = "filling", ignore = true) // Буде заповнено через customFilling
    @Mapping(target = "customFilling", ignore = true)
    @Mapping(target = "isDamagedFilling", source = "fillerCompressed")
    @Mapping(target = "wearLevel", ignore = true)
    @Mapping(target = "isStandardColor", ignore = true)
    @Mapping(target = "isValid", ignore = true)
    @Mapping(target = "validationErrors", ignore = true)
    CharacteristicsDTO fromOrderItem(OrderItemDTO orderItem);

    /**
     * Витягує дані характеристик з Map<String, Object> (дані візарда)
     *
     * @param wizardData дані з сесії візарда
     * @return DTO характеристик
     */
    default CharacteristicsDTO fromWizardData(Map<String, Object> wizardData) {
        if (wizardData == null) {
            return CharacteristicsDTO.builder().build();
        }

        CharacteristicsDTO.CharacteristicsDTOBuilder builder = CharacteristicsDTO.builder();

        // Безпечне витягування даних з Map
        try {
            // Матеріал
            Object materialObj = wizardData.get("material");
            if (materialObj instanceof String materialStr) {
                MaterialType material = MaterialType.fromCode(materialStr);
                if (material != null) {
                    builder.material(material);
                }
            } else if (materialObj instanceof MaterialType material) {
                builder.material(material);
            }

            // Колір
            Object colorObj = wizardData.get("color");
            if (colorObj instanceof String color) {
                builder.color(color);
            }

            // Стандартний колір
            Object isStandardColorObj = wizardData.get("isStandardColor");
            if (isStandardColorObj instanceof Boolean isStandard) {
                builder.isStandardColor(isStandard);
            }

            // Наповнювач
            Object fillingObj = wizardData.get("filling");
            if (fillingObj instanceof String fillingStr) {
                FillingType filling = FillingType.fromCode(fillingStr);
                if (filling != null) {
                    builder.filling(filling);
                }
            } else if (fillingObj instanceof FillingType filling) {
                builder.filling(filling);
            }

            // Кастомний наповнювач
            Object customFillingObj = wizardData.get("customFilling");
            if (customFillingObj instanceof String customFilling) {
                builder.customFilling(customFilling);
            }

            // Збитий наповнювач
            Object isDamagedFillingObj = wizardData.get("isDamagedFilling");
            if (isDamagedFillingObj instanceof Boolean isDamaged) {
                builder.isDamagedFilling(isDamaged);
            }

            // Рівень зносу
            Object wearLevelObj = wizardData.get("wearLevel");
            if (wearLevelObj instanceof String wearStr) {
                WearLevel wearLevel = WearLevel.fromDisplayValue(wearStr);
                if (wearLevel != null) {
                    builder.wearLevel(wearLevel);
                }
            } else if (wearLevelObj instanceof Integer wearPercentage) {
                WearLevel wearLevel = WearLevel.fromPercentage(wearPercentage);
                if (wearLevel != null) {
                    builder.wearLevel(wearLevel);
                }
            } else if (wearLevelObj instanceof WearLevel wearLevel) {
                builder.wearLevel(wearLevel);
            }

            // Примітки
            Object notesObj = wizardData.get("characteristicsNotes");
            if (notesObj instanceof String notes) {
                builder.notes(notes);
            }

        } catch (Exception e) {
            // Логування помилок, але продовжуємо роботу
            System.err.println("Помилка при витягуванні характеристик з wizardData: " + e.getMessage());
        }

        return builder.build();
    }

    /**
     * Конвертує CharacteristicsDTO в Map<String, Object> для зберігання в сесії візарда
     *
     * @param characteristics дані характеристик
     * @return Map з даними для зберігання
     */
    default Map<String, Object> toWizardData(CharacteristicsDTO characteristics) {
        Map<String, Object> wizardData = new java.util.HashMap<>();

        if (characteristics == null) {
            return wizardData;
        }

        // Зберігаємо всі дані з characteristics
        if (characteristics.getMaterial() != null) {
            wizardData.put("material", characteristics.getMaterial().getCode());
        }

        if (characteristics.getColor() != null) {
            wizardData.put("color", characteristics.getColor());
        }

        if (characteristics.getIsStandardColor() != null) {
            wizardData.put("isStandardColor", characteristics.getIsStandardColor());
        }

        if (characteristics.getFilling() != null) {
            wizardData.put("filling", characteristics.getFilling().getCode());
        }

        if (characteristics.getCustomFilling() != null) {
            wizardData.put("customFilling", characteristics.getCustomFilling());
        }

        if (characteristics.getIsDamagedFilling() != null) {
            wizardData.put("isDamagedFilling", characteristics.getIsDamagedFilling());
        }

        if (characteristics.getWearLevel() != null) {
            wizardData.put("wearLevel", characteristics.getWearLevel().getPercentage());
        }

        if (characteristics.getNotes() != null) {
            wizardData.put("characteristicsNotes", characteristics.getNotes());
        }

        return wizardData;
    }

        /**
     * Перетворює MaterialType enum в рядок для OrderItemDTO
     *
     * @param material тип матеріала
     * @return рядкове представлення
     */
    @Named("materialToString")
    default String materialToString(MaterialType material) {
        return material != null ? material.getDisplayName() : null;
    }

    /**
     * Перетворює рядок в MaterialType enum
     *
     * @param materialStr рядкове представлення матеріала
     * @return enum MaterialType
     */
    @Named("stringToMaterial")
    default MaterialType stringToMaterial(String materialStr) {
        if (materialStr == null || materialStr.trim().isEmpty()) {
            return null;
        }

        // Спочатку пробуємо по display name
        for (MaterialType material : MaterialType.values()) {
            if (material.getDisplayName().equalsIgnoreCase(materialStr.trim())) {
                return material;
            }
        }

        // Потім по коду
        return MaterialType.fromCode(materialStr);
    }

    /**
     * Створює повну інформацію про наповнювач для OrderItemDTO
     *
     * @param characteristics дані характеристик
     * @return рядок з інформацією про наповнювач
     */
    @Named("buildFillingInfo")
    default String buildFillingInfo(CharacteristicsDTO characteristics) {
        if (characteristics == null || characteristics.getFilling() == null) {
            return null;
        }

        StringBuilder fillingInfo = new StringBuilder();

        // Основний тип наповнювача
        String mainFilling = characteristics.getFullFillingName();
        if (mainFilling != null) {
            fillingInfo.append(mainFilling);
        }

        // Інформація про збитий наповнювач
        if (Boolean.TRUE.equals(characteristics.getIsDamagedFilling())) {
            if (fillingInfo.length() > 0) {
                fillingInfo.append(" (збитий)");
            } else {
                fillingInfo.append("Збитий наповнювач");
            }
        }

        return fillingInfo.length() > 0 ? fillingInfo.toString() : null;
    }

    /**
     * Витягує інформацію про рівень зносу для OrderItemDTO
     *
     * @param characteristics дані характеристик
     * @return рядок з інформацією про знос
     */
    @Named("buildWearInfo")
    default String buildWearInfo(CharacteristicsDTO characteristics) {
        if (characteristics == null || characteristics.getWearLevel() == null) {
            return null;
        }

        WearLevel wearLevel = characteristics.getWearLevel();
        return wearLevel.getDisplayValue() + " - " + wearLevel.getDescription();
    }
}
