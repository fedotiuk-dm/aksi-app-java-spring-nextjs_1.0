package com.aksi.domain.order.statemachine.stage2.substep2.dto;

import com.aksi.domain.order.dto.OrderItemAddRequest;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для управління станом підетапу 2.2 "Характеристики предмета".
 * Використовує domain DTO згідно з архітектурними правилами.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemCharacteristicsDTO {

    /**
     * Поточний запит на додавання предмета (містить характеристики).
     */
    private OrderItemAddRequest currentItem;

    /**
     * Чи завершено вибір матеріалу.
     */
    @Builder.Default
    private boolean materialSelectionCompleted = false;

    /**
     * Чи завершено вибір кольору.
     */
    @Builder.Default
    private boolean colorSelectionCompleted = false;

    /**
     * Чи завершено вибір наповнювача.
     */
    @Builder.Default
    private boolean fillerSelectionCompleted = false;

    /**
     * Чи завершено вибір ступеня зносу.
     */
    @Builder.Default
    private boolean wearDegreeSelectionCompleted = false;

    /**
     * Перевіряє, чи всі обов'язкові дані заповнені.
     *
     * @return true, якщо дані валідні
     */
    public boolean isDataValid() {
        return materialSelectionCompleted && colorSelectionCompleted && wearDegreeSelectionCompleted;
    }

    /**
     * Перевіряє, чи є матеріал.
     *
     * @return true, якщо матеріал вибраний
     */
    public boolean hasMaterial() {
        if (currentItem == null) {
            return false;
        }
        return currentItem.getMaterial() != null && !currentItem.getMaterial().trim().isEmpty();
    }

    /**
     * Перевіряє, чи є колір.
     *
     * @return true, якщо колір вибраний
     */
    public boolean hasColor() {
        if (currentItem == null) {
            return false;
        }
        return currentItem.getColor() != null && !currentItem.getColor().trim().isEmpty();
    }

    /**
     * Перевіряє, чи є наповнювач.
     *
     * @return true, якщо наповнювач вибраний
     */
    public boolean hasFiller() {
        if (currentItem == null) {
            return false;
        }
        return currentItem.getFillerType() != null && !currentItem.getFillerType().trim().isEmpty();
    }

    /**
     * Перевіряє, чи є ступінь зносу.
     *
     * @return true, якщо ступінь зносу вибраний
     */
    public boolean hasWearDegree() {
        if (currentItem == null) {
            return false;
        }
        return currentItem.getWearDegree() != null && !currentItem.getWearDegree().trim().isEmpty();
    }

    /**
     * Ініціалізує currentItem, якщо він null.
     */
    public void ensureCurrentItemExists() {
        if (currentItem == null) {
            currentItem = OrderItemAddRequest.builder().build();
        }
    }
}
