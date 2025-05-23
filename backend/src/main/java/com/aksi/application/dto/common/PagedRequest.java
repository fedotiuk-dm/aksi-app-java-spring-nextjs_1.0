package com.aksi.application.dto.common;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder.Default;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * Стандартизований DTO для запитів з пагінацією.
 */
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Параметри пагінації для списків")
public class PagedRequest {

    @Schema(
        description = "Номер сторінки (починається з 0)",
        example = "0",
        minimum = "0"
    )
    @Min(value = 0, message = "Номер сторінки не може бути від'ємним")
    @Default
    private int page = 0;

    @Schema(
        description = "Розмір сторінки",
        example = "20",
        minimum = "1",
        maximum = "1000"
    )
    @Min(value = 1, message = "Розмір сторінки повинен бути більше 0")
    @Max(value = 1000, message = "Розмір сторінки не може перевищувати 1000")
    @Default
    private int size = 20;

    @Schema(
        description = "Поле для сортування",
        example = "name"
    )
    private String sortBy;

    @Schema(
        description = "Напрямок сортування",
        example = "ASC",
        allowableValues = {"ASC", "DESC"}
    )
    @Default
    private String sortDirection = "ASC";
}
