package com.aksi.domain.pricing.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.experimental.SuperBuilder;

/**
 * DTO для передачі даних про типи дефектів.
 * Успадковується від базового ItemIssueDTO для уникнення дублювання коду.
 */
@SuperBuilder
@Schema(description = "Інформація про тип дефекту")
public class DefectTypeDTO extends ItemIssueDTO {
    // Специфічні для дефектів поля можна додати тут
    
    /**
     * Конструктор за замовчуванням.
     */
    public DefectTypeDTO() {
        super();
    }
} 