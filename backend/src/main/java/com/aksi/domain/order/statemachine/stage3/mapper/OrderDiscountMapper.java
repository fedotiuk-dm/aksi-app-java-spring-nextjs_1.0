package com.aksi.domain.order.statemachine.stage3.mapper;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.dto.OrderDTO;
import com.aksi.domain.order.dto.OrderDiscountRequest;
import com.aksi.domain.order.dto.OrderDiscountResponse;
import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.model.DiscountType;
import com.aksi.domain.order.model.NonDiscountableCategory;
import com.aksi.domain.order.statemachine.stage3.dto.OrderDiscountDTO;

import lombok.extern.slf4j.Slf4j;

/**
 * Mapper для підетапу 3.2 "Знижки (глобальні для замовлення)".
 *
 * Відповідає за конвертацію між:
 * - OrderDiscountDTO та OrderDTO
 * - Створення OrderDiscountRequest для DiscountService
 * - Аналіз категорій товарів для визначення можливості застосування знижки
 */
@Component
@Slf4j
public class OrderDiscountMapper {

    /**
     * Створює OrderDiscountDTO з OrderDTO.
     */
    public OrderDiscountDTO fromOrderDTO(OrderDTO orderDTO) {
        if (orderDTO == null) {
            return createEmptyDTO();
        }

        log.debug("Конвертація OrderDTO в OrderDiscountDTO для замовлення: {}", orderDTO.getId());

        // Аналізуємо категорії товарів
        List<String> categories = extractOrderItemCategories(orderDTO);
        boolean hasNonDiscountableItems = analyzeNonDiscountableCategories(categories);

        // Створюємо discountRequest з базовими налаштуваннями
        OrderDiscountRequest discountRequest = OrderDiscountRequest.builder()
                .orderId(orderDTO.getId())
                .discountType(DiscountType.NO_DISCOUNT)  // За замовчуванням без знижки
                .build();

        // Створюємо discountResponse якщо є дані про знижку
        OrderDiscountResponse discountResponse = null;
        if (orderDTO.getDiscountAmount() != null && orderDTO.getDiscountAmount().compareTo(BigDecimal.ZERO) > 0) {
            discountResponse = OrderDiscountResponse.builder()
                    .orderId(orderDTO.getId())
                    .discountType(DiscountType.NO_DISCOUNT)  // Поки невідомо який тип
                    .totalAmount(orderDTO.getTotalAmount())
                    .discountAmount(orderDTO.getDiscountAmount())
                    .finalAmount(orderDTO.getFinalAmount())
                    .build();
        }

        return OrderDiscountDTO.builder()
                .discountRequest(discountRequest)
                .discountResponse(discountResponse)
                .orderItemCategories(categories)
                .hasNonDiscountableItems(hasNonDiscountableItems)
                .lastUpdated(LocalDateTime.now())
                .build();
    }

    /**
     * Оновлює OrderDTO з OrderDiscountDTO.
     */
    public void updateOrderDTO(OrderDTO orderDTO, OrderDiscountDTO discountDTO) {
        if (orderDTO == null || discountDTO == null) {
            return;
        }

        log.debug("Оновлення OrderDTO з OrderDiscountDTO");

        // OrderDTO має тільки discountAmount, тип знижки зберігається в OrderEntity
        // Оновлюємо суми якщо є discountResponse
        if (discountDTO.getDiscountResponse() != null) {
            orderDTO.setDiscountAmount(discountDTO.getDiscountAmount());
            orderDTO.setFinalAmount(discountDTO.getFinalAmount());
        } else if (discountDTO.getDiscountType() == DiscountType.NO_DISCOUNT) {
            // Очищаємо знижку
            orderDTO.setDiscountAmount(null);
        }
    }

    /**
     * Створює OrderDiscountRequest з OrderDiscountDTO.
     */
    public OrderDiscountRequest toOrderDiscountRequest(OrderDiscountDTO dto) {
        if (dto == null || dto.getDiscountRequest() == null) {
            return null;
        }

        return dto.getDiscountRequest();
    }

    /**
     * Оновлює OrderDiscountDTO з OrderDiscountResponse.
     */
    public void updateWithDiscountResponse(OrderDiscountDTO dto, OrderDiscountResponse response) {
        if (dto == null || response == null) {
            return;
        }

        log.debug("Оновлення OrderDiscountDTO з OrderDiscountResponse");

        dto.setDiscountResponse(response);

        // Оновлюємо статуси та попередження
        updateDiscountWarnings(dto);
        dto.setLastUpdated(LocalDateTime.now());
    }

    /**
     * Створює OrderDiscountDTO з нуля для нового замовлення.
     */
    public OrderDiscountDTO createForNewOrder(UUID orderId, List<String> categories) {
        if (orderId == null) {
            return createEmptyDTO();
        }

        log.debug("Створення OrderDiscountDTO для нового замовлення: {}", orderId);

        boolean hasNonDiscountableItems = analyzeNonDiscountableCategories(categories);

        OrderDiscountRequest discountRequest = OrderDiscountRequest.builder()
                .orderId(orderId)
                .discountType(DiscountType.NO_DISCOUNT)
                .build();

        return OrderDiscountDTO.builder()
                .discountRequest(discountRequest)
                .orderItemCategories(categories != null ? categories : List.of())
                .hasNonDiscountableItems(hasNonDiscountableItems)
                .lastUpdated(LocalDateTime.now())
                .build();
    }

    /**
     * Оновлює тип знижки в OrderDiscountDTO.
     */
    public void updateDiscountType(OrderDiscountDTO dto, DiscountType discountType, Integer percentage, String description) {
        if (dto == null) {
            return;
        }

        log.debug("Оновлення типу знижки в OrderDiscountDTO: {}", discountType);

        // Оновлюємо discountRequest
        if (dto.getDiscountRequest() == null) {
            dto.setDiscountRequest(OrderDiscountRequest.builder().build());
        }

        dto.getDiscountRequest().setDiscountType(discountType);
        dto.getDiscountRequest().setDiscountPercentage(percentage);
        dto.getDiscountRequest().setDiscountDescription(description);

        // Очищаємо discountResponse при зміні типу знижки
        dto.setDiscountResponse(null);

        // Оновлюємо попередження
        updateDiscountWarnings(dto);
        dto.setLastUpdated(LocalDateTime.now());
    }

    /**
     * Витягує список категорій товарів з OrderDTO.
     */
    private List<String> extractOrderItemCategories(OrderDTO orderDTO) {
        if (orderDTO.getItems() == null || orderDTO.getItems().isEmpty()) {
            return List.of();
        }

        return orderDTO.getItems().stream()
                .map(OrderItemDTO::getCategory)
                .distinct()
                .toList();
    }

    /**
     * Аналізує чи є в замовленні категорії що не підлягають знижкам.
     */
    private boolean analyzeNonDiscountableCategories(List<String> categories) {
        if (categories == null || categories.isEmpty()) {
            return false;
        }

        return categories.stream()
                .anyMatch(NonDiscountableCategory::isNonDiscountable);
    }

    /**
     * Оновлює попередження про знижки.
     */
    public void updateDiscountWarnings(OrderDiscountDTO dto) {
        if (dto == null) {
            return;
        }

        if (dto.getDiscountType() == DiscountType.NO_DISCOUNT) {
            dto.setShowDiscountWarning(false);
            dto.setDiscountWarningText(null);
            dto.setHasNonDiscountableItems(false);
            return;
        }

        // Аналізуємо категорії замовлення
        List<String> categories = dto.getOrderItemCategories();
        if (categories == null || categories.isEmpty()) {
            dto.setShowDiscountWarning(false);
            dto.setDiscountWarningText(null);
            dto.setHasNonDiscountableItems(false);
            return;
        }

        // Знаходимо категорії що не підлягають знижкам
        List<String> nonDiscountableCategories = categories.stream()
                .filter(NonDiscountableCategory::isNonDiscountable)
                .toList();

        boolean hasNonDiscountableItems = !nonDiscountableCategories.isEmpty();
        dto.setHasNonDiscountableItems(hasNonDiscountableItems);
        dto.setShowDiscountWarning(hasNonDiscountableItems);

        if (hasNonDiscountableItems) {
            String warningText = generateDiscountWarningText(nonDiscountableCategories);
            dto.setDiscountWarningText(warningText);
        } else {
            dto.setDiscountWarningText(null);
        }
    }

    /**
     * Генерує текст попередження про знижку.
     */
    private String generateDiscountWarningText(List<String> nonDiscountableCategories) {
        StringBuilder warning = new StringBuilder();
        warning.append("Увага! Знижка не буде застосована до наступних категорій: ");
        warning.append(String.join(", ", nonDiscountableCategories));
        warning.append(". Ці категорії не підлягають знижкам згідно з правилами компанії.");
        return warning.toString();
    }

    /**
     * Створює порожній DTO з базовими налаштуваннями.
     */
    private OrderDiscountDTO createEmptyDTO() {
        OrderDiscountRequest emptyRequest = OrderDiscountRequest.builder()
                .discountType(DiscountType.NO_DISCOUNT)
                .build();

        return OrderDiscountDTO.builder()
                .discountRequest(emptyRequest)
                .orderItemCategories(List.of())
                .hasNonDiscountableItems(false)
                .showDiscountWarning(false)
                .hasErrors(false)
                .lastUpdated(LocalDateTime.now())
                .build();
    }
}
