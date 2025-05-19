package com.aksi.domain.order.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для відповіді з даними підпису клієнта
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerSignatureResponse {
    
    /**
     * ID підпису
     */
    private UUID id;
    
    /**
     * ID замовлення
     */
    private UUID orderId;
    
    /**
     * Дані підпису у форматі base64
     */
    private String signatureData;
    
    /**
     * Прапорець прийняття умов надання послуг
     */
    private boolean termsAccepted;
    
    /**
     * Тип підпису
     */
    private String signatureType;
    
    /**
     * Дата створення
     */
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;
    
    /**
     * Дата оновлення
     */
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;
} 
