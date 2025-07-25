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
import com.aksi.api.auth.dto.LoginRequest;
import com.aksi.api.auth.dto.LogoutResponse;
import com.aksi.api.auth.dto.RefreshTokenRequest;
import com.aksi.domain.auth.config.JwtProperties;
import com.aksi.domain.auth.service.AuthEventLogger;
import com.aksi.domain.auth.service.AuthService;
import com.aksi.domain.auth.util.CookieUtils;

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
        loginRequest.getUsername(), request.getRemoteAddr(), request.getHeader("User-Agent"));

    AuthResponse authResponse = authService.authenticate(loginRequest);

    // Set httpOnly cookies
    cookieUtils.createAccessTokenCookie(
        response,
        authResponse.getAccessToken(),
        Duration.ofSeconds(jwtProperties.getAccessTokenExpirationSeconds()));

    eventLogger.logCookieSet("accessToken", false, null);

    cookieUtils.createRefreshTokenCookie(
        response,
        authResponse.getRefreshToken(),
        Duration.ofSeconds(jwtProperties.getRefreshTokenExpirationSeconds()));

    eventLogger.logCookieSet("refreshToken", false, null);

    // Return response without tokens (they are in httpOnly cookies)
    AuthResponse safeResponse =
        new AuthResponse(
            null, // Don't return tokens in response body
            null,
            authResponse.getTokenType(),
            authResponse.getExpiresIn());

    return ResponseEntity.ok(safeResponse);
  }

  @PostMapping("/logout")
  public ResponseEntity<LogoutResponse> logout(
      HttpServletRequest request, HttpServletResponse response) {

    // Get current user from SecurityContext before clearing
    String username =
        SecurityContextHolder.getContext().getAuthentication() != null
            ? SecurityContextHolder.getContext().getAuthentication().getName()
            : "Unknown";

    eventLogger.logLogoutRequest(
        username, request.getRemoteAddr(), request.getHeader("User-Agent"));

    // Get access token from cookies
    String accessToken = cookieUtils.getAccessTokenFromCookies(request);

    if (accessToken == null) {
      eventLogger.logCookieNotFound("accessToken");
    }

    eventLogger.logDebug(
        "LOGOUT - Access token from cookies: {}", accessToken != null ? "present" : "missing");

    if (accessToken != null) {
      // Create a fake Authorization header for the existing logout logic
      String fakeAuthHeader = "Bearer " + accessToken;
      authService.logout(fakeAuthHeader);
    } else {
      eventLogger.logDebug("No access token found in cookies, skipping token revocation");
    }

    // Clear all auth cookies
    cookieUtils.clearAllAuthCookies(response);

    // Clear security context
    SecurityContextHolder.clearContext();

    eventLogger.logDebug("Cookies cleared for user: {}", username);

    LogoutResponse logoutResponse = new LogoutResponse();
    logoutResponse.setSuccess(true);
    logoutResponse.setMessage("Successfully logged out");

    return ResponseEntity.ok(logoutResponse);
  }

  @PostMapping("/refresh-token")
  public ResponseEntity<AuthResponse> refreshToken(
      HttpServletRequest request, HttpServletResponse response) {

    // Get refresh token from cookies
    String refreshToken = cookieUtils.getRefreshTokenFromCookies(request);

    if (refreshToken == null) {
      eventLogger.logCookieNotFound("refreshToken");
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    // Create refresh token request
    RefreshTokenRequest refreshRequest = new RefreshTokenRequest();
    refreshRequest.setRefreshToken(refreshToken);

    // Refresh tokens
    AuthResponse authResponse = authService.refreshToken(refreshRequest);

    // Update cookies with new tokens
    cookieUtils.createAccessTokenCookie(
        response,
        authResponse.getAccessToken(),
        Duration.ofSeconds(jwtProperties.getAccessTokenExpirationSeconds()));

    // Refresh token stays the same in this implementation

    eventLogger.logDebug("Tokens refreshed successfully, cookies updated");

    // Return response without tokens (they are in httpOnly cookies)
    AuthResponse safeResponse =
        new AuthResponse(
            null, // Don't return tokens in response body
            null,
            authResponse.getTokenType(),
            authResponse.getExpiresIn());

    return ResponseEntity.ok(safeResponse);
  }
}
