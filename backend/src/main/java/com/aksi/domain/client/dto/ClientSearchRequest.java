package com.aksi.domain.client.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для запиту пошуку клієнтів з пагінацією.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientSearchRequest {
    /**
     * Пошуковий запит
     */
    @NotBlank(message = "Пошуковий запит не може бути порожнім")
    private String query;

    /**
     * Номер сторінки (з нуля)
     */
    @Min(value = 0, message = "Номер сторінки повинен бути невід'ємним")
    @Builder.Default
    private int page = 0;

    /**
     * Розмір сторінки
     */
    @Min(value = 1, message = "Розмір сторінки повинен бути більше нуля")
    @Builder.Default
    private int size = 10;
}
