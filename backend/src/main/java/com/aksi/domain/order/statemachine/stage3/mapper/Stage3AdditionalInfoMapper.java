package com.aksi.domain.order.statemachine.stage3.mapper;

import java.util.UUID;

import com.aksi.domain.order.dto.AdditionalRequirementsRequest;
import com.aksi.domain.order.dto.AdditionalRequirementsResponse;
import com.aksi.domain.order.statemachine.stage3.dto.AdditionalInfoDTO;

/**
 * Mapper для конвертації AdditionalInfoDTO та доменних DTO
 * ЕТАП 1.3: Залежить тільки від DTO
 */
public class Stage3AdditionalInfoMapper {

    /**
     * Створює AdditionalInfoDTO з базових параметрів
     */
    public static AdditionalInfoDTO createFromBasicParams(
            UUID sessionId,
            UUID orderId) {
        return new AdditionalInfoDTO(sessionId, orderId);
    }

    /**
     * Створює AdditionalInfoDTO з доменного запиту
     */
    public static AdditionalInfoDTO fromDomainRequest(
            UUID sessionId,
            AdditionalRequirementsRequest request) {
        if (request == null) {
            return new AdditionalInfoDTO(sessionId);
        }

        AdditionalInfoDTO dto = new AdditionalInfoDTO(sessionId, request.getOrderId());
        dto.setAdditionalInfoRequest(request);
        return dto;
    }

    /**
     * Конвертує AdditionalInfoDTO в доменний запит
     */
    public static AdditionalRequirementsRequest toDomainRequest(AdditionalInfoDTO dto) {
        if (dto == null || !dto.hasRequiredParameters()) {
            return null;
        }

        return AdditionalRequirementsRequest.builder()
                .orderId(dto.getOrderId())
                .additionalRequirements(dto.getAdditionalRequirements())
                .customerNotes(dto.getCustomerNotes())
                .build();
    }

    /**
     * Оновлює AdditionalInfoDTO з доменної відповіді
     */
    public static AdditionalInfoDTO updateWithDomainResponse(
            AdditionalInfoDTO dto,
            AdditionalRequirementsResponse response) {
        if (dto == null) {
            return null;
        }

        dto.setAdditionalInfoResponse(response);

        // Автоматично встановлюємо валідність
        dto.setIsValid(true); // AdditionalInfo завжди валідно

        return dto;
    }

    /**
     * Встановлює додаткові вимоги
     */
    public static AdditionalInfoDTO withAdditionalRequirements(
            AdditionalInfoDTO dto,
            String additionalRequirements) {
        if (dto == null) {
            return null;
        }

        dto.setAdditionalRequirements(additionalRequirements);
        return dto;
    }

    /**
     * Встановлює примітки клієнта
     */
    public static AdditionalInfoDTO withCustomerNotes(
            AdditionalInfoDTO dto,
            String customerNotes) {
        if (dto == null) {
            return null;
        }

        dto.setCustomerNotes(customerNotes);
        return dto;
    }

    /**
     * Встановлює обидва типи додаткової інформації
     */
    public static AdditionalInfoDTO withAllInfo(
            AdditionalInfoDTO dto,
            String additionalRequirements,
            String customerNotes) {
        if (dto == null) {
            return null;
        }

        dto.setAdditionalRequirements(additionalRequirements);
        dto.setCustomerNotes(customerNotes);
        return dto;
    }

    /**
     * Очищає всю додаткову інформацію
     */
    public static AdditionalInfoDTO clearAllInfo(AdditionalInfoDTO dto) {
        if (dto == null) {
            return null;
        }

        dto.setAdditionalRequirements(null);
        dto.setCustomerNotes(null);
        return dto;
    }

    /**
     * Позначає додаткову інформацію як завершену
     */
    public static AdditionalInfoDTO markAsComplete(AdditionalInfoDTO dto) {
        if (dto == null) {
            return null;
        }

        if (dto.isReadyForCompletion()) {
            dto.setAdditionalInfoComplete(true);
        }
        return dto;
    }

    /**
     * Скидає стан завершення
     */
    public static AdditionalInfoDTO resetCompletion(AdditionalInfoDTO dto) {
        if (dto == null) {
            return null;
        }

        dto.setAdditionalInfoComplete(false);
        return dto;
    }

    /**
     * Створює копію DTO з новою інформацією
     */
    public static AdditionalInfoDTO copyWithNewInfo(
            AdditionalInfoDTO original,
            String additionalRequirements,
            String customerNotes) {
        if (original == null) {
            return null;
        }

        AdditionalInfoDTO copy = new AdditionalInfoDTO(
                original.getSessionId(),
                original.getOrderId());
        copy.setAdditionalRequirements(additionalRequirements);
        copy.setCustomerNotes(customerNotes);

        return copy;
    }

    /**
     * Створює короткий опис додаткової інформації
     */
    public static String createShortSummary(AdditionalInfoDTO dto) {
        if (dto == null) {
            return "Немає додаткової інформації";
        }

        if (!dto.hasAnyInformation()) {
            return "Немає додаткової інформації";
        }

        StringBuilder summary = new StringBuilder();
        boolean hasRequirements = Boolean.TRUE.equals(dto.getHasAdditionalRequirements());
        boolean hasNotes = Boolean.TRUE.equals(dto.getHasCustomerNotes());

        if (hasRequirements && hasNotes) {
            summary.append("Є додаткові вимоги та примітки");
        } else if (hasRequirements) {
            summary.append("Є додаткові вимоги");
        } else if (hasNotes) {
            summary.append("Є примітки клієнта");
        }

        return summary.toString();
    }

    /**
     * Створює детальний опис додаткової інформації
     */
    public static String createDetailedSummary(AdditionalInfoDTO dto) {
        if (dto == null) {
            return "Додаткова інформація відсутня";
        }

        StringBuilder summary = new StringBuilder();

        String additionalRequirements = dto.getAdditionalRequirements();
        String customerNotes = dto.getCustomerNotes();

        if (isNotEmpty(additionalRequirements)) {
            summary.append("Додаткові вимоги: ").append(additionalRequirements);
        }

        if (isNotEmpty(customerNotes)) {
            if (summary.length() > 0) {
                summary.append("; ");
            }
            summary.append("Примітки клієнта: ").append(customerNotes);
        }

        if (summary.length() == 0) {
            summary.append("Додаткова інформація відсутня");
        }

        return summary.toString();
    }

    /**
     * Перевіряє чи змінилася додаткова інформація
     */
    public static boolean hasInfoChanged(
            AdditionalInfoDTO dto,
            String newAdditionalRequirements,
            String newCustomerNotes) {
        if (dto == null) {
            return isNotEmpty(newAdditionalRequirements) || isNotEmpty(newCustomerNotes);
        }

        String currentRequirements = dto.getAdditionalRequirements();
        String currentNotes = dto.getCustomerNotes();

        boolean requirementsChanged = !stringEquals(currentRequirements, newAdditionalRequirements);
        boolean notesChanged = !stringEquals(currentNotes, newCustomerNotes);

        return requirementsChanged || notesChanged;
    }

    /**
     * Підраховує загальну кількість символів у всій додатковій інформації
     */
    public static int getTotalCharacterCount(AdditionalInfoDTO dto) {
        if (dto == null) {
            return 0;
        }

        int count = 0;

        String additionalRequirements = dto.getAdditionalRequirements();
        if (additionalRequirements != null) {
            count += additionalRequirements.length();
        }

        String customerNotes = dto.getCustomerNotes();
        if (customerNotes != null) {
            count += customerNotes.length();
        }

        return count;
    }

    /**
     * Перевіряє чи інформація відповідає обмеженням довжини
     */
    public static boolean isWithinLengthLimits(AdditionalInfoDTO dto) {
        if (dto == null) {
            return true;
        }

        String additionalRequirements = dto.getAdditionalRequirements();
        String customerNotes = dto.getCustomerNotes();

        // Перевіряємо згідно з анотаціями валідації з доменного DTO
        boolean requirementsValid = additionalRequirements == null || additionalRequirements.length() <= 1000;
        boolean notesValid = customerNotes == null || customerNotes.length() <= 1000;

        return requirementsValid && notesValid;
    }

    /**
     * Встановлює повідомлення валідації
     */
    public static AdditionalInfoDTO withValidationMessage(
            AdditionalInfoDTO dto,
            String message,
            boolean isValid) {
        if (dto == null) {
            return null;
        }

        dto.setValidationMessage(message);
        dto.setIsValid(isValid);
        return dto;
    }

    /**
     * Утилітний метод для перевірки чи рядок не порожній
     */
    private static boolean isNotEmpty(String value) {
        return value != null && !value.trim().isEmpty();
    }

    /**
     * Утилітний метод для порівняння рядків з урахуванням null
     */
    private static boolean stringEquals(String str1, String str2) {
        if (str1 == null && str2 == null) {
            return true;
        }
        if (str1 == null || str2 == null) {
            return false;
        }
        return str1.equals(str2);
    }
}
