package com.aksi.domain.order.dto.receipt;

import java.time.LocalDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для відповіді на запит генерації PDF квитанції.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PdfReceiptResponse {
    /**
     * ID замовлення.
     */
    private UUID orderId;

    /**
     * URL для завантаження PDF файлу (якщо зберігається на сервері).
     */
    private String pdfUrl;

    /**
     * Base64 дані PDF файлу.
     */
    private String pdfData;

    /**
     * Дата та час генерації.
     */
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime generatedAt;

    /**
     * Формат документу.
     */
    private String format;

    /**
     * Чи включено підпис.
     */
    private boolean includeSignature;

    /**
     * Розмір файлу в байтах.
     */
    private Long fileSize;

    /**
     * Ім'я файлу.
     */
    private String fileName;
}
