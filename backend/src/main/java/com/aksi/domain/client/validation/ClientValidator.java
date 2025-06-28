package com.aksi.domain.client.validation;

import java.util.regex.Pattern;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.client.exception.ClientAlreadyExistsException;
import com.aksi.domain.client.exception.ClientValidationException;
import com.aksi.domain.client.repository.ClientRepository;

import lombok.RequiredArgsConstructor;

/**
 * Validator для бізнес-правил клієнтів
 * Базується на OpenAPI схемах та business rules
 */
@Component
@RequiredArgsConstructor
public class ClientValidator {

    private final ClientRepository clientRepository;

    // Паттерни валідації згідно з OpenAPI
    private static final Pattern PHONE_PATTERN = Pattern.compile("^\\+380\\d{9}$");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");

    // Константи згідно з OpenAPI constraints
    private static final int MIN_NAME_LENGTH = 2;
    private static final int MAX_NAME_LENGTH = 50;
    private static final int MAX_NOTES_LENGTH = 500;

    /**
     * Валідація для створення нового клієнта
     */
    public void validateForCreate(ClientEntity client) {
        validateBasicFields(client);
        validatePhoneFormat(client.getPhone());
        validateEmailFormat(client.getEmail());
        validateUniqueness(client);
    }

    /**
     * Валідація для оновлення існуючого клієнта
     */
    public void validateForUpdate(ClientEntity client) {
        validateBasicFields(client);
        validatePhoneFormat(client.getPhone());
        validateEmailFormat(client.getEmail());
        validateUniquenessForUpdate(client);
    }

    /**
     * Валідація базових обов'язкових полів
     */
    private void validateBasicFields(ClientEntity client) {
        // Перевірка ім'я
        if (!StringUtils.hasText(client.getFirstName())) {
            throw ClientValidationException.emptyFirstName();
        }
        if (client.getFirstName().trim().length() < MIN_NAME_LENGTH) {
            throw ClientValidationException.firstNameTooShort();
        }
        if (client.getFirstName().length() > MAX_NAME_LENGTH) {
            throw new ClientValidationException("Ім'я не може перевищувати " + MAX_NAME_LENGTH + " символів");
        }

        // Перевірка прізвище
        if (!StringUtils.hasText(client.getLastName())) {
            throw ClientValidationException.emptyLastName();
        }
        if (client.getLastName().trim().length() < MIN_NAME_LENGTH) {
            throw ClientValidationException.lastNameTooShort();
        }
        if (client.getLastName().length() > MAX_NAME_LENGTH) {
            throw new ClientValidationException("Прізвище не може перевищувати " + MAX_NAME_LENGTH + " символів");
        }

        // Перевірка телефон (обов'язковий)
        if (!StringUtils.hasText(client.getPhone())) {
            throw new ClientValidationException("Номер телефону є обов'язковим");
        }

        // Перевірка примітки
        if (client.getNotes() != null && client.getNotes().length() > MAX_NOTES_LENGTH) {
            throw ClientValidationException.notesTooLong();
        }

        // Перевірка способів зв'язку
        if (client.getCommunicationMethods() == null || client.getCommunicationMethods().isEmpty()) {
            throw ClientValidationException.noCommunicationMethods();
        }
    }

    /**
     * Валідація формату телефону згідно з OpenAPI pattern
     */
    private void validatePhoneFormat(String phone) {
        if (phone != null && !PHONE_PATTERN.matcher(phone).matches()) {
            throw ClientValidationException.invalidPhone(phone);
        }
    }

    /**
     * Валідація формату email
     */
    private void validateEmailFormat(String email) {
        if (StringUtils.hasText(email) && !EMAIL_PATTERN.matcher(email).matches()) {
            throw ClientValidationException.invalidEmail(email);
        }
    }

    /**
     * Валідація унікальності для нового клієнта
     */
    private void validateUniqueness(ClientEntity client) {
        // Перевірка унікальності телефону
        if (clientRepository.existsByPhone(client.getPhone())) {
            throw ClientAlreadyExistsException.byPhone(client.getPhone());
        }

        // Перевірка унікальності email (якщо вказаний)
        if (StringUtils.hasText(client.getEmail()) && clientRepository.existsByEmail(client.getEmail())) {
            throw ClientAlreadyExistsException.byEmail(client.getEmail());
        }
    }

    /**
     * Валідація унікальності для оновлення клієнта
     */
    private void validateUniquenessForUpdate(ClientEntity client) {
        // Перевірка унікальності телефону (виключаючи поточного клієнта)
        clientRepository.findByPhone(client.getPhone())
            .filter(existingClient -> !existingClient.getId().equals(client.getId()))
            .ifPresent(existingClient -> {
                throw ClientAlreadyExistsException.byPhone(client.getPhone());
            });

        // Перевірка унікальності email (якщо вказаний, виключаючи поточного клієнта)
        if (StringUtils.hasText(client.getEmail())) {
            clientRepository.findByEmail(client.getEmail())
                .filter(existingClient -> !existingClient.getId().equals(client.getId()))
                .ifPresent(existingClient -> {
                    throw ClientAlreadyExistsException.byEmail(client.getEmail());
                });
        }
    }

    /**
     * Бізнес-правило: Валідація можливості видалення клієнта
     */
    public void validateForDeletion(ClientEntity client) {
        // Перевірка чи має клієнт активні замовлення
        if (client.getTotalOrders() != null && client.getTotalOrders() > 0) {
            throw new ClientValidationException(
                "Неможливо видалити клієнта з існуючими замовленнями. " +
                "Клієнт має " + client.getTotalOrders() + " замовлень");
        }
    }

    /**
     * Бізнес-правило: Валідація контактної інформації
     */
    public void validateContactInfo(ClientEntity client) {
        // Якщо вибрано EMAIL як спосіб зв'язку, email має бути вказаний
        if (client.getCommunicationMethods() != null &&
            client.getCommunicationMethods().contains(com.aksi.domain.client.enums.CommunicationMethodType.EMAIL) &&
            !StringUtils.hasText(client.getEmail())) {
            throw new ClientValidationException("Email має бути вказаний якщо вибрано EMAIL як спосіб зв'язку");
        }
    }

    /**
     * Бізнес-правило: Валідація VIP статусу
     */
    public void validateVipStatus(ClientEntity client) {
        if (client.getIsVip() != null && client.getIsVip()) {
            // VIP клієнт повинен мати принаймні одне замовлення або значну суму витрат
            boolean hasEnoughOrders = client.getTotalOrders() != null && client.getTotalOrders() >= 5;
            boolean hasEnoughSpending = client.getTotalSpent() != null &&
                client.getTotalSpent().compareTo(java.math.BigDecimal.valueOf(1000)) >= 0;

            if (!hasEnoughOrders && !hasEnoughSpending) {
                throw new ClientValidationException(
                    "VIP статус надається клієнтам з мінімум 5 замовленнями або витратами понад 1000 грн");
            }
        }
    }
}
