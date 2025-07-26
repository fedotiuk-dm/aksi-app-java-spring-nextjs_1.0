package com.aksi.shared.validation;

import lombok.experimental.UtilityClass;

/** Constants for validation across all layers (DB, Entity, DTO) */
@UtilityClass
public final class ValidationConstants {

  /** User field validation constants */
  public static final class User {
    /** Minimum length for username */
    public static final int USERNAME_MIN_LENGTH = 3;

    /** Maximum length for username */
    public static final int USERNAME_MAX_LENGTH = 50;

    /** Minimum length for email */
    public static final int EMAIL_MIN_LENGTH = 3;

    /** Maximum length for email */
    public static final int EMAIL_MAX_LENGTH = 100;

    /** Regular expression pattern for email validation */
    public static final String EMAIL_PATTERN = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";

    /** Minimum length for password */
    public static final int PASSWORD_MIN_LENGTH = 6;

    /** Maximum length for password */
    public static final int PASSWORD_MAX_LENGTH = 128;

    /** Minimum length for first name */
    public static final int FIRST_NAME_MIN_LENGTH = 1;

    /** Maximum length for first name */
    public static final int FIRST_NAME_MAX_LENGTH = 50;

    /** Minimum length for last name */
    public static final int LAST_NAME_MIN_LENGTH = 1;

    /** Maximum length for last name */
    public static final int LAST_NAME_MAX_LENGTH = 50;

    /** Maximum length for user role */
    public static final int ROLE_MAX_LENGTH = 20;

    /** Maximum number of failed login attempts before account lock */
    public static final int MAX_FAILED_LOGIN_ATTEMPTS = 5;

    /** Duration in minutes for account lock after exceeding failed attempts */
    public static final int ACCOUNT_LOCK_DURATION_MINUTES = 30;
  }

  /** Refresh token validation constants */
  public static final class RefreshToken {
    /** Maximum length for refresh token */
    public static final int TOKEN_MAX_LENGTH = 500;

    /** Maximum length for username in refresh token */
    public static final int USERNAME_MAX_LENGTH = User.USERNAME_MAX_LENGTH; // Use same as User

    /** Maximum length for device info */
    public static final int DEVICE_INFO_MAX_LENGTH = 255;

    /** Maximum length for IP address (supports IPv6) */
    public static final int IP_ADDRESS_MAX_LENGTH = 45; // Max IPv6 length
  }

  /** JWT token constants */
  public static final class Jwt {
    /** JWT claim key for token type */
    public static final String CLAIM_TYPE = "type";

    /** JWT claim key for user authorities */
    public static final String CLAIM_AUTHORITIES = "authorities";

    /** Token type value for refresh tokens */
    public static final String TOKEN_TYPE_REFRESH = "refresh";

    /** Log message template for JWT parsing errors */
    public static final String JWT_PARSING_ERROR = "JWT token parsing error: {}";
  }

  /** Validation error messages */
  public static final class Messages {
    /** Error message for empty username */
    public static final String USERNAME_EMPTY = "Username cannot be empty";

    /** Error message for username too short */
    public static final String USERNAME_TOO_SHORT = "Username must be at least %d characters long";

    /** Error message for username too long */
    public static final String USERNAME_TOO_LONG = "Username must not exceed %d characters";

    public static final String EMAIL_EMPTY = "Email cannot be empty";
    public static final String EMAIL_TOO_SHORT = "Email must be at least %d characters long";
    public static final String EMAIL_TOO_LONG = "Email must not exceed %d characters";
    public static final String EMAIL_INVALID_FORMAT = "Email format is invalid";

    public static final String PASSWORD_NULL = "Password cannot be null";
    public static final String PASSWORD_EMPTY = "Password cannot be empty";
    public static final String PASSWORD_TOO_SHORT = "Password must be at least %d characters long";
    public static final String PASSWORD_TOO_LONG = "Password must not exceed %d characters";
    public static final String PASSWORD_INCORRECT = "Current password is incorrect";

    public static final String REFRESH_TOKEN_EXPIRED = "Refresh token expired";
    public static final String REFRESH_TOKEN_REVOKED = "Refresh token revoked";
    public static final String INVALID_JWT_TOKEN = "Invalid JWT token";
    public static final String INVALID_CREDENTIALS = "Invalid username or password";

    public static final String USER_NOT_FOUND = "User not found: %s";
    public static final String USER_NOT_ACTIVE = "User is not active: %s";
    public static final String USER_LOCKED = "User is locked until: %s";

    // Auth service messages
    public static final String NON_EXISTENT_USER = "Non-existent user";
    public static final String USER_HAS_EXISTING_TOKEN =
        "User %s has existing active refresh token, revoking it";
    public static final String LOGOUT_INITIATED = "Logout initiated - Token present: %s";
    public static final String NO_TOKEN_FOR_LOGOUT = "No token provided for logout";
    public static final String LOGOUT_PROCESSING_FOR_USER = "Logout processing for user: %s";
    public static final String TOKEN_REFRESH_FAILED = "Token refresh failed";
    public static final String INVALID_REFRESH_TOKEN = "Invalid refresh token";

    // Auth controller messages
    public static final String LOGOUT_SUCCESS_MESSAGE = "Successfully logged out";

    // Refresh token service messages
    public static final String REFRESH_TOKEN_CREATED = "Created new refresh token for user: {}";
    public static final String REFRESH_TOKEN_NOT_FOUND = "Refresh token not found: {}";
    public static final String INVALID_REFRESH_TOKEN_ERROR = "Invalid refresh token";
    public static final String REFRESH_TOKEN_EXPIRED_FOR_USER =
        "Refresh token expired for user: {}";
    public static final String REFRESH_TOKEN_REVOKED_FOR_USER =
        "Refresh token revoked for user: {}";
    public static final String REFRESH_TOKENS_REVOKED_FOR_USER =
        "Revoked all refresh tokens for user: {}";
    public static final String EXPIRED_TOKENS_CLEANED = "Cleaned up expired refresh tokens";

    // Security constants
    public static final String ROLE_PREFIX = "ROLE_";
    public static final String ANONYMOUS_USER = "anonymousUser";
    public static final String ANONYMOUS_NAME = "Anonymous";

    // Exception messages
    public static final String DEFAULT_INVALID_CREDENTIALS = "Invalid username or password";
    public static final String DEFAULT_TOKEN_EXPIRED = "Token has expired";
    public static final String DEFAULT_INVALID_TOKEN = "Invalid token";

    // Entity validation messages
    public static final String USERNAME_CANNOT_BE_BLANK = "Username cannot be blank";
    public static final String USERNAME_SIZE_MESSAGE =
        "Username must be between {min} and {max} characters";
    public static final String EMAIL_CANNOT_BE_BLANK = "Email cannot be blank";
    public static final String EMAIL_SHOULD_BE_VALID = "Email should be valid";
    public static final String EMAIL_SIZE_MESSAGE =
        "Email must be between {min} and {max} characters";
    public static final String FIRST_NAME_CANNOT_BE_BLANK = "First name cannot be blank";
    public static final String FIRST_NAME_SIZE_MESSAGE =
        "First name must be between {min} and {max} characters";
    public static final String LAST_NAME_CANNOT_BE_BLANK = "Last name cannot be blank";
    public static final String LAST_NAME_SIZE_MESSAGE =
        "Last name must be between {min} and {max} characters";
  }

  /** Exception handling constants */
  public static final class Exceptions {
    // Error codes
    public static final String INVALID_CREDENTIALS_CODE = "INVALID_CREDENTIALS";
    public static final String TOKEN_EXPIRED_CODE = "TOKEN_EXPIRED";
    public static final String INVALID_TOKEN_CODE = "INVALID_TOKEN";

    // Log messages
    public static final String INVALID_CREDENTIALS_LOG = "Invalid credentials error: {}";
    public static final String TOKEN_EXPIRED_LOG = "Token expired error: {}";
    public static final String INVALID_TOKEN_LOG = "Invalid token error: {}";

    // Other
    public static final String URI_PREFIX = "uri=";

    // JWT Entry Point
    public static final String UNAUTHORIZED_ERROR = "Unauthorized error: {}";
    public static final String UNAUTHORIZED_CODE = "Unauthorized";
  }

  /** JWT Authentication Filter constants */
  public static final class JwtFilter {
    // Log messages
    public static final String COOKIES_FOUND = "JwtAuthFilter - Cookies found: {} for path: {}";
    public static final String COOKIE_DEBUG = "Cookie: {} = {}...";
    public static final String NO_COOKIES = "JwtAuthFilter - No cookies in request for path: {}";
    public static final String NO_JWT_TOKEN =
        "JwtAuthFilter - No JWT token found in cookies for path: {}";
    public static final String JWT_TOKEN_FOUND = "JwtAuthFilter - JWT token found for path: {}";
    public static final String USERNAME_FROM_TOKEN = "JwtAuthFilter - Username from token: {}";
    public static final String USER_DETAILS_LOADED = "JwtAuthFilter - User details loaded for: {}";
    public static final String TOKEN_INVALID = "Token is INVALID for user: {}";
    public static final String USERNAME_NULL_OR_AUTH_EXISTS =
        "JwtAuthFilter - Username is null or auth already exists";
    public static final String AUTHENTICATION_ERROR = "JwtAuthFilter - Authentication error: {}";

    // Constants
    public static final int COOKIE_VALUE_PREFIX_LENGTH = 20;
  }

  /** HTTP and Web constants */
  public static final class Web {
    public static final String USER_AGENT_HEADER = "User-Agent";
    public static final String UNKNOWN_USER = "Unknown";
    public static final String ACCESS_TOKEN_COOKIE = "accessToken";
    public static final String REFRESH_TOKEN_COOKIE = "refreshToken";
    public static final String COOKIE_PATH = "/";
    public static final String SET_COOKIE_HEADER = "Set-Cookie";

    // Log messages
    public static final String LOGOUT_TOKEN_CHECK = "LOGOUT - Access token from cookies: {}";
    public static final String TOKEN_PRESENT = "present";
    public static final String TOKEN_MISSING = "missing";
    public static final String NO_ACCESS_TOKEN_IN_COOKIES =
        "No access token found in cookies, skipping token revocation";
    public static final String COOKIES_CLEARED_FOR_USER = "Cookies cleared for user: {}";
    public static final String TOKENS_REFRESHED_COOKIES_UPDATED =
        "Tokens refreshed successfully, cookies updated";

    // Cookie utils log messages
    public static final String ACCESS_TOKEN_COOKIE_CREATED =
        "Access token cookie created | Expiration: {} | Secure: {} | Domain: {} | SameSite: {}";
    public static final String REFRESH_TOKEN_COOKIE_CREATED =
        "Refresh token cookie created | Expiration: {} | Secure: {} | Domain: {} | SameSite: {}";
    public static final String ALL_AUTH_COOKIES_CLEARED = "All authentication cookies cleared";
    public static final String COOKIE_CLEARED = "Cookie {} cleared";
  }

  /** Common validation patterns */
  public static final class Patterns {
    public static final String PHONE_PATTERN =
        "^\\+380[\\s\\-]?(\\(?\\d{2}\\)?[\\s\\-]?\\d{3}[\\s\\-]?\\d{2}[\\s\\-]?\\d{2}|\\d{9})$";
    public static final String POSTAL_CODE_PATTERN = "^\\d{5}$";
    public static final String URL_PATTERN = "^https?://[\\w\\-]+(\\.\\w\\-]+)+[/#?]?.*$";
    public static final String RECEIPT_PREFIX_PATTERN = "^[A-Z]+(-[A-Z0-9]+)?$";
  }

  /** Money validation */
  public static final class Money {
    public static final double MIN_VALUE = 0.0;
    public static final double MULTIPLE_OF = 0.01;
  }

  /** Controller constants */
  public static final class Controllers {
    // User controller log messages
    public static final String CREATING_USER = "Creating new user with username: {}";
    public static final String GETTING_USERS_LIST =
        "Getting users list with filters - page: {}, size: {}, branchId: {}, role: {}, isActive: {}";
    public static final String UNAUTHORIZED_ACCESS_ATTEMPT =
        "Unauthorized access attempt to getCurrentUser endpoint";
    public static final String GETTING_CURRENT_USER = "Getting current user info for: {}";
    public static final String GETTING_USER_BY_ID = "Getting user by ID: {}";
    public static final String UPDATING_USER = "Updating user: {}";
    public static final String CHANGING_PASSWORD = "Changing password for user: {}";
    public static final String UPDATING_USER_ROLE = "Updating role for user: {} to {}";
    public static final String UPDATING_USER_STATUS = "Updating status for user: {} to active={}";

    // Health check controller
    public static final String HEALTH_CHECK_STARTED = "=== HEALTH CHECK STARTED ===";
    public static final String HEALTH_CHECK_COMPLETED = "=== HEALTH CHECK COMPLETED ===";
    public static final String HEALTH_STATUS = "status";
    public static final String HEALTH_STATUS_UP = "UP";
    public static final String HEALTH_TIMESTAMP = "timestamp";
    public static final String HEALTH_ACTIVE_PROFILES = "activeProfiles";
    public static final String HEALTH_VERSION = "version";
    public static final String HEALTH_NAME = "name";
    public static final String HEALTH_CURRENT_USER = "currentUser";
    public static final String HEALTH_IS_AUTHENTICATED = "isAuthenticated";
    public static final String INFO_LOG_TEST = "INFO log test - This should be visible";
    public static final String DEBUG_LOG_TEST = "DEBUG log test - This may not be visible";
    public static final String WARN_LOG_TEST = "WARN log test - This should be visible";
    public static final String HEALTH_CHECK_DEBUG_MESSAGE = "Health check debug message";

    // Pagination defaults
    public static final int DEFAULT_PAGE = 0;
    public static final int DEFAULT_PAGE_SIZE = 20;

    // Security
    public static final String ROLE_ADMIN = "ADMIN";
    public static final String HAS_ROLE_ADMIN = "hasRole('ADMIN')";
  }

  /** Exception handler constants */
  public static final class ExceptionHandlers {
    // Error codes
    public static final String USER_NOT_FOUND_CODE = "USER_NOT_FOUND";
    public static final String USER_ALREADY_EXISTS_CODE = "USER_ALREADY_EXISTS";
    public static final String ACCESS_DENIED_CODE = "ACCESS_DENIED";
    public static final String INVALID_ARGUMENT_CODE = "INVALID_ARGUMENT";
    public static final String VALIDATION_FAILED_CODE = "VALIDATION_FAILED";
    public static final String INTERNAL_SERVER_ERROR_CODE = "INTERNAL_SERVER_ERROR";

    // Log messages
    public static final String USER_NOT_FOUND_LOG = "User not found: {}";
    public static final String USER_ALREADY_EXISTS_LOG = "User already exists: {}";
    public static final String ACCESS_DENIED_LOG = "Access denied: {}";
    public static final String INVALID_ARGUMENT_LOG = "Invalid argument: {}";
    public static final String VALIDATION_FAILED_LOG = "Validation failed: {}";
    public static final String UNHANDLED_RUNTIME_EXCEPTION_LOG = "Unhandled runtime exception";

    // Error messages
    public static final String ACCESS_DENIED_DEFAULT_MESSAGE =
        "You don't have permission to perform this action";
    public static final String VALIDATION_FAILED_MESSAGE =
        "Validation failed for one or more fields";
    public static final String INTERNAL_SERVER_ERROR_MESSAGE = "An unexpected error occurred";
  }

  /** Log message templates */
  public static final class LogTemplates {
    // Login events
    public static final String LOGIN_REQUEST =
        "🔑 LOGIN REQUEST | User: {} | IP: {} | User-Agent: {} | Time: {}";
    public static final String LOGIN_SUCCESS =
        "🟢 LOGIN SUCCESS | User: {} | Roles: {} | Token expires in: {}s | Active tokens: {} | Time: {}";
    public static final String LOGIN_FAILED = "🔴 LOGIN FAILED | User: {} | Reason: {} | Time: {}";

    // Logout events
    public static final String LOGOUT_REQUEST =
        "🚪 LOGOUT REQUEST | User: {} | IP: {} | User-Agent: {} | Time: {}";
    public static final String LOGOUT_SUCCESS = "🟠 LOGOUT SUCCESS | User: {} | Time: {}";
    public static final String LOGOUT_FAILED = "🔴 LOGOUT FAILED | Reason: {} | Time: {}";

    // Token events
    public static final String TOKEN_REFRESHED =
        "🔄 TOKEN REFRESHED | User: {} | Token expires in: {}s | Time: {}";
    public static final String TOKEN_VALIDATED =
        "🔐 TOKEN VALIDATED | User: {} | IP: {} | Time: {}";

    // Security events
    public static final String SECURITY_CONTEXT_SET =
        "🔐 SECURITY CONTEXT SET | User: {} | Authorities: {} | Time: {}";
    public static final String SECURITY_CONTEXT_CLEARED = "🔓 SECURITY CONTEXT CLEARED | Time: {}";

    // Cookie events
    public static final String COOKIE_SET =
        "🍪 COOKIE SET | Type: {} | Secure: {} | Domain: {} | Time: {}";
    public static final String COOKIE_NOT_FOUND = "⚠️ COOKIE NOT FOUND | Type: {} | Time: {}";

    // Debug
    public static final String DEBUG_PREFIX = "🔍 {}";

    // Auth event
    public static final String AUTH_EVENT_SEPARATOR = "=".repeat(80);
    public static final String AUTH_EVENT_STARTED = "AUTHENTICATION EVENT STARTED";
  }
}
