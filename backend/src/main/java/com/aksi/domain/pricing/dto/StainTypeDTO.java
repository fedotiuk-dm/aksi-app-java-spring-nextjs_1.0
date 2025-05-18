package com.aksi.domain.pricing.dto;

import java.util.UUID;

import com.aksi.domain.pricing.entity.StainTypeEntity.RiskLevel;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для передачі даних про типи плям.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Інформація про тип плями")
public class StainTypeDTO {

    @Schema(description = "Унікальний ідентифікатор типу плями")
    private UUID id;
    
    @Schema(description = "Код типу плями для програмного використання")
    private String code;
    
    @Schema(description = "Назва типу плями")
    private String name;
    
    @Schema(description = "Опис типу плями")
    private String description;
    
    @Schema(description = "Рівень ризику: LOW, MEDIUM, HIGH")
    private RiskLevel riskLevel;
    
    @Schema(description = "Чи активний тип плями")
    private boolean active;
} 