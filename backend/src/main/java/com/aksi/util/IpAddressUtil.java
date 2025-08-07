package com.aksi.util;

import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Utility class for extracting client IP addresses from HTTP requests, handling various proxy
 * headers.
 */
@Component
public class IpAddressUtil {

  private static final String X_FORWARDED_FOR = "X-Forwarded-For";
  private static final String X_REAL_IP = "X-Real-IP";
  private static final String X_ORIGINAL_FORWARDED_FOR = "X-Original-Forwarded-For";
  private static final String FORWARDED = "Forwarded";
  private static final String FORWARDED_FOR = "Forwarded-For";
  private static final String X_FORWARDED = "X-Forwarded";
  private static final String X_CLUSTER_CLIENT_IP = "X-Cluster-Client-Ip";
  private static final String CLIENT_IP = "Client-Ip";
  private static final String CF_CONNECTING_IP = "CF-Connecting-IP";
  private static final String TRUE_CLIENT_IP = "True-Client-IP";

  private final HttpServletRequest request;

  public IpAddressUtil(HttpServletRequest request) {
    this.request = request;
  }

  /**
   * Get client IP address from the current request, handling proxy headers. Checks multiple headers
   * in order of preference.
   *
   * @return client IP address
   */
  public String getClientIpAddress() {
    // Check X-Forwarded-For (most common)
    String ip = getIpFromHeader(X_FORWARDED_FOR);
    if (isValidIp(ip)) return ip;

    // Check X-Real-IP
    ip = request.getHeader(X_REAL_IP);
    if (isValidIp(ip)) return ip;

    // Check Cloudflare headers
    ip = request.getHeader(CF_CONNECTING_IP);
    if (isValidIp(ip)) return ip;

    ip = request.getHeader(TRUE_CLIENT_IP);
    if (isValidIp(ip)) return ip;

    // Check other proxy headers
    ip = getIpFromHeader(X_ORIGINAL_FORWARDED_FOR);
    if (isValidIp(ip)) return ip;

    ip = getIpFromHeader(FORWARDED_FOR);
    if (isValidIp(ip)) return ip;

    ip = getIpFromHeader(X_FORWARDED);
    if (isValidIp(ip)) return ip;

    ip = getIpFromHeader(X_CLUSTER_CLIENT_IP);
    if (isValidIp(ip)) return ip;

    ip = request.getHeader(CLIENT_IP);
    if (isValidIp(ip)) return ip;

    // Parse Forwarded header (RFC 7239)
    ip = parseForwardedHeader();
    if (isValidIp(ip)) return ip;

    // Fall back to remote address
    return request.getRemoteAddr();
  }

  /**
   * Get IP from header that may contain multiple IPs. Returns the first IP in the list (original
   * client).
   */
  private String getIpFromHeader(String headerName) {
    String header = request.getHeader(headerName);
    if (header == null || header.isEmpty()) {
      return null;
    }

    // Header can contain multiple IPs separated by comma
    // The first one is the original client
    int commaIndex = header.indexOf(',');
    if (commaIndex > 0) {
      return header.substring(0, commaIndex).trim();
    }

    return header.trim();
  }

  /**
   * Parse the Forwarded header according to RFC 7239. Example: Forwarded: for=192.0.2.43,
   * for=198.51.100.17
   */
  private String parseForwardedHeader() {
    String forwarded = request.getHeader(FORWARDED);
    if (forwarded == null || forwarded.isEmpty()) {
      return null;
    }

    // Look for "for=" parameter
    String[] parts = forwarded.split(";");
    for (String part : parts) {
      String trimmed = part.trim();
      if (trimmed.toLowerCase().startsWith("for=")) {
        String forValue = trimmed.substring(4);

        // Remove quotes if present
        if (forValue.startsWith("\"") && forValue.endsWith("\"")) {
          forValue = forValue.substring(1, forValue.length() - 1);
        }

        // Remove port if present
        int portIndex = forValue.lastIndexOf(':');
        if (portIndex > 0) {
          // Check if it's IPv6 by looking for multiple colons
          if (forValue.indexOf(':') != portIndex) {
            // IPv6, don't remove anything
            return forValue;
          } else {
            // IPv4 with port
            return forValue.substring(0, portIndex);
          }
        }

        return forValue;
      }
    }

    return null;
  }

  /** Validate if the given string is a valid IP address. */
  private boolean isValidIp(String ip) {
    return ip != null && !ip.isEmpty() && !ip.equalsIgnoreCase("unknown");
  }
}
