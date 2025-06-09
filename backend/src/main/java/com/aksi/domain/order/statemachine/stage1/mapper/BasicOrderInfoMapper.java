package com.aksi.domain.order.statemachine.stage1.mapper;

import java.time.LocalDateTime;

import org.springframework.stereotype.Component;

import com.aksi.domain.branch.dto.BranchLocationDTO;
import com.aksi.domain.order.statemachine.stage1.dto.BasicOrderInfoDTO;

/**
 * Mapper для роботи з базовою інформацією замовлення (етап 1.2).
 * Відповідає тільки за трансформації даних етапу 1.2.
 */
@Component
public class BasicOrderInfoMapper {

    /**
     * Створює BasicOrderInfoDTO з мінімальними даними.
     */
    public BasicOrderInfoDTO createEmpty() {
        return new BasicOrderInfoDTO();
    }

    /**
     * Створює BasicOrderInfoDTO з унікальною міткою та філією.
     */
    public BasicOrderInfoDTO createWithTagAndBranch(String uniqueTag, BranchLocationDTO branchLocation) {
        return new BasicOrderInfoDTO(null, uniqueTag, branchLocation);
    }

    /**
     * Створює повний BasicOrderInfoDTO з усіма полями.
     */
    public BasicOrderInfoDTO createFull(String receiptNumber, String uniqueTag,
                                       BranchLocationDTO branchLocation, LocalDateTime createdAt) {
        BasicOrderInfoDTO dto = new BasicOrderInfoDTO(receiptNumber, uniqueTag, branchLocation);
        if (createdAt != null) {
            dto.setCreatedAt(createdAt);
        }
        return dto;
    }

    /**
     * Копіює дані з одного DTO в інший.
     */
    public void copyData(BasicOrderInfoDTO source, BasicOrderInfoDTO target) {
        if (source == null || target == null) {
            return;
        }

        target.setReceiptNumber(source.getReceiptNumber());
        target.setUniqueTag(source.getUniqueTag());
        target.setBranchLocation(source.getBranchLocation());
        target.setCreatedAt(source.getCreatedAt());
    }

    /**
     * Клонує BasicOrderInfoDTO.
     */
    public BasicOrderInfoDTO clone(BasicOrderInfoDTO source) {
        if (source == null) {
            return null;
        }

        return createFull(
            source.getReceiptNumber(),
            source.getUniqueTag(),
            source.getBranchLocation(),
            source.getCreatedAt()
        );
    }

    /**
     * Форматує відображення базової інформації.
     */
    public String formatDisplay(BasicOrderInfoDTO dto) {
        if (dto == null) {
            return "Базова інформація не заповнена";
        }

        StringBuilder display = new StringBuilder();

        if (dto.hasReceiptNumber()) {
            display.append("Квитанція: ").append(dto.getReceiptNumber());
        }

        if (dto.hasUniqueTag()) {
            if (display.length() > 0) display.append(" | ");
            display.append("Мітка: ").append(dto.getUniqueTag());
        }

        if (dto.hasBranchLocation()) {
            if (display.length() > 0) display.append(" | ");
            display.append("Філія: ").append(dto.getBranchLocation().getName());
        }

        return display.toString();
    }

    /**
     * Очищає всі поля DTO.
     */
    public void clear(BasicOrderInfoDTO dto) {
        if (dto == null) {
            return;
        }

        dto.setReceiptNumber(null);
        dto.setUniqueTag(null);
        dto.setBranchLocation(null);
        dto.setCreatedAt(LocalDateTime.now());
    }
}
