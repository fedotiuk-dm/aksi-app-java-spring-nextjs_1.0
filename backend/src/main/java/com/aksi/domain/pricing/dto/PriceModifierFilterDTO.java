package com.aksi.domain.pricing.dto;

import com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity.ModifierCategory;
import com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity.ModifierType;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для фільтрації модифікаторів цін.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Фільтри для пошуку модифікаторів")
public class PriceModifierFilterDTO {

    @Schema(description = "Пошуковий запит за назвою, описом або кодом")
    private String query;

    @Schema(description = "Категорія модифікатора")
    private ModifierCategory category;

    @Schema(description = "Тип модифікатора")
    private ModifierType type;

    @Schema(description = "Код категорії послуги")
    private String serviceCategoryCode;

    @Schema(description = "Фільтр за активністю")
    private Boolean active;
}
