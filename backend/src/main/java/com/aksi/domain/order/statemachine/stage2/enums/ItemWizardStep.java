package com.aksi.domain.order.statemachine.stage2.enums;

import lombok.Getter;

/**
 * Кроки підвізарда предметів в етапі 2 Order Wizard.
 *
 * Відповідає структурі документації:
 * 2.1 - Основна інформація про предмет
 * 2.2 - Характеристики предмета
 * 2.3 - Забруднення, дефекти та ризики
 * 2.4 - Знижки та надбавки (калькулятор ціни)
 * 2.5 - Фотодокументація
 */
@Getter
public enum ItemWizardStep {

    /**
     * 2.1 Основна інформація про предмет.
     * - Категорія послуги
     * - Найменування виробу
     * - Одиниця виміру і кількість
     */
    BASIC_INFO("2.1", "Основна інформація", "Категорія, найменування, кількість"),

    /**
     * 2.2 Характеристики предмета.
     * - Матеріал
     * - Колір
     * - Наповнювач (для відповідних категорій)
     * - Ступінь зносу
     */
    CHARACTERISTICS("2.2", "Характеристики", "Матеріал, колір, наповнювач, знос"),

    /**
     * 2.3 Забруднення, дефекти та ризики.
     * - Плями (мультивибір)
     * - Дефекти та ризики (мультивибір)
     * - Примітки щодо дефектів
     */
    DEFECTS_STAINS("2.3", "Дефекти та плями", "Забруднення, дефекти, ризики"),

    /**
     * 2.4 Знижки та надбавки (калькулятор ціни).
     * - Базова ціна (автоматично)
     * - Коефіцієнти і модифікатори
     * - Інтерактивний розрахунок ціни
     */
    PRICING("2.4", "Розрахунок ціни", "Модифікатори, калькулятор ціни"),

    /**
     * 2.5 Фотодокументація.
     * - Завантаження фото (макс 5 фото, до 5MB кожне)
     * - Попередній перегляд мініатюр
     * - Можливість пропуску кроку
     */
    PHOTOS("2.5", "Фотодокументація", "Завантаження фото (необов'язково)");

    /**
     * Номер кроку.
     */
    private final String stepNumber;

    /**
     * Назва кроку.
     */
    private final String stepName;

    /**
     * Опис кроку.
     */
    private final String description;

    ItemWizardStep(String stepNumber, String stepName, String description) {
        this.stepNumber = stepNumber;
        this.stepName = stepName;
        this.description = description;
    }

    /**
     * Чи є цей крок обов'язковим.
     */
    public boolean isRequired() {
        // Фотодокументація не є обов'язковою
        return this != PHOTOS;
    }

    /**
     * Отримати наступний крок.
     */
    public ItemWizardStep getNext() {
        ItemWizardStep[] steps = values();
        int currentIndex = this.ordinal();
        return currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null;
    }

    /**
     * Отримати попередній крок.
     */
    public ItemWizardStep getPrevious() {
        ItemWizardStep[] steps = values();
        int currentIndex = this.ordinal();
        return currentIndex > 0 ? steps[currentIndex - 1] : null;
    }

    /**
     * Чи є цей крок останнім.
     */
    public boolean isLast() {
        return this.ordinal() == values().length - 1;
    }

    /**
     * Чи є цей крок першим.
     */
    public boolean isFirst() {
        return this.ordinal() == 0;
    }

    /**
     * Отримати всі кроки до поточного (включно).
     */
    public ItemWizardStep[] getStepsUpTo() {
        ItemWizardStep[] allSteps = values();
        ItemWizardStep[] result = new ItemWizardStep[this.ordinal() + 1];
        System.arraycopy(allSteps, 0, result, 0, this.ordinal() + 1);
        return result;
    }
}
