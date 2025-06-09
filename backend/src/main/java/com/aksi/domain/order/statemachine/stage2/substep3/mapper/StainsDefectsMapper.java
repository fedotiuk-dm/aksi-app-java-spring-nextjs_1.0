package com.aksi.domain.order.statemachine.stage2.substep3.mapper;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.dto.OrderItemAddRequest;
import com.aksi.domain.order.dto.OrderItemDetailedDTO;
import com.aksi.domain.order.statemachine.stage2.substep3.dto.StainsDefectsDTO;

/**
 * Мапер для підетапу 2.3 "Забруднення, дефекти та ризики".
 * Перетворює між внутрішнім DTO та domain DTO згідно з архітектурними правилами.
 */
@Component
public class StainsDefectsMapper {

    /**
     * Розбиває рядок плям на список.
     *
     * @param stainsString рядок з плямами, розділеними комами
     * @return список плям
     */
    public List<String> parseStains(final String stainsString) {
        if (stainsString == null || stainsString.trim().isEmpty()) {
            return Collections.emptyList();
        }
        return Arrays.stream(stainsString.split(","))
                .map(String::trim)
                .filter(stain -> !stain.isEmpty())
                .toList();
    }

    /**
     * З'єднує список плям у рядок.
     *
     * @param stains список плям
     * @return рядок з плямами, розділеними комами
     */
    public String joinStains(final List<String> stains) {
        if (stains == null || stains.isEmpty()) {
            return "";
        }
        return String.join(", ", stains);
    }

    /**
     * Розбиває рядок дефектів на список.
     *
     * @param defectsString рядок з дефектами, розділеними комами
     * @return список дефектів
     */
    public List<String> parseDefects(final String defectsString) {
        if (defectsString == null || defectsString.trim().isEmpty()) {
            return Collections.emptyList();
        }
        return Arrays.stream(defectsString.split(","))
                .map(String::trim)
                .filter(defect -> !defect.isEmpty())
                .toList();
    }

    /**
     * З'єднує список дефектів у рядок.
     *
     * @param defects список дефектів
     * @return рядок з дефектами, розділеними комами
     */
    public String joinDefects(final List<String> defects) {
        if (defects == null || defects.isEmpty()) {
            return "";
        }
        return String.join(", ", defects);
    }

    /**
     * Створює StainsDefectsDTO з OrderItemAddRequest.
     *
     * @param orderItem запит на додавання предмета
     * @return DTO для управління станом плям та дефектів
     */
    public StainsDefectsDTO fromOrderItemAddRequest(final OrderItemAddRequest orderItem) {
        return StainsDefectsDTO.builder()
                .currentItem(orderItem)
                .stainsSelectionCompleted(false)
                .defectsSelectionCompleted(false)
                .build();
    }

    /**
     * Оновлює OrderItemAddRequest з новими плямами.
     *
     * @param request існуючий запит
     * @param stains нові плями
     * @param otherStains інші плями
     * @return оновлений запит
     */
    public OrderItemAddRequest updateWithStains(final OrderItemAddRequest request,
                                                final List<String> stains,
                                                final String otherStains) {
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
                .wearDegree(request.getWearDegree())
                .stains(joinStains(stains))
                .otherStains(otherStains)
                .defectsAndRisks(request.getDefectsAndRisks())
                .noGuaranteeReason(request.getNoGuaranteeReason())
                .defectsNotes(request.getDefectsNotes())
                .build();
    }

    /**
     * Оновлює OrderItemAddRequest з новими дефектами.
     *
     * @param request існуючий запит
     * @param defects дефекти та ризики
     * @param defectsNotes примітки щодо дефектів
     * @param noGuaranteeReason причина відмови від гарантій
     * @return оновлений запит
     */
    public OrderItemAddRequest updateWithDefects(final OrderItemAddRequest request,
                                                 final List<String> defects,
                                                 final String defectsNotes,
                                                 final String noGuaranteeReason) {
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
                .wearDegree(request.getWearDegree())
                .stains(request.getStains())
                .otherStains(request.getOtherStains())
                .defectsAndRisks(joinDefects(defects))
                .noGuaranteeReason(noGuaranteeReason)
                .defectsNotes(defectsNotes)
                .build();
    }

    /**
     * Повне оновлення OrderItemAddRequest з плямами та дефектами.
     *
     * @param request існуючий запит
     * @param stains плями
     * @param otherStains інші плями
     * @param defects дефекти та ризики
     * @param defectsNotes примітки щодо дефектів
     * @param noGuaranteeReason причина відмови від гарантій
     * @return повністю оновлений запит
     */
    public OrderItemAddRequest updateWithAllData(final OrderItemAddRequest request,
                                                 final List<String> stains,
                                                 final String otherStains,
                                                 final List<String> defects,
                                                 final String defectsNotes,
                                                 final String noGuaranteeReason) {
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
                .wearDegree(request.getWearDegree())
                .stains(joinStains(stains))
                .otherStains(otherStains)
                .defectsAndRisks(joinDefects(defects))
                .noGuaranteeReason(noGuaranteeReason)
                .defectsNotes(defectsNotes)
                .build();
    }

    /**
     * Витягує плями з OrderItemDetailedDTO.
     *
     * @param orderItem деталізований предмет замовлення
     * @return список плям
     */
    public List<String> getStainsFromDetailedDTO(final OrderItemDetailedDTO orderItem) {
        return orderItem.getStains() != null ? orderItem.getStains() : Collections.emptyList();
    }

    /**
     * Витягує дефекти з OrderItemDetailedDTO.
     *
     * @param orderItem деталізований предмет замовлення
     * @return список дефектів
     */
    public List<String> getDefectsFromDetailedDTO(final OrderItemDetailedDTO orderItem) {
        return orderItem.getDefects() != null ? orderItem.getDefects() : Collections.emptyList();
    }

    /**
     * Перетворює StainsDefectsDTO у OrderItemAddRequest.
     *
     * @param dto DTO зі станом плям та дефектів
     * @return запит на додавання предмета
     */
    public OrderItemAddRequest toOrderItemAddRequest(final StainsDefectsDTO dto) {
        return dto.getCurrentItem();
    }
}
