package com.aksi.domain.auth.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.auth.dto.AuthResponse;
import com.aksi.api.auth.dto.LoginRequest;
import com.aksi.api.auth.dto.RefreshTokenRequest;
import com.aksi.domain.auth.config.JwtProperties;
import com.aksi.domain.auth.entity.RefreshTokenEntity;
import com.aksi.domain.auth.exception.InvalidCredentialsException;
import com.aksi.domain.auth.exception.InvalidTokenException;
import com.aksi.domain.user.service.UserService;

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

  /** Authenticate user and generate tokens */
  public AuthResponse authenticate(LoginRequest request) {
    try {
      // Check if user exists
      if (!userDetailsProvider.existsByUsername(request.getUsername())) {
        log.warn("Authentication attempt for non-existent user: {}", request.getUsername());
        throw new InvalidCredentialsException("Invalid username or password");
      }

      // Authenticate user
      Authentication authentication =
          authenticationManager.authenticate(
              new UsernamePasswordAuthenticationToken(
                  request.getUsername(), request.getPassword()));

      UserDetails userDetails = (UserDetails) authentication.getPrincipal();

      // Check if user already has active refresh token
      RefreshTokenEntity existingToken =
          refreshTokenService.findActiveByUsername(userDetails.getUsername());
      if (existingToken != null) {
        log.info(
            "User {} has existing active refresh token, revoking it", userDetails.getUsername());
      }

      // Generate tokens
      String accessToken = jwtTokenService.generateAccessToken(userDetails);
      RefreshTokenEntity refreshToken =
          refreshTokenService.createRefreshToken(userDetails.getUsername());

      // Log active tokens count
      long activeTokens = refreshTokenService.countActiveTokens(userDetails.getUsername());
      log.info(
          "User {} successfully authenticated. Active tokens: {}",
          userDetails.getUsername(),
          activeTokens);

      // Handle successful login
      userService.handleSuccessfulLogin(userDetails.getUsername());

      // Build response
      return new AuthResponse(
          accessToken,
          refreshToken.getToken(),
          AuthResponse.TokenTypeEnum.BEARER,
          (int) jwtProperties.getAccessTokenExpirationSeconds());

    } catch (Exception e) {
      log.error("Authentication failed for user: {}", request.getUsername(), e);

      // Handle failed login attempt
      if (e instanceof InvalidCredentialsException
          || e.getCause()
              instanceof org.springframework.security.authentication.BadCredentialsException) {
        userService.handleFailedLogin(request.getUsername());
      }

      throw new InvalidCredentialsException("Invalid username or password");
    }
  }

  /** Logout user and revoke tokens */
  public void logout(String authHeader) {
    try {
      // Extract username from token
      String token = extractTokenFromHeader(authHeader);
      String username = jwtTokenService.extractUsername(token);

      // Revoke all user tokens
      refreshTokenService.revokeUserTokens(username);

      // Clear security context
      SecurityContextHolder.clearContext();

      log.info("User {} successfully logged out", username);

    } catch (Exception e) {
      log.error("Logout failed", e);
      throw new InvalidTokenException("Invalid token");
    }
  }

  /** Refresh access token using refresh token */
  public AuthResponse refreshToken(RefreshTokenRequest request) {
    try {
      // Find and verify refresh token
      RefreshTokenEntity refreshToken = refreshTokenService.findByToken(request.getRefreshToken());
      refreshToken = refreshTokenService.verifyExpiration(refreshToken);

      // Load user details
      UserDetails userDetails = userDetailsProvider.loadUserByUsername(refreshToken.getUsername());

      // Generate new access token
      String newAccessToken = jwtTokenService.generateAccessToken(userDetails);

      log.info("Access token refreshed for user: {}", refreshToken.getUsername());

      // Build response
      return new AuthResponse(
          newAccessToken,
          refreshToken.getToken(),
          AuthResponse.TokenTypeEnum.BEARER,
          (int) jwtProperties.getAccessTokenExpirationSeconds());

    } catch (Exception e) {
      log.error("Token refresh failed", e);
      throw new InvalidTokenException("Invalid refresh token");
    }
  }

  /** Extract token from Authorization header */
  private String extractTokenFromHeader(String authHeader) {
    if (authHeader != null && authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7);
    }
    throw new InvalidTokenException("Invalid authorization header");
  }
}
