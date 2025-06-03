package com.aksi.domain.order.statemachine.stage2.dto;

import java.math.BigDecimal;

/**
 * DTO для підсумку замовлення на етапі 2.0 (менеджер предметів)
 */
public class OrderSummaryDTO {
    private final int totalItems;
    private final int itemsWithPhotos;
    private final BigDecimal totalAmount;

    public OrderSummaryDTO(int totalItems, int itemsWithPhotos, BigDecimal totalAmount) {
        this.totalItems = totalItems;
        this.itemsWithPhotos = itemsWithPhotos;
        this.totalAmount = totalAmount;
    }

    public int getTotalItems() {
        return totalItems;
    }

    public int getItemsWithPhotos() {
        return itemsWithPhotos;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }
}
