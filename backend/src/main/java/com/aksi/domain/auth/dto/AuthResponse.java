package com.aksi.domain.auth.dto;

import java.util.UUID;

import com.aksi.domain.user.entity.RoleEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для відповіді після успішної авторизації/реєстрації.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    
    /**
     * Унікальний ідентифікатор користувача.
     */
    private UUID id;
    
    /**
     * Ім'я користувача.
     */
    private String name;
    
    /**
     * Логін користувача.
     */
    private String username;
    
    /**
     * Email користувача.
     */
    private String email;
    
    /**
     * Роль користувача.
     */
    private RoleEntity role;
    
    /**
     * Посада користувача.
     */
    private String position;
    
    /**
     * Токен доступу (JWT).
     */
    private String accessToken;
    
    /**
     * Токен оновлення.
     */
    private String refreshToken;
    
    /**
     * Час життя токена в секундах.
     */
    private long expiresIn;
}

