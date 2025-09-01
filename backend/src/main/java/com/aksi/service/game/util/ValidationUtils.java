package com.aksi.service.game.util;

import org.springframework.util.StringUtils;

import com.aksi.exception.BadRequestException;
import com.aksi.exception.ConflictException;

import lombok.extern.slf4j.Slf4j;

/**
 * Common validation utilities for game services. Provides reusable validation patterns to reduce
 * code duplication.
 */
@Slf4j
public final class ValidationUtils {

  private ValidationUtils() {
    // Utility class
  }

  // ===== STRING VALIDATION =====

  /**
   * Validate that string is not null, empty or whitespace-only.
   *
   * @param value String value to validate
   * @param fieldName Field name for error message
   * @throws BadRequestException if validation fails
   */
  public static void validateRequired(String value, String fieldName) {
    if (!StringUtils.hasText(value)) {
      throw new BadRequestException(fieldName + " is required");
    }
  }

  /**
   * Validate string length constraints.
   *
   * @param value String value to validate
   * @param fieldName Field name for error message
   * @param minLength Minimum length (inclusive)
   * @param maxLength Maximum length (inclusive)
   * @throws BadRequestException if validation fails
   */
  public static void validateLength(String value, String fieldName, int minLength, int maxLength) {
    if (value.length() < minLength || value.length() > maxLength) {
      throw new BadRequestException(
          fieldName + " must be between " + minLength + " and " + maxLength + " characters");
    }
  }

  /**
   * Validate string format using regex pattern.
   *
   * @param value String value to validate
   * @param fieldName Field name for error message
   * @param pattern Regex pattern
   * @param errorMessage Custom error message
   * @throws BadRequestException if validation fails
   */
  public static void validatePattern(
      String value, String fieldName, String pattern, String errorMessage) {
    if (!value.matches(pattern)) {
      throw new BadRequestException(errorMessage);
    }
  }

  /**
   * Validate code format (uppercase letters, numbers, underscores).
   *
   * @param code Code to validate
   * @param fieldName Field name for error message
   * @throws BadRequestException if validation fails
   */
  public static void validateCodeFormat(String code, String fieldName) {
    validatePattern(
        code,
        fieldName,
        "^[A-Z0-9_]+$",
        fieldName + " must contain only uppercase letters, numbers, and underscores");
  }

  // ===== NUMERIC VALIDATION =====

  /**
   * Validate that number is not null.
   *
   * @param value Number value to validate
   * @param fieldName Field name for error message
   * @throws BadRequestException if validation fails
   */
  public static void validateRequired(Number value, String fieldName) {
    if (value == null) {
      throw new BadRequestException(fieldName + " is required");
    }
  }

  /**
   * Validate integer range.
   *
   * @param value Integer value to validate
   * @param fieldName Field name for error message
   * @param minValue Minimum value (inclusive)
   * @param maxValue Maximum value (inclusive)
   * @throws BadRequestException if validation fails
   */
  public static void validateRange(Integer value, String fieldName, int minValue, int maxValue) {
    if (value < minValue || value > maxValue) {
      throw new BadRequestException(
          fieldName + " must be between " + minValue + " and " + maxValue);
    }
  }

  // ===== ENTITY EXISTENCE VALIDATION =====

  /**
   * Validate that entity exists by checking boolean result.
   *
   * @param exists Boolean result from existence check
   * @param entityType Entity type name for error message
   * @param identifier Entity identifier
   * @throws BadRequestException if entity doesn't exist
   */
  public static void validateEntityExists(boolean exists, String entityType, Object identifier) {
    if (!exists) {
      throw new BadRequestException(entityType + " not found: " + identifier);
    }
  }

  // ===== UNIQUENESS VALIDATION =====

  /**
   * Validate field uniqueness for creation.
   *
   * @param exists Boolean result from existence check
   * @param fieldName Field name for error message
   * @param fieldValue Field value
   * @throws ConflictException if field is not unique
   */
  public static void validateUniqueness(boolean exists, String fieldName, String fieldValue) {
    if (exists) {
      log.error("{} '{}' already exists", fieldName, fieldValue);
      throw new ConflictException(fieldName + " '" + fieldValue + "' already exists");
    }
  }

  /**
   * Validate field uniqueness for updates (excluding current entity).
   *
   * @param exists Boolean result from existence check
   * @param fieldName Field name for error message
   * @param fieldValue Field value
   * @throws ConflictException if field is not unique
   */
  public static void validateUniquenessForUpdate(
      boolean exists, String fieldName, String fieldValue) {
    if (exists) {
      log.error("{} '{}' already exists for another entity", fieldName, fieldValue);
      throw new ConflictException(
          fieldName + " '" + fieldValue + "' already exists for another entity");
    }
  }

  // ===== EMAIL VALIDATION =====

  /**
   * Validate email format if provided.
   *
   * @param email Email to validate (nullable)
   * @param fieldName Field name for error message
   * @throws BadRequestException if validation fails
   */
  public static void validateEmail(String email, String fieldName) {
    if (email != null && !email.trim().isEmpty()) {
      validateLength(email, fieldName, 0, 255);

      validatePattern(
          email,
          fieldName,
          "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
          "Invalid " + fieldName.toLowerCase() + " format");
    }
  }

  // ===== DISCORD USERNAME VALIDATION =====

  /**
   * Validate Discord username format.
   *
   * @param username Discord username to validate
   * @param fieldName Field name for error message
   * @throws BadRequestException if validation fails
   */
  public static void validateDiscordUsername(String username, String fieldName) {
    validateRequired(username, fieldName);
    validateLength(username, fieldName, 0, 100);

    validatePattern(
        username, fieldName, "^[a-zA-Z0-9._-]+$", fieldName + " contains invalid characters");
  }
}
