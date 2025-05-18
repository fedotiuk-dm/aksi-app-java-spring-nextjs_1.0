package com.aksi.domain.order.dto.receipt;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.aksi.domain.order.model.ExpediteType;
import com.aksi.domain.order.model.PaymentMethod;
import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для представлення структури квитанції
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReceiptDTO {
    /**
     * ID замовлення
     */
    private UUID orderId;
    
    /**
     * Номер квитанції
     */
    private String receiptNumber;
    
    /**
     * Номер унікальної мітки
     */
    private String tagNumber;
    
    /**
     * Дата створення замовлення
     */
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdDate;
    
    /**
     * Орієнтовна дата видачі
     */
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime expectedCompletionDate;
    
    /**
     * Тип термінового виконання
     */
    private ExpediteType expediteType;
    
    /**
     * Інформація про філію
     */
    private ReceiptBranchInfoDTO branchInfo;
    
    /**
     * Інформація про клієнта
     */
    private ReceiptClientInfoDTO clientInfo;
    
    /**
     * Список предметів у замовленні
     */
    private List<ReceiptItemDTO> items;
    
    /**
     * Фінансова інформація
     */
    private ReceiptFinancialInfoDTO financialInfo;
    
    /**
     * Юридична інформація та умови надання послуг
     */
    private String legalTerms;
    
    /**
     * Дані підпису клієнта (base64)
     */
    private String customerSignatureData;
    
    /**
     * Підтвердження прийняття умов
     */
    private boolean termsAccepted;
    
    /**
     * Додаткові примітки до замовлення
     */
    private String additionalNotes;
    
    /**
     * Спосіб оплати
     */
    private PaymentMethod paymentMethod;
} 