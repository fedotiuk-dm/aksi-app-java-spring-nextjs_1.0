package com.aksi.domain.branch.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для передачі даних про пункт прийому замовлень.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BranchLocationDTO {

    /**
     * Унікальний ідентифікатор пункту прийому.
     */
    private UUID id;

    /**
     * Назва пункту прийому.
     */
    @NotBlank(message = "Назва пункту прийому не може бути порожньою")
    private String name;

    /**
     * Адреса пункту прийому.
     */
    @NotBlank(message = "Адреса пункту прийому не може бути порожньою")
    private String address;

    /**
     * Контактний телефон пункту прийому.
     */
    @Pattern(regexp = "^\\+?[0-9\\s-()]{10,15}$", message = "Неправильний формат телефону")
    private String phone;

    /**
     * Код пункту прийому (для формування номерів замовлень).
     */
    @NotBlank(message = "Код пункту прийому не може бути порожнім")
    private String code;

    /**
     * Статус активності пункту прийому.
     */
    private Boolean active;

    /**
     * Дата та час створення запису.
     */
    private LocalDateTime createdAt;

    /**
     * Дата та час останнього оновлення запису.
     */
    private LocalDateTime updatedAt;
}
