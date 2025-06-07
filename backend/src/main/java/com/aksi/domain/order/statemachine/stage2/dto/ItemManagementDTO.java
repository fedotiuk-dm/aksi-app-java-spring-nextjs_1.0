package com.aksi.domain.order.statemachine.stage2.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.aksi.domain.order.dto.OrderItemDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для управління предметами в етапі 2 Order Wizard.
 * Містить інформацію про додані предмети та загальний стан етапу.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemManagementDTO {

    /**
     * Список доданих предметів до замовлення.
     */
    @Builder.Default
    private List<OrderItemDTO> addedItems = new ArrayList<>();

    /**
     * Загальна вартість всіх предметів.
     */
    @Builder.Default
    private BigDecimal totalAmount = BigDecimal.ZERO;

    /**
     * Чи можна перейти до наступного етапу.
     */
    @Builder.Default
    private Boolean canProceedToNextStage = false;

    /**
     * Поточний статус етапу 2.
     */
    private String currentStatus;

    /**
     * Кількість доданих предметів.
     */
    public int getItemCount() {
        return addedItems != null ? addedItems.size() : 0;
    }

    /**
     * Чи має етап хоча б один предмет.
     */
    public boolean hasItems() {
        return getItemCount() > 0;
    }

    /**
     * Додати предмет до списку.
     */
    public void addItem(OrderItemDTO item) {
        if (addedItems == null) {
            addedItems = new ArrayList<>();
        }
        addedItems.add(item);
        recalculateTotal();
    }

    /**
     * Видалити предмет зі списку.
     */
    public boolean removeItem(String itemId) {
        if (addedItems == null) {
            return false;
        }
        boolean removed = addedItems.removeIf(item ->
            item.getId() != null && item.getId().equals(itemId));
        if (removed) {
            recalculateTotal();
        }
        return removed;
    }

    /**
     * Перерахувати загальну суму.
     */
    private void recalculateTotal() {
        if (addedItems == null || addedItems.isEmpty()) {
            totalAmount = BigDecimal.ZERO;
            canProceedToNextStage = false;
        } else {
            totalAmount = addedItems.stream()
                .map(OrderItemDTO::getTotalPrice)
                .filter(price -> price != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            canProceedToNextStage = true;
        }
    }
}
