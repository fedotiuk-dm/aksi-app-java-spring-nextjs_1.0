package com.aksi.domain.order.statemachine.stage3.mapper;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.aksi.domain.order.dto.CompletionDateCalculationRequest;
import com.aksi.domain.order.dto.CompletionDateResponse;
import com.aksi.domain.order.model.ExpediteType;
import com.aksi.domain.order.statemachine.stage3.dto.ExecutionParamsDTO;

/**
 * Mapper для конвертації ExecutionParamsDTO та доменних DTO
 * ЕТАП 1.3: Залежить тільки від DTO
 */
public class Stage3ExecutionParamsMapper {

    /**
     * Створює ExecutionParamsDTO з базових параметрів
     */
    public static ExecutionParamsDTO createFromBasicParams(
            UUID sessionId,
            List<UUID> serviceCategoryIds) {
        return new ExecutionParamsDTO(sessionId, serviceCategoryIds);
    }

    /**
     * Створює ExecutionParamsDTO з доменного запиту
     */
    public static ExecutionParamsDTO fromDomainRequest(
            UUID sessionId,
            CompletionDateCalculationRequest request) {
        if (request == null) {
            return new ExecutionParamsDTO(sessionId);
        }

        ExecutionParamsDTO dto = new ExecutionParamsDTO(sessionId, request.getServiceCategoryIds());
        dto.setCompletionDateRequest(request);
        return dto;
    }

    /**
     * Конвертує ExecutionParamsDTO в доменний запит
     */
    public static CompletionDateCalculationRequest toDomainRequest(ExecutionParamsDTO dto) {
        if (dto == null || !dto.hasRequiredParameters()) {
            return null;
        }

        return CompletionDateCalculationRequest.builder()
                .serviceCategoryIds(dto.getServiceCategoryIds())
                .expediteType(dto.getExpediteType())
                .build();
    }

    /**
     * Оновлює ExecutionParamsDTO з доменної відповіді
     */
    public static ExecutionParamsDTO updateWithDomainResponse(
            ExecutionParamsDTO dto,
            CompletionDateResponse response) {
        if (dto == null) {
            return null;
        }

        dto.setCompletionDateResponse(response);
        return dto;
    }

    /**
     * Встановлює тип терміновості
     */
    public static ExecutionParamsDTO withExpediteType(
            ExecutionParamsDTO dto,
            ExpediteType expediteType) {
        if (dto == null) {
            return null;
        }

        dto.setExpediteType(expediteType);
        return dto;
    }

    /**
     * Встановлює ручну дату виконання
     */
    public static ExecutionParamsDTO withManualDate(
            ExecutionParamsDTO dto,
            LocalDate manualDate) {
        if (dto == null) {
            return null;
        }

        dto.setManualExecutionDate(manualDate);
        return dto;
    }

    /**
     * Відключає ручну дату, повертаючись до автоматичного розрахунку
     */
    public static ExecutionParamsDTO disableManualDate(ExecutionParamsDTO dto) {
        if (dto == null) {
            return null;
        }

        dto.setManualExecutionDate(null);
        dto.setUseManualDate(false);
        return dto;
    }

    /**
     * Позначає параметри як завершені
     */
    public static ExecutionParamsDTO markAsComplete(ExecutionParamsDTO dto) {
        if (dto == null) {
            return null;
        }

        if (dto.isReadyForCompletion()) {
            dto.setExecutionParamsComplete(true);
        }
        return dto;
    }

    /**
     * Скидає стан завершення
     */
    public static ExecutionParamsDTO resetCompletion(ExecutionParamsDTO dto) {
        if (dto == null) {
            return null;
        }

        dto.setExecutionParamsComplete(false);
        return dto;
    }

    /**
     * Перевіряє чи потрібен перерахунок після зміни параметрів
     */
    public static boolean needsRecalculation(
            ExecutionParamsDTO dto,
            List<UUID> newServiceCategoryIds,
            ExpediteType newExpediteType) {
        if (dto == null) {
            return true;
        }

        List<UUID> currentCategories = dto.getServiceCategoryIds();
        ExpediteType currentType = dto.getExpediteType();

        boolean categoriesChanged = !equalLists(currentCategories, newServiceCategoryIds);
        boolean expediteTypeChanged = currentType != newExpediteType;

        return categoriesChanged || expediteTypeChanged;
    }

    /**
     * Створює копію DTO з новими параметрами
     */
    public static ExecutionParamsDTO copyWithNewParams(
            ExecutionParamsDTO original,
            List<UUID> serviceCategoryIds,
            ExpediteType expediteType) {
        if (original == null) {
            return null;
        }

        ExecutionParamsDTO copy = new ExecutionParamsDTO(
                original.getSessionId(),
                serviceCategoryIds);
        copy.setExpediteType(expediteType);

        // Копіюємо ручну дату якщо була встановлена
        if (Boolean.TRUE.equals(original.getUseManualDate())) {
            copy.setManualExecutionDate(original.getManualExecutionDate());
        }

        return copy;
    }

    /**
     * Отримує ефективну дату виконання як LocalDate
     */
    public static LocalDate getEffectiveExecutionDateAsLocalDate(ExecutionParamsDTO dto) {
        if (dto == null) {
            return null;
        }

        LocalDateTime effectiveDateTime = dto.getEffectiveExecutionDate();
        return effectiveDateTime != null ? effectiveDateTime.toLocalDate() : null;
    }

    /**
     * Створює сумарну інформацію про параметри виконання
     */
    public static String createExecutionSummary(ExecutionParamsDTO dto) {
        if (dto == null) {
            return "Параметри виконання не встановлені";
        }

        StringBuilder summary = new StringBuilder();

        // Тип терміновості
        ExpediteType expediteType = dto.getExpediteType();
        String expediteText = switch (expediteType) {
            case STANDARD -> "Звичайне виконання";
            case EXPRESS_48H -> "Термінове виконання +50% за 48 год";
            case EXPRESS_24H -> "Термінове виконання +100% за 24 год";
            default -> "Тип виконання: " + expediteType;
        };
        summary.append(expediteText);

        // Дата виконання
        LocalDateTime effectiveDate = dto.getEffectiveExecutionDate();
        if (effectiveDate != null) {
            summary.append(", дата готовності: ")
                   .append(effectiveDate.toLocalDate())
                   .append(" після 14:00");
        }

        // Ручна дата
        if (Boolean.TRUE.equals(dto.getUseManualDate())) {
            summary.append(" (встановлено вручну)");
        }

        return summary.toString();
    }

    /**
     * Утилітний метод для порівняння списків
     */
    private static boolean equalLists(List<UUID> list1, List<UUID> list2) {
        if (list1 == null && list2 == null) {
            return true;
        }
        if (list1 == null || list2 == null) {
            return false;
        }
        if (list1.size() != list2.size()) {
            return false;
        }
        return list1.containsAll(list2) && list2.containsAll(list1);
    }
}
