package com.aksi.domain.client.utils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.client.enums.CommunicationMethodType;

/**
 * Утилітарний клас для роботи з клієнтами.
 * Містить допоміжні методи та функції без сторонніх ефектів.
 */
public final class ClientUtils {

    private ClientUtils() {
        // Utility class
    }

    /**
     * Створення Pageable для quickSearch з обмеженням
     */
    public static Pageable createQuickSearchPageable(int limit) {
        return PageRequest.of(0, Math.min(limit, 50));
    }

    /**
     * Створення Pageable з сортуванням за замовчуванням
     */
    public static Pageable createDefaultPageable(Pageable pageable) {
        return Optional.ofNullable(pageable)
                .filter(p -> p.getSort().isSorted())
                .orElse(PageRequest.of(
                        pageable.getPageNumber(),
                        pageable.getPageSize(),
                        Sort.by(Sort.Direction.ASC, "lastName", "firstName")
                ));
    }

    /**
     * Форматування повного імені клієнта
     */
    public static String formatFullName(String firstName, String lastName) {
        return Optional.ofNullable(firstName)
                .filter(fn -> !fn.trim().isEmpty())
                .map(fn -> fn.trim() + " " +
                           Optional.ofNullable(lastName)
                                   .filter(ln -> !ln.trim().isEmpty())
                                   .map(String::trim)
                                   .orElse(""))
                .orElse(Optional.ofNullable(lastName)
                                .filter(ln -> !ln.trim().isEmpty())
                                .map(String::trim)
                                .orElse(""));
    }

    /**
     * Форматування номера телефону для відображення
     */
    public static String formatPhoneForDisplay(String phone) {
        return Optional.ofNullable(phone)
                .filter(p -> p.matches("^\\+380\\d{9}$"))
                .map(p -> "+380 " +
                         p.substring(4, 6) + " " +
                         p.substring(6, 9) + " " +
                         p.substring(9, 11) + " " +
                         p.substring(11))
                .orElse(phone);
    }

    /**
     * Перевірка чи клієнт є новим (зареєстрований менше ніж 30 днів тому)
     */
    public static boolean isNewClient(ClientEntity client) {
        return Optional.ofNullable(client)
                .map(ClientEntity::getCreatedAt)
                .map(regDate -> regDate.isAfter(LocalDateTime.now().minusDays(30)))
                .orElse(false);
    }

    /**
     * Розрахунок статусу клієнта
     */
    public static String calculateClientStatus(ClientEntity client) {
        if (client == null) {
            return "UNKNOWN";
        }

        if (!Boolean.TRUE.equals(client.getIsActive())) {
            return "INACTIVE";
        }

        if (client.isVip()) {
            return "VIP";
        }

        if (isNewClient(client)) {
            return "NEW";
        }

        if (client.isInactive()) {
            return "DORMANT";
        }

        return "REGULAR";
    }

    /**
     * Фільтрація валідних способів зв'язку
     */
    public static List<CommunicationMethodType> filterValidCommunicationMethods(
            List<CommunicationMethodType> methods, String email) {

        return Optional.ofNullable(methods)
                .map(methodList -> methodList.stream()
                        .filter(method -> method != CommunicationMethodType.EMAIL ||
                                         (email != null && !email.trim().isEmpty()))
                        .distinct()
                        .collect(Collectors.toList()))
                .orElse(List.of());
    }

    /**
     * Генерація опису клієнта для логування
     */
    public static String generateClientLogDescription(ClientEntity client) {
        return Optional.ofNullable(client)
                .map(c -> String.format("Client[id=%d, name='%s', phone='%s', status='%s']",
                        c.getId(),
                        c.getFullName(),
                        c.getPhone(),
                        calculateClientStatus(c)))
                .orElse("Client[unknown]");
    }

    /**
     * Перевірка чи пошуковий запит може бути номером телефону
     */
    public static boolean isPhoneQuery(String query) {
        return Optional.ofNullable(query)
                .filter(q -> !q.trim().isEmpty())
                .map(q -> q.replaceAll("\\D", ""))
                .filter(digits -> digits.length() >= 7)
                .isPresent();
    }

    /**
     * Перевірка чи пошуковий запит може бути email
     */
    public static boolean isEmailQuery(String query) {
        return Optional.ofNullable(query)
                .filter(q -> !q.trim().isEmpty())
                .filter(q -> q.contains("@"))
                .isPresent();
    }

    /**
     * Нормалізація пошукового запиту
     */
    public static String normalizeSearchQuery(String query) {
        return Optional.ofNullable(query)
                .map(String::trim)
                .map(String::toLowerCase)
                .orElse("");
    }

    /**
     * Перевірка чи клієнт потребує уваги (давно не робив замовлення, але активний)
     */
    public static boolean needsAttention(ClientEntity client) {
        return Optional.ofNullable(client)
                .filter(c -> Boolean.TRUE.equals(c.getIsActive()))
                .filter(c -> c.getTotalOrders() != null && c.getTotalOrders() > 0)
                .filter(ClientEntity::isInactive)
                .isPresent();
    }

    /**
     * Розрахунок пріоритету клієнта для сортування в пошуку
     */
    public static int calculateSearchPriority(ClientEntity client, String query) {
        if (client == null || query == null) {
            return Integer.MAX_VALUE;
        }

        String normalizedQuery = normalizeSearchQuery(query);

        // Точне співпадіння прізвища має найвищий пріоритет
        if (client.getLastName().toLowerCase().equals(normalizedQuery)) {
            return 1;
        }

        // Прізвище починається з запиту
        if (client.getLastName().toLowerCase().startsWith(normalizedQuery)) {
            return 2;
        }

        // Точне співпадіння імені
        if (client.getFirstName().toLowerCase().equals(normalizedQuery)) {
            return 3;
        }

        // Ім'я починається з запиту
        if (client.getFirstName().toLowerCase().startsWith(normalizedQuery)) {
            return 4;
        }

        // Телефон містить запит
        if (isPhoneQuery(query) && client.getPhone().contains(query.replaceAll("\\D", ""))) {
            return 5;
        }

        // Email містить запит
        if (client.getEmail() != null &&
            client.getEmail().toLowerCase().contains(normalizedQuery)) {
            return 6;
        }

        // Повне ім'я містить запит
        if (client.getFullName().toLowerCase().contains(normalizedQuery)) {
            return 7;
        }

        return Integer.MAX_VALUE;
    }

    /**
     * Створення хеш-коду для кешування пошукових результатів
     */
    public static String createSearchCacheKey(String query, int limit) {
        return String.format("client_search_%s_%d",
                           normalizeSearchQuery(query).hashCode(),
                           limit);
    }

    /**
     * Перевірка валідності діапазону дат
     */
    public static boolean isValidDateRange(LocalDateTime from, LocalDateTime to) {
        if (from == null || to == null) {
            return true; // null значення дозволені
        }
        return !from.isAfter(to);
    }
}
