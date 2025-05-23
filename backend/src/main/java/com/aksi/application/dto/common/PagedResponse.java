package com.aksi.application.dto.common;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Стандартизований DTO для відповідей з пагінацією.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Відповідь з пагінацією")
public class PagedResponse<T> {

    @Schema(description = "Список елементів на поточній сторінці")
    private List<T> content;

    @Schema(description = "Номер поточної сторінки (починається з 0)", example = "0")
    private int page;

    @Schema(description = "Розмір сторінки", example = "20")
    private int size;

    @Schema(description = "Загальна кількість елементів", example = "150")
    private long totalElements;

    @Schema(description = "Загальна кількість сторінок", example = "8")
    private int totalPages;

    @Schema(description = "Чи це перша сторінка", example = "true")
    private boolean first;

    @Schema(description = "Чи це остання сторінка", example = "false")
    private boolean last;

    @Schema(description = "Кількість елементів на поточній сторінці", example = "20")
    private int numberOfElements;

    @Schema(description = "Чи порожня сторінка", example = "false")
    private boolean empty;

    @Schema(description = "Інформація про сортування")
    private SortInfo sort;

    /**
     * Інформація про сортування.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Інформація про сортування")
    public static class SortInfo {

        @Schema(description = "Чи застосовано сортування", example = "true")
        private boolean sorted;

        @Schema(description = "Поле сортування", example = "name")
        private String sortBy;

        @Schema(description = "Напрямок сортування", example = "ASC")
        private String direction;
    }
}
