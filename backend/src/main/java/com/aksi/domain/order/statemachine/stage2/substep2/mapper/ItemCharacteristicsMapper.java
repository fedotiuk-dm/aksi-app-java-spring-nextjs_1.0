package com.aksi.domain.order.statemachine.stage2.substep2.mapper;

import com.aksi.domain.order.constants.ItemCharacteristicsConstants;
import com.aksi.domain.order.dto.OrderItemAddRequest;
import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.dto.ItemCharacteristicsDTO;

/**
 * Маппер для перетворення даних характеристик предмета
 */
public class ItemCharacteristicsMapper {

    private ItemCharacteristicsMapper() {
        // Приватний конструктор для статичного класу
    }

    /**
     * Перетворення з DTO характеристик в запит додавання предмета
     */
    public static OrderItemAddRequest toOrderItemAddRequest(ItemCharacteristicsDTO characteristicsDTO) {
        if (characteristicsDTO == null) {
            return OrderItemAddRequest.builder().build();
        }

        return OrderItemAddRequest.builder()
                .material(characteristicsDTO.getMaterial())
                .color(characteristicsDTO.getColor())
                .fillerType(characteristicsDTO.getFillerType())
                .fillerCompressed(characteristicsDTO.getIsFillerDamaged())
                .wearDegree(characteristicsDTO.getWearDegree())
                .defectsNotes(buildNotesWithCharacteristics(characteristicsDTO))
                .build();
    }

    /**
     * Перетворення з DTO предмета в DTO характеристик
     */
    public static ItemCharacteristicsDTO fromOrderItemDTO(OrderItemDTO orderItemDTO) {
        if (orderItemDTO == null) {
            return ItemCharacteristicsDTO.createEmpty();
        }

        return ItemCharacteristicsDTO.builder()
                .material(orderItemDTO.getMaterial())
                .color(orderItemDTO.getColor())
                .fillerType(orderItemDTO.getFillerType())
                .isFillerDamaged(orderItemDTO.getFillerCompressed())
                .wearDegree(orderItemDTO.getWearDegree())
                .notes(orderItemDTO.getDefectsNotes())
                .showFillerSection(shouldShowFillerSection(orderItemDTO.getCategory()))
                .build();
    }

    /**
     * Оновлення існуючого DTO характеристик з новими даними
     */
    public static ItemCharacteristicsDTO updateWithNewData(
            ItemCharacteristicsDTO existingDTO,
            String field,
            Object value) {

        if (existingDTO == null) {
            existingDTO = ItemCharacteristicsDTO.createEmpty();
        }

        ItemCharacteristicsDTO.ItemCharacteristicsDTOBuilder builder = existingDTO.toBuilder();

        switch (field.toLowerCase()) {
            case "material" -> builder.material((String) value);
            case "color" -> builder.color((String) value);
            case "fillertype" -> builder.fillerType((String) value);
            case "isfillerdamaged" -> builder.isFillerDamaged((Boolean) value);
            case "weardegree" -> builder.wearDegree((String) value);
            case "notes" -> builder.notes((String) value);
            case "showfillersection" -> builder.showFillerSection((Boolean) value);
            default -> {
                // Невідоме поле - ігноруємо
            }
        }

        return builder.build();
    }

    /**
     * Створення DTO з урахуванням категорії для визначення необхідності секції наповнювача
     */
    public static ItemCharacteristicsDTO createForCategory(String categoryCode) {
        return ItemCharacteristicsDTO.builder()
                .material("")
                .color("")
                .fillerType("")
                .isFillerDamaged(false)
                .wearDegree("")
                .notes("")
                .showFillerSection(shouldShowFillerSection(categoryCode))
                .build();
    }

    /**
     * Створення примітки з характеристиками для збереження в OrderItem
     */
    private static String buildNotesWithCharacteristics(ItemCharacteristicsDTO dto) {
        StringBuilder notes = new StringBuilder();

        if (dto.getNotes() != null && !dto.getNotes().trim().isEmpty()) {
            notes.append(dto.getNotes()).append(" ");
        }

        // Додаємо інформацію про наповнювач, якщо є
        if (dto.getFillerType() != null && !dto.getFillerType().trim().isEmpty()) {
            notes.append("Наповнювач: ").append(dto.getFillerType());

            if (Boolean.TRUE.equals(dto.getIsFillerDamaged())) {
                notes.append(" (збитий)");
            }
            notes.append(". ");
        }

        // Додаємо інформацію про ступінь зносу
        if (dto.getWearDegree() != null && !dto.getWearDegree().trim().isEmpty()) {
            notes.append("Знос: ").append(dto.getWearDegree()).append(". ");
        }

        return notes.toString().trim();
    }

    /**
     * Визначення чи потрібно показувати секцію наповнювача
     */
    private static boolean shouldShowFillerSection(String categoryCode) {
        return ItemCharacteristicsConstants.FillerCategories.shouldShowFillerSection(categoryCode);
    }
}
