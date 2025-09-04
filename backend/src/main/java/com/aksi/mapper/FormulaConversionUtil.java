package com.aksi.mapper;

import org.springframework.stereotype.Component;

import com.aksi.api.game.dto.CalculationFormula;
import com.aksi.api.game.dto.FormulaFormula;
import com.aksi.api.game.dto.LinearFormula;
import com.aksi.api.game.dto.RangeFormula;
import com.aksi.api.game.dto.TimeBasedFormula;
import com.aksi.domain.game.formula.CalculationFormulaEntity;
import com.aksi.domain.game.formula.FormulaFormulaEntity;
import com.aksi.domain.game.formula.LinearFormulaEntity;
import com.aksi.domain.game.formula.PriceRangeEntity;
import com.aksi.domain.game.formula.RangeFormulaEntity;
import com.aksi.domain.game.formula.TimeBasedFormulaEntity;

/**
 * Utility class for converting API formula DTOs to domain entities.
 * This handles the polymorphic formula conversion that MapStruct cannot handle.
 */
@Component
public class FormulaConversionUtil {

    /**
     * Converts API formula DTO to domain entity
     */
        public CalculationFormulaEntity toDomainFormula(CalculationFormula apiFormula) {
        if (apiFormula == null) {
            return null;
        }

        if (apiFormula.getType() == null) {
            throw new IllegalArgumentException("Formula type cannot be null");
        }

        // Convert based on formula type
        return switch (apiFormula.getType().getValue()) {
            case "LINEAR" -> {
                if (apiFormula instanceof LinearFormula linearFormula) {
                    yield toLinearFormulaEntity(linearFormula);
                } else {
                    throw new IllegalArgumentException("Expected LinearFormula but got: " + apiFormula.getClass());
                }
            }
            case "RANGE" -> {
                if (apiFormula instanceof RangeFormula rangeFormula) {
                    yield toRangeFormulaEntity(rangeFormula);
                } else {
                    throw new IllegalArgumentException("Expected RangeFormula but got: " + apiFormula.getClass());
                }
            }
            case "FORMULA" -> {
                if (apiFormula instanceof FormulaFormula formulaFormula) {
                    yield toFormulaFormulaEntity(formulaFormula);
                } else {
                    throw new IllegalArgumentException("Expected FormulaFormula but got: " + apiFormula.getClass());
                }
            }
            case "TIME_BASED" -> {
                if (apiFormula instanceof TimeBasedFormula timeFormula) {
                    yield toTimeBasedFormulaEntity(timeFormula);
                } else {
                    throw new IllegalArgumentException("Expected TimeBasedFormula but got: " + apiFormula.getClass());
                }
            }
            default -> throw new IllegalArgumentException("Unsupported calculation formula type: " + apiFormula.getType());
        };
    }

    private LinearFormulaEntity toLinearFormulaEntity(LinearFormula linearFormula) {
        var entity = new LinearFormulaEntity();
        entity.setType(linearFormula.getType());
        if (linearFormula.getPricePerLevel() != null) {
            entity.setPricePerLevel(linearFormula.getPricePerLevel());
        }
        return entity;
    }

    private RangeFormulaEntity toRangeFormulaEntity(RangeFormula rangeFormula) {
        var entity = new RangeFormulaEntity();
        entity.setType(rangeFormula.getType());
        if (rangeFormula.getRanges() != null) {
            for (var rangeDto : rangeFormula.getRanges()) {
                var rangeEntity = new PriceRangeEntity(
                    rangeDto.getFrom(),
                    rangeDto.getTo(),
                    rangeDto.getPrice()
                );
                entity.getRanges().add(rangeEntity);
            }
        }
        return entity;
    }

    private FormulaFormulaEntity toFormulaFormulaEntity(FormulaFormula formulaFormula) {
        var entity = new FormulaFormulaEntity();
        entity.setType(formulaFormula.getType());

        if (formulaFormula.getExpression() != null) {
            entity.setExpression(formulaFormula.getExpression());
        }

        if (formulaFormula.getVariables() != null) {
            entity.setVariables(formulaFormula.getVariables());
        }

        return entity;
    }

    private TimeBasedFormulaEntity toTimeBasedFormulaEntity(TimeBasedFormula timeFormula) {
        var entity = new TimeBasedFormulaEntity();
        entity.setType(timeFormula.getType());
        if (timeFormula.getHourlyRate() != null) {
            entity.setHourlyRate(timeFormula.getHourlyRate());
        }
        if (timeFormula.getBaseHours() != null) {
            entity.setBaseHours(timeFormula.getBaseHours());
        }
        if (timeFormula.getComplexityMultiplier() != null) {
            entity.setComplexityMultiplier(timeFormula.getComplexityMultiplier());
        }
        if (timeFormula.getHoursPerLevel() != null) {
            entity.setHoursPerLevel(timeFormula.getHoursPerLevel());
        }
        if (timeFormula.getMinimumHours() != null) {
            entity.setMinimumHours(timeFormula.getMinimumHours());
        }
        if (timeFormula.getRoundToHours() != null) {
            entity.setRoundToHours(timeFormula.getRoundToHours());
        }
        return entity;
    }
}
