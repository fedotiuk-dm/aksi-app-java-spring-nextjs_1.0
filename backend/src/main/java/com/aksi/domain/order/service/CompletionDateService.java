package com.aksi.domain.order.service;

import com.aksi.domain.order.dto.CompletionDateCalculationRequest;
import com.aksi.domain.order.dto.CompletionDateResponse;

/**
 * Сервіс для розрахунку дати завершення замовлення.
 */
public interface CompletionDateService {

    /**
     * Розрахувати очікувану дату завершення замовлення.
     *
     * @param request запит з категоріями послуг та типом терміновості
     * @return відповідь з розрахованою датою завершення
     */
    CompletionDateResponse calculateExpectedCompletionDate(CompletionDateCalculationRequest request);
}
