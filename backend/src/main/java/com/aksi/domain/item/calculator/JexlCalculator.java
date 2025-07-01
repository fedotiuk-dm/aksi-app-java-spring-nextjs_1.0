package com.aksi.domain.item.calculator;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.jexl3.JexlBuilder;
import org.apache.commons.jexl3.JexlContext;
import org.apache.commons.jexl3.JexlEngine;
import org.apache.commons.jexl3.JexlExpression;
import org.apache.commons.jexl3.MapContext;
import org.springframework.stereotype.Component;

import com.aksi.api.item.dto.CalculationStep;
import com.aksi.domain.item.entity.PriceModifierEntity;
import com.aksi.shared.service.CalculationStepBuilder;

import lombok.extern.slf4j.Slf4j;

/**
 * JEXL калькулятор для складних правил (10% випадків) Обробляє модифікатори з jexlFormula
 * ВИКОРИСТОВУЄ DTO CalculationStep (OpenAPI First!).
 */
@Component
@Slf4j
public class JexlCalculator {

  private final JexlEngine jexl;

  public JexlCalculator() {
    this.jexl = new JexlBuilder().cache(512).strict(false).silent(false).create();
  }

  /** Розрахувати ціну з JEXL модифікаторами. */
  public CalculationResult calculate(
      Double basePrice, List<PriceModifierEntity> modifiers, Map<String, Object> context) {
    log.debug("JEXL calculation for base price: {} with {} modifiers", basePrice, modifiers.size());

    List<CalculationStep> steps = new ArrayList<>();
    Double currentPrice = basePrice;

    // Створити JEXL контекст
    JexlContext jexlContext = createJexlContext(currentPrice, context);

    // Застосувати кожен модифікатор послідовно
    for (PriceModifierEntity modifier : modifiers) {
      try {
        Double previousPrice = currentPrice;
        currentPrice = applyJexlModifier(currentPrice, modifier, jexlContext);

        // Оновити контекст з новою ціною
        jexlContext.set("currentPrice", currentPrice);

        // Створити крок розрахунку (DTO!)
        CalculationStep step =
            CalculationStepBuilder.createJexlStep(
                modifier, currentPrice - previousPrice, currentPrice);

        steps.add(step);
        log.debug(
            "Applied JEXL modifier {}: {} -> {}", modifier.getCode(), previousPrice, currentPrice);

      } catch (Exception e) {
        log.error("Error applying JEXL modifier {}: {}", modifier.getCode(), e.getMessage());

        return CalculationResult.builder()
            .basePrice(basePrice)
            .finalPrice(currentPrice)
            .totalModification(currentPrice - basePrice)
            .steps(steps)
            .success(false)
            .errorMessage("JEXL error: " + e.getMessage())
            .build();
      }
    }

    return CalculationResult.builder()
        .basePrice(basePrice)
        .finalPrice(currentPrice)
        .totalModification(currentPrice - basePrice)
        .steps(steps)
        .success(true)
        .build();
  }

  /** Застосувати один JEXL модифікатор. */
  private Double applyJexlModifier(
      Double currentPrice, PriceModifierEntity modifier, JexlContext context) {
    String formula = modifier.getJexlFormula();
    if (formula == null || formula.trim().isEmpty()) {
      log.warn("Empty JEXL formula for modifier {}, using entity method", modifier.getCode());
      return modifier.applyToPrice(currentPrice);
    }

    // Парсити та виконати JEXL вираз
    JexlExpression expression = jexl.createExpression(formula);
    Object result = expression.evaluate(context);

    if (result instanceof Number number) {
      return number.doubleValue();
    } else {
      log.warn("JEXL result is not a number for modifier {}: {}", modifier.getCode(), result);
      return currentPrice;
    }
  }

  /** Створити JEXL контекст. */
  private JexlContext createJexlContext(
      Double currentPrice, Map<String, Object> additionalContext) {
    JexlContext context = new MapContext();

    // Основні змінні
    context.set("currentPrice", currentPrice);
    context.set("basePrice", currentPrice);

    // Додаткові змінні з контексту
    if (additionalContext != null) {
      additionalContext.forEach(context::set);
    }

    // JEXL функції
    context.set("math", Math.class);
    context.set("min", (java.util.function.BinaryOperator<Double>) Math::min);
    context.set("max", (java.util.function.BinaryOperator<Double>) Math::max);

    return context;
  }

  /** Перевірити чи може обробити модифікатор. */
  public boolean canHandle(PriceModifierEntity modifier) {
    return modifier.hasJexlFormula();
  }

  /** Перевірити чи може обробити всі модифікатори. */
  public boolean canHandleAll(List<PriceModifierEntity> modifiers) {
    return modifiers.stream().allMatch(this::canHandle);
  }

  /** Fallback розрахунок без додаткового контексту. */
  public CalculationResult calculate(Double basePrice, List<PriceModifierEntity> modifiers) {
    return calculate(basePrice, modifiers, new HashMap<>());
  }
}
