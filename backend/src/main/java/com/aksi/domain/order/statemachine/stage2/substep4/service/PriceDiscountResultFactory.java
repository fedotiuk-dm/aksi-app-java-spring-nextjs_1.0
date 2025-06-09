package com.aksi.domain.order.statemachine.stage2.substep4.service;

import java.util.UUID;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage2.substep4.dto.PriceDiscountDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.dto.SubstepResultDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.enums.PriceDiscountState;

/**
 * Фабрика для створення різних типів результатів підетапу 2.4.
 * Інкапсулює логіку створення SubstepResultDTO з різними станами.
 */
@Component
public class PriceDiscountResultFactory {

    /**
     * Створює успішний результат з даними.
     */
    public SubstepResultDTO createSuccessResult(UUID sessionId, PriceDiscountState state,
                                              PriceDiscountDTO data, String message) {
        return SubstepResultDTO.builder()
            .currentState(state)
            .data(data)
            .success(true)
            .message(message)
            .hasErrors(false)
            .basePrice(extractBasePrice(data))
            .finalPrice(extractFinalPrice(data))
            .errorMessage(null)
            .build();
    }

    /**
     * Створює результат з помилкою.
     */
    public SubstepResultDTO createErrorResult(UUID sessionId, PriceDiscountState state,
                                            PriceDiscountDTO data, String errorMessage) {
        return SubstepResultDTO.builder()
            .currentState(state)
            .data(data)
            .success(false)
            .message(errorMessage)
            .hasErrors(true)
            .basePrice(extractBasePrice(data))
            .finalPrice(extractFinalPrice(data))
            .errorMessage(errorMessage)
            .build();
    }

    /**
     * Створює результат для критичної помилки (коли немає доступу до даних).
     */
    public SubstepResultDTO createCriticalErrorResult(UUID sessionId, String errorMessage) {
        return SubstepResultDTO.builder()
            .currentState(null)
            .data(null)
            .success(false)
            .message("Критична помилка: " + errorMessage)
            .hasErrors(true)
            .basePrice(null)
            .finalPrice(null)
            .errorMessage(errorMessage)
            .build();
    }

    /**
     * Створює результат для інформаційних операцій (отримання стану).
     */
    public SubstepResultDTO createInfoResult(UUID sessionId, PriceDiscountState state,
                                           PriceDiscountDTO data, String message) {
        return SubstepResultDTO.builder()
            .currentState(state)
            .data(data)
            .success(true)
            .message(message)
            .hasErrors(data != null && data.isHasCalculationErrors())
            .basePrice(extractBasePrice(data))
            .finalPrice(extractFinalPrice(data))
            .errorMessage(data != null ? data.getErrorMessage() : null)
            .build();
    }

    /**
     * Створює результат для операцій валідації.
     */
    public SubstepResultDTO createValidationResult(UUID sessionId, PriceDiscountState state,
                                                 PriceDiscountDTO data, boolean isValid, String message) {
        return SubstepResultDTO.builder()
            .currentState(state)
            .data(data)
            .success(isValid)
            .message(message)
            .hasErrors(!isValid)
            .basePrice(extractBasePrice(data))
            .finalPrice(extractFinalPrice(data))
            .errorMessage(isValid ? null : message)
            .build();
    }

    // === PRIVATE МЕТОДИ ===

    /**
     * Безпечне витягування базової ціни з даних.
     */
    private java.math.BigDecimal extractBasePrice(PriceDiscountDTO data) {
        if (data == null) return null;
        return data.getBasePrice();
    }

    /**
     * Безпечне витягування фінальної ціни з даних.
     */
    private java.math.BigDecimal extractFinalPrice(PriceDiscountDTO data) {
        if (data == null) return null;
        return data.getFinalPrice();
    }
}
