package com.aksi.domain.order.statemachine.stage2.substep2.dto;

import lombok.Builder;
import lombok.Data;

/**
 * DTO для характеристик предмета (підетап 2.2)
 */
@Data
@Builder(toBuilder = true)
public class ItemCharacteristicsDTO {

    /**
     * Матеріал предмета
     */
    private String material;

    /**
     * Колір предмета
     */
    private String color;

    /**
     * Тип наповнювача (для відповідних категорій)
     */
    private String fillerType;

    /**
     * Чи збитий наповнювач
     */
    private Boolean isFillerDamaged;

    /**
     * Ступінь зносу у відсотках
     */
    private String wearDegree;

    /**
     * Примітки щодо характеристик
     */
    private String notes;

    /**
     * Чи потрібно показувати секцію наповнювача для даної категорії
     */
    private Boolean showFillerSection;

    /**
     * Чи всі обов'язкові поля заповнені
     */
    public boolean isComplete() {
        boolean basicFieldsComplete = material != null && !material.trim().isEmpty() &&
                color != null && !color.trim().isEmpty() &&
                wearDegree != null && !wearDegree.trim().isEmpty();

        // Якщо показується секція наповнювача, то вона також обов'язкова
        if (Boolean.TRUE.equals(showFillerSection)) {
            return basicFieldsComplete &&
                   fillerType != null && !fillerType.trim().isEmpty();
        }

        return basicFieldsComplete;
    }

    /**
     * Створити порожній DTO з базовими налаштуваннями
     */
    public static ItemCharacteristicsDTO createEmpty() {
        return ItemCharacteristicsDTO.builder()
                .material("")
                .color("")
                .fillerType("")
                .isFillerDamaged(false)
                .wearDegree("")
                .notes("")
                .showFillerSection(false)
                .build();
    }
}
