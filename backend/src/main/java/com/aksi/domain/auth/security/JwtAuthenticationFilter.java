package com.aksi.domain.auth.security;

import java.io.IOException;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.aksi.domain.auth.service.JwtTokenService;
import com.aksi.domain.auth.service.UserDetailsProvider;
import com.aksi.domain.auth.util.CookieUtils;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
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

    // If no token found in cookies, continue filter chain
    if (jwt == null) {
      filterChain.doFilter(request, response);
      return;
    }

    try {
      // Extract username from token
      username = jwtTokenService.extractUsername(jwt);

      // If username exists and no authentication in context
      if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

        // Load user details
        UserDetails userDetails = userDetailsProvider.loadUserByUsername(username);

        // Validate token
        if (jwtTokenService.isTokenValid(jwt, userDetails)) {

          // Create authentication token
          UsernamePasswordAuthenticationToken authToken =
              new UsernamePasswordAuthenticationToken(
                  userDetails, null, userDetails.getAuthorities());

          // Set authentication details
          authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

          // Set authentication in context
          SecurityContextHolder.getContext().setAuthentication(authToken);

          log.debug("User {} authenticated successfully", username);
        }
      }
    } catch (Exception e) {
      log.error("JWT authentication failed: {}", e.getMessage());
    }

    filterChain.doFilter(request, response);
  }
}
