package com.aksi.domain.auth.service;

import java.time.Instant;
import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import com.aksi.shared.validation.ValidationConstants;

import lombok.extern.slf4j.Slf4j;

/** Centralized auth event logging service */
@Slf4j
@Service
public class AuthEventLogger {

  // Login events
  public void logLoginRequest(String username, String ipAddress, String userAgent) {
    log.info(
        ValidationConstants.LogTemplates.LOGIN_REQUEST,
        username,
        ipAddress,
        userAgent,
        Instant.now());
  }

  public void logLoginSuccess(
      String username,
      Collection<? extends GrantedAuthority> authorities,
      long tokenExpirationSeconds,
      long activeTokens) {
    log.info(
        ValidationConstants.LogTemplates.LOGIN_SUCCESS,
        username,
        authorities,
        tokenExpirationSeconds,
        activeTokens,
        Instant.now());
  }

  public void logLoginFailure(String username, String reason) {
    log.warn(ValidationConstants.LogTemplates.LOGIN_FAILED, username, reason, Instant.now());
  }

  // Logout events
  public void logLogoutRequest(String username, String ipAddress, String userAgent) {
    log.info(
        ValidationConstants.LogTemplates.LOGOUT_REQUEST,
        username,
        ipAddress,
        userAgent,
        Instant.now());
  }

  public void logLogoutSuccess(String username) {
    log.info(ValidationConstants.LogTemplates.LOGOUT_SUCCESS, username, Instant.now());
  }

  public void logLogoutFailure(String reason) {
    log.error(ValidationConstants.LogTemplates.LOGOUT_FAILED, reason, Instant.now());
  }

  // Token events
  public void logTokenRefresh(String username, long tokenExpirationSeconds) {
    log.info(
        ValidationConstants.LogTemplates.TOKEN_REFRESHED,
        username,
        tokenExpirationSeconds,
        Instant.now());
  }

  public void logTokenValidation(String username, String ipAddress) {
    log.debug(ValidationConstants.LogTemplates.TOKEN_VALIDATED, username, ipAddress, Instant.now());
  }

  // Security events
  public void logSecurityContextSet(
      String username, Collection<? extends GrantedAuthority> authorities) {
    log.info(
        ValidationConstants.LogTemplates.SECURITY_CONTEXT_SET,
        username,
        authorities,
        Instant.now());
  }

  public void logSecurityContextCleared() {
    log.debug(ValidationConstants.LogTemplates.SECURITY_CONTEXT_CLEARED, Instant.now());
  }

  // Cookie events
  public void logCookieSet(String cookieType, boolean secure, String domain) {
    log.debug(
        ValidationConstants.LogTemplates.COOKIE_SET, cookieType, secure, domain, Instant.now());
  }

  public void logCookieNotFound(String cookieType) {
    log.warn(ValidationConstants.LogTemplates.COOKIE_NOT_FOUND, cookieType, Instant.now());
  }

  // Debug helpers
  public void logDebug(String message, Object... args) {
    if (log.isDebugEnabled()) {
      // Format message with emoji prefix
      String formattedMessage = ValidationConstants.LogTemplates.DEBUG_PREFIX;

      // Create new array with message as first argument
      Object[] newArgs = new Object[args.length + 1];
      newArgs[0] = message;
      System.arraycopy(args, 0, newArgs, 1, args.length);

      log.debug(formattedMessage, newArgs);
    }
  }

  public void logAuthenticationAttempt() {
    log.info(ValidationConstants.LogTemplates.AUTH_EVENT_SEPARATOR);
    log.info(ValidationConstants.LogTemplates.AUTH_EVENT_STARTED);
    log.info(ValidationConstants.LogTemplates.AUTH_EVENT_SEPARATOR);
  }
}
