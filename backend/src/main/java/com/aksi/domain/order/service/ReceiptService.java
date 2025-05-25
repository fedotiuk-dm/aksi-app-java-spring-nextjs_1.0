package com.aksi.domain.order.service;

import com.aksi.domain.order.dto.receipt.EmailReceiptRequest;
import com.aksi.domain.order.dto.receipt.EmailReceiptResponse;
import com.aksi.domain.order.dto.receipt.PdfReceiptResponse;
import com.aksi.domain.order.dto.receipt.ReceiptDTO;
import com.aksi.domain.order.dto.receipt.ReceiptGenerationRequest;

/**
 * Сервіс для роботи з квитанціями замовлень.
 */
public interface ReceiptService {

    /**
     * Згенерувати дані для квитанції.
     *
     * @param request запит з параметрами генерації
     * @return DTO з даними квитанції
     */
    ReceiptDTO generateReceipt(ReceiptGenerationRequest request);

    /**
     * Згенерувати PDF-квитанцію.
     *
     * @param request запит з параметрами генерації
     * @return відповідь з інформацією про згенеровану квитанцію
     */
    PdfReceiptResponse generatePdfReceipt(ReceiptGenerationRequest request);

    /**
     * Відправити квитанцію на email.
     *
     * @param request запит з параметрами відправки
     * @return відповідь з інформацією про відправку
     */
    EmailReceiptResponse emailReceipt(EmailReceiptRequest request);

    /**
     * Згенерувати PDF-квитанцію як масив байтів (для внутрішнього використання).
     *
     * @param request запит з параметрами генерації
     * @return масив байтів з PDF-документом
     */
    byte[] generatePdfReceiptBytes(ReceiptGenerationRequest request);
}
