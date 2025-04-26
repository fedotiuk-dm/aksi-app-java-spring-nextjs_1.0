package com.aksi.service.user;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.aksi.domain.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

/**
 * Сервіс для завантаження користувачів з бази даних для автентифікації.
 */
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    
    private final UserRepository userRepository;
    
    /**
     * Завантаження користувача за ім'ям або email.
     * @param username ім'я користувача або email
     * @return деталі користувача
     * @throws UsernameNotFoundException коли користувача не знайдено
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Спочатку шукаємо за username
        return userRepository.findByUsername(username)
                // Якщо не знайдено, шукаємо за email
                .or(() -> userRepository.findByEmail(username))
                .orElseThrow(() -> new UsernameNotFoundException("Користувача не знайдено: " + username));
    }
} 
