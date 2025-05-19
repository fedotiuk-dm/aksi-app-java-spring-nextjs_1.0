package com.aksi.domain.branch.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * Базовий клас для запитів, пов'язаних з пунктами прийому замовлень.
 * Містить спільні поля та валідаційні правила для створення та оновлення філій.
 */
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public abstract class BaseBranchLocationRequest {

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
    @Pattern(regexp = "^\\+ ? [0-9\\s-()]{10,15}$", message = "Неправильний формат телефону")
    private String phone;

    /**
     * Код пункту прийому (для формування номерів замовлень).
     */
    @NotBlank(message = "Код пункту прийому не може бути порожнім")
    @Pattern(regexp = "^[A-Z0-9]{2,5}$", message = "Код повинен містити від 2 до 5 символів (великі літери та цифри)")
    private String code;

    /**
     * Статус активності пункту прийому.
     */
    private Boolean active;
}
