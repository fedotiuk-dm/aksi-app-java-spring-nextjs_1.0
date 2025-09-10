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
 * complexityMultiplier = 150 (150% = 1.5x)
 * For levels 1-10: 8 + (9 × 1) = 17 hours
 * Result: 2000 × 17 × 150 / 100 = 51000 cents ($510)
 */
@Setter
@Getter
public class TimeBasedFormulaEntity extends CalculationFormulaEntity {

    @JsonProperty("hourlyRate")
    private Integer hourlyRate;

    @JsonProperty("baseHours")
    private int baseHours;

    @JsonProperty("hoursPerLevel")
    private int hoursPerLevel;

    @JsonProperty("complexityMultiplier")
    private Integer complexityMultiplier; // Changed to Integer to match the error

    @JsonProperty("minimumHours")
    private Integer minimumHours;

    @JsonProperty("roundToHours")
    private boolean roundToHours;

    // Конструктори
    public TimeBasedFormulaEntity() {
        super(TypeEnum.TIME_BASED);
        this.complexityMultiplier = 100;
        this.roundToHours = true;
    }

    // REFACTORED: Business logic methods moved to TimeBasedFormulaCalculator service
    // calculate() -> TimeBasedFormulaCalculator.calculate()
    // calculateEstimatedHours() -> TimeBasedFormulaCalculator.calculateEstimatedHours()
    // validate() -> TimeBasedFormulaCalculator.validateFormula()

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TimeBasedFormulaEntity that = (TimeBasedFormulaEntity) o;
        return baseHours == that.baseHours &&
               hoursPerLevel == that.hoursPerLevel &&
               roundToHours == that.roundToHours &&
               Objects.equals(type, that.type) &&
               Objects.equals(hourlyRate, that.hourlyRate) &&
               Objects.equals(complexityMultiplier, that.complexityMultiplier) &&
               Objects.equals(minimumHours, that.minimumHours);
    }

    @Override
    public int hashCode() {
        return Objects.hash(type, hourlyRate, baseHours, hoursPerLevel,
                           complexityMultiplier, minimumHours, roundToHours);
    }

    @Override
    public String toString() {
        return String.format("TimeBasedFormula{hourlyRate=%s, baseHours=%d, hoursPerLevel=%d, complexityMultiplier=%s}",
                            hourlyRate, baseHours, hoursPerLevel, complexityMultiplier);
    }
}
