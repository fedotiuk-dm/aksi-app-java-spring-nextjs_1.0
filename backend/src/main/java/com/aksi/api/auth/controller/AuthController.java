package com.aksi.api.auth.controller;

import java.time.Duration;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.auth.dto.AuthResponse;
import com.aksi.api.auth.dto.InternalAuthResponse;
import com.aksi.api.auth.dto.LoginRequest;
import com.aksi.api.auth.dto.LogoutResponse;
import com.aksi.api.auth.dto.RefreshTokenRequest;
import com.aksi.domain.auth.config.JwtProperties;
import com.aksi.domain.auth.service.AuthEventLogger;
import com.aksi.domain.auth.service.AuthService;
import com.aksi.domain.auth.util.CookieUtils;
import com.aksi.shared.validation.ValidationConstants;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Auth controller that uses httpOnly cookies for JWT tokens */
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;
  private final CookieUtils cookieUtils;
  private final JwtProperties jwtProperties;
  private final AuthEventLogger eventLogger;

  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(
      @Valid @RequestBody LoginRequest loginRequest,
      HttpServletResponse response,
      HttpServletRequest request) {

    eventLogger.logAuthenticationAttempt();
    eventLogger.logLoginRequest(
        loginRequest.getUsername(),
        request.getRemoteAddr(),
        request.getHeader(ValidationConstants.Web.USER_AGENT_HEADER));

    InternalAuthResponse internalAuthResponse = authService.authenticate(loginRequest);

    // Set httpOnly cookies
    cookieUtils.createAccessTokenCookie(
        response,
        internalAuthResponse.getAccessToken(),
        Duration.ofSeconds(jwtProperties.getAccessTokenExpirationSeconds()));

    eventLogger.logCookieSet(
        ValidationConstants.Web.ACCESS_TOKEN_COOKIE,
        cookieUtils.isSecureCookies(),
        cookieUtils.getCookieDomain());

    cookieUtils.createRefreshTokenCookie(
        response,
        internalAuthResponse.getRefreshToken(),
        Duration.ofSeconds(jwtProperties.getRefreshTokenExpirationSeconds()));

    eventLogger.logCookieSet(
        ValidationConstants.Web.REFRESH_TOKEN_COOKIE,
        cookieUtils.isSecureCookies(),
        cookieUtils.getCookieDomain());

    // Return response without tokens (they are in httpOnly cookies)
    AuthResponse safeResponse = new AuthResponse(internalAuthResponse.getExpiresIn());

    return ResponseEntity.ok(safeResponse);
  }

  @PostMapping("/logout")
  public ResponseEntity<LogoutResponse> logout(
      HttpServletRequest request, HttpServletResponse response) {

    // Get current user from SecurityContext before clearing
    String username =
        SecurityContextHolder.getContext().getAuthentication() != null
            ? SecurityContextHolder.getContext().getAuthentication().getName()
            : ValidationConstants.Web.UNKNOWN_USER;

    eventLogger.logLogoutRequest(
        username,
        request.getRemoteAddr(),
        request.getHeader(ValidationConstants.Web.USER_AGENT_HEADER));

    // Get access token from cookies
    String accessToken = cookieUtils.getAccessTokenFromCookies(request);

    if (accessToken == null) {
      eventLogger.logCookieNotFound(ValidationConstants.Web.ACCESS_TOKEN_COOKIE);
    }

    eventLogger.logDebug(
        ValidationConstants.Web.LOGOUT_TOKEN_CHECK,
        accessToken != null
            ? ValidationConstants.Web.TOKEN_PRESENT
            : ValidationConstants.Web.TOKEN_MISSING);

    if (accessToken != null) {
      authService.logout(accessToken);
    } else {
      eventLogger.logDebug(ValidationConstants.Web.NO_ACCESS_TOKEN_IN_COOKIES);
    }

    // Clear all auth cookies
    cookieUtils.clearAllAuthCookies(response);

    // Clear security context
    SecurityContextHolder.clearContext();

    eventLogger.logDebug(ValidationConstants.Web.COOKIES_CLEARED_FOR_USER, username);

    LogoutResponse logoutResponse = new LogoutResponse();
    logoutResponse.setSuccess(true);
    logoutResponse.setMessage(ValidationConstants.Messages.LOGOUT_SUCCESS_MESSAGE);

    return ResponseEntity.ok(logoutResponse);
  }

  @PostMapping("/refresh-token")
  public ResponseEntity<AuthResponse> refreshToken(
      HttpServletRequest request, HttpServletResponse response) {

    // Get refresh token from cookies
    String refreshToken = cookieUtils.getRefreshTokenFromCookies(request);

    if (refreshToken == null) {
      eventLogger.logCookieNotFound(ValidationConstants.Web.REFRESH_TOKEN_COOKIE);
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    // Create refresh token request
    RefreshTokenRequest refreshRequest = new RefreshTokenRequest();
    refreshRequest.setRefreshToken(refreshToken);

    // Refresh tokens
    InternalAuthResponse internalAuthResponse = authService.refreshToken(refreshRequest);

    // Update cookies with new tokens
    cookieUtils.createAccessTokenCookie(
        response,
        internalAuthResponse.getAccessToken(),
        Duration.ofSeconds(jwtProperties.getAccessTokenExpirationSeconds()));

    // Refresh token stays the same in this implementation

    eventLogger.logDebug(ValidationConstants.Web.TOKENS_REFRESHED_COOKIES_UPDATED);

    // Return response without tokens (they are in httpOnly cookies)
    AuthResponse safeResponse = new AuthResponse(internalAuthResponse.getExpiresIn());

    return ResponseEntity.ok(safeResponse);
  }
}
