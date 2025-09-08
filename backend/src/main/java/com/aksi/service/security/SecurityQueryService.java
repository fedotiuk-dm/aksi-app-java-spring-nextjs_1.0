package com.aksi.service.security;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.security.dto.PasswordPolicyInfo;
import com.aksi.api.security.dto.RateLimitingPolicy;
import com.aksi.api.security.dto.SecurityAttemptsResponse;
import com.aksi.api.security.dto.SecurityPolicyResponse;
import com.aksi.api.security.dto.SessionPolicyInfo;

import lombok.RequiredArgsConstructor;

/**
 * Query service for security-related read operations.
 * Handles all security data retrieval and monitoring.
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class SecurityQueryService {

    private final SecurityEventAuditService securityEventAuditService;
  private final SecurityConfiguration securityConfig;

    /**
     * Get security attempt statistics and monitoring data.
     *
     * @return SecurityAttemptsResponse containing statistics
     */
    public SecurityAttemptsResponse getSecurityAttempts() {
        return securityEventAuditService.getSecurityAttempts();
    }

    /**
     * Get current security policy settings.
     *
     * @return SecurityPolicyResponse containing policy information
     */
    public SecurityPolicyResponse getSecurityPolicy() {
        SecurityPolicyResponse response = new SecurityPolicyResponse();

        response.setRateLimiting(createRateLimitingPolicy());
        response.setPasswordPolicy(createPasswordPolicy());
        response.setSessionPolicy(createSessionPolicy());

        return response;
    }

    /**
     * Create rate limiting policy from configuration.
     *
     * @return RateLimitingPolicy configured instance
     */
    private RateLimitingPolicy createRateLimitingPolicy() {
        RateLimitingPolicy rateLimiting = new RateLimitingPolicy();
        rateLimiting.setMaxAttemptsPerUser(securityConfig.getMaxAttemptsPerUser());
        rateLimiting.setMaxAttemptsPerIp(securityConfig.getMaxAttemptsPerIp());
        rateLimiting.setLockoutDurationMinutes(securityConfig.getLockoutDurationMinutes());
        rateLimiting.setEnabled(securityConfig.isRateLimitingEnabled());
        return rateLimiting;
    }

    /**
     * Create password policy from configuration.
     *
     * @return PasswordPolicyInfo configured instance
     */
    private PasswordPolicyInfo createPasswordPolicy() {
        PasswordPolicyInfo passwordPolicy = new PasswordPolicyInfo();
        passwordPolicy.setMinLength(securityConfig.getPasswordMinLength());
        passwordPolicy.setRequireUppercase(securityConfig.isPasswordRequireUppercase());
        passwordPolicy.setRequireLowercase(securityConfig.isPasswordRequireLowercase());
        passwordPolicy.setRequireNumbers(securityConfig.isPasswordRequireNumbers());
        passwordPolicy.setRequireSpecialChars(securityConfig.isPasswordRequireSpecialChars());
        passwordPolicy.setAllowedSpecialChars(securityConfig.getPasswordAllowedSpecialChars());
        return passwordPolicy;
    }

    /**
     * Create session policy from configuration.
     *
     * @return SessionPolicyInfo configured instance
     */
    private SessionPolicyInfo createSessionPolicy() {
        SessionPolicyInfo sessionPolicy = new SessionPolicyInfo();
        sessionPolicy.setDefaultTimeoutMinutes(securityConfig.getSessionDefaultTimeoutMinutes());
        sessionPolicy.setMaxConcurrentSessions(securityConfig.getSessionMaxConcurrentSessions());
        sessionPolicy.setRememberMeTimeoutDays(securityConfig.getSessionRememberMeTimeoutDays());
        sessionPolicy.setSessionFixationProtection(securityConfig.isSessionSessionFixationProtection());
        return sessionPolicy;
    }

}
