package com.aksi.domain.order.statemachine.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.aksi.domain.order.statemachine.dto.OrderWizardSessionResponse;
import com.aksi.domain.order.statemachine.entity.OrderWizardSessionEntity;

/**
 * MapStruct mapper для Order Wizard сесій
 */
@Mapper(componentModel = "spring")
public interface OrderWizardSessionMapper {

    /**
     * Конвертує entity в response DTO
     */
    @Mapping(target = "clientId", source = "client.id")
    @Mapping(target = "branchId", source = "branch.id")
    @Mapping(target = "isExpired", expression = "java(entity.isExpired())")
    OrderWizardSessionResponse toResponse(OrderWizardSessionEntity entity);
}
