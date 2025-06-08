package com.aksi.domain.order.statemachine.mapper;

import java.time.LocalDateTime;
import java.util.Map;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

import com.aksi.domain.order.statemachine.dto.OrderWizardSessionResponse;
import com.aksi.domain.order.statemachine.dto.WizardContextDTO;
import com.aksi.domain.order.statemachine.entity.OrderWizardSessionEntity;

/**
 * MapStruct маппер для перетворення між Entity та DTO в Order Wizard.
 *
 * Забезпечує конвертацію між:
 * - OrderWizardSessionEntity ↔ OrderWizardSessionResponse
 * - OrderWizardSessionEntity + Map<String, Object> → WizardContextDTO
 *
 * Використовує MapStruct для автоматичної генерації коду.
 */
@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    imports = {LocalDateTime.class}
)
public interface OrderWizardMapper {

    /**
     * Конвертує OrderWizardSessionEntity в OrderWizardSessionResponse.
     */
    @Mapping(target = "isExpired", source = ".", qualifiedByName = "calculateIsExpired")
    OrderWizardSessionResponse toSessionResponse(OrderWizardSessionEntity entity);

    /**
     * Конвертує OrderWizardSessionEntity та дані wizard в WizardContextDTO.
     */
    @Mapping(target = "extendedData", source = "wizardData")
    @Mapping(target = "selectedClient", ignore = true) // Буде заповнено з extendedData
    @Mapping(target = "selectedBranch", ignore = true) // Буде заповнено з extendedData
    @Mapping(target = "orderItems", ignore = true) // Буде заповнено з extendedData
    WizardContextDTO toContextDTO(OrderWizardSessionEntity entity, Map<String, Object> wizardData);

    /**
     * Перевіряє чи закінчилася сесія.
     */
    @Named("calculateIsExpired")
    default Boolean calculateIsExpired(OrderWizardSessionEntity entity) {
        if (entity.getExpiresAt() == null) {
            return false;
        }
        return LocalDateTime.now().isAfter(entity.getExpiresAt());
    }

    /**
     * Створює базовий WizardContextDTO з мінімальними даними.
     */
    default WizardContextDTO createBasicContext(String wizardId,
                                                com.aksi.domain.order.statemachine.OrderState currentState) {
        return WizardContextDTO.builder()
            .wizardId(wizardId)
            .currentState(currentState)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();
    }
}
