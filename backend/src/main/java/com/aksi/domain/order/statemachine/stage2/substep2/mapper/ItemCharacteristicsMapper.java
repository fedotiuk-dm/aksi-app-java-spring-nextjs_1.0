package com.aksi.domain.order.statemachine.stage2.substep2.mapper;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.dto.OrderItemAddRequest;
import com.aksi.domain.order.dto.OrderItemDetailedDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.dto.ItemCharacteristicsDTO;

/**
 * Мапер для підетапу 2.2 "Характеристики предмета".
 * Перетворює між внутрішнім DTO та domain DTO згідно з архітектурними правилами.
 */
@Component
public class ItemCharacteristicsMapper {

    /**
     * Створює ItemCharacteristicsDTO з OrderItemAddRequest.
     *
     * @param orderItem запит на додавання предмета
     * @return DTO для управління станом характеристик
     */
    public ItemCharacteristicsDTO fromOrderItemAddRequest(final OrderItemAddRequest orderItem) {
        return ItemCharacteristicsDTO.builder()
                .currentItem(orderItem)
                .materialSelectionCompleted(false)
                .colorSelectionCompleted(false)
                .fillerSelectionCompleted(false)
                .wearDegreeSelectionCompleted(false)
                .build();
    }

    /**
     * Оновлює OrderItemAddRequest з новим матеріалом.
     *
     * @param request існуючий запит
     * @param material новий матеріал
     * @return оновлений запит
     */
    public OrderItemAddRequest updateWithMaterial(final OrderItemAddRequest request, final String material) {
        return OrderItemAddRequest.builder()
                .id(request.getId())
                .orderId(request.getOrderId())
                .description(request.getDescription())
                .quantity(request.getQuantity())
                .unitPrice(request.getUnitPrice())
                .totalPrice(request.getTotalPrice())
                .category(request.getCategory())
                .color(request.getColor())
                .material(material)
                .unitOfMeasure(request.getUnitOfMeasure())
                .defects(request.getDefects())
                .specialInstructions(request.getSpecialInstructions())
                .fillerType(request.getFillerType())
                .fillerCompressed(request.getFillerCompressed())
                .wearDegree(request.getWearDegree())
                .stains(request.getStains())
                .otherStains(request.getOtherStains())
                .defectsAndRisks(request.getDefectsAndRisks())
                .noGuaranteeReason(request.getNoGuaranteeReason())
                .defectsNotes(request.getDefectsNotes())
                .build();
    }

    /**
     * Оновлює OrderItemAddRequest з новим кольором.
     *
     * @param request існуючий запит
     * @param color новий колір
     * @return оновлений запит
     */
    public OrderItemAddRequest updateWithColor(final OrderItemAddRequest request, final String color) {
        return OrderItemAddRequest.builder()
                .id(request.getId())
                .orderId(request.getOrderId())
                .description(request.getDescription())
                .quantity(request.getQuantity())
                .unitPrice(request.getUnitPrice())
                .totalPrice(request.getTotalPrice())
                .category(request.getCategory())
                .color(color)
                .material(request.getMaterial())
                .unitOfMeasure(request.getUnitOfMeasure())
                .defects(request.getDefects())
                .specialInstructions(request.getSpecialInstructions())
                .fillerType(request.getFillerType())
                .fillerCompressed(request.getFillerCompressed())
                .wearDegree(request.getWearDegree())
                .stains(request.getStains())
                .otherStains(request.getOtherStains())
                .defectsAndRisks(request.getDefectsAndRisks())
                .noGuaranteeReason(request.getNoGuaranteeReason())
                .defectsNotes(request.getDefectsNotes())
                .build();
    }

    /**
     * Оновлює OrderItemAddRequest з новим наповнювачем.
     *
     * @param request існуючий запит
     * @param fillerType тип наповнювача
     * @param fillerCompressed чи збитий наповнювач
     * @return оновлений запит
     */
    public OrderItemAddRequest updateWithFiller(final OrderItemAddRequest request,
                                               final String fillerType,
                                               final Boolean fillerCompressed) {
        return OrderItemAddRequest.builder()
                .id(request.getId())
                .orderId(request.getOrderId())
                .description(request.getDescription())
                .quantity(request.getQuantity())
                .unitPrice(request.getUnitPrice())
                .totalPrice(request.getTotalPrice())
                .category(request.getCategory())
                .color(request.getColor())
                .material(request.getMaterial())
                .unitOfMeasure(request.getUnitOfMeasure())
                .defects(request.getDefects())
                .specialInstructions(request.getSpecialInstructions())
                .fillerType(fillerType)
                .fillerCompressed(fillerCompressed)
                .wearDegree(request.getWearDegree())
                .stains(request.getStains())
                .otherStains(request.getOtherStains())
                .defectsAndRisks(request.getDefectsAndRisks())
                .noGuaranteeReason(request.getNoGuaranteeReason())
                .defectsNotes(request.getDefectsNotes())
                .build();
    }

    /**
     * Оновлює OrderItemAddRequest з новим ступенем зносу.
     *
     * @param request існуючий запит
     * @param wearDegree ступінь зносу
     * @return оновлений запит
     */
    public OrderItemAddRequest updateWithWearDegree(final OrderItemAddRequest request, final String wearDegree) {
        return OrderItemAddRequest.builder()
                .id(request.getId())
                .orderId(request.getOrderId())
                .description(request.getDescription())
                .quantity(request.getQuantity())
                .unitPrice(request.getUnitPrice())
                .totalPrice(request.getTotalPrice())
                .category(request.getCategory())
                .color(request.getColor())
                .material(request.getMaterial())
                .unitOfMeasure(request.getUnitOfMeasure())
                .defects(request.getDefects())
                .specialInstructions(request.getSpecialInstructions())
                .fillerType(request.getFillerType())
                .fillerCompressed(request.getFillerCompressed())
                .wearDegree(wearDegree)
                .stains(request.getStains())
                .otherStains(request.getOtherStains())
                .defectsAndRisks(request.getDefectsAndRisks())
                .noGuaranteeReason(request.getNoGuaranteeReason())
                .defectsNotes(request.getDefectsNotes())
                .build();
    }

    /**
     * Повне оновлення OrderItemAddRequest з усіма характеристиками.
     *
     * @param request існуючий запит
     * @param material матеріал
     * @param color колір
     * @param fillerType тип наповнювача
     * @param fillerCompressed чи збитий наповнювач
     * @param wearDegree ступінь зносу
     * @return повністю оновлений запит
     */
    public OrderItemAddRequest updateWithAllCharacteristics(final OrderItemAddRequest request,
                                                           final String material,
                                                           final String color,
                                                           final String fillerType,
                                                           final Boolean fillerCompressed,
                                                           final String wearDegree) {
        return OrderItemAddRequest.builder()
                .id(request.getId())
                .orderId(request.getOrderId())
                .description(request.getDescription())
                .quantity(request.getQuantity())
                .unitPrice(request.getUnitPrice())
                .totalPrice(request.getTotalPrice())
                .category(request.getCategory())
                .color(color)
                .material(material)
                .unitOfMeasure(request.getUnitOfMeasure())
                .defects(request.getDefects())
                .specialInstructions(request.getSpecialInstructions())
                .fillerType(fillerType)
                .fillerCompressed(fillerCompressed)
                .wearDegree(wearDegree)
                .stains(request.getStains())
                .otherStains(request.getOtherStains())
                .defectsAndRisks(request.getDefectsAndRisks())
                .noGuaranteeReason(request.getNoGuaranteeReason())
                .defectsNotes(request.getDefectsNotes())
                .build();
    }

    /**
     * Витягує характеристики з OrderItemDetailedDTO.
     *
     * @param orderItem деталізований предмет замовлення
     * @return DTO з характеристиками
     */
    public ItemCharacteristicsDTO fromOrderItemDetailedDTO(final OrderItemDetailedDTO orderItem) {
        final OrderItemAddRequest currentItem = OrderItemAddRequest.builder()
                .material(orderItem.getMaterial())
                .color(orderItem.getColor())
                .fillerType(orderItem.getFiller())
                .fillerCompressed(orderItem.isFillerClumped())
                .wearDegree(String.valueOf(orderItem.getWearPercentage()))
                .build();

        return ItemCharacteristicsDTO.builder()
                .currentItem(currentItem)
                .materialSelectionCompleted(orderItem.getMaterial() != null)
                .colorSelectionCompleted(orderItem.getColor() != null)
                .fillerSelectionCompleted(orderItem.getFiller() != null)
                .wearDegreeSelectionCompleted(orderItem.getWearPercentage() != null)
                .build();
    }

    /**
     * Перетворює ItemCharacteristicsDTO у OrderItemAddRequest.
     *
     * @param dto DTO зі станом характеристик
     * @return запит на додавання предмета
     */
    public OrderItemAddRequest toOrderItemAddRequest(final ItemCharacteristicsDTO dto) {
        return dto.getCurrentItem();
    }
}
