package com.aksi.domain.pricing.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.experimental.SuperBuilder;

/**
 * DTO для передачі даних про типи плям.
 * Успадковується від базового ItemIssueDTO для уникнення дублювання коду.
 */
@SuperBuilder
@Schema(description = "Інформація про тип плями")
public class StainTypeDTO extends ItemIssueDTO {
    // Специфічні для плям поля можна додати тут
    
    /**
     * Конструктор за замовчуванням.
     */
    public StainTypeDTO() {
        super();
    }
} 
