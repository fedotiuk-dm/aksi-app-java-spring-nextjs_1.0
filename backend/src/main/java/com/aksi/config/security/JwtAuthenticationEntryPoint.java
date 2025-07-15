package com.aksi.config.security;

import java.io.IOException;
import java.time.Instant;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.aksi.api.auth.dto.ErrorResponse;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * JWT Authentication Entry Point. Handles unauthorized requests and returns JSON error response.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

  private final ObjectMapper objectMapper;

  @Override
  public void commence(
      HttpServletRequest request,
      HttpServletResponse response,
      AuthenticationException authException)
      throws IOException, ServletException {

    log.debug("Unauthorized request to: {}", request.getRequestURI());

    ErrorResponse errorResponse = new ErrorResponse();
    errorResponse.setMessage("Токен автентифікації недійсний або відсутній");
    errorResponse.setTimestamp(Instant.now());
    errorResponse.setStatus(HttpStatus.UNAUTHORIZED.value());
    errorResponse.setError("UNAUTHORIZED");
    errorResponse.setPath(request.getRequestURI());

    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    response.setStatus(HttpStatus.UNAUTHORIZED.value());
    response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
  }
}
