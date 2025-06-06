package com.aksi.domain.order.statemachine.stage1.validator;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;

import org.springframework.stereotype.Component;

import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.client.entity.CommunicationChannelEntity;
import com.aksi.domain.client.enums.ClientSource;

import lombok.extern.slf4j.Slf4j;

/**
 * Валідатор для даних клієнта в Order Wizard
 * Винесено з Guards для спрощення коду
 */
@Component
@Slf4j
public class ClientDataValidator {

    // Регекс для українських номерів телефонів
    private static final Pattern UKRAINIAN_PHONE_PATTERN = Pattern.compile(
        "^(\\+38|38|8)?[\\s\\-]?\\(?0?(39|50|63|66|67|68|91|92|93|94|95|96|97|98|99|73|89)\\)?[\\s\\-]?\\d{3}[\\s\\-]?\\d{2}[\\s\\-]?\\d{2}$"
    );

    // Регекс для перевірки імен
    private static final Pattern NAME_PATTERN = Pattern.compile("^[\\p{L}\\s\\-']{2,50}$");

    // Регекс для email
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");

    /**
     * Валідує дані клієнта та повертає список помилок
     *
     * @param client дані клієнта для валідації
     * @return список помилок валідації (порожній якщо все валідно)
     */
    public ValidationResult validate(ClientResponse client) {
        List<String> errors = new ArrayList<>();

        if (client == null) {
            return ValidationResult.invalid("Дані клієнта не передано");
        }

        // Валідація прізвища
        if (!isValidName(client.getLastName())) {
            errors.add("Прізвище обов'язкове і повинно містити від 2 до 50 символів");
        }

        // Валідація імені
        if (!isValidName(client.getFirstName())) {
            errors.add("Ім'я обов'язкове і повинно містити від 2 до 50 символів");
        }

        // Валідація телефону (обов'язкове поле)
        if (!isValidUkrainianPhone(client.getPhone())) {
            errors.add("Номер телефону обов'язковий і повинен відповідати українському формату");
        }

        // Валідація email (необов'язкове, але якщо вказано - повинно бути коректним)
        if (client.getEmail() != null && !client.getEmail().trim().isEmpty()) {
            if (!isValidEmail(client.getEmail())) {
                errors.add("Email має некоректний формат");
            }
        }

                // Валідація адреси (необов'язкове поле, але якщо вказано - має бути валідним)
        if (client.getAddress() != null && !client.getAddress().trim().isEmpty()) {
            if (!isValidAddress(client.getAddress())) {
                errors.add("Адреса клієнта має некоректний формат або перевищує 200 символів");
            }
        }

        // Валідація способів зв'язку (необов'язкове поле)
        if (client.getCommunicationChannels() != null && !client.getCommunicationChannels().isEmpty()) {
            validateCommunicationChannels(client.getCommunicationChannels(), errors);
        }

        // Валідація джерела інформації (необов'язкове поле)
        if (client.getSource() != null) {
            if (!isValidInfoSource(client.getSource())) {
                errors.add("Джерело інформації має некоректне значення");
            }
        }

        // Валідація додаткових деталей джерела (якщо обрано "Інше")
        if (client.getSource() != null && client.getSource().name().equals("OTHER") &&
            (client.getSourceDetails() == null || client.getSourceDetails().trim().isEmpty())) {
            errors.add("При виборі 'Інше' джерело інформації має бути уточнено");
        }

        return errors.isEmpty() ? ValidationResult.valid() : ValidationResult.invalid(errors);
    }

    /**
     * Перевіряє чи є клієнт новим (без ID) чи існуючим
     */
    public boolean isNewClient(ClientResponse client) {
        return client != null && client.getId() == null;
    }

    /**
     * Перевіряє коректність імені/прізвища
     */
    private boolean isValidName(String name) {
        return name != null &&
               !name.trim().isEmpty() &&
               NAME_PATTERN.matcher(name.trim()).matches();
    }

    /**
     * Перевіряє коректність українського номеру телефону
     */
    private boolean isValidUkrainianPhone(String phone) {
        if (phone == null || phone.trim().isEmpty()) {
            return false;
        }

        String cleanPhone = phone.replaceAll("[\\s\\-\\(\\)]", "");
        return UKRAINIAN_PHONE_PATTERN.matcher(cleanPhone).matches();
    }

    /**
     * Перевіряє коректність email
     */
    private boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return true; // Email не обов'язковий
        }

        return EMAIL_PATTERN.matcher(email.trim()).matches();
    }

    /**
     * Перевіряє коректність адреси клієнта
     */
    private boolean isValidAddress(String address) {
        if (address == null || address.trim().isEmpty()) {
            return true; // Адреса не обов'язкова
        }

        String cleanAddress = address.trim();

        // Перевірка довжини (максимум 200 символів)
        if (cleanAddress.length() > 200) {
            return false;
        }

        // Адреса може містити літери, цифри, пробіли та спеціальні символи
        return cleanAddress.matches("^[\\p{L}\\p{N}\\s\\.,\\-/№#]+$");
    }

    /**
     * Валідує способи зв'язку (communication channels)
     */
    private void validateCommunicationChannels(Set<CommunicationChannelEntity> channels, List<String> errors) {
        if (channels == null || channels.isEmpty()) {
            return; // Способи зв'язку не обов'язкові
        }

        // Перевіряємо, що всі канали є валідними enum значеннями
        for (CommunicationChannelEntity channel : channels) {
            if (channel == null) {
                errors.add("Некоректний спосіб зв'язку: null значення не дозволено");
            }
        }

        // Логічна перевірка: якщо обрано SMS або Viber, має бути вказаний телефон
        if ((channels.contains(CommunicationChannelEntity.SMS) ||
             channels.contains(CommunicationChannelEntity.VIBER)) &&
            !channels.contains(CommunicationChannelEntity.PHONE)) {
            // Примітка: це логічне попередження, не критична помилка
            log.debug("Обрано SMS/Viber без основного телефону - може потребувати уваги");
        }
    }

    /**
     * Перевіряє коректність джерела інформації
     */
    private boolean isValidInfoSource(ClientSource source) {
        if (source == null) {
            return true; // Джерело не обов'язкове
        }

        // Всі значення enum ClientSource є валідними
        return source == ClientSource.INSTAGRAM ||
               source == ClientSource.GOOGLE ||
               source == ClientSource.RECOMMENDATION ||
               source == ClientSource.OTHER;
    }

    /**
     * Результат валідації
     */
    public static class ValidationResult {
        private final boolean valid;
        private final List<String> errors;

        private ValidationResult(boolean valid, List<String> errors) {
            this.valid = valid;
            this.errors = errors != null ? errors : new ArrayList<>();
        }

        public static ValidationResult valid() {
            return new ValidationResult(true, new ArrayList<>());
        }

        public static ValidationResult invalid(String error) {
            return new ValidationResult(false, List.of(error));
        }

        public static ValidationResult invalid(List<String> errors) {
            return new ValidationResult(false, errors);
        }

        public boolean isValid() {
            return valid;
        }

        public List<String> getErrors() {
            return errors;
        }

        public String getFirstError() {
            return errors.isEmpty() ? null : errors.get(0);
        }
    }
}
