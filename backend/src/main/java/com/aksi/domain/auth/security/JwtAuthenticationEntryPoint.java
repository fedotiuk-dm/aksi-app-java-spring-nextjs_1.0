package com.aksi.domain.auth.security;

import java.io.IOException;
import java.time.Instant;

import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

/** JWT authentication entry point for handling authentication errors */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

  private final ObjectMapper objectMapper;

  @Override
  public void commence(
      HttpServletRequest request,
      HttpServletResponse response,
      AuthenticationException authException)
      throws IOException {

    log.error("Unauthorized error: {}", authException.getMessage());

    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

    // Create error response
    ErrorResponse errorResponse = new ErrorResponse();
    errorResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    errorResponse.setError("Unauthorized");
    errorResponse.setMessage(authException.getMessage());
    errorResponse.setPath(request.getRequestURI());
    errorResponse.setTimestamp(Instant.now());

    objectMapper.writeValue(response.getOutputStream(), errorResponse);
  }

  /** Error response DTO */
  @Setter
  @Getter
  private static class ErrorResponse {
    // Getters and setters
    private int status;
    private String error;
    private String message;
    private String path;
    private Instant timestamp;
  }
}
