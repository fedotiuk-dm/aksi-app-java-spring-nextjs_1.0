package com.aksi.service.security;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Command service for security-related write operations.
 * Handles all security state changes and modifications.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SecurityCommandService {

    private final LoginAttemptService loginAttemptService;

    /**
     * Unlock a blocked user account.
     *
     * @param username Username to unlock
     */
    public void unlockUser(String username) {
        loginAttemptService.unlockUser(username);
        log.info("SECURITY: User account unlocked: {}", username);
    }

    /**
     * Unlock a blocked IP address.
     *
     * @param ipAddress IP address to unlock
     */
    public void unlockIp(String ipAddress) {
        loginAttemptService.unlockIp(ipAddress);
        log.info("SECURITY: IP address unlocked: {}", ipAddress);
    }

}
