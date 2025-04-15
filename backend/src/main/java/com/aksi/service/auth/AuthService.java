package com.aksi.service.auth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.user.entity.Role;
import com.aksi.domain.user.entity.User;
import com.aksi.domain.user.repository.UserRepository;
import com.aksi.dto.auth.AuthResponse;
import com.aksi.dto.auth.LoginRequest;
import com.aksi.dto.auth.RegisterRequest;
import com.aksi.exception.AuthenticationException;
import com.aksi.exception.UserAlreadyExistsException;
import com.aksi.util.JwtUtils;

/**
 * Сервіс для автентифікації та реєстрації користувачів
 */
@Service
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, 
                       JwtUtils jwtUtils, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.authenticationManager = authenticationManager;
    }
    
    /**
     * Реєстрація нового користувача
     * @param request дані для реєстрації
     * @return відповідь з JWT токеном
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Перевірка чи існує користувач з таким username
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException("Користувач з таким логіном вже існує");
        }
        
        // Перевірка чи існує користувач з таким email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Користувач з таким email вже існує");
        }
        
        // Встановлюємо роль STAFF якщо не вказано інше
        Role role = request.getRole() != null ? request.getRole() : Role.STAFF;
        
        // Створення нового користувача
        User user = User.builder()
                .name(request.getName())
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .position(request.getPosition())
                .isActive(true)
                .build();
        
        // Збереження користувача
        userRepository.save(user);
        
        // Генерація JWT токена
        String token = jwtUtils.generateToken(user);
        
        // Генерація refresh токена
        String refreshToken = jwtUtils.generateRefreshToken(user);
        
        // Повернення відповіді
        return AuthResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .position(user.getPosition())
                .accessToken(token)
                .refreshToken(refreshToken)
                .expiresIn(jwtUtils.getExpirationInSeconds())
                .build();
    }
    
    /**
     * Автентифікація користувача
     * @param request дані для входу
     * @return відповідь з JWT токеном
     */
    public AuthResponse login(LoginRequest request) {
        try {
            // Спроба автентифікації
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
            
            // Якщо автентифікація успішна, знаходимо користувача
            User user = userRepository.findByUsername(request.getUsername())
                    .or(() -> userRepository.findByEmail(request.getUsername()))
                    .orElseThrow(() -> new AuthenticationException("Неправильний логін або пароль"));
            
            // Генерація JWT токена
            String token = jwtUtils.generateToken(user);
            
            // Генерація refresh токена
            String refreshToken = jwtUtils.generateRefreshToken(user);
            
            // Повернення відповіді
            return AuthResponse.builder()
                    .id(user.getId())
                    .name(user.getName())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .position(user.getPosition())
                    .accessToken(token)
                    .refreshToken(refreshToken)
                    .expiresIn(jwtUtils.getExpirationInSeconds())
                    .build();
        } catch (org.springframework.security.core.AuthenticationException e) {
            throw new AuthenticationException("Неправильний логін або пароль");
        }
    }

    /**
     * Оновлення JWT токена
     * @param refreshToken токен для оновлення
     * @return відповідь з новим JWT токеном
     */
    public AuthResponse refreshToken(String refreshToken) {
        try {
            // Отримання імені користувача з токена
            String username = jwtUtils.extractUsername(refreshToken);
            
            if (username == null) {
                throw new AuthenticationException("Недійсний refresh token");
            }
            
            // Перевірка користувача
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new AuthenticationException("Користувача не знайдено"));
            
            // Перевірка валідності токена
            if (!jwtUtils.isTokenValid(refreshToken, user)) {
                throw new AuthenticationException("Недійсний refresh token");
            }
            
            // Генерація нового JWT токена
            String accessToken = jwtUtils.generateToken(user);
            
            // Генерація нового refresh токена
            String newRefreshToken = jwtUtils.generateRefreshToken(user);
            
            // Повернення відповіді
            return AuthResponse.builder()
                    .id(user.getId())
                    .name(user.getName())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .position(user.getPosition())
                    .accessToken(accessToken)
                    .refreshToken(newRefreshToken)
                    .expiresIn(jwtUtils.getExpirationInSeconds())
                    .build();
        } catch (IllegalArgumentException | io.jsonwebtoken.JwtException | NullPointerException e) {
            throw new AuthenticationException("Помилка оновлення токена: " + e.getMessage());
        }
    }
} 