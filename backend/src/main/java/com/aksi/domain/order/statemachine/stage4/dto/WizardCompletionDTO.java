package com.aksi.domain.order.statemachine.stage4.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.aksi.domain.order.model.ExpediteType;
import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для підетапу 4.4 "Завершення процесу".
 *
 * Містить інформацію про успішне завершення Order Wizard та опції для подальших дій.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WizardCompletionDTO {

    // Інформація про створене замовлення
    private UUID orderId;
    private String receiptNumber;
    private String tagNumber;

    // Інформація про клієнта
    private String clientName;
    private String clientPhone;

    // Дати
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime orderCreatedDate;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime expectedCompletionDate;

    private ExpediteType expediteType;

    // Фінансова інформація
    private Double finalAmount;
    private Double prepaymentAmount;
    private Double balanceAmount;

    // Стан процесу завершення
    @Builder.Default
    private boolean isOrderFinalized = false;

    @Builder.Default
    private boolean isPdfGenerated = false;

    @Builder.Default
    private boolean isPrinted = false;

    @Builder.Default
    private boolean isEmailSent = false;

    @Builder.Default
    private boolean isWizardCompleted = false;

    // Опції для подальших дій
    @Builder.Default
    private boolean canCreateNewOrder = true;

    @Builder.Default
    private boolean canReturnToOrderList = true;

    @Builder.Default
    private boolean canPrintAgain = false;

    @Builder.Default
    private boolean canResendEmail = false;

    // Повідомлення та підсумок
    private String completionMessage;
    private String reminderMessage;

    @Builder.Default
    private List<String> completedActions = new ArrayList<>();

    @Builder.Default
    private List<String> availableActions = new ArrayList<>();

    // Стан та помилки
    @Builder.Default
    private boolean hasErrors = false;

    private String errorMessage;

    @Builder.Default
    private List<String> errors = new ArrayList<>();

    // Метадані
    private LocalDateTime completedAt;
    private LocalDateTime lastUpdated;

    // Додаткова інформація
    private String branchName;
    private String operatorName;
    private int totalItemsCount;

    /**
     * Перевіряє чи весь процес завершено успішно.
     */
    public boolean isFullyCompleted() {
        return isOrderFinalized &&
               isPdfGenerated &&
               isPrinted &&
               isWizardCompleted &&
               !hasErrors;
    }

    /**
     * Перевіряє чи можна завершити wizard.
     */
    public boolean canCompleteWizard() {
        return isOrderFinalized && isPdfGenerated && !hasErrors;
    }

    /**
     * Отримує повне ім'я клієнта для відображення.
     */
    public String getDisplayClientName() {
        return clientName != null ? clientName : "Клієнт";
    }

    /**
     * Отримує форматовану дату готовності.
     */
    public String getFormattedCompletionDate() {
        if (expectedCompletionDate != null) {
            return expectedCompletionDate.toLocalDate().toString() + " після 14:00";
        }
        return "уточнюйте";
    }

    /**
     * Отримує інформацію про терміновість.
     */
    public String getExpediteInfo() {
        if (expediteType == null || expediteType == ExpediteType.STANDARD) {
            return "звичайне виконання";
        }

        return switch (expediteType) {
            case EXPRESS_48H -> "термінове 48 годин";
            case EXPRESS_24H -> "термінове 24 години";
            default -> "звичайне виконання";
        };
    }

    /**
     * Отримує статус оплати.
     */
    public String getPaymentStatus() {
        if (finalAmount == null) return "не визначено";

        if (balanceAmount == null || balanceAmount <= 0) {
            return "повністю сплачено";
        } else {
            return String.format("залишок: %.2f грн", balanceAmount);
        }
    }

    /**
     * Позначає замовлення як фіналізоване.
     */
    public void markOrderFinalized(UUID orderId, String receiptNumber) {
        this.orderId = orderId;
        this.receiptNumber = receiptNumber;
        this.isOrderFinalized = true;
        addCompletedAction("Замовлення створено та збережено");
        updateTimestamp();
    }

    /**
     * Позначає PDF як згенерований.
     */
    public void markPdfGenerated() {
        this.isPdfGenerated = true;
        this.canPrintAgain = true;
        addCompletedAction("PDF-квитанція згенерована");
        updateTimestamp();
    }

    /**
     * Позначає як надруковано.
     */
    public void markPrinted() {
        this.isPrinted = true;
        this.canPrintAgain = true;
        addCompletedAction("Квитанція надрукована");
        updateTimestamp();
    }

    /**
     * Позначає email як надісланий.
     */
    public void markEmailSent(String email) {
        this.isEmailSent = true;
        this.canResendEmail = true;
        addCompletedAction("Квитанція надіслана на " + email);
        updateTimestamp();
    }

    /**
     * Позначає wizard як завершений.
     */
    public void markWizardCompleted() {
        this.isWizardCompleted = true;
        this.completedAt = LocalDateTime.now();
        updateTimestamp();

        generateCompletionMessage();
        generateReminderMessage();
        generateAvailableActions();
    }

    /**
     * Додає виконану дію.
     */
    public void addCompletedAction(String action) {
        if (completedActions == null) {
            completedActions = new ArrayList<>();
        }
        completedActions.add(action);
    }

    /**
     * Додає доступну дію.
     */
    public void addAvailableAction(String action) {
        if (availableActions == null) {
            availableActions = new ArrayList<>();
        }
        availableActions.add(action);
    }

    /**
     * Додає помилку.
     */
    public void addError(String error) {
        if (errors == null) {
            errors = new ArrayList<>();
        }
        errors.add(error);
        this.hasErrors = true;
        this.errorMessage = error;
        updateTimestamp();
    }

    /**
     * Очищує помилки.
     */
    public void clearErrors() {
        this.hasErrors = false;
        this.errorMessage = null;
        if (errors != null) {
            errors.clear();
        }
        updateTimestamp();
    }

    /**
     * Оновлює timestamp.
     */
    public void updateTimestamp() {
        this.lastUpdated = LocalDateTime.now();
    }

    /**
     * Підготовка для нового замовлення.
     */
    public void prepareForNewOrder() {
        addAvailableAction("Створити нове замовлення");
        addAvailableAction("Повернутися до списку замовлень");
    }

    // Приватні методи генерації повідомлень

    private void generateCompletionMessage() {
        StringBuilder message = new StringBuilder();
        message.append("Замовлення №").append(receiptNumber).append(" успішно створено!\n\n");

        if (clientName != null) {
            message.append("Клієнт: ").append(clientName).append("\n");
        }

        if (totalItemsCount > 0) {
            message.append("Кількість предметів: ").append(totalItemsCount).append("\n");
        }

        message.append("Тип виконання: ").append(getExpediteInfo()).append("\n");
        message.append("Статус оплати: ").append(getPaymentStatus()).append("\n\n");

        message.append("Виконані дії:\n");
        if (completedActions != null) {
            for (String action : completedActions) {
                message.append("✓ ").append(action).append("\n");
            }
        }

        this.completionMessage = message.toString();
    }

    private void generateReminderMessage() {
        StringBuilder reminder = new StringBuilder();
        reminder.append("Нагадування:\n");
        reminder.append("• Дата готовності: ").append(getFormattedCompletionDate()).append("\n");

        if (clientPhone != null) {
            reminder.append("• Зв'язок з клієнтом: ").append(clientPhone).append("\n");
        }

        if (balanceAmount != null && balanceAmount > 0) {
            reminder.append("• Залишок до доплати: ").append(String.format("%.2f грн", balanceAmount)).append("\n");
        }

        this.reminderMessage = reminder.toString();
    }

    private void generateAvailableActions() {
        availableActions.clear();

        if (canPrintAgain) {
            addAvailableAction("Повторний друк квитанції");
        }

        if (canResendEmail) {
            addAvailableAction("Повторне надсилання email");
        }

        if (canCreateNewOrder) {
            addAvailableAction("Створити нове замовлення");
        }

        if (canReturnToOrderList) {
            addAvailableAction("Перейти до списку замовлень");
        }
    }
}
