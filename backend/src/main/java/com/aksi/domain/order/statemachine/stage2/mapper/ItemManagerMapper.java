package com.aksi.domain.order.statemachine.stage2.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.entity.OrderItemEntity;
import com.aksi.domain.order.repository.OrderItemPhotoRepository;
import com.aksi.domain.order.statemachine.stage2.dto.ItemManagerDTO;
import com.aksi.domain.order.statemachine.stage2.dto.TempOrderItemDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Mapper для етапу 2.0 - головний екран менеджера предметів.
 *
 * Відповідає за конвертацію між:
 * - OrderItemEntity та ItemSummaryDto
 * - TempOrderItemDto та OrderItemEntity
 * - Списки предметів та DTO для відображення
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ItemManagerMapper {

    private final OrderItemPhotoRepository orderItemPhotoRepository;

    /**
     * Конвертує OrderItemEntity у ItemSummaryDto для відображення в таблиці.
     */
    public ItemManagerDTO.ItemSummaryDto toItemSummaryDto(OrderItemEntity entity) {
        if (entity == null) {
            return null;
        }

        return ItemManagerDTO.ItemSummaryDto.builder()
            .id(entity.getId().toString())
            .name(entity.getName())
            .category(entity.getCategory())
            .quantity(entity.getQuantity())
            .unitOfMeasure(entity.getUnitOfMeasure())
            .material(entity.getMaterial())
            .color(entity.getColor())
            .unitPrice(entity.getUnitPrice())
            .totalPrice(entity.getTotalPrice())
            .conditionSummary(buildConditionSummary(entity))
            .hasPhotos(orderItemPhotoRepository.countByOrderItemId(entity.getId()) > 0)
            .createdAt(entity.getCreatedAt() != null ?
                java.time.ZoneOffset.UTC.getRules().getOffset(entity.getCreatedAt()).getTotalSeconds() * 1000L : null)
            .build();
    }

    /**
     * Конвертує список OrderItemEntity у список ItemSummaryDto.
     */
    public List<ItemManagerDTO.ItemSummaryDto> toItemSummaryDtoList(List<OrderItemEntity> entities) {
        if (entities == null) {
            return List.of();
        }

        return entities.stream()
            .map(this::toItemSummaryDto)
            .collect(Collectors.toList());
    }

    /**
     * Конвертує OrderItemEntity у TempOrderItemDto для редагування.
     */
    public TempOrderItemDTO toTempOrderItemDto(OrderItemEntity entity) {
        if (entity == null) {
            return null;
        }

        return TempOrderItemDTO.builder()
            .name(entity.getName())
            .description(entity.getDescription())
            .quantity(entity.getQuantity())
            .unitPrice(entity.getUnitPrice())
            .totalPrice(entity.getTotalPrice())
            .category(entity.getCategory())
            .color(entity.getColor())
            .material(entity.getMaterial())
            .unitOfMeasure(entity.getUnitOfMeasure())
            .defects(entity.getDefects())
            .specialInstructions(entity.getSpecialInstructions())
            .fillerType(entity.getFillerType())
            .fillerCompressed(entity.getFillerCompressed())
            .wearDegree(entity.getWearDegree())
            .stains(entity.getStains())
            .otherStains(entity.getOtherStains())
            .defectsAndRisks(entity.getDefectsAndRisks())
            .noGuaranteeReason(entity.getNoGuaranteeReason())
            .defectsNotes(entity.getDefectsNotes())
            .hasPhotos(orderItemPhotoRepository.countByOrderItemId(entity.getId()) > 0)
            .wizardStep(1) // Починаємо з першого кроку при редагуванні
            .build();
    }

    /**
     * Оновлює OrderItemEntity на основі TempOrderItemDto.
     */
    public void updateEntityFromTempDto(OrderItemEntity entity, TempOrderItemDTO dto) {
        if (entity == null || dto == null) {
            return;
        }

        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setQuantity(dto.getQuantity());
        entity.setUnitPrice(dto.getUnitPrice());
        entity.setTotalPrice(dto.getTotalPrice());
        entity.setCategory(dto.getCategory());
        entity.setColor(dto.getColor());
        entity.setMaterial(dto.getMaterial());
        entity.setUnitOfMeasure(dto.getUnitOfMeasure());
        entity.setDefects(dto.getDefects());
        entity.setSpecialInstructions(dto.getSpecialInstructions());
        entity.setFillerType(dto.getFillerType());
        entity.setFillerCompressed(dto.getFillerCompressed());
        entity.setWearDegree(dto.getWearDegree());
        entity.setStains(dto.getStains());
        entity.setOtherStains(dto.getOtherStains());
        entity.setDefectsAndRisks(dto.getDefectsAndRisks());
        entity.setNoGuaranteeReason(dto.getNoGuaranteeReason());
        entity.setDefectsNotes(dto.getDefectsNotes());
    }

    /**
     * Створює новий OrderItemEntity на основі TempOrderItemDto.
     */
    public OrderItemEntity createEntityFromTempDto(TempOrderItemDTO dto) {
        if (dto == null) {
            return null;
        }

        OrderItemEntity entity = new OrderItemEntity();
        updateEntityFromTempDto(entity, dto);
        return entity;
    }

    /**
     * Створює ItemManagerDto на основі списку предметів та додаткової інформації.
     */
    public ItemManagerDTO createItemManagerDto(
            List<OrderItemEntity> items,
            java.math.BigDecimal totalPrice,
            boolean canProceedToNextStage,
            String validationMessage,
            String selectedItemId,
            boolean isMainFormActive) {

        List<ItemManagerDTO.ItemSummaryDto> itemSummaries = toItemSummaryDtoList(items);

        return ItemManagerDTO.builder()
            .items(itemSummaries)
            .totalItemsCount(items != null ? items.size() : 0)
            .totalPrice(totalPrice)
            .canProceedToNextStage(canProceedToNextStage)
            .validationMessage(validationMessage)
            .selectedItemId(selectedItemId)
            .isMainFormActive(isMainFormActive)
            .build();
    }

    /**
     * Будує короткий опис стану предмета (дефекти, плями тощо).
     */
    private String buildConditionSummary(OrderItemEntity entity) {
        StringBuilder summary = new StringBuilder();

        // Додаємо інформацію про плями
        if (entity.getStains() != null && !entity.getStains().trim().isEmpty()) {
            summary.append("Плями: ").append(entity.getStains());
        }

        if (entity.getOtherStains() != null && !entity.getOtherStains().trim().isEmpty()) {
            if (summary.length() > 0) {
                summary.append("; ");
            }
            summary.append("Інші плями: ").append(entity.getOtherStains());
        }

        // Додаємо інформацію про дефекти
        if (entity.getDefectsAndRisks() != null && !entity.getDefectsAndRisks().trim().isEmpty()) {
            if (summary.length() > 0) {
                summary.append("; ");
            }
            summary.append("Дефекти: ").append(entity.getDefectsAndRisks());
        }

        // Додаємо інформацію про відсутність гарантій
        if (entity.getNoGuaranteeReason() != null && !entity.getNoGuaranteeReason().trim().isEmpty()) {
            if (summary.length() > 0) {
                summary.append("; ");
            }
            summary.append("Без гарантій: ").append(entity.getNoGuaranteeReason());
        }

        // Додаємо інформацію про ступінь зносу
        if (entity.getWearDegree() != null && !entity.getWearDegree().trim().isEmpty()) {
            if (summary.length() > 0) {
                summary.append("; ");
            }
            summary.append("Знос: ").append(entity.getWearDegree());
        }

        return summary.toString();
    }
}
