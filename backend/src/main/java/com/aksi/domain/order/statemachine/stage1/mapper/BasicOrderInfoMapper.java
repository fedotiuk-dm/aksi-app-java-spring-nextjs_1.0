package com.aksi.domain.order.statemachine.stage1.mapper;

import java.time.LocalDateTime;
import java.util.UUID;

import com.aksi.domain.branch.dto.BranchLocationDTO;
import com.aksi.domain.order.statemachine.stage1.dto.BasicOrderInfoDTO;

/**
 * Маппер для базової інформації замовлення в етапі 1.3.
 * Забезпечує статичні методи для створення та перетворення BasicOrderInfoDTO.
 */
public final class BasicOrderInfoMapper {

    private BasicOrderInfoMapper() {
        // Utility класи не повинні інстанціюватись
    }

    /**
     * Створює порожнє DTO базової інформації замовлення.
     */
    public static BasicOrderInfoDTO createEmpty() {
        return new BasicOrderInfoDTO();
    }

    /**
     * Створює DTO з автоматично згенерованим номером квитанції.
     */
    public static BasicOrderInfoDTO createWithReceiptNumber(String receiptNumber) {
        BasicOrderInfoDTO dto = new BasicOrderInfoDTO();
        dto.setReceiptNumber(receiptNumber);
        dto.setCreationDate(LocalDateTime.now());
        return dto;
    }

    /**
     * Створює DTO з обраною філією.
     */
    public static BasicOrderInfoDTO createWithBranch(BranchLocationDTO branch) {
        BasicOrderInfoDTO dto = new BasicOrderInfoDTO();
        dto.setSelectedBranch(branch);
        dto.setCreationDate(LocalDateTime.now());
        return dto;
    }

    /**
     * Створює DTO з унікальною міткою.
     */
    public static BasicOrderInfoDTO createWithUniqueTag(String uniqueTag) {
        BasicOrderInfoDTO dto = new BasicOrderInfoDTO();
        dto.setUniqueTag(uniqueTag);
        dto.setCreationDate(LocalDateTime.now());
        return dto;
    }

    /**
     * Створює повністю заповнене DTO базової інформації замовлення.
     */
    public static BasicOrderInfoDTO createComplete(String receiptNumber, String uniqueTag,
                                                 BranchLocationDTO branch) {
        BasicOrderInfoDTO dto = new BasicOrderInfoDTO();
        dto.setReceiptNumber(receiptNumber);
        dto.setUniqueTag(uniqueTag);
        dto.setSelectedBranch(branch);
        dto.setCreationDate(LocalDateTime.now());
        return dto;
    }

    /**
     * Створює копію DTO з оновленим номером квитанції.
     */
    public static BasicOrderInfoDTO copyWithReceiptNumber(BasicOrderInfoDTO original, String receiptNumber) {
        BasicOrderInfoDTO copy = new BasicOrderInfoDTO();
        copy.setReceiptNumber(receiptNumber);
        copy.setUniqueTag(original.getUniqueTag());
        copy.setSelectedBranch(original.getSelectedBranch());
        copy.setCreationDate(original.getCreationDate() != null ? original.getCreationDate() : LocalDateTime.now());
        return copy;
    }

    /**
     * Створює копію DTO з оновленою унікальною міткою.
     */
    public static BasicOrderInfoDTO copyWithUniqueTag(BasicOrderInfoDTO original, String uniqueTag) {
        BasicOrderInfoDTO copy = new BasicOrderInfoDTO();
        copy.setReceiptNumber(original.getReceiptNumber());
        copy.setUniqueTag(uniqueTag);
        copy.setSelectedBranch(original.getSelectedBranch());
        copy.setCreationDate(original.getCreationDate() != null ? original.getCreationDate() : LocalDateTime.now());
        return copy;
    }

    /**
     * Створює копію DTO з оновленою філією.
     */
    public static BasicOrderInfoDTO copyWithBranch(BasicOrderInfoDTO original, BranchLocationDTO branch) {
        BasicOrderInfoDTO copy = new BasicOrderInfoDTO();
        copy.setReceiptNumber(original.getReceiptNumber());
        copy.setUniqueTag(original.getUniqueTag());
        copy.setSelectedBranch(branch);
        copy.setCreationDate(original.getCreationDate() != null ? original.getCreationDate() : LocalDateTime.now());
        return copy;
    }

    /**
     * Конвертує мінімальні дані (ID філії) в повне DTO.
     */
    public static BasicOrderInfoDTO fromBranchId(UUID branchId, String branchName) {
        BasicOrderInfoDTO dto = new BasicOrderInfoDTO();
        dto.setSelectedBranchId(branchId);

        // Створюємо тимчасове DTO філії для встановлення
        if (branchId != null && branchName != null) {
            BranchLocationDTO branch = BranchLocationDTO.builder()
                    .id(branchId)
                    .name(branchName)
                    .build();
            dto.setSelectedBranch(branch);
        }

        dto.setCreationDate(LocalDateTime.now());
        return dto;
    }

    /**
     * Перевіряє, чи два DTO еквівалентні за основними полями.
     */
    public static boolean areEquivalent(BasicOrderInfoDTO dto1, BasicOrderInfoDTO dto2) {
        if (dto1 == dto2) return true;
        if (dto1 == null || dto2 == null) return false;

        return java.util.Objects.equals(dto1.getReceiptNumber(), dto2.getReceiptNumber()) &&
               java.util.Objects.equals(dto1.getUniqueTag(), dto2.getUniqueTag()) &&
               java.util.Objects.equals(dto1.getSelectedBranchId(), dto2.getSelectedBranchId());
    }

    /**
     * Об'єднує дані з двох DTO, де другий має пріоритет над першим.
     */
    public static BasicOrderInfoDTO merge(BasicOrderInfoDTO base, BasicOrderInfoDTO override) {
        if (base == null) return override;
        if (override == null) return base;

        BasicOrderInfoDTO merged = new BasicOrderInfoDTO();

        merged.setReceiptNumber(override.getReceiptNumber() != null ?
                              override.getReceiptNumber() : base.getReceiptNumber());
        merged.setUniqueTag(override.getUniqueTag() != null ?
                          override.getUniqueTag() : base.getUniqueTag());
        merged.setSelectedBranch(override.getSelectedBranch() != null ?
                               override.getSelectedBranch() : base.getSelectedBranch());
        merged.setCreationDate(override.getCreationDate() != null ?
                             override.getCreationDate() : base.getCreationDate());

        return merged;
    }

    /**
     * Валідує та очищає DTO від некоректних даних.
     */
    public static BasicOrderInfoDTO sanitize(BasicOrderInfoDTO dto) {
        if (dto == null) return createEmpty();

        BasicOrderInfoDTO sanitized = new BasicOrderInfoDTO();

        // Очищаємо номер квитанції
        if (dto.getReceiptNumber() != null && dto.isReceiptNumberValid()) {
            sanitized.setReceiptNumber(dto.getReceiptNumber().trim().toUpperCase());
        }

        // Очищаємо унікальну мітку
        if (dto.getUniqueTag() != null && dto.isUniqueTagValid()) {
            sanitized.setUniqueTag(dto.getUniqueTag().trim());
        }

        // Зберігаємо філію якщо вона валідна
        if (dto.getSelectedBranch() != null && dto.getSelectedBranch().getId() != null) {
            sanitized.setSelectedBranch(dto.getSelectedBranch());
        }

        // Встановлюємо дату
        sanitized.setCreationDate(dto.getCreationDate() != null ?
                                dto.getCreationDate() : LocalDateTime.now());

        return sanitized;
    }
}
