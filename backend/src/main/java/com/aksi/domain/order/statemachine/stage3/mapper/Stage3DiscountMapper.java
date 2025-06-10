package com.aksi.domain.order.statemachine.stage3.mapper;

import java.math.BigDecimal;
import java.util.UUID;

import com.aksi.domain.order.dto.OrderDiscountRequest;
import com.aksi.domain.order.dto.OrderDiscountResponse;
import com.aksi.domain.order.model.DiscountType;
import com.aksi.domain.order.statemachine.stage3.dto.DiscountConfigurationDTO;

/**
 * Mapper для конвертації DiscountConfigurationDTO та доменних DTO
 * ЕТАП 1.3: Залежить тільки від DTO
 */
public class Stage3DiscountMapper {

    /**
     * Створює DiscountConfigurationDTO з базових параметрів
     */
    public static DiscountConfigurationDTO createFromBasicParams(
            UUID sessionId,
            UUID orderId) {
        return new DiscountConfigurationDTO(sessionId, orderId);
    }

    /**
     * Створює DiscountConfigurationDTO з доменного запиту
     */
    public static DiscountConfigurationDTO fromDomainRequest(
            UUID sessionId,
            OrderDiscountRequest request) {
        if (request == null) {
            return new DiscountConfigurationDTO(sessionId);
        }

        DiscountConfigurationDTO dto = new DiscountConfigurationDTO(sessionId, request.getOrderId());
        dto.setDiscountRequest(request);
        return dto;
    }

    /**
     * Конвертує DiscountConfigurationDTO в доменний запит
     */
    public static OrderDiscountRequest toDomainRequest(DiscountConfigurationDTO dto) {
        if (dto == null || !dto.hasRequiredParameters()) {
            return null;
        }

        return OrderDiscountRequest.builder()
                .orderId(dto.getOrderId())
                .discountType(dto.getDiscountType())
                .discountPercentage(dto.getDiscountPercentage())
                .discountDescription(dto.getDiscountDescription())
                .build();
    }

    /**
     * Оновлює DiscountConfigurationDTO з доменної відповіді
     */
    public static DiscountConfigurationDTO updateWithDomainResponse(
            DiscountConfigurationDTO dto,
            OrderDiscountResponse response) {
        if (dto == null) {
            return null;
        }

        dto.setDiscountResponse(response);

        // Автоматично встановлюємо валідність
        dto.setIsValid(response != null);

        return dto;
    }

    /**
     * Встановлює тип знижки
     */
    public static DiscountConfigurationDTO withDiscountType(
            DiscountConfigurationDTO dto,
            DiscountType discountType) {
        if (dto == null) {
            return null;
        }

        dto.setDiscountType(discountType);
        return dto;
    }

    /**
     * Встановлює користувацький відсоток знижки
     */
    public static DiscountConfigurationDTO withCustomPercentage(
            DiscountConfigurationDTO dto,
            Integer percentage,
            String description) {
        if (dto == null) {
            return null;
        }

        dto.setDiscountType(DiscountType.CUSTOM);
        dto.setDiscountPercentage(percentage);
        dto.setDiscountDescription(description);
        return dto;
    }

    /**
     * Скидає знижку до "без знижки"
     */
    public static DiscountConfigurationDTO resetToNoDiscount(DiscountConfigurationDTO dto) {
        if (dto == null) {
            return null;
        }

        dto.setDiscountType(DiscountType.NO_DISCOUNT);
        dto.setDiscountPercentage(null);
        dto.setDiscountDescription(null);
        return dto;
    }

    /**
     * Позначає конфігурацію знижок як завершену
     */
    public static DiscountConfigurationDTO markAsComplete(DiscountConfigurationDTO dto) {
        if (dto == null) {
            return null;
        }

        if (dto.isReadyForCompletion()) {
            dto.setDiscountConfigComplete(true);
        }
        return dto;
    }

    /**
     * Скидає стан завершення
     */
    public static DiscountConfigurationDTO resetCompletion(DiscountConfigurationDTO dto) {
        if (dto == null) {
            return null;
        }

        dto.setDiscountConfigComplete(false);
        return dto;
    }

    /**
     * Створює копію DTO з новим типом знижки
     */
    public static DiscountConfigurationDTO copyWithNewDiscountType(
            DiscountConfigurationDTO original,
            DiscountType discountType) {
        if (original == null) {
            return null;
        }

        DiscountConfigurationDTO copy = new DiscountConfigurationDTO(
                original.getSessionId(),
                original.getOrderId());
        copy.setDiscountType(discountType);

        // Зберігаємо оригінальну суму
        copy.setOriginalAmount(original.getOriginalAmount());

        return copy;
    }

    /**
     * Розраховує ефективний відсоток знижки
     */
    public static BigDecimal getEffectiveDiscountPercentage(DiscountConfigurationDTO dto) {
        if (dto == null || dto.getDiscountType() == null) {
            return BigDecimal.ZERO;
        }

        DiscountType discountType = dto.getDiscountType();
        return switch (discountType) {
            case NO_DISCOUNT -> BigDecimal.ZERO;
            case EVERCARD -> BigDecimal.valueOf(10);
            case SOCIAL_MEDIA -> BigDecimal.valueOf(5);
            case MILITARY -> BigDecimal.valueOf(10);
            case CUSTOM -> {
                Integer customPercentage = dto.getDiscountPercentage();
                yield customPercentage != null ? BigDecimal.valueOf(customPercentage) : BigDecimal.ZERO;
            }
            default -> BigDecimal.ZERO;
        };
    }

    /**
     * Створює опис знижки
     */
    public static String createDiscountSummary(DiscountConfigurationDTO dto) {
        if (dto == null || dto.getDiscountType() == null) {
            return "Знижка не застосована";
        }

        DiscountType discountType = dto.getDiscountType();
        BigDecimal percentage = getEffectiveDiscountPercentage(dto);

        StringBuilder summary = new StringBuilder();

        String discountText = switch (discountType) {
            case NO_DISCOUNT -> "Без знижки";
            case EVERCARD -> "Знижка Еверкард: " + percentage + "%";
            case SOCIAL_MEDIA -> "Знижка соцмережі: " + percentage + "%";
            case MILITARY -> "Знижка ЗСУ: " + percentage + "%";
            case CUSTOM -> {
                StringBuilder customText = new StringBuilder("Індивідуальна знижка: " + percentage + "%");
                String description = dto.getDiscountDescription();
                if (description != null && !description.trim().isEmpty()) {
                    customText.append(" (").append(description).append(")");
                }
                yield customText.toString();
            }
            default -> "Знижка: " + discountType;
        };
        summary.append(discountText);

        // Додаємо суми якщо є
        if (dto.hasDiscount()) {
            BigDecimal discountAmount = dto.getDiscountAmount();
            BigDecimal finalAmount = dto.getFinalAmount();

            if (discountAmount != null) {
                summary.append(", економія: ").append(discountAmount).append(" грн");
            }
            if (finalAmount != null) {
                summary.append(", до сплати: ").append(finalAmount).append(" грн");
            }
        }

        return summary.toString();
    }

    /**
     * Перевіряє чи змінився тип знижки
     */
    public static boolean hasDiscountTypeChanged(
            DiscountConfigurationDTO dto,
            DiscountType newDiscountType) {
        if (dto == null) {
            return newDiscountType != null;
        }

        DiscountType currentType = dto.getDiscountType();
        return currentType != newDiscountType;
    }

    /**
     * Перевіряє чи є знижка доступною для суми замовлення
     */
    public static boolean isDiscountApplicable(
            DiscountConfigurationDTO dto,
            BigDecimal orderAmount) {
        if (dto == null || orderAmount == null) {
            return false;
        }

        // Базова перевірка - сума повинна бути більше нуля
        return orderAmount.compareTo(BigDecimal.ZERO) > 0;
    }

    /**
     * Встановлює повідомлення валідації
     */
    public static DiscountConfigurationDTO withValidationMessage(
            DiscountConfigurationDTO dto,
            String message,
            boolean isValid) {
        if (dto == null) {
            return null;
        }

        dto.setValidationMessage(message);
        dto.setIsValid(isValid);
        return dto;
    }
}
