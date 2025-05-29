package com.aksi.ui.wizard.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.order.entity.OrderEntity;
import com.aksi.domain.order.entity.OrderItemEntity;
import com.aksi.ui.wizard.dto.OrderWizardData;

/**
 * MapStruct mapper для конвертації між UI DTO та доменними об'єктами Order Wizard.
 */
@Mapper(componentModel = "spring")
public interface OrderWizardMapper {

    OrderWizardMapper INSTANCE = Mappers.getMapper(OrderWizardMapper.class);

    /**
     * Конвертувати OrderWizardData у OrderEntity для збереження
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    @Mapping(source = "draftOrder.receiptNumber", target = "receiptNumber")
    @Mapping(source = "draftOrder.tagNumber", target = "tagNumber")
    @Mapping(source = "selectedClient", target = "client")
    OrderEntity toOrderEntity(OrderWizardData wizardData);

    /**
     * Оновити існуючий OrderEntity з даних OrderWizardData
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    void updateOrderEntity(@MappingTarget OrderEntity target, OrderWizardData source);

    /**
     * Створити OrderWizardData з існуючого OrderEntity (для редагування)
     */
    @Mapping(target = "selectedClient", source = "client")
    @Mapping(target = "newClient", constant = "false")
    @Mapping(target = "currentItem", ignore = true)
    @Mapping(target = "tempPhotoPaths", ignore = true)
    @Mapping(target = "step1Complete", expression = "java(isStep1Complete(order))")
    @Mapping(target = "step2Complete", expression = "java(isStep2Complete(order))")
    @Mapping(target = "step3Complete", expression = "java(isStep3Complete(order))")
    OrderWizardData fromOrderEntity(OrderEntity order);

    /**
     * Допоміжні методи для визначення завершеності етапів
     */
    default boolean isStep1Complete(OrderEntity order) {
        return order.getClient() != null &&
               order.getReceiptNumber() != null &&
               !order.getReceiptNumber().trim().isEmpty();
    }

    default boolean isStep2Complete(OrderEntity order) {
        return order.getItems() != null && !order.getItems().isEmpty();
    }

    default boolean isStep3Complete(OrderEntity order) {
        return order.getExpectedCompletionDate() != null &&
               order.getPaymentMethod() != null;
    }
}
