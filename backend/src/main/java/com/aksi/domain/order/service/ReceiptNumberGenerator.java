package com.aksi.domain.order.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.repository.OrderRepository;

import lombok.RequiredArgsConstructor;
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
@RequiredArgsConstructor
@Slf4j
public class ReceiptNumberGenerator {

    private final OrderRepository orderRepository;

    private static final Random RANDOM = new Random();
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
        int randomSuffix = RANDOM.nextInt(1000);
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

    /**
     * Генерує унікальний номер квитанції з перевіркою на унікальність.
     *
     * @param branchCode код філії (може бути null)
     * @param dateTime час для генерації номера
     * @return гарантовано унікальний номер квитанції
     */
    public String generateUnique(String branchCode, LocalDateTime dateTime) {
        int maxAttempts = 100; // Максимум спроб для уникнення нескінченного циклу

        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            String candidateNumber = generate(branchCode, dateTime);

            if (isUniqueReceiptNumber(candidateNumber)) {
                log.debug("Унікальний номер квитанції згенеровано: {} (спроба: {})", candidateNumber, attempt);
                return candidateNumber;
            }

            log.debug("Номер квитанції {} не унікальний, повторна генерація (спроба: {})", candidateNumber, attempt);
        }

        // Якщо всі спроби вичерпано, генеруємо номер з більш унікальним суфіксом
        String fallbackNumber = generateFallbackUniqueNumber(branchCode, dateTime);
        log.warn("Використано fallback генерацію для унікального номера: {}", fallbackNumber);
        return fallbackNumber;
    }

    /**
     * Генерує унікальний номер квитанції з поточним часом.
     *
     * @param branchCode код філії (може бути null)
     * @return гарантовано унікальний номер квитанції
     */
    public String generateUnique(String branchCode) {
        return generateUnique(branchCode, LocalDateTime.now());
    }

    /**
     * Перевіряє, чи є номер квитанції унікальним.
     *
     * @param receiptNumber номер квитанції для перевірки
     * @return true, якщо номер унікальний (не існує в базі даних)
     */
    public boolean isUniqueReceiptNumber(String receiptNumber) {
        if (receiptNumber == null || receiptNumber.trim().isEmpty()) {
            return false;
        }

        return orderRepository.findByReceiptNumber(receiptNumber.trim()) == null;
    }

    /**
     * Генерує fallback номер квитанції з гарантованою унікальністю.
     *
     * @param branchCode код філії
     * @param dateTime час для генерації
     * @return унікальний номер квитанції
     */
    private String generateFallbackUniqueNumber(String branchCode, LocalDateTime dateTime) {
        String normalizedBranchCode = normalizeBranchCode(branchCode);
        String timestamp = dateTime.format(DATE_TIME_FORMATTER);

        // Використовуємо наносекунди для максимальної унікальності
        long nanoSuffix = System.nanoTime() % 100000; // останні 5 цифр наносекунд
        String fallbackSuffix = String.format("%05d", nanoSuffix);

        return String.format("%s-%s-%s-FB%s",
            COMPANY_PREFIX, normalizedBranchCode, timestamp, fallbackSuffix);
    }
}
