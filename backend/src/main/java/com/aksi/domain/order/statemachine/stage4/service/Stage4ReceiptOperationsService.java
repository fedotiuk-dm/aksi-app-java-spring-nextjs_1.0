package com.aksi.domain.order.statemachine.stage4.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.dto.receipt.EmailReceiptRequest;
import com.aksi.domain.order.dto.receipt.ReceiptDTO;
import com.aksi.domain.order.dto.receipt.ReceiptGenerationRequest;
import com.aksi.domain.order.service.ReceiptService;

import lombok.RequiredArgsConstructor;

/**
 * Сервіс операцій з квитанціями для Stage4.
 * Тонка обгортка навколо domain ReceiptService.
 */
@Service
@RequiredArgsConstructor
public class Stage4ReceiptOperationsService {

    private final ReceiptService receiptService;

    /**
     * Генерує квитанцію для замовлення.
     *
     * @param request запит на генерацію квитанції
     * @return згенерована квитанція
     */
    public ReceiptDTO generateReceipt(ReceiptGenerationRequest request) {
        return receiptService.generateReceipt(request);
    }

    /**
     * Генерує PDF квитанції у вигляді масиву байтів.
     *
     * @param request запит на генерацію квитанції
     * @return PDF файл у вигляді масиву байтів
     */
    public byte[] generatePdfReceiptBytes(ReceiptGenerationRequest request) {
        return receiptService.generatePdfReceiptBytes(request);
    }

    /**
     * Відправляє квитанцію на email.
     *
     * @param request запит на відправку квитанції
     */
    public void sendReceiptByEmail(EmailReceiptRequest request) {
        receiptService.emailReceipt(request);
    }

    /**
     * Перевіряє чи можна згенерувати квитанцію для замовлення.
     *
     * @param orderId ID замовлення
     * @return true якщо квитанцію можна згенерувати
     */
    public boolean canGenerateReceipt(UUID orderId) {
        try {
            ReceiptGenerationRequest request = ReceiptGenerationRequest.builder()
                    .orderId(orderId)
                    .build();
            ReceiptDTO receipt = generateReceipt(request);
            return receipt != null && receipt.getOrderId() != null;
        } catch (Exception e) {
            return false;
        }
    }
}
