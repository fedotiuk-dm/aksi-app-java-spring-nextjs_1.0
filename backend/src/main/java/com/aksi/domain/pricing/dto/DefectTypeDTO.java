package com.aksi.domain.pricing.dto;

import java.util.UUID;

import com.aksi.domain.pricing.entity.DefectTypeEntity.RiskLevel;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для передачі даних про типи дефектів.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Інформація про тип дефекту")
public class DefectTypeDTO {

    @Schema(description = "Унікальний ідентифікатор типу дефекту")
    private UUID id;
    
    @Schema(description = "Код типу дефекту для програмного використання")
    private String code;
    
    @Schema(description = "Назва типу дефекту")
    private String name;
    
    @Schema(description = "Опис типу дефекту")
    private String description;
    
    @Schema(description = "Рівень ризику: LOW, MEDIUM, HIGH")
    private RiskLevel riskLevel;
    
    @Schema(description = "Чи активний тип дефекту")
    private boolean active;
} 