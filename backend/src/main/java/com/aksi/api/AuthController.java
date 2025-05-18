package com.aksi.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.auth.dto.AuthResponse;
import com.aksi.domain.auth.dto.LoginRequest;
import com.aksi.domain.auth.dto.RegisterRequest;
import com.aksi.service.auth.AuthService;
import com.aksi.util.ApiResponseUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Контролер для операцій автентифікації та реєстрації.
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Authentication", description = "API для автентифікації та реєстрації користувачів")
public class AuthController {
    
    private final AuthService authService;
    
    /**
     * Реєстрація нового користувача.
     * @param request дані користувача
     * @return відповідь з JWT токеном
     */
    @PostMapping("/register")
    @Operation(summary = "Реєстрація нового користувача", 
               description = "Створює нового користувача і повертає JWT токен")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ApiResponseUtils.ok(response, "Успішна реєстрація користувача: {}", request.getUsername());
        } catch (Exception e) {
            return ApiResponseUtils.conflict("Помилка при реєстрації", 
                "Не вдалося зареєструвати користувача: {}. Причина: {}", request.getUsername(), e.getMessage());
        }
    }
    
    /**
     * Вхід користувача.
     * @param request дані для входу
     * @return відповідь з JWT токеном
     */
    @PostMapping("/login")
    @Operation(summary = "Вхід користувача", 
               description = "Автентифікує користувача і повертає JWT токен")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ApiResponseUtils.ok(response, "Успішний вхід користувача: {}", request.getUsername());
        } catch (Exception e) {
            return ApiResponseUtils.unauthorized("Помилка автентифікації", 
                "Не вдалося автентифікувати користувача: {}. Причина: {}", request.getUsername(), e.getMessage());
        }
    }
    
    /**
     * Оновлення токена.
     * @param refreshToken параметр refreshToken
     * @return відповідь з новим JWT токеном
     */
    @PostMapping("/refresh-token")
    @Operation(summary = "Оновлення токена", 
               description = "Оновлює JWT токен за допомогою refresh токена")
    public ResponseEntity<?> refreshToken(@RequestBody String refreshToken) {
        try {
            AuthResponse response = authService.refreshToken(refreshToken);
            return ApiResponseUtils.ok(response, "Успішне оновлення токена");
        } catch (Exception e) {
            return ApiResponseUtils.unauthorized("Недійсний токен оновлення", 
                "Не вдалося оновити токен. Причина: {}", e.getMessage());
        }
    }
    
    /**
     * Тестовий ендпоінт для перевірки доступності.
     * @return відповідь про успішне з'єднання
     */
    @GetMapping("/test")
    @Operation(summary = "Перевірка доступності", 
               description = "Тестовий ендпоінт для перевірки доступності API аутентифікації")
    public ResponseEntity<String> testAuthEndpoint() {
        return ApiResponseUtils.ok("Auth endpoint is working!", "Тестовий запит до API аутентифікації");
    }
} 
