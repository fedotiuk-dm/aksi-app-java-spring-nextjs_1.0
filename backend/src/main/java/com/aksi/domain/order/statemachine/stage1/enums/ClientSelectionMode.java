package com.aksi.domain.order.statemachine.stage1.enums;

import java.util.List;
import java.util.function.Function;

import com.aksi.domain.order.statemachine.stage1.dto.ClientSelectionDTO;
import com.aksi.domain.order.statemachine.stage1.validator.ValidationResult;

/**
 * Enum з вбудованими стратегіями валідації для різних режимів вибору клієнта.
 */
public enum ClientSelectionMode {

    SELECT_EXISTING("SELECT_EXISTING", clientSelection -> {
        if (clientSelection.getSelectedClientId() == null) {
            return ValidationResult.failure(List.of("ID клієнта не вказаний для існуючого клієнта"));
        }
        if (clientSelection.getSelectedClient() == null) {
            return ValidationResult.failure(List.of("Дані обраного клієнта відсутні"));
        }
        return ValidationResult.success();
    }),

    CREATE_NEW("CREATE_NEW", clientSelection -> {
        if (clientSelection.getNewClientData() == null) {
            return ValidationResult.failure(List.of("Дані нового клієнта відсутні"));
        }
        // newClientData валідується через @Valid анотацію
        return ValidationResult.success();
    });

    private final String code;
    private final Function<ClientSelectionDTO, ValidationResult> validationStrategy;

    ClientSelectionMode(String code, Function<ClientSelectionDTO, ValidationResult> validationStrategy) {
        this.code = code;
        this.validationStrategy = validationStrategy;
    }

    public String getCode() {
        return code;
    }

    /**
     * Валідація за допомогою стратегії для цього режиму.
     */
    public ValidationResult validate(ClientSelectionDTO clientSelection) {
        return validationStrategy.apply(clientSelection);
    }

    /**
     * Знаходить режим за кодом.
     */
    public static ClientSelectionMode fromCode(String code) {
        for (ClientSelectionMode mode : values()) {
            if (mode.code.equals(code)) {
                return mode;
            }
        }
        throw new IllegalArgumentException("Невідомий режим вибору клієнта: " + code);
    }
}
