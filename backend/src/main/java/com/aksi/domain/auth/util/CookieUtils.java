package com.aksi.domain.auth.util;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

/** Utility class for working with HTTP cookies for JWT authentication */
@Slf4j
@Component
public class CookieUtils {

  private static final String ACCESS_TOKEN_COOKIE = "accessToken";
  private static final String REFRESH_TOKEN_COOKIE = "refreshToken";
  private static final String COOKIE_PATH = "/";
  private static final String SAME_SITE_LAX = "Lax";

  @Value("${application.security.cookie.secure:false}")
  private boolean secureCookies;

  /** Create httpOnly cookie for access token */
  public void createAccessTokenCookie(
      HttpServletResponse response, String token, Duration expiration) {
    ResponseCookie cookie =
        ResponseCookie.from(ACCESS_TOKEN_COOKIE, token)
            .httpOnly(true)
            .secure(secureCookies) // Only over HTTPS in production
            .path(COOKIE_PATH)
            .maxAge(expiration)
            .sameSite(SAME_SITE_LAX)
            .build();

    response.addHeader("Set-Cookie", cookie.toString());
    log.debug("Access token cookie created with expiration: {}", expiration);
  }

  /** Create httpOnly cookie for refresh token */
  public void createRefreshTokenCookie(
      HttpServletResponse response, String token, Duration expiration) {
    ResponseCookie cookie =
        ResponseCookie.from(REFRESH_TOKEN_COOKIE, token)
            .httpOnly(true)
            .secure(secureCookies) // Only over HTTPS in production
            .path(COOKIE_PATH)
            .maxAge(expiration)
            .sameSite(SAME_SITE_LAX)
            .build();

    response.addHeader("Set-Cookie", cookie.toString());
    log.debug("Refresh token cookie created with expiration: {}", expiration);
  }

  /** Extract access token from cookies */
  public String getAccessTokenFromCookies(HttpServletRequest request) {
    return getCookieValue(request, ACCESS_TOKEN_COOKIE);
  }

  /** Extract refresh token from cookies */
  public String getRefreshTokenFromCookies(HttpServletRequest request) {
    return getCookieValue(request, REFRESH_TOKEN_COOKIE);
  }

  /** Clear access token cookie */
  public void clearAccessTokenCookie(HttpServletResponse response) {
    clearCookie(response, ACCESS_TOKEN_COOKIE);
  }

  /** Clear refresh token cookie */
  public void clearRefreshTokenCookie(HttpServletResponse response) {
    clearCookie(response, REFRESH_TOKEN_COOKIE);
  }

  /** Clear all authentication cookies */
  public void clearAllAuthCookies(HttpServletResponse response) {
    clearAccessTokenCookie(response);
    clearRefreshTokenCookie(response);
    log.debug("All authentication cookies cleared");
  }

  /** Get cookie value by name */
  private String getCookieValue(HttpServletRequest request, String cookieName) {
    if (request.getCookies() != null) {
      for (Cookie cookie : request.getCookies()) {
        if (cookieName.equals(cookie.getName())) {
          return cookie.getValue();
        }
      }
    }
    return null;
  }

  /** Clear specific cookie */
  private void clearCookie(HttpServletResponse response, String cookieName) {
    ResponseCookie cookie =
        ResponseCookie.from(cookieName, "")
            .httpOnly(true)
            .secure(secureCookies)
            .path(COOKIE_PATH)
            .maxAge(0) // Expire immediately
            .sameSite(SAME_SITE_LAX)
            .build();

    response.addHeader("Set-Cookie", cookie.toString());
    log.debug("Cookie {} cleared", cookieName);
  }
}
