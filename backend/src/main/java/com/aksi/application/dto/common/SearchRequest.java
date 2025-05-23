package com.aksi.application.dto.common;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * Базовий DTO для пошукових запитів з пагінацією.
 */
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Schema(description = "Базові параметри пошуку з пагінацією")
public class SearchRequest extends PagedRequest {

    @Schema(
        description = "Пошуковий запит (за назвою, описом тощо)",
        example = "прання",
        maxLength = 255
    )
    @Size(max = 255, message = "Пошуковий запит не може перевищувати 255 символів")
    private String query;

    @Schema(
        description = "Фільтр за активністю",
        example = "true"
    )
    private Boolean active;
}
