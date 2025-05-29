package com.aksi.config;

import java.util.stream.Stream;

import com.vaadin.flow.server.HandlerHelper;
import com.vaadin.flow.shared.ApplicationConstants;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Утиліти для безпеки Vaadin
 */
public final class SecurityUtils {

    private SecurityUtils() {
        // Utility class
    }

    /**
     * Перевіряє, чи є запит внутрішнім запитом Vaadin framework
     */
    public static boolean isFrameworkInternalRequest(HttpServletRequest request) {
        final String parameterValue = request.getParameter(ApplicationConstants.REQUEST_TYPE_PARAMETER);
        return parameterValue != null
            && Stream.of(HandlerHelper.RequestType.values())
                .anyMatch(r -> r.getIdentifier().equalsIgnoreCase(parameterValue));
    }
}
