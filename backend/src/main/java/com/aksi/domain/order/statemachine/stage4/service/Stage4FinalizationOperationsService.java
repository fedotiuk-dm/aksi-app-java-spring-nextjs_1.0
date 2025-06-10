package com.aksi.domain.order.statemachine.stage4.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.dto.OrderDTO;
import com.aksi.domain.order.dto.OrderFinalizationRequest;
import com.aksi.domain.order.dto.receipt.EmailReceiptRequest;
import com.aksi.domain.order.service.OrderFinalizationService;

import lombok.RequiredArgsConstructor;

/**
 * Сервіс операцій з фіналізацією замовлень для Stage4.
 * Тонка обгортка навколо domain OrderFinalizationService.
 */
@Service
@RequiredArgsConstructor
public class Stage4FinalizationOperationsService {

    private final OrderFinalizationService finalizationService;

    /**
     * Завершує замовлення.
     *
     * @param request запит на завершення замовлення
     * @return дані завершеного замовлення
     */
    public OrderDTO finalizeOrder(OrderFinalizationRequest request) {
        return finalizationService.finalizeOrder(request);
    }

    /**
     * Відправляє квитанцію на email.
     *
     * @param request запит на відправку квитанції
     */
    public void sendReceiptByEmail(EmailReceiptRequest request) {
        finalizationService.sendReceiptByEmail(request);
    }

    /**
     * Отримує PDF квитанцію замовлення.
     *
     * @param orderId ID замовлення
     * @param includeSignature включати підпис клієнта
     * @return PDF файл у вигляді масиву байтів
     */
    public byte[] getOrderReceipt(UUID orderId, boolean includeSignature) {
        return finalizationService.getOrderReceipt(orderId, includeSignature);
    }

    /**
     * Перевіряє чи можна завершити замовлення.
     *
     * @param orderId ID замовлення
     * @return true якщо замовлення можна завершити
     */
    public boolean canFinalizeOrder(UUID orderId) {
        try {
            // Перевіряємо чи можна отримати квитанцію (це означає що замовлення існує і готове)
            byte[] receipt = getOrderReceipt(orderId, false);
            return receipt != null && receipt.length > 0;
        } catch (Exception e) {
            return false;
        }
    }
}
