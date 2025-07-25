package com.aksi.domain.auth.service;

import java.time.Instant;
import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

/** Centralized auth event logging service */
@Slf4j
@Service
public class AuthEventLogger {

  // Login events
  public void logLoginRequest(String username, String ipAddress, String userAgent) {
    log.info(
        "🔑 LOGIN REQUEST | User: {} | IP: {} | User-Agent: {} | Time: {}",
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
        "🟢 LOGIN SUCCESS | User: {} | Roles: {} | Token expires in: {}s | Active tokens: {} | Time: {}",
        username,
        authorities,
        tokenExpirationSeconds,
        activeTokens,
        Instant.now());
  }

  public void logLoginFailure(String username, String reason) {
    log.warn("🔴 LOGIN FAILED | User: {} | Reason: {} | Time: {}", username, reason, Instant.now());
  }

  // Logout events
  public void logLogoutRequest(String username, String ipAddress, String userAgent) {
    log.info(
        "🚪 LOGOUT REQUEST | User: {} | IP: {} | User-Agent: {} | Time: {}",
        username,
        ipAddress,
        userAgent,
        Instant.now());
  }

  public void logLogoutSuccess(String username) {
    log.info("🟠 LOGOUT SUCCESS | User: {} | Time: {}", username, Instant.now());
  }

  public void logLogoutFailure(String reason) {
    log.error("🔴 LOGOUT FAILED | Reason: {} | Time: {}", reason, Instant.now());
  }

  // Token events
  public void logTokenRefresh(String username, long tokenExpirationSeconds) {
    log.info(
        "🔄 TOKEN REFRESHED | User: {} | Token expires in: {}s | Time: {}",
        username,
        tokenExpirationSeconds,
        Instant.now());
  }

  public void logTokenValidation(String username, String ipAddress) {
    log.debug(
        "🔐 TOKEN VALIDATED | User: {} | IP: {} | Time: {}", username, ipAddress, Instant.now());
  }

  // Security events
  public void logSecurityContextSet(
      String username, Collection<? extends GrantedAuthority> authorities) {
    log.info(
        "🔐 SECURITY CONTEXT SET | User: {} | Authorities: {} | Time: {}",
        username,
        authorities,
        Instant.now());
  }

  public void logSecurityContextCleared() {
    log.debug("🔓 SECURITY CONTEXT CLEARED | Time: {}", Instant.now());
  }

  // Cookie events
  public void logCookieSet(String cookieType, boolean secure, String domain) {
    log.debug(
        "🍪 COOKIE SET | Type: {} | Secure: {} | Domain: {} | Time: {}",
        cookieType,
        secure,
        domain,
        Instant.now());
  }

  public void logCookieNotFound(String cookieType) {
    log.warn("⚠️ COOKIE NOT FOUND | Type: {} | Time: {}", cookieType, Instant.now());
  }

  // Debug helpers
  public void logDebug(String message, Object... args) {
    if (log.isDebugEnabled()) {
      // Format message with emoji prefix
      String formattedMessage = "🔍 {}";

      // Create new array with message as first argument
      Object[] newArgs = new Object[args.length + 1];
      newArgs[0] = message;
      System.arraycopy(args, 0, newArgs, 1, args.length);

      log.debug(formattedMessage, newArgs);
    }
  }

  public void logAuthenticationAttempt() {
    log.info("=".repeat(80));
    log.info("AUTHENTICATION EVENT STARTED");
    log.info("=".repeat(80));
  }
}
