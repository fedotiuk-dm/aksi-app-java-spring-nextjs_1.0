package com.aksi.domain.order.statemachine.stage2.substep3.dto;

import com.aksi.domain.order.dto.OrderItemAddRequest;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для управління станом підетапу 2.3 "Забруднення, дефекти та ризики".
 * Використовує domain DTO згідно з архітектурними правилами.
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class StainsDefectsDTO {

    /**
     * Поточний запит на додавання предмета (містить плями та дефекти).
     */
    private OrderItemAddRequest currentItem;

    /**
     * Чи завершено вибір плям.
     */
    @Builder.Default
    private boolean stainsSelectionCompleted = false;

    /**
     * Чи завершено вибір дефектів.
     */
    @Builder.Default
    private boolean defectsSelectionCompleted = false;

    /**
     * Перевіряє, чи всі обов'язкові дані заповнені.
     *
     * @return true, якщо дані валідні
     */
    public boolean isDataValid() {
        return stainsSelectionCompleted && defectsSelectionCompleted;
    }

    /**
     * Перевіряє, чи є вибрані плями.
     *
     * @return true, якщо є вибрані плями
     */
    public boolean hasStains() {
        if (currentItem == null) {
            return false;
        }
        return (currentItem.getStains() != null && !currentItem.getStains().trim().isEmpty())
                || (currentItem.getOtherStains() != null && !currentItem.getOtherStains().trim().isEmpty());
    }

    /**
     * Перевіряє, чи є вибрані дефекти.
     *
     * @return true, якщо є вибрані дефекти
     */
    public boolean hasDefects() {
        if (currentItem == null) {
            return false;
        }
        return currentItem.getDefectsAndRisks() != null && !currentItem.getDefectsAndRisks().trim().isEmpty();
    }

    /**
     * Перевіряє, чи обрано "Без гарантій".
     *
     * @return true, якщо обрано "Без гарантій"
     */
    public boolean isNoGuarantee() {
        if (currentItem == null || currentItem.getDefectsAndRisks() == null) {
            return false;
        }
        return currentItem.getDefectsAndRisks().contains("Без гарантій");
    }

    /**
     * Перевіряє, чи потрібна причина відмови від гарантій.
     *
     * @return true, якщо потрібна причина
     */
    public boolean isNoGuaranteeReasonRequired() {
        return isNoGuarantee() && (currentItem.getNoGuaranteeReason() == null
                || currentItem.getNoGuaranteeReason().trim().isEmpty());
    }

    /**
     * Ініціалізує currentItem, якщо він null.
     */
    public void ensureCurrentItemExists() {
        if (currentItem == null) {
            currentItem = OrderItemAddRequest.builder().build();
        }
    }

    /**
     * Перевіряє, чи завершено вибір плям.
     *
     * @return true, якщо завершено вибір плям
     */
    public boolean isStainsSelectionCompleted() {
        return stainsSelectionCompleted;
    }

    /**
     * Перевіряє, чи завершено вибір дефектів.
     *
     * @return true, якщо завершено вибір дефектів
     */
    public boolean isDefectsSelectionCompleted() {
        return defectsSelectionCompleted;
    }
}
