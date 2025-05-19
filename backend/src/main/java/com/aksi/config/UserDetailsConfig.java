package com.aksi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.aksi.domain.user.repository.UserRepository;
import com.aksi.service.user.UserDetailsServiceImpl;

import lombok.RequiredArgsConstructor;

/**
 * Конфігурація сервісу користувацьких деталей.
 * Відокремлено для запобігання циклічних залежностей.
 */
@Configuration
@RequiredArgsConstructor
public class UserDetailsConfig {

    private final UserRepository userRepository;

    /**
     * Створює власний encoder паролів для незалежності від SecurityConfig.
     */
    @Bean
    public PasswordEncoder userDetailsPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Створює сервіс користувацьких деталей.
     * @return реалізація UserDetailsService на основі репозиторію користувачів
     */
    @Bean
    public UserDetailsService userDetailsService() {
        return new UserDetailsServiceImpl(userRepository);
    }

    /**
     * Провайдер автентифікації на основі DAO з BCrypt шифруванням паролів.
     * @return налаштований провайдер автентифікації на основі бази даних
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService());
        provider.setPasswordEncoder(userDetailsPasswordEncoder());
        return provider;
    }
}
