package com.aksi.service.game.calculation.util;

/**
 * Constants used throughout the calculation system.
 * Centralized location for all calculation-related constants.
 */
public final class CalculationConstants {

    // Private constructor to prevent instantiation
    private CalculationConstants() {
        throw new UnsupportedOperationException("Utility class cannot be instantiated");
    }

    // Response constants
    public static final class Response {
        public static final String DEFAULT_CURRENCY = "USD";
        public static final String ERROR_FORMULA_VERSION = "ERROR";
        public static final int DEFAULT_EXECUTION_TIME_MS = 0;
        public static final int DEFAULT_MODIFIERS_COUNT = 0;
        public static final int DEFAULT_LEVEL_DIFFERENCE = 0;
        public static final int DEFAULT_BASE_PRICE = 0;
        public static final int DEFAULT_FINAL_PRICE = 0;

        private Response() {
            throw new UnsupportedOperationException("Utility class cannot be instantiated");
        }
    }

    // Formula type constants
    public static final class FormulaType {
        public static final String LINEAR = "LINEAR";
        public static final String RANGE = "RANGE";
        public static final String TIME_BASED = "TIME_BASED";
        public static final String FORMULA = "FORMULA";
        public static final String UNIVERSAL = "UNIVERSAL";

        private FormulaType() {
            throw new UnsupportedOperationException("Utility class cannot be instantiated");
        }
    }

    // Calculation limits and defaults
    public static final class Limits {
        public static final int MIN_LEVEL = 1;
        public static final int MAX_LEVEL = 9999;
        public static final int MIN_BASE_PRICE = 0;
        public static final int MAX_BASE_PRICE = Integer.MAX_VALUE;
        public static final int MIN_MODIFIER_VALUE = Integer.MIN_VALUE;
        public static final int MAX_MODIFIER_VALUE = Integer.MAX_VALUE;

        private Limits() {
            throw new UnsupportedOperationException("Utility class cannot be instantiated");
        }
    }

    // Error messages
    public static final class ErrorMessages {
        public static final String FORMULA_NULL = "Formula cannot be null";
        public static final String BASE_PRICE_NULL = "Base price cannot be null";
        public static final String CONTEXT_NULL = "Calculation context is required";
        public static final String START_LEVEL_NULL = "Start level is required";
        public static final String TARGET_LEVEL_NULL = "Target level is required";
        public static final String GAME_NOT_FOUND = "Game not found: %s";
        public static final String SERVICE_TYPE_NOT_FOUND = "Service type not found: %s for game: %s";
        public static final String NO_STRATEGY_FOUND = "No calculation strategy found for formula type: %s";
        public static final String INSUFFICIENT_PARAMETERS = "Formula is required when additional parameters are insufficient";
        public static final String CALCULATION_FAILED = "Price calculation failed: %s";
        public static final String NEGATIVE_FINAL_PRICE = "Calculation failed: negative or zero final price";

        private ErrorMessages() {
            throw new UnsupportedOperationException("Utility class cannot be instantiated");
        }
    }

    // Logging messages
    public static final class LogMessages {
        public static final String CALCULATION_START = "Starting price calculation for formulaType={}, startLevel={}, targetLevel={}";
        public static final String CALCULATION_SUCCESS = "Price calculation completed successfully: basePrice={}, modifiers={}, finalPrice={}, executionTime={}ms";
        public static final String CALCULATION_ERROR = "Failed to calculate price: {}";
        public static final String MODIFIER_APPLIED = "Applied modifier {}: {} {} (price: {} -> {})";
        public static final String STRATEGY_SELECTED = "Selected calculation strategy: {}";

        private LogMessages() {
            throw new UnsupportedOperationException("Utility class cannot be instantiated");
        }
    }

    // Modifier calculation constants
    public static final class Modifier {
        public static final int PERCENTAGE_BASE = 100;
        public static final int MIN_PERCENTAGE_DIVISOR = 1;
        public static final int MIN_LEVEL_MULTIPLIER = 1;

        private Modifier() {
            throw new UnsupportedOperationException("Utility class cannot be instantiated");
        }
    }

    // Universal calculator constants
    public static final class Universal {
        public static final String BASE_PRICE_PARAM = "basePrice";
        public static final String LEVEL_DIFF_PARAM = "levelDiff";
        public static final String DEFAULT_EXPRESSION = "basePrice + levelDiff";

        private Universal() {
            throw new UnsupportedOperationException("Utility class cannot be instantiated");
        }
    }
}
