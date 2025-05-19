package com.aksi.domain.order.mapper;

import org.mapstruct.InheritConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.aksi.domain.branch.mapper.BranchLocationMapper;
import com.aksi.domain.client.mapper.ClientMapper;
import com.aksi.domain.order.dto.CreateOrderRequest;
import com.aksi.domain.order.dto.OrderDTO;
import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.entity.OrderEntity;
import com.aksi.domain.order.entity.OrderItemEntity;

/**
 * Маппер для перетворення між OrderEntity і OrderDTO.
 */
@Mapper(
    componentModel = "spring",
    uses = {ClientMapper.class, BranchLocationMapper.class},
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface OrderMapper {

    /**
     * Перетворити OrderEntity у OrderDTO.
     * @param order параметр order
     * @return об'єкт OrderDTO, створений на основі ентіті замовлення
     */
    @Mapping(target = "clientId", source = "client.id")
    @Mapping(target = "branchLocationId", source = "branchLocation.id")
    OrderDTO toDTO(OrderEntity order);

    /**
     * Перетворити CreateOrderRequest у OrderEntity.
     * Використовує спільний метод mapOrderCommonFields для наслідування анотацій.
     *
     * @param orderRequest запит на створення замовлення
     * @return сутність замовлення
     */
    @InheritConfiguration(name = "mapOrderCommonFields")
    OrderEntity toEntity(CreateOrderRequest orderRequest);

    /**
     * Оновити замовлення з новими даними.
     * @param orderRequest запит на оновлення замовлення
     * @param order замовлення для оновлення
     */
    @InheritConfiguration(name = "mapOrderCommonFields")
    void updateOrderFromRequest(CreateOrderRequest orderRequest, @MappingTarget OrderEntity order);

    /**
     * Перетворити OrderItemEntity у OrderItemDTO.
     * @param item параметр item
     * @return DTO елемента замовлення
     */
    OrderItemDTO toOrderItemDTO(OrderItemEntity item);

    /**
     * Перетворити OrderItemDTO у OrderItemEntity.
     * @param dto об'єкт передачі даних
     * @return ентіті елемента замовлення
     */
    OrderItemEntity toOrderItemEntity(OrderItemDTO dto);

    /**
     * Базове мапінгове налаштування для перетворення та оновлення OrderEntity.
     * Цей метод використовується для визначення спільного набору анотацій @Mapping,
     * які застосовуються як для toEntity, так і для updateOrderFromRequest.
     *
     * @param orderRequest запит із даними замовлення
     * @param order цільовий об'єкт замовлення (може бути новим або існуючим)
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "receiptNumber", ignore = true)
    @Mapping(target = "tagNumber", ignore = true)
    @Mapping(target = "client", ignore = true)
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "totalAmount", ignore = true)
    @Mapping(target = "finalAmount", ignore = true)
    @Mapping(target = "balanceAmount", ignore = true)
    @Mapping(target = "branchLocation", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    @Mapping(target = "completedDate", ignore = true)
    void mapOrderCommonFields(CreateOrderRequest orderRequest, @MappingTarget OrderEntity order);
}
