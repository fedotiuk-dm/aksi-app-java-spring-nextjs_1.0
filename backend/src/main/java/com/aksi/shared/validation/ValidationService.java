package com.aksi.shared.validation;

import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

/** Centralized validation service using validation constants */
@Service
public class ValidationService {

  private static final Pattern EMAIL_PATTERN =
      Pattern.compile(ValidationConstants.User.EMAIL_PATTERN);

  /**
   * Validate username
   *
   * @param username username to validate
   * @return validation error message or null if valid
   */
  public String validateUsername(String username) {
    return validateLength(
        username,
        ValidationConstants.User.USERNAME_MIN_LENGTH,
        ValidationConstants.User.USERNAME_MAX_LENGTH,
        ValidationConstants.Messages.USERNAME_EMPTY,
        ValidationConstants.Messages.USERNAME_TOO_SHORT,
        ValidationConstants.Messages.USERNAME_TOO_LONG);
  }

  /**
   * Validate email format
   *
   * @param email email to validate
   * @return validation error message or null if valid
   */
  public String validateEmail(String email) {
    // First check length validation
    String lengthError =
        validateLength(
            email,
            ValidationConstants.User.EMAIL_MIN_LENGTH,
            ValidationConstants.User.EMAIL_MAX_LENGTH,
            ValidationConstants.Messages.EMAIL_EMPTY,
            ValidationConstants.Messages.EMAIL_TOO_SHORT,
            ValidationConstants.Messages.EMAIL_TOO_LONG);

    if (lengthError != null) {
      return lengthError;
    }

    // Then check pattern
    return EMAIL_PATTERN.matcher(email).matches()
        ? null
        : ValidationConstants.Messages.EMAIL_INVALID_FORMAT;
  }

  /**
   * Validate password
   *
   * @param password password to validate
   * @return validation error message or null if valid
   */
  public String validatePassword(String password) {
    // Special handling for null password
    if (password == null) {
      return ValidationConstants.Messages.PASSWORD_NULL;
    }

    return validateLength(
        password,
        ValidationConstants.User.PASSWORD_MIN_LENGTH,
        ValidationConstants.User.PASSWORD_MAX_LENGTH,
        ValidationConstants.Messages.PASSWORD_NULL,
        ValidationConstants.Messages.PASSWORD_TOO_SHORT,
        ValidationConstants.Messages.PASSWORD_TOO_LONG);
  }

  /**
   * Validate user creation request
   *
   * @throws IllegalArgumentException if validation fails
   */
  public void validateUserCreation(String username, String email, String password) {
    String error;
    if ((error = validateUsername(username)) != null) throw new IllegalArgumentException(error);
    if ((error = validateEmail(email)) != null) throw new IllegalArgumentException(error);
    if ((error = validatePassword(password)) != null) throw new IllegalArgumentException(error);
  }

  /**
   * Validate field and throw exception if invalid
   *
   * @throws IllegalArgumentException if validation fails
   */
  public void requireValid(String value, java.util.function.Function<String, String> validator) {
    String error = validator.apply(value);
    if (error != null) {
      throw new IllegalArgumentException(error);
    }
  }

  /** Generic validation method to reduce duplication */
  private String validateLength(
      String value,
      int minLength,
      int maxLength,
      String emptyMessage,
      String tooShortMessage,
      String tooLongMessage) {
    if (value == null || value.trim().isEmpty()) {
      return emptyMessage;
    }

    int length = value.length();
    if (length < minLength) {
      return String.format(tooShortMessage, minLength);
    }

    if (length > maxLength) {
      return String.format(tooLongMessage, maxLength);
    }

    return null;
  }

  /**
   * Validate login credentials (username and password)
   *
   * @return error message or null if valid
   */
  public String validateLoginCredentials(String username, String password) {
    if (username == null || username.trim().isEmpty()) {
      return ValidationConstants.Messages.USERNAME_EMPTY;
    }

    if (password == null || password.trim().isEmpty()) {
      return ValidationConstants.Messages.PASSWORD_EMPTY;
    }

    return null;
  }

  /** Check if string is null or empty */
  public static boolean isNullOrEmpty(String value) {
    return value == null || value.trim().isEmpty();
  }
}
