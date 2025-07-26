package com.aksi.domain.auth.security;

import java.io.IOException;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.aksi.domain.auth.service.AuthEventLogger;
import com.aksi.domain.auth.service.JwtTokenService;
import com.aksi.domain.auth.service.UserDetailsProvider;
import com.aksi.domain.auth.util.CookieUtils;
import com.aksi.shared.validation.ValidationConstants;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** JWT authentication filter */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private final JwtTokenService jwtTokenService;
  private final UserDetailsProvider userDetailsProvider;
  private final CookieUtils cookieUtils;
  private final AuthEventLogger eventLogger;

  @Override
  protected void doFilterInternal(
      @NonNull HttpServletRequest request,
      @NonNull HttpServletResponse response,
      @NonNull FilterChain filterChain)
      throws ServletException, IOException {

    final String jwt;
    final String username;

    // Extract JWT token from httpOnly cookie
    jwt = cookieUtils.getAccessTokenFromCookies(request);

    // Debug logging for troubleshooting
    if (log.isDebugEnabled()) {
      if (request.getCookies() != null) {
        log.debug(
            ValidationConstants.JwtFilter.COOKIES_FOUND,
            request.getCookies().length,
            request.getRequestURI());
        for (Cookie cookie : request.getCookies()) {
          log.debug(
              ValidationConstants.JwtFilter.COOKIE_DEBUG,
              cookie.getName(),
              cookie
                  .getValue()
                  .substring(
                      0,
                      Math.min(
                          ValidationConstants.JwtFilter.COOKIE_VALUE_PREFIX_LENGTH,
                          cookie.getValue().length())));
        }
      } else {
        log.debug(ValidationConstants.JwtFilter.NO_COOKIES, request.getRequestURI());
      }
    }

    // If no token found in cookies, continue filter chain
    if (jwt == null) {
      log.debug(ValidationConstants.JwtFilter.NO_JWT_TOKEN, request.getRequestURI());
      filterChain.doFilter(request, response);
      return;
    }

    log.debug(ValidationConstants.JwtFilter.JWT_TOKEN_FOUND, request.getRequestURI());

    try {
      // Extract username from token
      username = jwtTokenService.extractUsername(jwt);
      log.debug(ValidationConstants.JwtFilter.USERNAME_FROM_TOKEN, username);

      // If username exists and no authentication in context
      if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

        // Load user details
        UserDetails userDetails = userDetailsProvider.loadUserByUsername(username);
        log.debug(ValidationConstants.JwtFilter.USER_DETAILS_LOADED, username);

        // Validate token
        if (jwtTokenService.isTokenValid(jwt, userDetails)) {
          eventLogger.logTokenValidation(username, request.getRemoteAddr());

          // Create authentication token
          UsernamePasswordAuthenticationToken authToken =
              new UsernamePasswordAuthenticationToken(
                  userDetails, null, userDetails.getAuthorities());

          // Set authentication details
          authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

          // Set authentication in context
          SecurityContextHolder.getContext().setAuthentication(authToken);

          eventLogger.logSecurityContextSet(username, userDetails.getAuthorities());
        } else {
          eventLogger.logDebug(ValidationConstants.JwtFilter.TOKEN_INVALID, username);
        }
      } else {
        log.debug(ValidationConstants.JwtFilter.USERNAME_NULL_OR_AUTH_EXISTS);
      }
    } catch (Exception e) {
      log.error(ValidationConstants.JwtFilter.AUTHENTICATION_ERROR, e.getMessage(), e);
    }

    filterChain.doFilter(request, response);
  }
}
