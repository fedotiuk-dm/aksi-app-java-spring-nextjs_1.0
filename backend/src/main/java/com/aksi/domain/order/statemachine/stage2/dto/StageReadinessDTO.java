package com.aksi.domain.order.statemachine.stage2.dto;

/**
 * DTO для перевірки готовності етапу до переходу на наступний
 */
public class StageReadinessDTO {
    private final boolean ready;
    private final String message;
    private final int itemCount;

    public StageReadinessDTO(boolean ready, String message, int itemCount) {
        this.ready = ready;
        this.message = message;
        this.itemCount = itemCount;
    }

    public boolean isReady() {
        return ready;
    }

    public String getMessage() {
        return message;
    }

    public int getItemCount() {
        return itemCount;
    }
}
