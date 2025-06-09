package com.aksi.domain.order.statemachine.stage2.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import com.aksi.domain.order.dto.OrderItemDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для головного екрану менеджера предметів (Етап 2.0).
 * Використовує domain DTO згідно з архітектурними правилами.
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class ItemManagerDTO {

    /**
     * Унікальний ідентифікатор сесії менеджера предметів
     */
    private UUID sessionId;

    /**
     * Ідентифікатор замовлення
     */
    private UUID orderId;

    /**
     * Список доданих предметів (з domain)
     */
    @Builder.Default
    private List<OrderItemDTO> addedItems = new java.util.ArrayList<>();

    /**
     * Загальна вартість всіх предметів
     */
    @Builder.Default
    private BigDecimal totalAmount = BigDecimal.ZERO;

    /**
     * Кількість доданих предметів
     */
    @Builder.Default
    private int itemCount = 0;

    /**
     * Чи можна перейти до наступного етапу (мінімум один предмет)
     */
    @Builder.Default
    private boolean canProceedToNextStage = false;

    /**
     * Ідентифікатор активного підвізарда (якщо запущений)
     */
    private UUID activeWizardId;

    /**
     * Ідентифікатор предмета, що редагується (якщо в режимі редагування)
     */
    private UUID editingItemId;

    /**
     * Поточний стан менеджера
     */
    private String currentStatus;

    /**
     * Перевіряє, чи є додані предмети
     */
    public boolean hasItems() {
        return addedItems != null && !addedItems.isEmpty();
    }

    /**
     * Перевіряє, чи активний підвізард
     */
    public boolean isWizardActive() {
        return activeWizardId != null;
    }

    /**
     * Перевіряє, чи в режимі редагування
     */
    public boolean isEditMode() {
        return editingItemId != null;
    }

    /**
     * Розраховує кількість предметів
     */
    public int calculateItemCount() {
        return addedItems != null ? addedItems.size() : 0;
    }

    /**
     * Розраховує загальну вартість
     */
    public BigDecimal calculateTotalAmount() {
        if (addedItems == null || addedItems.isEmpty()) {
            return BigDecimal.ZERO;
        }

        return addedItems.stream()
                .map(OrderItemDTO::getTotalPrice)
                .filter(price -> price != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Оновлює розраховані поля
     */
    public void updateCalculatedFields() {
        this.itemCount = calculateItemCount();
        this.totalAmount = calculateTotalAmount();
        this.canProceedToNextStage = hasItems();
    }
}
