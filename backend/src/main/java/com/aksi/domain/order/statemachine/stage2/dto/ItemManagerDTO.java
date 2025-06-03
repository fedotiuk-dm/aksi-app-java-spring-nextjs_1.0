package com.aksi.domain.order.statemachine.stage2.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для головного екрану менеджера предметів (етап 2.0).
 *
 * Містить всю інформацію, необхідну для відображення головного екрану:
 * - Список предметів замовлення
 * - Загальну вартість
 * - Стан UI та доступні дії
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemManagerDTO {

    /**
     * Список предметів у замовленні для відображення в таблиці.
     */
    private List<ItemSummaryDto> items;

    /**
     * Загальна кількість предметів у замовленні.
     */
    private Integer totalItemsCount;

    /**
     * Загальна вартість всіх предметів.
     */
    private BigDecimal totalPrice;

    /**
     * Чи можна перейти до наступного етапу (чи є хоча б один предмет).
     */
    private Boolean canProceedToNextStage;

    /**
     * Повідомлення валідації (якщо є проблеми).
     */
    private String validationMessage;

    /**
     * Ідентифікатор обраного предмета (для редагування/видалення).
     */
    private String selectedItemId;

    /**
     * Чи активна головна форма (чи не запущений підвізард).
     */
    private Boolean isMainFormActive;

    /**
     * DTO для відображення предмета в списку головного екрану.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItemSummaryDto {

        /**
         * Ідентифікатор предмета.
         */
        private String id;

        /**
         * Найменування предмета.
         */
        private String name;

        /**
         * Категорія послуги.
         */
        private String category;

        /**
         * Кількість.
         */
        private Integer quantity;

        /**
         * Одиниця виміру.
         */
        private String unitOfMeasure;

        /**
         * Матеріал.
         */
        private String material;

        /**
         * Колір.
         */
        private String color;

        /**
         * Ціна за одиницю.
         */
        private BigDecimal unitPrice;

        /**
         * Загальна ціна за предмет.
         */
        private BigDecimal totalPrice;

        /**
         * Короткий опис стану предмета (дефекти, плями тощо).
         */
        private String conditionSummary;

        /**
         * Чи має предмет фотографії.
         */
        private Boolean hasPhotos;

        /**
         * Дата створення предмета.
         */
        private Long createdAt;

        /**
         * Формує короткий рядок для відображення кількості та одиниці виміру.
         */
        public String getQuantityDisplay() {
            if (quantity == null || unitOfMeasure == null) {
                return "";
            }
            return quantity + " " + unitOfMeasure;
        }

        /**
         * Формує короткий рядок для відображення матеріалу та кольору.
         */
        public String getMaterialColorDisplay() {
            StringBuilder sb = new StringBuilder();
            if (material != null && !material.trim().isEmpty()) {
                sb.append(material);
            }
            if (color != null && !color.trim().isEmpty()) {
                if (sb.length() > 0) {
                    sb.append(", ");
                }
                sb.append(color);
            }
            return sb.toString();
        }

        /**
         * Перевіряє, чи є у предмета особливості (дефекти, плями).
         */
        public boolean hasSpecialConditions() {
            return conditionSummary != null && !conditionSummary.trim().isEmpty();
        }
    }

    /**
     * Перевіряє, чи порожній список предметів.
     */
    public boolean isEmpty() {
        return items == null || items.isEmpty();
    }

    /**
     * Отримує кількість предметів для відображення в UI.
     */
    public int getDisplayItemsCount() {
        return items != null ? items.size() : 0;
    }

    /**
     * Перевіряє, чи є проблеми з валідацією.
     */
    public boolean hasValidationIssues() {
        return validationMessage != null && !validationMessage.trim().isEmpty();
    }
}
