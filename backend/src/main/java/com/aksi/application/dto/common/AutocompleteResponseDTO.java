package com.aksi.application.dto.common;

import java.util.List;
import java.util.Map;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для відповіді автокомпліту.
 * Загальний DTO для всіх типів автокомпліту в додатку.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Результати автокомпліту для різних типів даних")
public class AutocompleteResponseDTO {

    @Schema(description = "Список варіантів для автокомпліту")
    private List<AutocompleteItem> items;

    @Schema(description = "Загальна кількість знайдених варіантів", example = "150")
    private long totalCount;

    @Schema(description = "Категорія результатів", example = "ITEM_NAMES")
    private String category;

    /**
     * Елемент автокомпліту.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Елемент автокомпліту")
    public static class AutocompleteItem {

        @Schema(description = "Унікальний ідентифікатор", example = "ITEM_001")
        private String id;

        @Schema(description = "Значення для відображення", example = "Прання сорочки чоловічої")
        private String label;

        @Schema(description = "Значення для використання в коді", example = "SHIRT_WASH_MALE")
        private String value;

        @Schema(description = "Додаткова інформація для відображення", example = "Категорія: Одяг")
        private String description;

        @Schema(description = "Тип елемента", example = "ITEM", allowableValues = {"ITEM", "CATEGORY", "MODIFIER"})
        private String type;

        @Schema(description = "Додаткові метадані")
        private Map<String, Object> metadata;

        @Schema(description = "Чи активний елемент", example = "true")
        private boolean active;

        @Schema(description = "Пріоритет для сортування (менше - вище)", example = "1")
        private int priority;
    }
}
