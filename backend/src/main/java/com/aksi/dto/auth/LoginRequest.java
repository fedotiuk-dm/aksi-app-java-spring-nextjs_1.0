package com.aksi.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для запиту на логін
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    
    /**
     * Ім'я користувача або email
     */
    @NotBlank(message = "Логін не може бути пустим")
    private String username;
    
    /**
     * Пароль
     */
    @NotBlank(message = "Пароль не може бути пустим")
    private String password;
} 