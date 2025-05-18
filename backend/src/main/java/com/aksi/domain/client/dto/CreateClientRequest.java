package com.aksi.domain.client.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * DTO для запиту на створення нового клієнта.
 */
@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class CreateClientRequest extends BaseClientRequest {

    /**
     * Прізвище клієнта. Перевизначено для додавання валідації NotBlank.
     */
    @NotBlank(message = "Прізвище не може бути пустим")
    @Override
    public String getLastName() {
        return super.getLastName();
    }

    /**
     * Ім'я клієнта. Перевизначено для додавання валідації NotBlank.
     */
    @NotBlank(message = "Ім'я не може бути пустим")
    @Override
    public String getFirstName() {
        return super.getFirstName();
    }

    /**
     * Номер телефону клієнта. Перевизначено для додавання валідації NotBlank.
     */
    @NotBlank(message = "Телефон не може бути пустим")
    @Override
    public String getPhone() {
        return super.getPhone();
    }
}
