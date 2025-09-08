package com.aksi.service.security;

import com.aksi.api.security.dto.SecurityAttemptsResponse;
import com.aksi.api.security.dto.SecurityPolicyResponse;

/**
 * Service interface for security management operations.
 * Handles security monitoring, user unlocking, and policy information.
 */
public interface SecurityService {

    /**
     * Get security attempt statistics and monitoring data.
     *
     * @return SecurityAttemptsResponse containing statistics
     */
    SecurityAttemptsResponse getSecurityAttempts();

    /**
     * Unlock a blocked user account.
     *
     * @param username Username to unlock
     */
    void unlockUser(String username);

    /**
     * Unlock a blocked IP address.
     *
     * @param ipAddress IP address to unlock
     */
    void unlockIp(String ipAddress);

    /**
     * Get current security policy settings.
     *
     * @return SecurityPolicyResponse containing policy information
     */
    SecurityPolicyResponse getSecurityPolicy();
}
