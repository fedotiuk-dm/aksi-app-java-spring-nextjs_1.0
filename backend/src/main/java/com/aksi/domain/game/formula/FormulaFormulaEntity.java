package com.aksi.domain.game.formula;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.aksi.api.game.dto.CalculationFormula.TypeEnum;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

/**
 * Formula calculation based on mathematical expressions with variables.
 * Supports complex formulas using variables.
 * <p>
 * Example:
 * expression = "basePrice + (levelDiff * pricePerLevel * multiplier)"
 * variables = {"multiplier": 1.5}
 * Result: basePrice + (levelDiff × pricePerLevel × 1.5)
 */
public class FormulaFormulaEntity extends CalculationFormulaEntity {

  @Setter
  @Getter
  @JsonProperty("expression")
    private String expression;

    @JsonProperty("variables")
    private Map<String, BigDecimal> variables = new HashMap<>();

    // Pattern for finding variables in expression
    private static final Pattern VARIABLE_PATTERN = Pattern.compile("\\b([a-zA-Z_][a-zA-Z0-9_]*)\\b");

    // Конструктори
    public FormulaFormulaEntity() {
        super(TypeEnum.FORMULA);
    }

  @Override
    public BigDecimal calculate(BigDecimal basePrice, int fromLevel, int toLevel) {
        if (basePrice == null) {
            throw new IllegalArgumentException("Base price cannot be null");
        }
        if (expression == null || expression.trim().isEmpty()) {
            throw new IllegalArgumentException("Expression cannot be null or empty");
        }

        // Prepare variable context
        Map<String, BigDecimal> context = prepareVariableContext(basePrice, fromLevel, toLevel);

        // Process expression
        String processedExpression = replaceVariables(expression, context);

        // Calculate result
        return evaluateExpression(processedExpression);
    }

    /**
     * Prepare variable context for calculation
     */
    private Map<String, BigDecimal> prepareVariableContext(BigDecimal basePrice, int fromLevel, int toLevel) {
        Map<String, BigDecimal> context = new HashMap<>();

        // Standard variables
        context.put("basePrice", basePrice);
        context.put("fromLevel", BigDecimal.valueOf(fromLevel));
        context.put("toLevel", BigDecimal.valueOf(toLevel));
        context.put("levelDiff", BigDecimal.valueOf(Math.max(0, toLevel - fromLevel)));

        // Add custom variables
        if (variables != null) {
            context.putAll(variables);
        }

        return context;
    }

    /**
     * Replace variables in expression with their values
     */
    private String replaceVariables(String expr, Map<String, BigDecimal> context) {
        String result = expr;

        Matcher matcher = VARIABLE_PATTERN.matcher(expr);
        while (matcher.find()) {
            String varName = matcher.group(1);
            BigDecimal value = context.get(varName);
            if (value != null) {
                result = result.replaceAll("\\b" + Pattern.quote(varName) + "\\b", value.toString());
            }
        }

        return result;
    }

    /**
     * Evaluate simple mathematical expression
     * Supports: +, -, *, /, (, )
     */
    private BigDecimal evaluateExpression(String expr) {
        try {
            // Simplify expression (in real project better to use JEval-like library)
            String cleaned = expr.replaceAll("\\s+", "");

            // Simple calculator for basic operations
            return evaluateSimpleExpression(cleaned);
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to evaluate expression: " + expr, e);
        }
    }

    /**
     * Простий калькулятор для базових математичних операцій
     * Це базова реалізація, в продакшені краще використати спеціалізовану бібліотеку
     */
    private BigDecimal evaluateSimpleExpression(String expr) {
        // Для демонстрації підтримуємо тільки прості операції
        // basePrice + levelDiff * 100
        if (expr.contains("+") || expr.contains("-") || expr.contains("*") || expr.contains("/")) {
            // Розділити на частини та обчислити
            return evaluateArithmeticExpression(expr);
        }

        // Якщо це просто число
        try {
            return new BigDecimal(expr);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Unsupported expression format: " + expr);
        }
    }

    /**
     * Evaluate arithmetic expression
     */
    private BigDecimal evaluateArithmeticExpression(String expr) {
        // Simplify implementation - in real project use JEval or similar library
        try {
            // Try to evaluate using JavaScript engine (temporary solution)
            javax.script.ScriptEngine engine = new javax.script.ScriptEngineManager().getEngineByName("JavaScript");
            Object result = engine.eval(expr);

            if (result instanceof Number) {
                return BigDecimal.valueOf(((Number) result).doubleValue());
            }

            throw new IllegalArgumentException("Expression result is not a number: " + result);

        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to evaluate arithmetic expression: " + expr, e);
        }
    }

    @Override
    public void validate() {
        if (expression == null || expression.trim().isEmpty()) {
            throw new IllegalArgumentException("Expression is required for FormulaFormula");
        }

        // Check for required variables
        Matcher matcher = VARIABLE_PATTERN.matcher(expression);
        while (matcher.find()) {
            String varName = matcher.group(1);
            // Skip standard variables
            if (!isStandardVariable(varName)) {
                if (variables == null || !variables.containsKey(varName)) {
                    throw new IllegalArgumentException("Variable '" + varName + "' is not defined");
                }
            }
        }
    }

    /**
     * Check if this is a standard variable
     */
    private boolean isStandardVariable(String varName) {
        return "basePrice".equals(varName) ||
               "fromLevel".equals(varName) ||
               "toLevel".equals(varName) ||
               "levelDiff".equals(varName);
    }

  public Map<String, BigDecimal> getVariables() {
        return new HashMap<>(variables);
    }



    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        FormulaFormulaEntity that = (FormulaFormulaEntity) o;
        return Objects.equals(expression, that.expression) &&
               Objects.equals(variables, that.variables);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), expression, variables);
    }

    @Override
    public String toString() {
        return String.format("FormulaFormula{expression='%s', variables=%s}", expression, variables);
    }
}
