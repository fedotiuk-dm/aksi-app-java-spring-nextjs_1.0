package com.aksi.domain.pricing.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.aksi.domain.pricing.dto.StainTypeDTO;
import com.aksi.domain.pricing.entity.StainTypeEntity;

/**
 * Мапер для конвертації між StainTypeEntity та StainTypeDTO.
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface StainTypeMapper {

    /**
     * Конвертувати Entity в DTO.
     *
     * @param entity сутність типу плями
     * @return DTO типу плями
     */
    StainTypeDTO toDto(StainTypeEntity entity);

    /**
     * Конвертувати DTO в Entity.
     * Поля createdAt та updatedAt встановлюються в сервісі.
     *
     * @param dto DTO типу плями
     * @return сутність типу плями
     */
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    StainTypeEntity toEntity(StainTypeDTO dto);

    /**
     * Конвертувати список сутностей в список DTO.
     *
     * @param entities список сутностей типів плям
     * @return список DTO типів плям
     */
    List<StainTypeDTO> toDtoList(List<StainTypeEntity> entities);
}
