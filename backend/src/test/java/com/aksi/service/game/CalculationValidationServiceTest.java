package com.aksi.service.game;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class CalculationValidationServiceTest {

    private final CalculationValidationService validationService = new CalculationValidationService();

    @Test
    @DisplayName("Should validate correct calculation parameters")
    void shouldValidateCorrectCalculationParameters() {
        // Given
        Integer basePrice = 1000; // $10.00
        int fromLevel = 1;
        int toLevel = 10;

        // When & Then - should not throw exception
        assertDoesNotThrow(() ->
            validationService.validateCalculationParameters(basePrice, fromLevel, toLevel));
    }

    @Test
    @DisplayName("VALIDATION: Should throw exception for null base price")
    void shouldThrowExceptionForNullBasePrice() {
        // Given
        Integer basePrice = null;
        int fromLevel = 1;
        int toLevel = 10;

        // When & Then
        var exception = assertThrows(IllegalArgumentException.class, () ->
            validationService.validateCalculationParameters(basePrice, fromLevel, toLevel));
        assertTrue(exception.getMessage().contains("Base price"));
    }

    @Test
    @DisplayName("VALIDATION: Should throw exception for negative base price")
    void shouldThrowExceptionForNegativeBasePrice() {
        // Given
        Integer basePrice = -1000; // Negative price
        int fromLevel = 1;
        int toLevel = 10;

        // When & Then
        var exception = assertThrows(IllegalArgumentException.class, () ->
            validationService.validateCalculationParameters(basePrice, fromLevel, toLevel));
        assertTrue(exception.getMessage().contains("Base price"));
    }

    @Test
    @DisplayName("VALIDATION: Should throw exception for invalid level range")
    void shouldThrowExceptionForInvalidLevelRange() {
        // Given
        Integer basePrice = 1000;
        int fromLevel = 10; // Higher than toLevel
        int toLevel = 5;

        // When & Then
        var exception = assertThrows(IllegalArgumentException.class, () ->
            validationService.validateCalculationParameters(basePrice, fromLevel, toLevel));
        assertTrue(exception.getMessage().contains("level"));
    }

    @Test
    @DisplayName("VALIDATION: Should throw exception for zero from level")
    void shouldThrowExceptionForZeroFromLevel() {
        // Given
        Integer basePrice = 1000;
        int fromLevel = 0; // Invalid zero level
        int toLevel = 10;

        // When & Then
        var exception = assertThrows(IllegalArgumentException.class, () ->
            validationService.validateCalculationParameters(basePrice, fromLevel, toLevel));
        assertTrue(exception.getMessage().contains("level"));
    }

    @Test
    @DisplayName("VALIDATION: Should throw exception for negative to level")
    void shouldThrowExceptionForNegativeToLevel() {
        // Given
        Integer basePrice = 1000;
        int fromLevel = 1;
        int toLevel = -5; // Invalid negative level

        // When & Then
        var exception = assertThrows(IllegalArgumentException.class, () ->
            validationService.validateCalculationParameters(basePrice, fromLevel, toLevel));
        assertTrue(exception.getMessage().contains("level"));
    }

    @Test
    @DisplayName("EDGE CASE: Should handle same from and to level")
    void shouldHandleSameFromAndToLevel() {
        // Given
        Integer basePrice = 1000;
        int fromLevel = 5;
        int toLevel = 5; // Same level

        // When & Then - should not throw exception
        assertDoesNotThrow(() ->
            validationService.validateCalculationParameters(basePrice, fromLevel, toLevel));
    }

    @Test
    @DisplayName("PERFORMANCE TEST: Should validate quickly")
    void shouldValidateQuickly() {
        // Given
        Integer basePrice = 1000;
        int fromLevel = 1;
        int toLevel = 100;

        // When
        long startTime = System.nanoTime();
        validationService.validateCalculationParameters(basePrice, fromLevel, toLevel);
        long endTime = System.nanoTime();

        // Then
        long durationMs = (endTime - startTime) / 1_000_000;
        assertTrue(durationMs < 1, "Validation took too long: " + durationMs + "ms");
    }
}
