package com.aksi.ui.wizard.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.order.entity.OrderEntity;
import com.aksi.domain.order.entity.OrderItemEntity;

import lombok.Data;

/**
 * DTO для зберігання стану Order Wizard між етапами.
 * Використовує наявні доменні сутності для консистентності.
 */
@Data
public class OrderWizardData {

    // Основний об'єкт замовлення (будується поетапно)
    private OrderEntity draftOrder;

    // Клієнт (може бути існуючим або новим)
    private ClientEntity selectedClient;
    private boolean isNewClient = false;

    // Поточний предмет що додається (для підвізарда)
    private OrderItemEntity currentItem;

    // Список завантажених фото для поточного предмета
    private List<String> tempPhotoPaths;

    // Статус завершення етапів
    private boolean step1Complete = false;
    private boolean step2Complete = false;
    private boolean step3Complete = false;

    public OrderWizardData() {
        this.draftOrder = OrderEntity.builder()
            .items(new ArrayList<>())
            .totalAmount(BigDecimal.ZERO)
            .finalAmount(BigDecimal.ZERO)
            .draft(true)
            .build();
        this.tempPhotoPaths = new ArrayList<>();
    }

    /**
     * Додати предмет до замовлення
     */
    public void addItem(OrderItemEntity item) {
        draftOrder.addItem(item);
        draftOrder.recalculateTotalAmount();
        checkStep2Completion();
    }

    /**
     * Видалити предмет з замовлення
     */
    public void removeItem(OrderItemEntity item) {
        draftOrder.removeItem(item);
        draftOrder.recalculateTotalAmount();
        checkStep2Completion();
    }

    /**
     * Встановити клієнта для замовлення
     */
    public void setClient(ClientEntity client, boolean isNew) {
        this.selectedClient = client;
        this.isNewClient = isNew;
        this.draftOrder.setClient(client);
        checkStep1Completion();
    }

    /**
     * Встановити базову інформацію замовлення
     */
    public void setOrderBasicInfo(String receiptNumber, String tagNumber, LocalDateTime expectedDate) {
        draftOrder.setReceiptNumber(receiptNumber);
        draftOrder.setTagNumber(tagNumber);
        draftOrder.setExpectedCompletionDate(expectedDate);
        checkStep1Completion();
    }

    /**
     * Перевірити завершеність етапу 1
     */
    private void checkStep1Completion() {
        step1Complete = selectedClient != null &&
                       draftOrder.getReceiptNumber() != null &&
                       !draftOrder.getReceiptNumber().trim().isEmpty();
    }

    /**
     * Перевірити завершеність етапу 2
     */
    private void checkStep2Completion() {
        step2Complete = !draftOrder.getItems().isEmpty();
    }

    /**
     * Встановити параметри замовлення (етап 3)
     */
    public void setOrderParameters() {
        step3Complete = draftOrder.getExpectedCompletionDate() != null &&
                       draftOrder.getPaymentMethod() != null;
    }

    /**
     * Отримати кількість предметів у замовленні
     */
    public int getItemsCount() {
        return draftOrder.getItems().size();
    }

    /**
     * Отримати загальну суму замовлення
     */
    public BigDecimal getTotalAmount() {
        return draftOrder.getFinalAmount();
    }

    /**
     * Початковий елемент для підвізарда
     */
    public void startNewItem() {
        currentItem = OrderItemEntity.builder()
            .quantity(1)
            .unitPrice(BigDecimal.ZERO)
            .build();
        tempPhotoPaths.clear();
    }

    /**
     * Скасувати поточний предмет
     */
    public void cancelCurrentItem() {
        currentItem = null;
        tempPhotoPaths.clear();
    }

    /**
     * Завершити додавання поточного предмета
     */
    public void finishCurrentItem() {
        if (currentItem != null) {
            addItem(currentItem);
            currentItem = null;
            tempPhotoPaths.clear();
        }
    }
}
