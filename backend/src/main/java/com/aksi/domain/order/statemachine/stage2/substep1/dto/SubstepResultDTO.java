package com.aksi.domain.order.statemachine.stage2.substep1.dto;

import com.aksi.domain.order.statemachine.stage2.substep1.enums.ItemBasicInfoState;

/**
 * DTO для результату виконання підетапу 2.1
 */
public class SubstepResultDTO {
    private final ItemBasicInfoDTO data;
    private final ItemBasicInfoState state;
    private final String error;
    private final boolean canProceedToNext;

    public SubstepResultDTO(ItemBasicInfoDTO data, ItemBasicInfoState state, String error, boolean canProceedToNext) {
        this.data = data;
        this.state = state;
        this.error = error;
        this.canProceedToNext = canProceedToNext;
    }

    public ItemBasicInfoDTO getData() {
        return data;
    }

    public ItemBasicInfoState getState() {
        return state;
    }

    public String getError() {
        return error;
    }

    public boolean canProceedToNext() {
        return canProceedToNext;
    }

    public boolean hasError() {
        return error != null && !error.trim().isEmpty();
    }

    public boolean isCompleted() {
        return state == ItemBasicInfoState.COMPLETED;
    }
}
