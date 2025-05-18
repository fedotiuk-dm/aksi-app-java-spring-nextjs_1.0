package com.aksi.domain.pricing.dto;

import java.util.UUID;

import com.aksi.domain.pricing.enums.RiskLevel;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * Базовий DTO клас для передачі спільних даних про типи проблем (плям, дефектів).
 * Використовується новий enum RiskLevel з пакету enums замість вкладених enum у сутностях.
 */
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Базова інформація про тип проблеми")
public abstract class ItemIssueDTO {

    @Schema(description = "Унікальний ідентифікатор")
    private UUID id;
    
    @Schema(description = "Код типу для програмного використання")
    private String code;
    
    @Schema(description = "Назва типу")
    private String name;
    
    @Schema(description = "Опис типу")
    private String description;
    
    @Schema(description = "Рівень ризику: LOW, MEDIUM, HIGH")
    private RiskLevel riskLevel;
    
    @Schema(description = "Чи активний запис")
    private boolean active;
} 