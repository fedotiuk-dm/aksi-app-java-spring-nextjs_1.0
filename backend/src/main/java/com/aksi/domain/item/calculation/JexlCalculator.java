package com.aksi.domain.item.calculation;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;

import org.apache.commons.jexl3.JexlContext;
import org.apache.commons.jexl3.JexlEngine;
import org.apache.commons.jexl3.JexlExpression;
import org.apache.commons.jexl3.MapContext;

import com.aksi.domain.item.exception.FormulaCalculationException;

import lombok.extern.slf4j.Slf4j;

/** Calculator for evaluating JEXL formulas. */
@Slf4j
public class JexlCalculator {

  private final JexlEngine jexlEngine;
  private final String formula;
  private final JexlExpression expression;

  public JexlCalculator(JexlEngine jexlEngine, String formula) {
    this.jexlEngine = jexlEngine;
    this.formula = formula;
    this.expression = jexlEngine.createExpression(formula);
  }

  /**
   * Calculate result using provided context.
   *
   * @param context variables for calculation
   * @return calculated result
   */
  public BigDecimal calculate(Map<String, Object> context) {
    log.debug("Calculating formula: {} with context: {}", formula, context);

    try {
      // Create JEXL context
      JexlContext jexlContext = new MapContext(context);

      // Evaluate expression
      Object result = expression.evaluate(jexlContext);

      // Convert result to BigDecimal
      BigDecimal decimalResult;
      if (result instanceof BigDecimal) {
        decimalResult = (BigDecimal) result;
      } else if (result instanceof Number) {
        decimalResult = new BigDecimal(result.toString());
      } else {
        throw new IllegalStateException("Formula result is not a number: " + result);
      }

      // Round to 2 decimal places
      decimalResult = decimalResult.setScale(2, RoundingMode.HALF_UP);

      log.debug("Formula calculation result: {}", decimalResult);
      return decimalResult;

    } catch (Exception e) {
      log.error("Error calculating formula: {}", formula, e);
      throw new FormulaCalculationException("Failed to calculate formula: " + formula, e);
    }
  }

  /**
   * Validate formula syntax.
   *
   * @param jexlEngine JEXL engine
   * @param formula formula to validate
   * @return true if valid
   */
  public static boolean isValidFormula(JexlEngine jexlEngine, String formula) {
    try {
      jexlEngine.createExpression(formula);
      return true;
    } catch (Exception e) {
      log.warn("Invalid formula: {}", formula, e);
      return false;
    }
  }
}
