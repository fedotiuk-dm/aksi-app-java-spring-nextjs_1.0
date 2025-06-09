package com.aksi.domain.order.statemachine.stage1.validator;

import java.util.ArrayList;
import java.util.List;

/**
 * Результат валідації критеріїв пошуку клієнта.
 * Містить детальну інформацію про результати перевірки пошукових критеріїв.
 */
public class ClientSearchValidationResult {

    private boolean isValid;
    private List<String> errorMessages;
    private List<String> warningMessages;
    private String detailedReport;
    private boolean canSearchByPhone;
    private boolean canSearchByName;
    private boolean canSearchByEmail;

    public ClientSearchValidationResult() {
        this.isValid = true;
        this.errorMessages = new ArrayList<>();
        this.warningMessages = new ArrayList<>();
        this.detailedReport = "";
        this.canSearchByPhone = false;
        this.canSearchByName = false;
        this.canSearchByEmail = false;
    }

    /**
     * Додає помилку валідації.
     */
    public void addError(String message) {
        this.isValid = false;
        this.errorMessages.add(message);
    }

    /**
     * Додає попередження валідації.
     */
    public void addWarning(String message) {
        this.warningMessages.add(message);
    }

    /**
     * Перевіряє чи валідні критерії пошуку.
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
     * Отримує список попереджень.
     */
    public List<String> getWarningMessages() {
        return new ArrayList<>(warningMessages);
    }

    /**
     * Встановлює список попереджень.
     */
    public void setWarningMessages(List<String> warningMessages) {
        this.warningMessages = new ArrayList<>(warningMessages);
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
     * Перевіряє чи можна шукати за телефоном.
     */
    public boolean canSearchByPhone() {
        return canSearchByPhone;
    }

    /**
     * Встановлює можливість пошуку за телефоном.
     */
    public void setCanSearchByPhone(boolean canSearchByPhone) {
        this.canSearchByPhone = canSearchByPhone;
    }

    /**
     * Перевіряє чи можна шукати за ім'ям.
     */
    public boolean canSearchByName() {
        return canSearchByName;
    }

    /**
     * Встановлює можливість пошуку за ім'ям.
     */
    public void setCanSearchByName(boolean canSearchByName) {
        this.canSearchByName = canSearchByName;
    }

    /**
     * Перевіряє чи можна шукати за email.
     */
    public boolean canSearchByEmail() {
        return canSearchByEmail;
    }

    /**
     * Встановлює можливість пошуку за email.
     */
    public void setCanSearchByEmail(boolean canSearchByEmail) {
        this.canSearchByEmail = canSearchByEmail;
    }

    /**
     * Перевіряє чи є критичні помилки.
     */
    public boolean hasCriticalErrors() {
        return !isValid && !errorMessages.isEmpty();
    }

    /**
     * Перевіряє чи є попередження.
     */
    public boolean hasWarnings() {
        return !warningMessages.isEmpty();
    }

    /**
     * Очищає всі помилки та попередження.
     */
    public void clearErrors() {
        this.isValid = true;
        this.errorMessages.clear();
        this.warningMessages.clear();
        this.detailedReport = "";
    }

    /**
     * Об'єднує з іншим результатом валідації.
     */
    public void mergeWith(ClientSearchValidationResult other) {
        if (!other.isValid()) {
            this.isValid = false;
            this.errorMessages.addAll(other.getErrorMessages());
        }
        this.warningMessages.addAll(other.getWarningMessages());
    }

    @Override
    public String toString() {
        return "ClientSearchValidationResult{" +
                "isValid=" + isValid +
                ", errorCount=" + errorMessages.size() +
                ", warningCount=" + warningMessages.size() +
                ", hasReport=" + !detailedReport.isEmpty() +
                '}';
    }
}
