package com.aksi.dto.auth;

import com.aksi.domain.user.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * DTO для відповіді після успішної авторизації/реєстрації
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    
    /**
     * Унікальний ідентифікатор користувача
     */
    private UUID id;
    
    /**
     * Ім'я користувача
     */
    private String name;
    
    /**
     * Login користувача
     */
    private String username;
    
    /**
     * Email користувача
     */
    private String email;
    
    /**
     * Роль користувача
     */
    private Role role;
    
    /**
     * Посада користувача
     */
    private String position;
    
    /**
     * JWT токен для доступу
     */
    private String accessToken;
    
    /**
     * Токен для оновлення JWT
     */
    private String refreshToken;
    
    /**
     * Термін дії JWT токена (в секундах)
     */
    private long expiresIn;
} 