package com.aksi.domain.auth.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.auth.dto.InternalAuthResponse;
import com.aksi.api.auth.dto.LoginRequest;
import com.aksi.api.auth.dto.RefreshTokenRequest;
import com.aksi.domain.auth.config.JwtProperties;
import com.aksi.domain.auth.entity.RefreshTokenEntity;
import com.aksi.domain.auth.exception.InvalidCredentialsException;
import com.aksi.domain.auth.exception.InvalidTokenException;
import com.aksi.domain.user.service.UserService;
import com.aksi.shared.validation.ValidationConstants;
import com.aksi.shared.validation.ValidationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Main authentication service */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

  private final AuthenticationManager authenticationManager;
  private final UserDetailsProvider userDetailsProvider;
  private final JwtTokenService jwtTokenService;
  private final RefreshTokenService refreshTokenService;
  private final JwtProperties jwtProperties;
  private final UserService userService;
  private final AuthEventLogger eventLogger;
  private final ValidationService validationService;

  /** Authenticate user and generate tokens */
  public InternalAuthResponse authenticate(LoginRequest request) {
    // Validate input
    validateLoginRequest(request);

    try {
      // Check if user exists
      if (!userDetailsProvider.existsByUsername(request.getUsername())) {
        eventLogger.logLoginFailure(
            request.getUsername(), ValidationConstants.Messages.NON_EXISTENT_USER);
        throw new InvalidCredentialsException(ValidationConstants.Messages.INVALID_CREDENTIALS);
      }

      // Authenticate user
      Authentication authentication =
          authenticationManager.authenticate(
              new UsernamePasswordAuthenticationToken(
                  request.getUsername(), request.getPassword()));

      UserDetails userDetails = (UserDetails) authentication.getPrincipal();

      // Check if user already has active refresh token
      refreshTokenService
          .findActiveByUsername(userDetails.getUsername())
          .ifPresent(
              existingToken ->
                  eventLogger.logDebug(
                      ValidationConstants.Messages.USER_HAS_EXISTING_TOKEN,
                      userDetails.getUsername()));

      // Generate tokens
      String accessToken = jwtTokenService.generateAccessToken(userDetails);
      RefreshTokenEntity refreshToken =
          refreshTokenService.createRefreshToken(userDetails.getUsername());

      // Log active tokens count
      long activeTokens = refreshTokenService.countActiveTokens(userDetails.getUsername());
      eventLogger.logLoginSuccess(
          userDetails.getUsername(),
          userDetails.getAuthorities(),
          jwtProperties.getAccessTokenExpirationSeconds(),
          activeTokens);

      // Handle successful login
      userService.handleSuccessfulLogin(userDetails.getUsername());

      // Build response
      return new InternalAuthResponse(
          accessToken,
          refreshToken.getToken(),
          (int) jwtProperties.getAccessTokenExpirationSeconds());

    } catch (Exception e) {
      eventLogger.logLoginFailure(request.getUsername(), e.getMessage());

      // Handle failed login attempt
      if (e instanceof InvalidCredentialsException
          || e.getCause()
              instanceof org.springframework.security.authentication.BadCredentialsException) {
        userService.handleFailedLogin(request.getUsername());
      }

      throw new InvalidCredentialsException(ValidationConstants.Messages.INVALID_CREDENTIALS);
    }
  }

  private void validateLoginRequest(LoginRequest request) {
    // Basic credentials validation
    String error =
        validationService.validateLoginCredentials(request.getUsername(), request.getPassword());
    if (error != null) {
      throw new InvalidCredentialsException(error);
    }

    // Additional validation for email format if username looks like email
    if (request.getUsername().contains("@")) {
      String emailError = validationService.validateEmail(request.getUsername());
      if (emailError != null) {
        throw new InvalidCredentialsException(emailError);
      }
    }
  }

  /** Logout user and revoke tokens */
  public void logout(String accessToken) {
    eventLogger.logDebug(
        ValidationConstants.Messages.LOGOUT_INITIATED,
        accessToken != null && !accessToken.isEmpty());

    if (ValidationService.isNullOrEmpty(accessToken)) {
      eventLogger.logDebug(ValidationConstants.Messages.NO_TOKEN_FOR_LOGOUT);
      return;
    }

    try {
      // Extract username from token
      String username = jwtTokenService.extractUsername(accessToken);

      eventLogger.logDebug(ValidationConstants.Messages.LOGOUT_PROCESSING_FOR_USER, username);

      // Revoke all user tokens
      refreshTokenService.revokeUserTokens(username);

      // Clear security context
      SecurityContextHolder.clearContext();
      eventLogger.logSecurityContextCleared();

      eventLogger.logLogoutSuccess(username);

    } catch (Exception e) {
      eventLogger.logLogoutFailure(e.getMessage());
      // Don't throw exception on logout failure - just log it
      log.warn("Logout failed but continuing: {}", e.getMessage());
    }
  }

  /** Refresh access token using refresh token */
  public InternalAuthResponse refreshToken(RefreshTokenRequest request) {
    try {
      // Find and verify refresh token
      RefreshTokenEntity refreshToken = refreshTokenService.findByToken(request.getRefreshToken());
      refreshToken = refreshTokenService.verifyExpiration(refreshToken);

      // Load user details
      UserDetails userDetails = userDetailsProvider.loadUserByUsername(refreshToken.getUsername());

      // Generate new access token
      String newAccessToken = jwtTokenService.generateAccessToken(userDetails);

      eventLogger.logTokenRefresh(
          refreshToken.getUsername(), jwtProperties.getAccessTokenExpirationSeconds());

      // Build response
      return new InternalAuthResponse(
          newAccessToken,
          refreshToken.getToken(),
          (int) jwtProperties.getAccessTokenExpirationSeconds());

    } catch (Exception e) {
      log.error(ValidationConstants.Messages.TOKEN_REFRESH_FAILED, e);
      throw new InvalidTokenException(ValidationConstants.Messages.INVALID_REFRESH_TOKEN);
    }
  }
}
