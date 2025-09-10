package com.aksi.exception.handler;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import lombok.extern.slf4j.Slf4j;

/**
 * Base class for all exception handlers providing common utility methods.
 * Follows DRY principle by centralizing common functionality.
 */
@Slf4j
public abstract class BaseExceptionHandler {

    /**
     * Get current request path safely with fallback handling.
     * Used across all exception handlers for consistent path extraction.
     *
     * @return Current request path or empty string if not available
     */
    protected String getCurrentPath() {
        try {
            RequestAttributes attrs = RequestContextHolder.getRequestAttributes();
            if (attrs instanceof ServletRequestAttributes sra) {
                String servletPath = sra.getRequest().getServletPath();
                return servletPath != null ? servletPath : "";
            }
        } catch (IllegalStateException e) {
            // No request context available (e.g., async processing, scheduled tasks)
            log.trace("Request path context not available: {}", e.getMessage());
        }
        return "";
    }

    /**
     * Get current request method safely with fallback handling.
     *
     * @return Current HTTP method or empty string if not available
     */
    protected String getCurrentMethod() {
        try {
            RequestAttributes attrs = RequestContextHolder.getRequestAttributes();
            if (attrs instanceof ServletRequestAttributes sra) {
                String method = sra.getRequest().getMethod();
                return method != null ? method : "";
            }
        } catch (IllegalStateException e) {
            // No request context available
            log.trace("Request method context not available: {}", e.getMessage());
        }
        return "";
    }

    /**
     * Get current user safely from Spring Security context.
     *
     * @return Current authenticated user or "anonymous" if not available
     */
    protected String getCurrentUser() {
        try {
            var authentication = SecurityContextHolder
                    .getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() &&
                !"anonymousUser".equals(authentication.getPrincipal())) {
                return authentication.getName();
            }
        } catch (RuntimeException e) {
            // Ignore security context errors - it's optional
            log.trace("Could not extract user context: {}", e.getMessage());
        }
        return "anonymous";
    }

    /**
     * Format request context for logging purposes.
     *
     * @return Formatted string with method and path
     */
    protected String getRequestContext() {
        String method = getCurrentMethod();
        String path = getCurrentPath();

        if (!method.isEmpty() && !path.isEmpty()) {
            return method + " " + path;
        } else if (!path.isEmpty()) {
            return path;
        } else {
            return "unknown";
        }
    }
}
