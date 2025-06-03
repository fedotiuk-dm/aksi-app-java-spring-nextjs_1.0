package com.aksi.ui.wizard.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.order.entity.OrderEntity;
import com.aksi.ui.wizard.dto.OrderWizardData;

/**
 * MapStruct mapper для конвертації між UI DTO та доменними об'єктами Order Wizard.
 *
 * Згідно з документацією Order Wizard обробляє 4 етапи:
 * - Етап 1: Клієнт та базова інформація замовлення
 * - Етап 2: Менеджер предметів (циклічний процес)
 * - Етап 3: Загальні параметри замовлення
 * - Етап 4: Підтвердження та завершення
 */
@Mapper(componentModel = "spring")
public interface OrderWizardMapper {

    OrderWizardMapper INSTANCE = Mappers.getMapper(OrderWizardMapper.class);

    /**
     * Конвертувати OrderWizardData у OrderEntity для збереження після завершення wizard'а.
     * Використовується на етапі 4 (підтвердження) для створення фінального замовлення.
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    @Mapping(target = "isPrinted", ignore = true)
    @Mapping(target = "isEmailed", ignore = true)
    @Mapping(source = "draftOrder.receiptNumber", target = "receiptNumber")
    @Mapping(source = "draftOrder.tagNumber", target = "tagNumber")
    @Mapping(source = "selectedClient", target = "client")
    @Mapping(source = "draftOrder.branchLocation", target = "branchLocation")
    @Mapping(source = "draftOrder.status", target = "status")
    @Mapping(source = "draftOrder.totalAmount", target = "totalAmount")
    @Mapping(source = "draftOrder.discountAmount", target = "discountAmount")
    @Mapping(source = "draftOrder.discountPercentage", target = "discountPercentage")
    @Mapping(source = "draftOrder.discountType", target = "discountType")
    @Mapping(source = "draftOrder.discountDescription", target = "discountDescription")
    @Mapping(source = "draftOrder.finalAmount", target = "finalAmount")
    @Mapping(source = "draftOrder.prepaymentAmount", target = "prepaymentAmount")
    @Mapping(source = "draftOrder.balanceAmount", target = "balanceAmount")
    @Mapping(source = "draftOrder.paymentMethod", target = "paymentMethod")
    @Mapping(source = "draftOrder.expectedCompletionDate", target = "expectedCompletionDate")
    @Mapping(source = "draftOrder.completedDate", target = "completedDate")
    @Mapping(source = "draftOrder.expediteType", target = "expediteType")
    @Mapping(source = "draftOrder.customerNotes", target = "customerNotes")
    @Mapping(source = "draftOrder.internalNotes", target = "internalNotes")
    @Mapping(source = "draftOrder.completionComments", target = "completionComments")
    @Mapping(source = "draftOrder.additionalRequirements", target = "additionalRequirements")
    @Mapping(source = "draftOrder.termsAccepted", target = "termsAccepted")
    @Mapping(source = "draftOrder.finalizedAt", target = "finalizedAt")
    @Mapping(source = "draftOrder.draft", target = "draft")
    @Mapping(target = "items", ignore = true) // items обробляються окремо через draftOrder.items
    OrderEntity toOrderEntity(OrderWizardData wizardData);

    /**
     * Оновити існуючий OrderEntity з даних OrderWizardData.
     * Використовується для збереження змін під час роботи з wizard'ом.
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    void updateOrderEntity(@MappingTarget OrderEntity target, OrderWizardData source);

    /**
     * Створити OrderWizardData з існуючого OrderEntity (для редагування).
     * Використовується для відновлення стану wizard'а з існуючого замовлення.
     */
    @Mapping(target = "selectedClient", source = "client")
    @Mapping(target = "newClient", constant = "false")
    @Mapping(target = "currentItem", ignore = true)
    @Mapping(target = "tempPhotoPaths", ignore = true)
    @Mapping(target = "step1Complete", expression = "java(isStep1Complete(order))")
    @Mapping(target = "step2Complete", expression = "java(isStep2Complete(order))")
    @Mapping(target = "step3Complete", expression = "java(isStep3Complete(order))")
    @Mapping(target = "draftOrder", source = ".")
    @Mapping(target = "items", ignore = true) // items обробляються через OrderMapper окремо
    OrderWizardData fromOrderEntity(OrderEntity order);

    /**
     * Допоміжні методи для визначення завершеності етапів wizard'а
     */

    /**
     * Етап 1 завершений, якщо обрано клієнта і введено номер квитанції
     */
    default boolean isStep1Complete(OrderEntity order) {
        return order.getClient() != null &&
               order.getReceiptNumber() != null &&
               !order.getReceiptNumber().trim().isEmpty();
    }

    /**
     * Етап 2 завершений, якщо додано хоча б один предмет до замовлення
     */
    default boolean isStep2Complete(OrderEntity order) {
        return order.getItems() != null && !order.getItems().isEmpty();
    }

    /**
     * Етап 3 завершений, якщо встановлено дату виконання та спосіб оплати
     */
    default boolean isStep3Complete(OrderEntity order) {
        return order.getExpectedCompletionDate() != null &&
               order.getPaymentMethod() != null;
    }
}
