package com.aksi.dto.auth;

import com.aksi.domain.user.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для запиту на реєстрацію
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    
    /**
     * Повне ім'я користувача
     */
    @NotBlank(message = "Ім'я не може бути пустим")
    @Size(min = 2, max = 50, message = "Ім'я повинно містити від 2 до 50 символів")
    private String name;
    
    /**
     * Ім'я користувача для входу
     */
    @NotBlank(message = "Логін не може бути пустим")
    @Size(min = 3, max = 20, message = "Логін повинен містити від 3 до 20 символів")
    @Pattern(regexp = "^[a-zA-Z0-9._-]+$", message = "Логін може містити лише літери, цифри та символи . _ -")
    private String username;
    
    /**
     * Email
     */
    @NotBlank(message = "Email не може бути пустим")
    @Email(message = "Невірний формат email")
    private String email;
    
    /**
     * Пароль
     */
    @NotBlank(message = "Пароль не може бути пустим")
    @Size(min = 6, message = "Пароль повинен містити мінімум 6 символів")
    private String password;
    
    /**
     * Роль користувача
     */
    private Role role;
    
    /**
     * Посада/позиція користувача
     */
    private String position;
} 