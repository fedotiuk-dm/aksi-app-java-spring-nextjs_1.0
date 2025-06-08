package com.aksi.domain.order.statemachine.stage1.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.aksi.domain.branch.dto.BranchLocationDTO;
import com.aksi.domain.client.dto.ClientResponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для етапу базової інформації замовлення (1.2).
 *
 * Містить всю інформацію, необхідну для відображення екрану базових параметрів замовлення:
 * - Інформація про обраного клієнта
 * - Номер квитанції та унікальна мітка
 * - Пункт прийому замовлення
 * - Дата створення
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderInitializationDTO {

    /**
     * Обраний клієнт (з попереднього кроку).
     */
    private ClientResponse selectedClient;

    /**
     * Номер квитанції (генерується автоматично).
     */
    private String receiptNumber;

    /**
     * Унікальна мітка (вводиться вручну або сканується).
     */
    private String uniqueTag;

    /**
     * Обраний пункт прийому замовлення.
     */
    private BranchLocationDTO selectedBranch;

    /**
     * Список доступних пунктів прийому.
     */
    private List<BranchLocationDTO> availableBranches;

    /**
     * Дата створення замовлення.
     */
    private LocalDateTime orderCreationTime;

    /**
     * Чи можна перейти до наступного етапу.
     */
    private Boolean canProceedToNext;

    /**
     * Повідомлення валідації (якщо є проблеми).
     */
    private String validationMessage;

    /**
     * Попередній варіант номеру квитанції (для перегенерації).
     */
    private String previousReceiptNumber;



    /**
     * Перевіряє, чи обрано клієнта.
     */
    public boolean hasSelectedClient() {
        return selectedClient != null;
    }

    /**
     * Перевіряє, чи обрано філію.
     */
    public boolean hasSelectedBranch() {
        return selectedBranch != null;
    }

    /**
     * Перевіряє, чи згенеровано номер квитанції.
     */
    public boolean hasReceiptNumber() {
        return receiptNumber != null && !receiptNumber.trim().isEmpty();
    }

    /**
     * Перевіряє, чи введено унікальну мітку.
     */
    public boolean hasUniqueTag() {
        return uniqueTag != null && !uniqueTag.trim().isEmpty();
    }

    /**
     * Перевіряє, чи є проблеми з валідацією.
     */
    public boolean hasValidationIssues() {
        return validationMessage != null && !validationMessage.trim().isEmpty();
    }

    /**
     * Отримує кількість доступних філій.
     */
    public int getAvailableBranchesCount() {
        return availableBranches != null ? availableBranches.size() : 0;
    }

    /**
     * Формує повну інформацію про клієнта для відображення.
     */
    public String getClientDisplayInfo() {
        if (selectedClient == null) {
            return "Клієнт не обраний";
        }

        StringBuilder sb = new StringBuilder();
        if (selectedClient.getFirstName() != null && selectedClient.getLastName() != null) {
            sb.append(selectedClient.getFirstName())
              .append(" ")
              .append(selectedClient.getLastName());
        }

        if (selectedClient.getPhone() != null && !selectedClient.getPhone().trim().isEmpty()) {
            if (sb.length() > 0) {
                sb.append(" | ");
            }
            sb.append(selectedClient.getPhone());
        }

        return sb.length() > 0 ? sb.toString() : "Клієнт без інформації";
    }
}
