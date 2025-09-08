package com.aksi.service.security;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

/**
 * Configuration properties for security services.
 * Centralizes all security-related configuration values.
 */
@Component
@ConfigurationProperties(prefix = "app.security")
@Data
public class SecurityConfiguration {

    // Rate limiting configuration
    private int maxAttemptsPerUser = 5;
    private int maxAttemptsPerIp = 10;
    private int lockoutDurationMinutes = 15;
    private int attemptWindowMinutes = 60;
    private boolean rateLimitingEnabled = true;

    // Password policy configuration
    private int passwordMinLength = 12;
    private boolean passwordRequireUppercase = true;
    private boolean passwordRequireLowercase = true;
    private boolean passwordRequireNumbers = true;
    private boolean passwordRequireSpecialChars = true;
    private String passwordAllowedSpecialChars = "@$!%*?&";

    // Session policy configuration
    private int sessionDefaultTimeoutMinutes = 60;
    private int sessionMaxConcurrentSessions = 3;
    private int sessionRememberMeTimeoutDays = 30;
    private boolean sessionSessionFixationProtection = true;
}
