package com.aksi.domain.pricing.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.aksi.domain.pricing.dto.DefectTypeDTO;
import com.aksi.domain.pricing.entity.DefectTypeEntity;

/**
 * Мапер для конвертації між DefectTypeEntity та DefectTypeDTO.
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DefectTypeMapper {
    
    /**
     * Конвертувати Entity в DTO.
     * 
     * @param entity сутність типу дефекту
     * @return DTO типу дефекту
     */
    DefectTypeDTO toDto(DefectTypeEntity entity);
    
    /**
     * Конвертувати DTO в Entity.
     * Поля createdAt та updatedAt встановлюються в сервісі.
     * 
     * @param dto DTO типу дефекту
     * @return сутність типу дефекту
     */
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    DefectTypeEntity toEntity(DefectTypeDTO dto);
    
    /**
     * Конвертувати список сутностей в список DTO.
     * 
     * @param entities список сутностей типів дефектів
     * @return список DTO типів дефектів
     */
    List<DefectTypeDTO> toDtoList(List<DefectTypeEntity> entities);
} 
