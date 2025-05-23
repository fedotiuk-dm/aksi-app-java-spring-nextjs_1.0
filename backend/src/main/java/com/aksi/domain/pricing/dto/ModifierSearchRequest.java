package com.aksi.domain.pricing.dto;

import com.aksi.application.dto.common.SearchRequest;
import com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity.ModifierCategory;
import com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity.ModifierType;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * DTO для пошуку модифікаторів з фільтрацією.
 * Domain-specific розширення базового SearchRequest.
 */
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Schema(description = "Параметри пошуку модифікаторів цін")
public class ModifierSearchRequest extends SearchRequest {

    @Schema(
        description = "Фільтр за категорією модифікатора",
        example = "GENERAL"
    )
    private ModifierCategory category;

    @Schema(
        description = "Фільтр за типом модифікатора",
        example = "PERCENTAGE"
    )
    private ModifierType type;

    @Schema(
        description = "Код категорії послуги для фільтрації",
        example = "CLOTHING"
    )
    private String serviceCategoryCode;
}
