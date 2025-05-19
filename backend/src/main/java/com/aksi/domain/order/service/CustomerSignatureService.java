package com.aksi.domain.order.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.aksi.domain.order.dto.CustomerSignatureRequest;
import com.aksi.domain.order.dto.CustomerSignatureResponse;

/**
 * Інтерфейс сервісу для роботи з підписами клієнтів
 */
public interface CustomerSignatureService {

    /**
     * Зберегти підпис клієнта
     *
     * @param request дані підпису
     * @return збережений підпис
     */
    CustomerSignatureResponse saveSignature(CustomerSignatureRequest request);

    /**
     * Отримати підпис за ID
     *
     * @param signatureId ID підпису
     * @return підпис, якщо існує
     */
    Optional<CustomerSignatureResponse> getSignatureById(UUID signatureId);

    /**
     * Отримати підпис за ID замовлення та типом підпису
     *
     * @param orderId ID замовлення
     * @param signatureType тип підпису
     * @return підпис, якщо існує
     */
    Optional<CustomerSignatureResponse> getSignatureByOrderIdAndType(UUID orderId, String signatureType);

    /**
     * Отримати всі підписи для замовлення
     *
     * @param orderId ID замовлення
     * @return список підписів
     */
    List<CustomerSignatureResponse> getAllSignaturesByOrderId(UUID orderId);
}
