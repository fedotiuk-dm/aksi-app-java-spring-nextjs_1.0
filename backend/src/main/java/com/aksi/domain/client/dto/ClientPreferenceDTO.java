package com.aksi.domain.client.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для передачі інформації про переваги клієнта.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientPreferenceDTO {
    
    /**
     * Ідентифікатор переваги.
     */
    private UUID id;
    
    /**
     * Ключ переваги.
     */
    @NotBlank(message = "Ключ переваги не може бути порожнім")
    @Size(max = 100, message = "Ключ переваги не може перевищувати 100 символів")
    private String key;
    
    /**
     * Значення переваги.
     */
    @Size(max = 255, message = "Значення переваги не може перевищувати 255 символів")
    private String value;
}
