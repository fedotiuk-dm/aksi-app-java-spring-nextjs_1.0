package com.aksi.domain.order.statemachine.stage2.mapper;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage2.dto.ItemCharacteristicsDTO;
import com.aksi.domain.order.statemachine.stage2.dto.TempOrderItemDTO;

/**
 * Mapper для підетапу 2.2 "Характеристики предмета".
 *
 * Відповідає за перетворення між різними DTO:
 * - TempOrderItemDTO ↔ ItemCharacteristicsDTO
 */
@Component
public class ItemCharacteristicsMapper {

    /**
     * Створює ItemCharacteristicsDTO на основі TempOrderItemDTO.
     *
     * @param tempItem тимчасові дані предмета
     * @return DTO з характеристиками або null
     */
    public ItemCharacteristicsDTO fromTempOrderItem(TempOrderItemDTO tempItem) {
        if (tempItem == null) {
            return null;
        }

        return ItemCharacteristicsDTO.builder()
                .selectedMaterial(tempItem.getMaterial())
                .selectedColor(tempItem.getColor())
                .selectedFillerType(tempItem.getFillerType())
                .fillerCompressed(tempItem.getFillerCompressed())
                .selectedWearDegree(tempItem.getWearDegree())
                .categoryCode(tempItem.getCategory())
                .build();
    }

    /**
     * Оновлює TempOrderItemDTO характеристиками з ItemCharacteristicsDTO.
     *
     * @param tempItem тимчасові дані предмета для оновлення
     * @param characteristics дані характеристик
     */
    public void updateTempOrderItem(TempOrderItemDTO tempItem, ItemCharacteristicsDTO characteristics) {
        if (tempItem == null || characteristics == null) {
            return;
        }

        tempItem.setMaterial(characteristics.getSelectedMaterial());
        tempItem.setColor(characteristics.getFinalColor());
        tempItem.setFillerType(characteristics.getFinalFillerType());
        tempItem.setFillerCompressed(characteristics.getFillerCompressed());
        tempItem.setWearDegree(characteristics.getSelectedWearDegree());
    }

    /**
     * Створює новий TempOrderItemDTO на основі характеристик.
     *
     * @param characteristics дані характеристик
     * @return новий TempOrderItemDTO або null
     */
    public TempOrderItemDTO toTempOrderItem(ItemCharacteristicsDTO characteristics) {
        if (characteristics == null) {
            return null;
        }

        return TempOrderItemDTO.builder()
                .material(characteristics.getSelectedMaterial())
                .color(characteristics.getFinalColor())
                .fillerType(characteristics.getFinalFillerType())
                .fillerCompressed(characteristics.getFillerCompressed())
                .wearDegree(characteristics.getSelectedWearDegree())
                .category(characteristics.getCategoryCode())
                .build();
    }

    /**
     * Копіює характеристики з одного DTO в інший.
     *
     * @param source джерело
     * @param target ціль
     */
    public void copyCharacteristics(ItemCharacteristicsDTO source, ItemCharacteristicsDTO target) {
        if (source == null || target == null) {
            return;
        }

        target.setSelectedMaterial(source.getSelectedMaterial());
        target.setSelectedColor(source.getSelectedColor());
        target.setCustomColor(source.getCustomColor());
        target.setSelectedFillerType(source.getSelectedFillerType());
        target.setCustomFillerType(source.getCustomFillerType());
        target.setFillerCompressed(source.getFillerCompressed());
        target.setSelectedWearDegree(source.getSelectedWearDegree());
        target.setCategoryCode(source.getCategoryCode());
        target.setShowFillerSection(source.getShowFillerSection());
    }

    /**
     * Перевіряє, чи мають два DTO однакові характеристики.
     *
     * @param first перший DTO
     * @param second другий DTO
     * @return true, якщо характеристики однакові
     */
    public boolean areCharacteristicsEqual(ItemCharacteristicsDTO first, ItemCharacteristicsDTO second) {
        if (first == null && second == null) {
            return true;
        }
        if (first == null || second == null) {
            return false;
        }

        return equals(first.getSelectedMaterial(), second.getSelectedMaterial()) &&
               equals(first.getFinalColor(), second.getFinalColor()) &&
               equals(first.getFinalFillerType(), second.getFinalFillerType()) &&
               equals(first.getFillerCompressed(), second.getFillerCompressed()) &&
               equals(first.getSelectedWearDegree(), second.getSelectedWearDegree());
    }

    /**
     * Утилітний метод для порівняння двох об'єктів з урахуванням null.
     */
    private boolean equals(Object first, Object second) {
        if (first == null && second == null) {
            return true;
        }
        if (first == null || second == null) {
            return false;
        }
        return first.equals(second);
    }
}
