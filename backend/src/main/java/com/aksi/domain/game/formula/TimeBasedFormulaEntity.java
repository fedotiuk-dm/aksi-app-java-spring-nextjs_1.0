package com.aksi.domain.game.formula;


import java.util.Objects;

import com.aksi.api.game.dto.CalculationFormula.TypeEnum;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

/**
 * Time-based calculation formula: hourlyRate × estimatedHours × complexityMultiplier
 * Used for services where time is the main cost factor.
 * Example:
 * hourlyRate = 2000 cents/hour ($20)
 * baseHours = 8 hours
 * hoursPerLevel = 1 hour per level
 * complexityMultiplier = 1.5
 * For levels 1-10: 8 + (9 × 1) = 17 hours
 * Result: 2000 × 17 × 1.5 = 51000 cents ($510)
 */
@Setter
@Getter
public class TimeBasedFormulaEntity extends CalculationFormulaEntity {

  // Гетери та сетери
  @JsonProperty("hourlyRate")
    private Integer hourlyRate;

    @JsonProperty("baseHours")
    private int baseHours;

    @JsonProperty("hoursPerLevel")
    private int hoursPerLevel;

    @JsonProperty("complexityMultiplier")
    private Float complexityMultiplier;

    @JsonProperty("minimumHours")
    private Integer minimumHours;

    @JsonProperty("roundToHours")
    private boolean roundToHours;

    // Конструктори
    public TimeBasedFormulaEntity() {
        super(TypeEnum.TIME_BASED);
        this.complexityMultiplier = 1.0f;
        this.roundToHours = true;
    }

  @Override
    public Integer calculate(Integer basePrice, int fromLevel, int toLevel) {
        if (basePrice == null) {
            throw new IllegalArgumentException("Base price cannot be null");
        }
        if (hourlyRate == null) {
            throw new IllegalArgumentException("Hourly rate cannot be null");
        }

        int finalEstimatedHours = calculateEstimatedHours(fromLevel, toLevel);

        // Calculate time cost with integer arithmetic
        // Convert complexityMultiplier to integer percentage (1.5 = 150%)
        int complexityPercent = complexityMultiplier != null ?
            Math.round(complexityMultiplier * 100.0f) : 100;

        long timeCost = (long) hourlyRate * finalEstimatedHours * complexityPercent / 100;

        return basePrice + (int) timeCost;
    }

    /**
     * Calculate the final estimated hours based on level difference and configuration.
     *
     * @param fromLevel starting level
     * @param toLevel target level
     * @return final estimated hours after applying minimum hours and rounding if needed
     */
    private int calculateEstimatedHours(int fromLevel, int toLevel) {
        int levelDiff = Math.max(0, toLevel - fromLevel);
        int rawEstimatedHours = baseHours + (levelDiff * hoursPerLevel);

        // Застосувати мінімальні години
        int minHours = minimumHours != null ? minimumHours : 1;
        int finalEstimatedHours = Math.max(minHours, rawEstimatedHours);

        // Округлення до повних годин якщо потрібно
        if (roundToHours) {
            finalEstimatedHours = (int) (double) finalEstimatedHours;
            finalEstimatedHours = Math.max(minHours, finalEstimatedHours);
        }

        return finalEstimatedHours;
    }

    @Override
    public void validate() {
        if (hourlyRate == null) {
            throw new IllegalArgumentException("Hourly rate is required for TimeBasedFormula");
        }
        if (hourlyRate <= 0) {
            throw new IllegalArgumentException("Hourly rate must be positive");
        }
        if (baseHours < 0) {
            throw new IllegalArgumentException("Base hours cannot be negative");
        }
        if (hoursPerLevel < 0) {
            throw new IllegalArgumentException("Hours per level cannot be negative");
        }
        if (complexityMultiplier != null && complexityMultiplier <= 0.0f) {
            throw new IllegalArgumentException("Complexity multiplier must be positive");
        }
        if (minimumHours != null && minimumHours <= 0) {
            throw new IllegalArgumentException("Minimum hours must be positive");
        }
    }

  @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        TimeBasedFormulaEntity that = (TimeBasedFormulaEntity) o;
        return baseHours == that.baseHours &&
               hoursPerLevel == that.hoursPerLevel &&
               roundToHours == that.roundToHours &&
               Objects.equals(hourlyRate, that.hourlyRate) &&
               Objects.equals(complexityMultiplier, that.complexityMultiplier) &&
               Objects.equals(minimumHours, that.minimumHours);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), hourlyRate, baseHours, hoursPerLevel,
                           complexityMultiplier, minimumHours, roundToHours);
    }

    @Override
    public String toString() {
        return String.format("TimeBasedFormula{hourlyRate=%s, baseHours=%d, hoursPerLevel=%d, complexityMultiplier=%s}",
                            hourlyRate, baseHours, hoursPerLevel, complexityMultiplier);
    }
}
