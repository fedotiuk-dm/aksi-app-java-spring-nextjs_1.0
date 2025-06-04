package com.aksi.domain.order.statemachine.stage1.dto;

import java.util.List;

import com.aksi.domain.client.dto.ClientResponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для етапу вибору клієнта (1.1).
 *
 * Містить всю інформацію, необхідну для відображення екрану вибору клієнта:
 * - Результати пошуку клієнтів
 * - Обраний клієнт
 * - Стан UI та доступні дії
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientSelectionDTO {

    /**
     * Пошуковий запит від користувача.
     */
    private String searchQuery;

    /**
     * Результати пошуку клієнтів.
     */
    private List<ClientSummaryDto> searchResults;

    /**
     * Загальна кількість знайдених клієнтів.
     */
    private Integer totalResultsCount;

    /**
     * Обраний клієнт (якщо вибрано зі списку).
     */
    private ClientResponse selectedClient;

    /**
     * Чи можна перейти до наступного кроку.
     */
    private Boolean canProceedToNext;

    /**
     * Повідомлення валідації (якщо є проблеми).
     */
    private String validationMessage;

    /**
     * Режим роботи: пошук існуючого або створення нового.
     */
    private ClientSelectionMode mode;

    /**
     * Дані нового клієнта (якщо створюється новий).
     */
    private ClientResponse newClientData;

    /**
     * DTO для відображення клієнта у результатах пошуку.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ClientSummaryDto {

        /**
         * Ідентифікатор клієнта.
         */
        private String id;

        /**
         * Повне ім'я клієнта.
         */
        private String fullName;

        /**
         * Номер телефону.
         */
        private String phone;

        /**
         * Email (якщо є).
         */
        private String email;

        /**
         * Адреса (якщо є).
         */
        private String address;

        /**
         * Кількість попередніх замовлень.
         */
        private Integer previousOrdersCount;

        /**
         * Дата останнього замовлення.
         */
        private Long lastOrderDate;

        /**
         * Формує повне ім'я для відображення.
         */
        public String getDisplayName() {
            return fullName != null ? fullName : "Клієнт без імені";
        }

        /**
         * Формує рядок контактної інформації.
         */
        public String getContactInfo() {
            StringBuilder sb = new StringBuilder();
            if (phone != null && !phone.trim().isEmpty()) {
                sb.append(phone);
            }
            if (email != null && !email.trim().isEmpty()) {
                if (sb.length() > 0) {
                    sb.append(" | ");
                }
                sb.append(email);
            }
            return sb.toString();
        }

        /**
         * Перевіряє, чи є у клієнта попередні замовлення.
         */
        public boolean hasOrderHistory() {
            return previousOrdersCount != null && previousOrdersCount > 0;
        }
    }

    /**
     * Режими роботи з клієнтом.
     */
    public enum ClientSelectionMode {
        SEARCH_EXISTING("Пошук існуючого клієнта"),
        CREATE_NEW("Створення нового клієнта");

        private final String description;

        ClientSelectionMode(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    /**
     * Перевіряє, чи є результати пошуку.
     */
    public boolean hasSearchResults() {
        return searchResults != null && !searchResults.isEmpty();
    }

    /**
     * Перевіряє, чи обрано клієнта.
     */
    public boolean hasSelectedClient() {
        return selectedClient != null;
    }

    /**
     * Перевіряє, чи є проблеми з валідацією.
     */
    public boolean hasValidationIssues() {
        return validationMessage != null && !validationMessage.trim().isEmpty();
    }

    /**
     * Отримує кількість результатів для відображення в UI.
     */
    public int getDisplayResultsCount() {
        return searchResults != null ? searchResults.size() : 0;
    }
}
