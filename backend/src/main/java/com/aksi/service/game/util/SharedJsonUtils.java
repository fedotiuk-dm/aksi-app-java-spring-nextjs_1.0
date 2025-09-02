package com.aksi.service.game.util;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

/**
 * Shared utility class for JSON operations across all game services.
 * Eliminates ObjectMapper duplication between CalculationValidationUtils and GameCalculationUtils.
 */
@Component
@Slf4j
public class SharedJsonUtils {

  private final ObjectMapper objectMapper = new ObjectMapper();

  /**
   * Parse JSON string to JsonNode with unified error handling.
   *
   * @param jsonString JSON string to parse
   * @return Parsed JsonNode or null if parsing fails
   */
  public JsonNode parseJson(String jsonString) {
    if (jsonString == null || jsonString.trim().isEmpty()) {
      return null;
    }

    try {
      return objectMapper.readTree(jsonString);
    } catch (JsonProcessingException e) {
      log.error("Failed to parse JSON: {}", jsonString, e);
      return null;
    }
  }

  /**
   * Parse JSON string to JsonNode with custom error message.
   *
   * @param jsonString JSON string to parse
   * @param context Context for error message
   * @return Parsed JsonNode
   * @throws IllegalArgumentException if parsing fails
   */
  public JsonNode parseJsonOrThrow(String jsonString, String context) {
    JsonNode node = parseJson(jsonString);
    if (node == null) {
      throw new IllegalArgumentException("Invalid JSON for " + context + ": " + jsonString);
    }
    return node;
  }

  /**
   * Validate that JsonNode is an object.
   *
   * @param node Node to validate
   * @param context Context for error message
   * @throws IllegalArgumentException if not an object
   */
  public void validateObject(JsonNode node, String context) {
    if (!node.isObject()) {
      throw new IllegalArgumentException(context + " must be a JSON object");
    }
  }

  /**
   * Validate that JsonNode is an array.
   *
   * @param node Node to validate
   * @param context Context for error message
   * @throws IllegalArgumentException if not an array
   */
  public void validateArray(JsonNode node, String context) {
    if (!node.isArray()) {
      throw new IllegalArgumentException(context + " must be a JSON array");
    }
  }

  /**
   * Check if JsonNode has a specific field.
   *
   * @param node Node to check
   * @param fieldName Field name
   * @return true if field exists
   */
  public boolean hasField(JsonNode node, String fieldName) {
    return node != null && node.has(fieldName);
  }

  /**
   * Get field value as text, with fallback.
   *
   * @param node Node to get field from
   * @param fieldName Field name
   * @param defaultValue Default value if field missing
   * @return Field value or default
   */
  public String getTextField(JsonNode node, String fieldName, String defaultValue) {
    if (!hasField(node, fieldName)) {
      return defaultValue;
    }
    return node.get(fieldName).asText(defaultValue);
  }

}
