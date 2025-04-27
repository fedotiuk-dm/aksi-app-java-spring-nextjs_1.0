package com.aksi.domain.branch.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.aksi.domain.branch.dto.BranchLocationCreateRequest;
import com.aksi.domain.branch.dto.BranchLocationDTO;
import com.aksi.domain.branch.dto.BranchLocationUpdateRequest;
import com.aksi.domain.branch.entity.BranchLocationEntity;

/**
 * Маппер для перетворення між сутністю та DTO пункту прийому замовлень.
 */
@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface BranchLocationMapper {
    
    /**
     * Перетворює сутність в DTO.
     * 
     * @param entity сутність пункту прийому замовлень
     * @return DTO пункту прийому замовлень
     */
    BranchLocationDTO toDto(BranchLocationEntity entity);
    
    /**
     * Перетворює DTO в сутність.
     * 
     * @param dto DTO пункту прийому замовлень
     * @return сутність пункту прийому замовлень
     */
    BranchLocationEntity toEntity(BranchLocationDTO dto);
    
    /**
     * Створює нову сутність із запиту на створення.
     * 
     * @param request запит на створення пункту прийому замовлень
     * @return нова сутність пункту прийому замовлень
     */
    BranchLocationEntity toEntity(BranchLocationCreateRequest request);
    
    /**
     * Оновлює існуючу сутність за запитом на оновлення.
     * 
     * @param request запит на оновлення пункту прийому замовлень
     * @param entity існуюча сутність пункту прийому замовлень
     * @return оновлена сутність пункту прийому замовлень
     */
    BranchLocationEntity updateEntity(BranchLocationUpdateRequest request, @MappingTarget BranchLocationEntity entity);
}
