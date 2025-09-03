package com.aksi.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.aksi.api.game.dto.CalculationFormula;
import com.aksi.api.game.dto.CreatePriceConfigurationRequest;
import com.aksi.api.game.dto.PriceConfiguration;
import com.aksi.api.game.dto.UpdatePriceConfigurationRequest;
import com.aksi.domain.game.PriceConfigurationEntity;
import com.aksi.domain.game.formula.CalculationFormulaEntity;
import com.aksi.domain.game.formula.FormulaFormulaEntity;
import com.aksi.domain.game.formula.LinearFormulaEntity;
import com.aksi.domain.game.formula.RangeFormulaEntity;
import com.aksi.domain.game.formula.TimeBasedFormulaEntity;

/** MapStruct mapper for PriceConfiguration domain */
@Mapper(componentModel = "spring", config = BaseMapperConfig.class)
public interface PriceConfigurationMapper {

  // Entity to DTO mappings

  @Mapping(target = "calculationFormula", ignore = true) // Polymorphic object handled separately
  PriceConfiguration toPriceConfigurationDto(PriceConfigurationEntity entity);

  @Mapping(target = "calculationFormula", ignore = true) // Polymorphic object handled separately
  List<PriceConfiguration> toPriceConfigurationDtoList(List<PriceConfigurationEntity> entities);

  // DTO to Entity mappings

  @Mapping(target = "active", ignore = true)
  @Mapping(target = "calculationFormula", ignore = true) // Polymorphic object handled separately
  PriceConfigurationEntity toPriceConfigurationEntity(CreatePriceConfigurationRequest dto);

  // Update entity from DTO (only non-null fields)
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "calculationFormula", ignore = true) // Polymorphic object handled separately
  void updatePriceConfigurationFromDto(
      UpdatePriceConfigurationRequest dto,
      @MappingTarget PriceConfigurationEntity entity);

  // Formula conversion from API DTO to Domain
  default CalculationFormulaEntity toDomainFormula(CalculationFormula apiFormula) {
    if (apiFormula == null) return null;

    // Convert based on formula type
    return switch (apiFormula.getType().getValue()) {
      case "LINEAR" -> new LinearFormulaEntity();
      case "RANGE" -> new RangeFormulaEntity();
      case "FORMULA" -> new FormulaFormulaEntity();
      case "TIME_BASED" -> new TimeBasedFormulaEntity();
      default -> throw new IllegalArgumentException("Unsupported calculation formula type: " + apiFormula.getType());
    };
  }
}
