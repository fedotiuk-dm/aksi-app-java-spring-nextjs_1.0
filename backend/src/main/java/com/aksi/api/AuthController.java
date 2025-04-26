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
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Запит на реєстрацію користувача: {}", request.getUsername());
        return ResponseEntity.ok(authService.register(request));
    }
    
    /**
     * Вхід користувача.
     * @param request дані для входу
     * @return відповідь з JWT токеном
     */
    @PostMapping("/login")
    @Operation(summary = "Вхід користувача", 
               description = "Автентифікує користувача і повертає JWT токен")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Запит на логін користувача: {}", request.getUsername());
        return ResponseEntity.ok(authService.login(request));
    }
    
    /**
     * Оновлення токена.
     * @param refreshToken параметр refreshToken
     * @return відповідь з новим JWT токеном
     */
    @PostMapping("/refresh-token")
    @Operation(summary = "Оновлення токена", 
               description = "Оновлює JWT токен за допомогою refresh токена")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody String refreshToken) {
        log.info("Запит на оновлення токена");
        return ResponseEntity.ok(authService.refreshToken(refreshToken));
    }
    
    // Додаємо тестовий ендпоінт для перевірки доступності
    @GetMapping("/test")
    public ResponseEntity<String> testAuthEndpoint() {
        return ResponseEntity.ok("Auth endpoint is working!");
    }
} 
