package com.aksi.config.security;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.lang.NonNull;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.aksi.domain.auth.exception.InvalidTokenException;
import com.aksi.domain.auth.service.JwtTokenService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * JWT Authentication Filter for AKSI system. Extracts JWT token from Authorization header and sets
 * authentication in Spring Security context.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private static final String AUTHORIZATION_HEADER = "Authorization";
  private static final String BEARER_PREFIX = "Bearer ";

  private final JwtTokenService jwtTokenService;

  @Override
  protected void doFilterInternal(
      @NonNull HttpServletRequest request,
      @NonNull HttpServletResponse response,
      @NonNull FilterChain filterChain)
      throws ServletException, IOException {

    try {
      // Extract JWT token from request
      String jwt = extractJwtFromRequest(request);

      if (StringUtils.hasText(jwt) && jwtTokenService.isTokenValid(jwt)) {
        // Get user data from token
        JwtTokenService.UserTokenData userData = jwtTokenService.getUserDataFromToken(jwt);

        // Create authentication token
        List<SimpleGrantedAuthority> authorities =
            userData.roles().stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                .collect(Collectors.toList());

        JwtAuthenticationToken authentication =
            new JwtAuthenticationToken(userData.userId(), userData.username(), authorities, jwt);
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        // Set authentication in security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        log.debug("JWT authentication successful for user: {}", userData.username());
      }
    } catch (InvalidTokenException e) {
      log.debug("JWT authentication failed: {}", e.getMessage());
      // Continue filter chain without setting authentication
    } catch (Exception e) {
      log.error("Unexpected error in JWT filter: ", e);
      // Continue filter chain without setting authentication
    }

    filterChain.doFilter(request, response);
  }

  /**
   * Extract JWT token from Authorization header.
   *
   * @param request HTTP request
   * @return JWT token or null if not found
   */
  private String extractJwtFromRequest(HttpServletRequest request) {
    String bearerToken = request.getHeader(AUTHORIZATION_HEADER);

    if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(BEARER_PREFIX)) {
      return bearerToken.substring(BEARER_PREFIX.length());
    }

    return null;
  }
}
