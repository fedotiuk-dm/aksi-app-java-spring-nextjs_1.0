package com.aksi.domain.order.service;

import java.util.UUID;

import com.aksi.domain.order.dto.AdditionalRequirementsRequest;
import com.aksi.domain.order.dto.AdditionalRequirementsResponse;

/**
 * Сервіс для роботи з додатковими вимогами та примітками до замовлення
 */
public interface OrderRequirementsService {

    /**
     * Оновити додаткові вимоги та примітки до замовлення
     *
     * @param request запит з додатковими вимогами та примітками
     * @return відповідь з оновленими даними
     */
    AdditionalRequirementsResponse updateRequirements(AdditionalRequirementsRequest request);

    /**
     * Отримати додаткові вимоги та примітки до замовлення
     *
     * @param orderId ідентифікатор замовлення
     * @return відповідь з даними
     */
    AdditionalRequirementsResponse getRequirements(UUID orderId);
}
