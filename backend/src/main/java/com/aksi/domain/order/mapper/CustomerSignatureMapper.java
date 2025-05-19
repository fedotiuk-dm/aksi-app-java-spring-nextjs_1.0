package com.aksi.domain.order.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import com.aksi.domain.order.dto.CustomerSignatureResponse;
import com.aksi.domain.order.entity.CustomerSignatureEntity;

/**
 * Маппер для перетворення між сутностями та DTO підпису клієнта.
 */
@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface CustomerSignatureMapper {

    /**
     * Перетворити сутність на DTO відповіді.
     *
     * @param entity сутність підпису
     * @return DTO відповіді
     */
    @Mapping(target = "orderId", source = "order.id")
    CustomerSignatureResponse toResponse(CustomerSignatureEntity entity);
}
