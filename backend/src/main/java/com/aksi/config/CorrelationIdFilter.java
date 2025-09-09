package com.aksi.config;

import java.io.IOException;
import java.util.UUID;

import org.slf4j.MDC;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

/**
 * Filter that generates and manages correlation IDs for request tracing.
 * Supports both incoming correlation IDs from clients and generates new ones when needed.
 * Ensures correlation context is available throughout the entire request lifecycle.
 */
@Component
@Order(1) // Execute first to set up correlation context
@Slf4j
public class CorrelationIdFilter implements Filter {

  // Standard headers for correlation tracking
  public static final String CORRELATION_ID_HEADER = "X-Correlation-ID";
  public static final String TRACE_ID_HEADER = "X-Trace-ID";
  public static final String REQUEST_ID_HEADER = "X-Request-ID";

  // MDC keys for logging context
  public static final String CORRELATION_ID_KEY = "correlationId";
  public static final String TRACE_ID_KEY = "traceId";
  public static final String REQUEST_ID_KEY = "requestId";
  public static final String SESSION_ID_KEY = "sessionId";
  public static final String USER_ID_KEY = "userId";
  public static final String REQUEST_METHOD_KEY = "method";
  public static final String REQUEST_URI_KEY = "uri";

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
      throws IOException, ServletException {

    if (!(request instanceof HttpServletRequest httpRequest) ||
        !(response instanceof HttpServletResponse httpResponse)) {
      chain.doFilter(request, response);
      return;
    }

    try {
      // Setup correlation context
      setupCorrelationContext(httpRequest, httpResponse);

      // Log request start
      logRequestStart(httpRequest);

      // Process request
      long startTime = System.currentTimeMillis();
      chain.doFilter(request, response);
      long duration = System.currentTimeMillis() - startTime;

      // Log request completion
      logRequestEnd(httpRequest, httpResponse, duration);

    } finally {
      // Always clear MDC to prevent memory leaks
      clearCorrelationContext();
    }
  }

  /**
   * Setup correlation context for the current request.
   */
  private void setupCorrelationContext(HttpServletRequest request, HttpServletResponse response) {
    // Get or generate correlation ID
    String correlationId = getOrGenerateCorrelationId(request);
    String traceId = getOrGenerateTraceId(request, correlationId);
    String requestId = generateRequestId();

    // Set in MDC for logging
    MDC.put(CORRELATION_ID_KEY, correlationId);
    MDC.put(TRACE_ID_KEY, traceId);
    MDC.put(REQUEST_ID_KEY, requestId);
    MDC.put(REQUEST_METHOD_KEY, request.getMethod());
    MDC.put(REQUEST_URI_KEY, sanitizeUri(request.getRequestURI()));

    // Add session context if available
    if (request.getSession(false) != null) {
      MDC.put(SESSION_ID_KEY, request.getSession().getId());
    }

    // Add user context if available (from security context)
    addUserContextIfAvailable();

    // Add correlation headers to response for client tracing
    response.setHeader(CORRELATION_ID_HEADER, correlationId);
    response.setHeader(TRACE_ID_HEADER, traceId);
    response.setHeader(REQUEST_ID_HEADER, requestId);
  }

  /**
   * Get correlation ID from request headers or generate a new one.
   */
  private String getOrGenerateCorrelationId(HttpServletRequest request) {
    // Try different header names (support multiple standards)
    String correlationId = request.getHeader(CORRELATION_ID_HEADER);
    if (correlationId == null || correlationId.trim().isEmpty()) {
      correlationId = request.getHeader(TRACE_ID_HEADER);
    }
    if (correlationId == null || correlationId.trim().isEmpty()) {
      correlationId = request.getHeader(REQUEST_ID_HEADER);
    }
    if (correlationId == null || correlationId.trim().isEmpty()) {
      correlationId = request.getHeader("X-B3-TraceId"); // Zipkin standard
    }

    return (correlationId != null && !correlationId.trim().isEmpty())
        ? correlationId.trim()
        : generateUniqueId();
  }

  /**
   * Get or generate trace ID (can be same as correlation ID or different).
   */
  private String getOrGenerateTraceId(HttpServletRequest request, String correlationId) {
    String traceId = request.getHeader(TRACE_ID_HEADER);
    return (traceId != null && !traceId.trim().isEmpty())
        ? traceId.trim()
        : correlationId; // Use correlation ID as trace ID if not provided
  }

  /**
   * Generate a unique request ID for this specific request.
   */
  private String generateRequestId() {
    return generateUniqueId();
  }

  /**
   * Generate a unique ID using UUID (short format).
   */
  private String generateUniqueId() {
    return UUID.randomUUID().toString().replace("-", "").substring(0, 16);
  }

  /**
   * Sanitize URI for logging (remove sensitive parameters).
   */
  private String sanitizeUri(String uri) {
    if (uri == null) return "";

    // Remove sensitive information from URI
    return uri.replaceAll("([?&])(password|token|secret|key)=[^&]*", "$1$2=***")
              .replaceAll("([?&])(pwd|pass)=[^&]*", "$1$2=***");
  }

  /**
   * Add user context to MDC if security context is available.
   */
  private void addUserContextIfAvailable() {
    try {
      // Try to get user from Spring Security context
      var authentication = org.springframework.security.core.context.SecurityContextHolder
          .getContext().getAuthentication();

      if (authentication != null && authentication.isAuthenticated() &&
          !"anonymousUser".equals(authentication.getPrincipal())) {
        String userId = authentication.getName();
        if (userId != null && !userId.trim().isEmpty()) {
          MDC.put(USER_ID_KEY, userId);
        }
      }
    } catch (RuntimeException e) {
      // Ignore security context errors - it's optional
      log.debug("Could not extract user context: {}", e.getMessage());
    }
  }

  /**
   * Log request start with correlation context.
   */
  private void logRequestStart(HttpServletRequest request) {
    log.info("Request started: {} {} from {}",
        request.getMethod(),
        sanitizeUri(request.getRequestURI() +
            (request.getQueryString() != null ? "?" + request.getQueryString() : "")),
        getClientIpAddress(request));
  }

  /**
   * Log request completion with timing and status.
   */
  private void logRequestEnd(HttpServletRequest request, HttpServletResponse response, long duration) {
    log.info("Request completed: {} {} -> {} in {}ms",
        request.getMethod(),
        sanitizeUri(request.getRequestURI()),
        response.getStatus(),
        duration);
  }

  /**
   * Get client IP address handling proxies and load balancers.
   */
  private String getClientIpAddress(HttpServletRequest request) {
    String xForwardedFor = request.getHeader("X-Forwarded-For");
    if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
      return xForwardedFor.split(",")[0].trim();
    }

    String xRealIp = request.getHeader("X-Real-IP");
    if (xRealIp != null && !xRealIp.isEmpty()) {
      return xRealIp;
    }

    return request.getRemoteAddr();
  }

  /**
   * Clear all correlation context from MDC.
   */
  private void clearCorrelationContext() {
    MDC.remove(CORRELATION_ID_KEY);
    MDC.remove(TRACE_ID_KEY);
    MDC.remove(REQUEST_ID_KEY);
    MDC.remove(SESSION_ID_KEY);
    MDC.remove(USER_ID_KEY);
    MDC.remove(REQUEST_METHOD_KEY);
    MDC.remove(REQUEST_URI_KEY);
  }

}
