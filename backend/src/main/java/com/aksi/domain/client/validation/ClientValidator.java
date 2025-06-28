package com.aksi.domain.client.validation;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

import org.springframework.stereotype.Component;

import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.client.repository.ClientRepository;

/**
 * Централізований валідатор для всіх бізнес-правил клієнтів
 * Інкапсулює ВСІ правила валідації в одному місці
 */
@Component
public class ClientValidator {

    private static final Pattern PHONE_PATTERN = Pattern.compile("^\\+380\\d{9}$");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$");
    private static final int MIN_NAME_LENGTH = 2;
    private static final int MAX_NAME_LENGTH = 50;
    private static final int MAX_EMAIL_LENGTH = 100;
    private static final int MAX_ADDRESS_LENGTH = 500;
    private static final int MAX_NOTES_LENGTH = 500;

    private final ClientRepository clientRepository;

    public ClientValidator(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    /**
     * Валідація нового клієнта (перед створенням)
     */
    public List<String> validateNewClient(ClientEntity client) {
        List<String> errors = new ArrayList<>();

        // Базова валідація
        errors.addAll(validateBasicFields(client));

        // Перевірка унікальності телефону
        validatePhoneUniqueness(client.getPhone(), null)
            .ifPresent(errors::add);

        return errors;
    }

    /**
     * Валідація існуючого клієнта (перед оновленням)
     */
    public List<String> validateExistingClient(ClientEntity client) {
        List<String> errors = new ArrayList<>();

        // Базова валідація
        errors.addAll(validateBasicFields(client));

        // Перевірка унікальності телефону (виключаючи поточного клієнта)
        validatePhoneUniqueness(client.getPhone(), client.getUuid())
            .ifPresent(errors::add);

        return errors;
    }

    /**
     * Валідація базових полів
     */
    private List<String> validateBasicFields(ClientEntity client) {
        List<String> errors = new ArrayList<>();

        // Ім'я
        validateName(client.getFirstName(), "Ім'я")
            .ifPresent(errors::add);

        // Прізвище
        validateName(client.getLastName(), "Прізвище")
            .ifPresent(errors::add);

        // Телефон
        validatePhone(client.getPhone())
            .ifPresent(errors::add);

        // Email (опціональний)
        if (client.getEmail() != null && !client.getEmail().trim().isEmpty()) {
            validateEmail(client.getEmail())
                .ifPresent(errors::add);
        }

        // Адреса (опціональна)
        if (client.getAddress() != null && !client.getAddress().trim().isEmpty()) {
            validateAddress(client.getAddress())
                .ifPresent(errors::add);
        }

        // Примітки (опціональні)
        if (client.getNotes() != null && !client.getNotes().trim().isEmpty()) {
            validateNotes(client.getNotes())
                .ifPresent(errors::add);
        }

        return errors;
    }

    /**
     * Валідація імені/прізвища
     */
    private Optional<String> validateName(String name, String fieldName) {
        if (name == null || name.trim().isEmpty()) {
            return Optional.of(fieldName + " є обов'язковим");
        }

        String trimmedName = name.trim();
        if (trimmedName.length() < MIN_NAME_LENGTH) {
            return Optional.of(fieldName + " має бути не менше " + MIN_NAME_LENGTH + " символів");
        }

        if (trimmedName.length() > MAX_NAME_LENGTH) {
            return Optional.of(fieldName + " не може перевищувати " + MAX_NAME_LENGTH + " символів");
        }

        return Optional.empty();
    }

    /**
     * Валідація телефону
     */
    private Optional<String> validatePhone(String phone) {
        if (phone == null || phone.trim().isEmpty()) {
            return Optional.of("Телефон є обов'язковим");
        }

        if (!PHONE_PATTERN.matcher(phone.trim()).matches()) {
            return Optional.of("Телефон має бути в форматі +380XXXXXXXXX");
        }

        return Optional.empty();
    }

    /**
     * Валідація email
     */
    private Optional<String> validateEmail(String email) {
        String trimmedEmail = email.trim();

        if (trimmedEmail.length() > MAX_EMAIL_LENGTH) {
            return Optional.of("Email не може перевищувати " + MAX_EMAIL_LENGTH + " символів");
        }

        if (!EMAIL_PATTERN.matcher(trimmedEmail).matches()) {
            return Optional.of("Некоректний формат email");
        }

        return Optional.empty();
    }

    /**
     * Валідація адреси
     */
    private Optional<String> validateAddress(String address) {
        if (address.trim().length() > MAX_ADDRESS_LENGTH) {
            return Optional.of("Адреса не може перевищувати " + MAX_ADDRESS_LENGTH + " символів");
        }

        return Optional.empty();
    }

    /**
     * Валідація приміток
     */
    private Optional<String> validateNotes(String notes) {
        if (notes.trim().length() > MAX_NOTES_LENGTH) {
            return Optional.of("Примітки не можуть перевищувати " + MAX_NOTES_LENGTH + " символів");
        }

        return Optional.empty();
    }

    /**
     * Перевірка унікальності телефону
     */
    private Optional<String> validatePhoneUniqueness(String phone, java.util.UUID excludeClientUuid) {
        return clientRepository.findByPhoneAndIsActiveTrue(phone.trim())
            .filter(existingClient -> !existingClient.getUuid().equals(excludeClientUuid))
            .map(existingClient -> "Клієнт з телефоном " + phone + " вже існує");
    }

    /**
     * Швидка перевірка чи клієнт валідний
     */
    public boolean isValidClient(ClientEntity client) {
        return validateNewClient(client).isEmpty();
    }

    /**
     * Швидка перевірка чи телефон валідний
     */
    public boolean isValidPhone(String phone) {
        return validatePhone(phone).isEmpty();
    }

    /**
     * Швидка перевірка чи email валідний
     */
    public boolean isValidEmail(String email) {
        return email != null && !email.trim().isEmpty() && validateEmail(email).isEmpty();
    }
}
