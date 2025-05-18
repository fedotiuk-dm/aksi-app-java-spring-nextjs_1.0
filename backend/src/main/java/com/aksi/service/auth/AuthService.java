package com.aksi.service.auth;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.auth.dto.AuthResponse;
import com.aksi.domain.auth.dto.LoginRequest;
import com.aksi.domain.auth.dto.RegisterRequest;
import com.aksi.domain.user.entity.RoleEntity;
import com.aksi.domain.user.entity.UserEntity;
import com.aksi.domain.user.repository.UserRepository;
import com.aksi.exception.AuthenticationException;
import com.aksi.exception.UserAlreadyExistsException;
import com.aksi.util.JwtUtils;

/**
 * Сервіс для автентифікації та реєстрації користувачів.
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
     * Реєстрація нового користувача.
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
        RoleEntity role = request.getRole() != null ? request.getRole() : RoleEntity.STAFF;
        
        // Створення нового користувача
        UserEntity user = UserEntity.builder()
                .name(request.getName())
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .position(request.getPosition())
                .active(true)
                .build();
        
        // Збереження користувача
        userRepository.save(user);
        
        // Генерація токенів та побудова відповіді
        return createAuthResponseForUser(user);
    }
    
    /**
     * Автентифікація користувача.
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
            UserEntity user = findUserByUsernameOrEmail(request.getUsername());
            
            // Генерація токенів та побудова відповіді
            return createAuthResponseForUser(user);
        } catch (org.springframework.security.core.AuthenticationException e) {
            throw new AuthenticationException("Неправильний логін або пароль");
        }
    }

    /**
     * Оновлення JWT токена.
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
            UserEntity user = findUserByUsername(username);
            
            // Перевірка валідності токена
            if (!jwtUtils.isTokenValid(refreshToken, user)) {
                throw new AuthenticationException("Недійсний refresh token");
            }
            
            // Генерація токенів та побудова відповіді
            return createAuthResponseForUser(user);
        } catch (IllegalArgumentException | io.jsonwebtoken.JwtException | NullPointerException e) {
            throw new AuthenticationException("Помилка оновлення токена: " + e.getMessage());
        }
    }
    
    /**
     * Знаходить користувача за username або email.
     * 
     * @param usernameOrEmail Логін або email користувача
     * @return Об'єкт користувача
     * @throws AuthenticationException якщо користувача не знайдено
     */
    private UserEntity findUserByUsernameOrEmail(String usernameOrEmail) {
        return userRepository.findByUsername(usernameOrEmail)
                .or(() -> userRepository.findByEmail(usernameOrEmail))
                .orElseThrow(() -> new AuthenticationException("Неправильний логін або пароль"));
    }
    
    /**
     * Знаходить користувача за username.
     * 
     * @param username Логін користувача
     * @return Об'єкт користувача
     * @throws AuthenticationException якщо користувача не знайдено
     */
    private UserEntity findUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new AuthenticationException("Користувача не знайдено"));
    }
    
    /**
     * Створює об'єкт AuthResponse для користувача, генеруючи необхідні токени.
     * 
     * @param user Користувач
     * @return Об'єкт AuthResponse з JWT токенами та інформацією про користувача
     */
    private AuthResponse createAuthResponseForUser(UserEntity user) {
        Map<String, String> tokens = generateTokenPair(user);
        return buildAuthResponse(user, tokens.get("accessToken"), tokens.get("refreshToken"));
    }
    
    /**
     * Створення AuthResponse на основі даних користувача та токенів
     * 
     * @param user Користувач
     * @param accessToken JWT токен доступу
     * @param refreshToken Токен оновлення
     * @return Об'єкт AuthResponse з усіма необхідними даними
     */
    private AuthResponse buildAuthResponse(UserEntity user, String accessToken, String refreshToken) {
        return AuthResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .position(user.getPosition())
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(jwtUtils.getExpirationInSeconds())
                .build();
    }
    
    /**
     * Генерація пари токенів (access та refresh) для користувача
     * 
     * @param user Користувач
     * @return Пара токенів (ключ "accessToken" для JWT токену, "refreshToken" для refresh токену)
     */
    private Map<String, String> generateTokenPair(UserEntity user) {
        Map<String, String> tokens = new HashMap<>();
        
        // Генерація JWT токена
        tokens.put("accessToken", jwtUtils.generateToken(user));
        
        // Генерація refresh токена
        tokens.put("refreshToken", jwtUtils.generateRefreshToken(user));
        
        return tokens;
    }
} 
