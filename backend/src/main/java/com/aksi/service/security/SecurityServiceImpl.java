package com.aksi.service.security;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.security.dto.SecurityAttemptsResponse;
import com.aksi.api.security.dto.SecurityPolicyResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Implementation of SecurityService that delegates to command and query services.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class SecurityServiceImpl implements SecurityService {

    private final SecurityCommandService securityCommandService;
    private final SecurityQueryService securityQueryService;

    @Override
    @Transactional(readOnly = true)
    public SecurityAttemptsResponse getSecurityAttempts() {
        return securityQueryService.getSecurityAttempts();
    }

    @Override
    public void unlockUser(String username) {
        securityCommandService.unlockUser(username);
    }

    @Override
    public void unlockIp(String ipAddress) {
        securityCommandService.unlockIp(ipAddress);
    }

    @Override
    @Transactional(readOnly = true)
    public SecurityPolicyResponse getSecurityPolicy() {
        return securityQueryService.getSecurityPolicy();
    }
}
