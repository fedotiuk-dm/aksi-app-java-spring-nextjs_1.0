package com.aksi.domain.order.service;

import java.util.UUID;

import com.aksi.domain.order.dto.OrderDTO;
import com.aksi.domain.order.dto.OrderFinalizationRequest;
import com.aksi.domain.order.dto.receipt.EmailReceiptRequest;

/**
 * Сервіс для завершення процесу оформлення замовлення.
 */
public interface OrderFinalizationService {

    /**
     * Завершити замовлення, включаючи:
     * - збереження підпису клієнта
     * - оновлення статусу замовлення
     * - генерацію чеку
     *
     * @param request запит на завершення замовлення
     * @return дані завершеного замовлення
     */
    OrderDTO finalizeOrder(OrderFinalizationRequest request);

    /**
     * Надіслати чек клієнту електронною поштою.
     *
     * @param request запит на відправку чеку
     */
    void sendReceiptByEmail(EmailReceiptRequest request);

    /**
     * Отримати згенерований PDF чек замовлення.
     *
     * @param orderId ID замовлення
     * @param includeSignature включати підпис клієнта
     * @return PDF файл чеку у вигляді масиву байтів
     */
    byte[] getOrderReceipt(UUID orderId, boolean includeSignature);
}
