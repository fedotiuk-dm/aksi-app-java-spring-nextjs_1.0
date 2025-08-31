package com.aksi.mapper;

import org.mapstruct.MapperConfig;
import org.mapstruct.NullValuePropertyMappingStrategy;

/**
 * Base MapStruct configuration for all mappers in the project. Configures common mapping behavior
 * and unmapped target policy.
 */
@MapperConfig(
    componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
    unmappedTargetPolicy = org.mapstruct.ReportingPolicy.IGNORE)
public interface BaseMapperConfig {}
