package com.aksi.service;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.aksi.domain.user.entity.UserEntity;
import com.aksi.domain.user.repository.UserRepository;
import com.aksi.domain.auth.dto.AuthResponse;
import com.aksi.domain.auth.dto.LoginRequest;
import com.aksi.domain.auth.dto.RegisterRequest;
import com.aksi.exception.AuthenticationException;
import com.aksi.exception.UserAlreadyExistsException;
import com.aksi.service.auth.AuthService;
import com.aksi.util.JwtUtils;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthService authService;

    private UserEntity mockUser;
    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private final String username = "testuser";
    private final String email = "test@example.com";
    private final String password = "password";
    private final UUID userId = UUID.randomUUID();

    @BeforeEach
    protected void setUp() {
        mockUser = new UserEntity();
        mockUser.setId(userId);
        mockUser.setUsername(username);
        mockUser.setEmail(email);
        mockUser.setPassword("hashedPassword");

        registerRequest = new RegisterRequest();
        registerRequest.setUsername(username);
        registerRequest.setEmail(email);
        registerRequest.setPassword(password);

        loginRequest = new LoginRequest();
        loginRequest.setUsername(username);
        loginRequest.setPassword(password);
    }

    @Test
    void registerShouldCreateNewUser() {
        when(userRepository.existsByUsername(registerRequest.getUsername())).thenReturn(false);
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(registerRequest.getPassword())).thenReturn("hashedPassword");
        when(userRepository.save(any(UserEntity.class))).thenAnswer(invocation -> {
            UserEntity userToSave = invocation.getArgument(0);
            userToSave.setId(userId);
            return userToSave;
        });
        when(jwtUtils.generateToken(any(UserEntity.class))).thenReturn("accessToken");
        when(jwtUtils.generateRefreshToken(any(UserEntity.class))).thenReturn("refreshToken");
        when(jwtUtils.getExpirationInSeconds()).thenReturn(3600L);

        AuthResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertNotNull(response.getId());
        assertEquals(mockUser.getId().toString(), response.getId().toString());
        assertEquals(mockUser.getEmail(), response.getEmail());
        assertEquals("accessToken", response.getAccessToken());
        assertEquals("refreshToken", response.getRefreshToken());

        verify(userRepository).save(any(UserEntity.class));
        verify(jwtUtils).generateToken(any(UserEntity.class));
    }

    @Test
    void registerShouldThrowExceptionIfUsernameExists() {
        when(userRepository.existsByUsername(registerRequest.getUsername())).thenReturn(true);

        UserAlreadyExistsException exception = assertThrows(UserAlreadyExistsException.class, () -> {
            authService.register(registerRequest);
        });
        
        assertEquals("Користувач з таким логіном вже існує", exception.getMessage());
        verify(userRepository, never()).save(any(UserEntity.class));
    }

    @Test
    void registerShouldThrowExceptionIfEmailExists() {
        when(userRepository.existsByUsername(registerRequest.getUsername())).thenReturn(false);
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(true);

        UserAlreadyExistsException exception = assertThrows(UserAlreadyExistsException.class, () -> {
            authService.register(registerRequest);
        });
        
        assertEquals("Користувач з таким email вже існує", exception.getMessage());
        verify(userRepository, never()).save(any(UserEntity.class));
    }

    @Test
    void loginShouldReturnAuthResponse() {
        UsernamePasswordAuthenticationToken authToken = 
            new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword());
        
        when(authenticationManager.authenticate(authToken)).thenReturn(authentication);
        when(userRepository.findByUsername(loginRequest.getUsername())).thenReturn(Optional.of(mockUser));
        when(jwtUtils.generateToken(mockUser)).thenReturn("accessToken");
        when(jwtUtils.generateRefreshToken(mockUser)).thenReturn("refreshToken");
        when(jwtUtils.getExpirationInSeconds()).thenReturn(3600L);

        AuthResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals(mockUser.getId().toString(), response.getId().toString());
        assertEquals(mockUser.getEmail(), response.getEmail());
        assertEquals("accessToken", response.getAccessToken());
        assertEquals("refreshToken", response.getRefreshToken());

        verify(authenticationManager).authenticate(authToken);
        verify(jwtUtils).generateToken(mockUser);
        verify(jwtUtils).generateRefreshToken(mockUser);
    }

    @Test
    void loginShouldThrowExceptionIfAuthenticationFails() {
        UsernamePasswordAuthenticationToken authToken = 
            new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword());
            
        when(authenticationManager.authenticate(authToken))
                .thenThrow(new org.springframework.security.core.AuthenticationException("Authentication failed") {});

        AuthenticationException exception = assertThrows(AuthenticationException.class, () -> {
            authService.login(loginRequest);
        });
        
        assertEquals("Неправильний логін або пароль", exception.getMessage());
        verify(userRepository, never()).findByUsername(anyString());
    }

    @Test
    void loginShouldThrowExceptionIfUserNotFound() {
        UsernamePasswordAuthenticationToken authToken = 
            new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword());

        when(authenticationManager.authenticate(authToken)).thenReturn(authentication);
        when(userRepository.findByUsername(loginRequest.getUsername())).thenReturn(Optional.empty());

        AuthenticationException exception = assertThrows(AuthenticationException.class, () -> {
            authService.login(loginRequest);
        });
        
        assertEquals("Неправильний логін або пароль", exception.getMessage());
    }

    @Test
    void refreshTokenShouldReturnNewTokens() {
        String refreshToken = "validRefreshToken";
        when(jwtUtils.extractUsername(refreshToken)).thenReturn(username);
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(mockUser));
        when(jwtUtils.isTokenValid(refreshToken, mockUser)).thenReturn(true);
        when(jwtUtils.generateToken(mockUser)).thenReturn("newAccessToken");
        when(jwtUtils.generateRefreshToken(mockUser)).thenReturn("newRefreshToken");
        when(jwtUtils.getExpirationInSeconds()).thenReturn(3600L);

        AuthResponse response = authService.refreshToken(refreshToken);

        assertNotNull(response);
        assertEquals(mockUser.getId().toString(), response.getId().toString());
        assertEquals(mockUser.getEmail(), response.getEmail());
        assertEquals("newAccessToken", response.getAccessToken());
        assertEquals("newRefreshToken", response.getRefreshToken());

        verify(jwtUtils).isTokenValid(refreshToken, mockUser);
        verify(jwtUtils).generateToken(mockUser);
        verify(jwtUtils).generateRefreshToken(mockUser);
    }

    @Test
    void refreshTokenShouldThrowExceptionIfTokenInvalid() {
        String refreshToken = "invalidRefreshToken";
        when(jwtUtils.extractUsername(refreshToken)).thenReturn(username);
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(mockUser));
        when(jwtUtils.isTokenValid(refreshToken, mockUser)).thenReturn(false);

        AuthenticationException exception = assertThrows(AuthenticationException.class, () -> {
            authService.refreshToken(refreshToken);
        });
        
        assertEquals("Недійсний refresh token", exception.getMessage());
        verify(jwtUtils).isTokenValid(refreshToken, mockUser);
        verify(jwtUtils, never()).generateToken(any(UserEntity.class));
    }
} 
