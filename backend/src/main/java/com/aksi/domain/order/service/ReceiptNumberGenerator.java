package com.aksi.domain.order.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

/**
 * Єдиний сервіс для генерації номерів квитанцій у всьому проекті.
 *
 * Забезпечує консистентний формат номерів квитанцій:
 * AKSI-[BRANCH_CODE]-YYYYMMDD-HHMMSS-XXX
 *
 * Де:
 * - AKSI - префікс компанії
 * - BRANCH_CODE - код філії (DEF якщо відсутній)
 * - YYYYMMDD - дата
 * - HHMMSS - час
 * - XXX - випадкове 3-значне число
 */
@Component
@Slf4j
public class ReceiptNumberGenerator {

    private static final String COMPANY_PREFIX = "AKSI";
    private static final String DEFAULT_BRANCH_CODE = "DEF";
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss");

    /**
     * Генерує номер квитанції з поточним часом.
     *
     * @param branchCode код філії (може бути null)
     * @return згенерований номер квитанції
     */
    public String generate(String branchCode) {
        return generate(branchCode, LocalDateTime.now());
    }

    /**
     * Генерує номер квитанції з вказаним часом.
     *
     * @param branchCode код філії (може бути null)
     * @param dateTime час для генерації номера
     * @return згенерований номер квитанції
     */
    public String generate(String branchCode, LocalDateTime dateTime) {
        // Нормалізуємо код філії
        String normalizedBranchCode = normalizeBranchCode(branchCode);

        // Форматуємо дату та час
        String timestamp = dateTime.format(DATE_TIME_FORMATTER);

        // Генеруємо випадкове 3-значне число
        int randomSuffix = (int) (Math.random() * 1000);
        String formattedSuffix = String.format("%03d", randomSuffix);

        // Формуємо фінальний номер
        String receiptNumber = String.format("%s-%s-%s-%s",
            COMPANY_PREFIX, normalizedBranchCode, timestamp, formattedSuffix);

        log.debug("Згенеровано номер квитанції: {} для філії: {}", receiptNumber, branchCode);

        return receiptNumber;
    }

    /**
     * Нормалізує код філії до стандартного формату.
     *
     * @param branchCode код філії
     * @return нормалізований код філії
     */
    private String normalizeBranchCode(String branchCode) {
        if (branchCode == null || branchCode.trim().isEmpty()) {
            return DEFAULT_BRANCH_CODE;
        }

        // Видаляємо пробіли та переводимо у верхній регістр
        String normalized = branchCode.trim().toUpperCase();

        // Обмежуємо довжину до 10 символів
        if (normalized.length() > 10) {
            normalized = normalized.substring(0, 10);
        }

        return normalized;
    }

    /**
     * Валідує формат номера квитанції.
     *
     * @param receiptNumber номер квитанції для валідації
     * @return true якщо формат правильний
     */
    public boolean isValidFormat(String receiptNumber) {
        if (receiptNumber == null || receiptNumber.trim().isEmpty()) {
            return false;
        }

        // Перевіряємо паттерн: AKSI-[BRANCH]-YYYYMMDD-HHMMSS-XXX
        String pattern = "^AKSI-[A-Z0-9]{1,10}-\\d{8}-\\d{6}-\\d{3}$";
        return receiptNumber.matches(pattern);
    }

    /**
     * Витягує код філії з номера квитанції.
     *
     * @param receiptNumber номер квитанції
     * @return код філії або null якщо неможливо витягти
     */
    public String extractBranchCode(String receiptNumber) {
        if (!isValidFormat(receiptNumber)) {
            return null;
        }

        String[] parts = receiptNumber.split("-");
        return parts.length >= 2 ? parts[1] : null;
    }
}
