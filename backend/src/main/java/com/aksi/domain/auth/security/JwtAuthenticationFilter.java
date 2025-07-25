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
            "JwtAuthFilter - Cookies found: {} for path: {}",
            request.getCookies().length,
            request.getRequestURI());
        for (Cookie cookie : request.getCookies()) {
          log.debug(
              "Cookie: {} = {}...",
              cookie.getName(),
              cookie.getValue().substring(0, Math.min(20, cookie.getValue().length())));
        }
      } else {
        log.debug("JwtAuthFilter - No cookies in request for path: {}", request.getRequestURI());
      }
    }

    // If no token found in cookies, continue filter chain
    if (jwt == null) {
      log.debug(
          "JwtAuthFilter - No JWT token found in cookies for path: {}", request.getRequestURI());
      filterChain.doFilter(request, response);
      return;
    }

    log.debug("JwtAuthFilter - JWT token found for path: {}", request.getRequestURI());

    try {
      // Extract username from token
      username = jwtTokenService.extractUsername(jwt);
      log.debug("JwtAuthFilter - Username from token: {}", username);

      // If username exists and no authentication in context
      if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

        // Load user details
        UserDetails userDetails = userDetailsProvider.loadUserByUsername(username);
        log.debug("JwtAuthFilter - User details loaded for: {}", username);

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
          eventLogger.logDebug("Token is INVALID for user: {}", username);
        }
      } else {
        log.debug("JwtAuthFilter - Username is null or auth already exists");
      }
    } catch (Exception e) {
      log.error("JwtAuthFilter - Authentication error: {}", e.getMessage(), e);
    }

    filterChain.doFilter(request, response);
  }
}
