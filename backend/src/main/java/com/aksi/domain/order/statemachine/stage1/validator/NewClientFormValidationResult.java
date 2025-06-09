package com.aksi.domain.order.statemachine.stage1.validator;

import java.util.ArrayList;
import java.util.List;

import com.aksi.domain.order.statemachine.stage1.enums.NewClientFormValidationError;

/**
 * Результат валідації форми нового клієнта.
 * Містить детальну інформацію про результати перевірки даних форми.
 */
public class NewClientFormValidationResult {

    private boolean isValid;
    private List<String> errorMessages;
    private List<NewClientFormValidationError> validationErrors;
    private String detailedReport;

    public NewClientFormValidationResult() {
        this.isValid = true;
        this.errorMessages = new ArrayList<>();
        this.validationErrors = new ArrayList<>();
        this.detailedReport = "";
    }

    /**
     * Додає помилку валідації.
     */
    public void addError(NewClientFormValidationError error, String message) {
        this.isValid = false;
        this.validationErrors.add(error);
        this.errorMessages.add(message);
    }

    /**
     * Додає помилку валідації з категорією.
     */
    public void addError(String message) {
        this.isValid = false;
        this.errorMessages.add(message);
    }

    /**
     * Перевіряє чи валідна форма.
     */
    public boolean isValid() {
        return isValid;
    }

    /**
     * Встановлює статус валідності.
     */
    public void setValid(boolean valid) {
        isValid = valid;
    }

    /**
     * Отримує список повідомлень про помилки.
     */
    public List<String> getErrorMessages() {
        return new ArrayList<>(errorMessages);
    }

    /**
     * Встановлює список повідомлень про помилки.
     */
    public void setErrorMessages(List<String> errorMessages) {
        this.errorMessages = new ArrayList<>(errorMessages);
        this.isValid = errorMessages.isEmpty();
    }

    /**
     * Отримує список помилок валідації.
     */
    public List<NewClientFormValidationError> getValidationErrors() {
        return new ArrayList<>(validationErrors);
    }

    /**
     * Встановлює список помилок валідації.
     */
    public void setValidationErrors(List<NewClientFormValidationError> validationErrors) {
        this.validationErrors = new ArrayList<>(validationErrors);
    }

    /**
     * Отримує детальний звіт валідації.
     */
    public String getDetailedReport() {
        return detailedReport;
    }

    /**
     * Встановлює детальний звіт валідації.
     */
    public void setDetailedReport(String detailedReport) {
        this.detailedReport = detailedReport;
    }

    /**
     * Перевіряє чи є помилки певного типу.
     */
    public boolean hasError(NewClientFormValidationError errorType) {
        return validationErrors.contains(errorType);
    }

    /**
     * Перевіряє чи є критичні помилки.
     */
    public boolean hasCriticalErrors() {
        return validationErrors.stream()
                .anyMatch(error -> error == NewClientFormValidationError.FIRST_NAME_EMPTY ||
                                 error == NewClientFormValidationError.LAST_NAME_EMPTY ||
                                 error == NewClientFormValidationError.PHONE_EMPTY);
    }

    /**
     * Очищає всі помилки.
     */
    public void clearErrors() {
        this.isValid = true;
        this.errorMessages.clear();
        this.validationErrors.clear();
        this.detailedReport = "";
    }

    /**
     * Об'єднує з іншим результатом валідації.
     */
    public void mergeWith(NewClientFormValidationResult other) {
        if (!other.isValid()) {
            this.isValid = false;
            this.errorMessages.addAll(other.getErrorMessages());
            this.validationErrors.addAll(other.getValidationErrors());
        }
    }

    @Override
    public String toString() {
        return "NewClientFormValidationResult{" +
                "isValid=" + isValid +
                ", errorCount=" + errorMessages.size() +
                ", hasReport=" + !detailedReport.isEmpty() +
                '}';
    }
}
