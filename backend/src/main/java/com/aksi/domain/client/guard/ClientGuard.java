package com.aksi.domain.client.guard;

import java.util.Optional;

import org.springframework.stereotype.Component;

import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.client.exception.ClientAlreadyExistsException;
import com.aksi.domain.client.exception.ClientBusinessException;
import com.aksi.domain.client.exception.ClientNotFoundException;
import com.aksi.domain.client.repository.ClientRepository;

import lombok.RequiredArgsConstructor;

/**
 * Guard для перевірки бізнес-умов та авторизації операцій з клієнтами.
 * Реалізує pattern Guard Clauses для чистого коду без вкладених if-ів.
 */
@Component
@RequiredArgsConstructor
public class ClientGuard {

    private final ClientRepository clientRepository;

    /**
     * Перевірка унікальності телефону перед створенням
     */
    public void ensurePhoneNotExists(String phone) {
        Optional.ofNullable(phone)
                .filter(p -> !p.trim().isEmpty())
                .filter(clientRepository::existsByPhone)
                .ifPresent(p -> {
                    throw new ClientAlreadyExistsException(p);
                });
    }

    /**
     * Перевірка унікальності email перед створенням (якщо вказаний)
     */
    public void ensureEmailNotExists(String email) {
        Optional.ofNullable(email)
                .filter(e -> !e.trim().isEmpty())
                .filter(clientRepository::existsByEmail)
                .ifPresent(e -> {
                    throw ClientAlreadyExistsException.byEmail(e);
                });
    }

    /**
     * Перевірка існування клієнта
     */
    public ClientEntity ensureClientExists(Long clientId) {
        return clientRepository.findById(clientId)
                .orElseThrow(() -> new ClientNotFoundException(clientId));
    }

    /**
     * Перевірка що клієнт активний
     */
    public void ensureClientIsActive(ClientEntity client) {
        Optional.of(client)
                .filter(c -> !Boolean.TRUE.equals(c.getIsActive()))
                .ifPresent(c -> {
                    throw new ClientBusinessException(
                        "Операція неможлива: клієнт деактивований",
                        "CLIENT_INACTIVE"
                    );
                });
    }

    /**
     * Перевірка унікальності телефону при оновленні (виключаючи поточного клієнта)
     */
    public void ensurePhoneNotExistsForUpdate(String phone, Long currentClientId) {
        Optional.ofNullable(phone)
                .filter(p -> !p.trim().isEmpty())
                .flatMap(clientRepository::findByPhone)
                .filter(client -> !client.getId().equals(currentClientId))
                .ifPresent(client -> {
                    throw new ClientAlreadyExistsException(phone);
                });
    }

    /**
     * Перевірка унікальності email при оновленні (виключаючи поточного клієнта)
     */
    public void ensureEmailNotExistsForUpdate(String email, Long currentClientId) {
        Optional.ofNullable(email)
                .filter(e -> !e.trim().isEmpty())
                .flatMap(clientRepository::findByEmail)
                .filter(client -> !client.getId().equals(currentClientId))
                .ifPresent(client -> {
                    throw ClientAlreadyExistsException.byEmail(email);
                });
    }

    /**
     * Перевірка можливості видалення клієнта
     */
    public void ensureClientCanBeDeleted(ClientEntity client) {
        // Перевірка чи клієнт має активні замовлення (буде додано пізніше при інтеграції з Order domain)
        // Поки що перевіряємо базові умови

        Optional.of(client)
                .filter(c -> c.getTotalOrders() != null && c.getTotalOrders() > 0)
                .ifPresent(c -> {
                    throw new ClientBusinessException(
                        "Неможливо видалити клієнта з історією замовлень. Використайте деактивацію.",
                        "CLIENT_HAS_ORDERS"
                    );
                });
    }

    /**
     * Перевірка можливості деактивації клієнта
     */
    public void ensureClientCanBeDeactivated(ClientEntity client) {
        ensureClientIsActive(client);

        // Додаткові перевірки для деактивації можна додати тут
        // Наприклад, перевірка на активні замовлення
    }

    /**
     * Перевірка можливості активації клієнта
     */
    public void ensureClientCanBeActivated(ClientEntity client) {
        Optional.of(client)
                .filter(c -> Boolean.TRUE.equals(c.getIsActive()))
                .ifPresent(c -> {
                    throw new ClientBusinessException(
                        "Клієнт вже активний",
                        "CLIENT_ALREADY_ACTIVE"
                    );
                });
    }

    /**
     * Перевірка прав доступу до клієнта (для майбутньої авторизації)
     */
    public void ensureCanAccessClient(Long clientId, String currentUserRole) {
        // Поки що базова реалізація, пізніше може бути розширена
        // з урахуванням ролей користувачів та політик доступу

        if (currentUserRole == null || currentUserRole.trim().isEmpty()) {
            throw new ClientBusinessException(
                "Недостатньо прав для доступу до клієнта",
                "ACCESS_DENIED"
            );
        }
    }

    /**
     * Перевірка обмежень за ролями (для майбутньої авторизації)
     */
    public void ensureCanModifyClient(String currentUserRole) {
        // Базова перевірка прав на модифікацію
        Optional.ofNullable(currentUserRole)
                .filter(role -> role.equals("OPERATOR") || role.equals("ADMIN") || role.equals("MANAGER"))
                .orElseThrow(() -> new ClientBusinessException(
                    "Недостатньо прав для модифікації клієнта",
                    "MODIFICATION_DENIED"
                ));
    }

    /**
     * Перевірка ліміту пошуку
     */
    public void ensureSearchLimitValid(int limit) {
        Optional.of(limit)
                .filter(l -> l <= 0 || l > 100)
                .ifPresent(l -> {
                    throw new ClientBusinessException(
                        "Ліміт пошуку повинен бути від 1 до 100",
                        "INVALID_SEARCH_LIMIT"
                    );
                });
    }

    /**
     * Перевірка валідності пошукового запиту
     */
    public void ensureSearchQueryValid(String query) {
        Optional.ofNullable(query)
                .filter(q -> q.trim().length() < 2)
                .ifPresent(q -> {
                    throw new ClientBusinessException(
                        "Пошуковий запит повинен містити мінімум 2 символи",
                        "SEARCH_QUERY_TOO_SHORT"
                    );
                });
    }
}
