package com.aksi.domain.order.dto.receipt;

import java.time.LocalDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для відповіді на запит відправки квитанції на email.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailReceiptResponse {
    /**
     * ID замовлення.
     */
    private UUID orderId;

    /**
     * Email адреса отримувача.
     */
    private String recipientEmail;

    /**
     * Дата та час відправки.
     */
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime sentAt;

    /**
     * ID повідомлення (якщо доступний).
     */
    private String messageId;

    /**
     * Статус відправки.
     */
    private EmailStatus status;

    /**
     * Тема листа.
     */
    private String subject;

    /**
     * Повідомлення.
     */
    private String message;

    /**
     * Статуси відправки email.
     */
    public enum EmailStatus {
        SENT, FAILED, PENDING
    }
}
