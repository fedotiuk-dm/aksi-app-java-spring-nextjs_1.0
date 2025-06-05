package com.aksi.domain.order.statemachine.stage3.mapper;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.dto.CompletionDateCalculationRequest;
import com.aksi.domain.order.dto.CompletionDateResponse;
import com.aksi.domain.order.dto.OrderCompletionUpdateRequest;
import com.aksi.domain.order.dto.OrderDTO;
import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.model.ExpediteType;
import com.aksi.domain.order.statemachine.stage3.dto.ExecutionParametersDTO;

import lombok.extern.slf4j.Slf4j;

/**
 * Mapper для підетапу 3.1 "Параметри виконання".
 *
 * Відповідає за конвертацію між:
 * - ExecutionParametersDTO та OrderDTO
 * - Даними з CompletionDateService
 * - Розрахунками вартості терміновості
 */
@Component
@Slf4j
public class ExecutionParametersMapper {

    /**
     * Створює ExecutionParametersDTO з OrderDTO.
     */
    public ExecutionParametersDTO fromOrderDTO(OrderDTO orderDTO) {
        if (orderDTO == null) {
            return createEmptyDTO();
        }

        log.debug("Конвертація OrderDTO в ExecutionParametersDTO для замовлення: {}", orderDTO.getId());

        ExecutionParametersDTO.ExecutionParametersDTOBuilder builder = ExecutionParametersDTO.builder()
                .expediteType(orderDTO.getExpediteType() != null ? orderDTO.getExpediteType() : ExpediteType.STANDARD)
                .baseOrderTotal(orderDTO.getTotalAmount())
                .lastUpdated(LocalDateTime.now());

        // Встановлюємо дату виконання
        if (orderDTO.getExpectedCompletionDate() != null) {
            builder.completionDate(orderDTO.getExpectedCompletionDate().toLocalDate())
                   .completionTime("14:00");
        }

        // Аналізуємо предмети замовлення
        if (orderDTO.getItems() != null && !orderDTO.getItems().isEmpty()) {
            analyzeOrderItems(orderDTO.getItems(), builder);
        }

        ExecutionParametersDTO dto = builder.build();

        // Розраховуємо терміновість
        calculateExpediteCharges(dto);

        return dto;
    }

    /**
     * Оновлює OrderDTO з ExecutionParametersDTO.
     */
    public void updateOrderDTO(OrderDTO orderDTO, ExecutionParametersDTO executionParams) {
        if (orderDTO == null || executionParams == null) {
            return;
        }

        log.debug("Оновлення OrderDTO з ExecutionParametersDTO");

        orderDTO.setExpediteType(executionParams.getExpediteType());

        if (executionParams.getCompletionDate() != null) {
            // Конвертуємо LocalDate + час в LocalDateTime
            String time = executionParams.getCompletionTime() != null ?
                         executionParams.getCompletionTime() : "14:00";

            LocalDateTime completionDateTime = executionParams.getCompletionDate().atTime(
                Integer.parseInt(time.split(":")[0]),
                Integer.parseInt(time.split(":")[1])
            );

            orderDTO.setExpectedCompletionDate(completionDateTime);
        }

        // Оновлюємо загальну суму з урахуванням терміновості
        if (executionParams.getFinalOrderTotal() != null) {
            orderDTO.setTotalAmount(executionParams.getFinalOrderTotal());
        }
    }

    /**
     * Створює ExecutionParametersDTO з відповіді CompletionDateService.
     */
    public ExecutionParametersDTO fromCompletionDateResponse(CompletionDateResponse response, List<UUID> categoryIds) {
        if (response == null) {
            return createEmptyDTO();
        }

        log.debug("Конвертація CompletionDateResponse в ExecutionParametersDTO");

        // Створюємо calculation request якщо маємо категорії
        CompletionDateCalculationRequest calculationRequest = null;
        if (categoryIds != null && !categoryIds.isEmpty()) {
            calculationRequest = CompletionDateCalculationRequest.builder()
                    .serviceCategoryIds(categoryIds)
                    .expediteType(ExpediteType.STANDARD) // за замовчуванням
                    .build();
        }

        // Встановлюємо дату виконання з response
        LocalDate completionDate = null;
        if (response.getExpectedCompletionDate() != null) {
            completionDate = response.getExpectedCompletionDate().toLocalDate();
        }

        return ExecutionParametersDTO.builder()
                .expediteType(ExpediteType.STANDARD)
                .completionDate(completionDate)
                .completionTime("14:00")
                .calculationRequest(calculationRequest)
                .calculationResponse(response)
                .lastUpdated(LocalDateTime.now())
                .build();
    }

    /**
     * Перетворює список UUID категорій в список рядків.
     */
    public List<String> convertCategoryIds(List<UUID> categoryUUIDs) {
        if (categoryUUIDs == null) {
            return List.of();
        }

        return categoryUUIDs.stream()
                .map(UUID::toString)
                .toList();
    }

    /**
     * Оновлює ExecutionParametersDTO з новими розрахунками дат.
     */
    public void updateWithDateCalculations(ExecutionParametersDTO dto, CompletionDateResponse response) {
        if (dto == null || response == null) {
            return;
        }

        log.debug("Оновлення ExecutionParametersDTO з розрахунками дат");

        // Оновлюємо calculationResponse
        dto.setCalculationResponse(response);

        // Якщо ще не встановлена дата користувачем, використовуємо розраховану
        if (dto.getCompletionDate() == null && response.getExpectedCompletionDate() != null) {
            dto.setCompletionDate(response.getExpectedCompletionDate().toLocalDate());
        }

        dto.setLastUpdated(LocalDateTime.now());
    }

    /**
     * Аналізує предмети замовлення для визначення категорій і особливостей.
     */
    private void analyzeOrderItems(List<OrderItemDTO> items, ExecutionParametersDTO.ExecutionParametersDTOBuilder builder) {
        boolean hasLeatherItems = false;
        boolean hasNonExpeditableItems = false;
        List<String> categories = items.stream()
                .map(OrderItemDTO::getCategory)
                .distinct()
                .toList();

        for (OrderItemDTO item : items) {
            String category = item.getCategory();

            // Перевірка на шкіряні вироби
            if (category != null && (category.toLowerCase().contains("шкір") ||
                                   category.toLowerCase().contains("leather"))) {
                hasLeatherItems = true;
            }

            // Перевірка на неекспрес категорії
            if (category != null && isNonExpeditableCategory(category)) {
                hasNonExpeditableItems = true;
            }
        }

        builder.hasLeatherItems(hasLeatherItems)
               .hasNonExpeditableItems(hasNonExpeditableItems);
    }

    /**
     * Перевіряє чи категорія не може мати терміновості.
     */
    private boolean isNonExpeditableCategory(String category) {
        if (category == null) return false;

        String categoryLower = category.toLowerCase();
        return categoryLower.contains("прання") ||
               categoryLower.contains("прасування") ||
               categoryLower.contains("фарбування");
    }

    /**
     * Розраховує надбавки за терміновість.
     */
    private void calculateExpediteCharges(ExecutionParametersDTO dto) {
        if (dto.getBaseOrderTotal() == null || dto.getExpediteType() == null) {
            return;
        }

        BigDecimal expeditePercentage = dto.getExpeditePercentage();
        BigDecimal expediteCharge = dto.getBaseOrderTotal().multiply(expeditePercentage);
        BigDecimal finalTotal = dto.getBaseOrderTotal().add(expediteCharge);

        dto.setExpediteChargeAmount(expediteCharge);
        dto.setFinalOrderTotal(finalTotal);

        log.debug("Розраховано надбавку за терміновість: {}% = {} грн",
                 expeditePercentage.multiply(BigDecimal.valueOf(100)), expediteCharge);
    }

    /**
     * Оновлює calculationRequest в ExecutionParametersDTO.
     */
    public void updateCalculationRequest(ExecutionParametersDTO dto, List<UUID> categoryIds) {
        if (dto == null) {
            return;
        }

        CompletionDateCalculationRequest request = CompletionDateCalculationRequest.builder()
                .serviceCategoryIds(categoryIds != null ? categoryIds : List.of())
                .expediteType(dto.getExpediteType() != null ? dto.getExpediteType() : ExpediteType.STANDARD)
                .build();

        dto.setCalculationRequest(request);
    }

    /**
     * Створює OrderCompletionUpdateRequest з ExecutionParametersDTO.
     */
    public OrderCompletionUpdateRequest toOrderCompletionUpdateRequest(ExecutionParametersDTO dto, UUID orderId) {
        if (dto == null || orderId == null) {
            return null;
        }

        LocalDateTime completionDateTime = null;
        if (dto.getCompletionDate() != null) {
            String time = dto.getCompletionTime() != null ? dto.getCompletionTime() : "14:00";
            completionDateTime = dto.getCompletionDate().atTime(
                Integer.parseInt(time.split(":")[0]),
                Integer.parseInt(time.split(":")[1])
            );
        }

        return OrderCompletionUpdateRequest.builder()
                .orderId(orderId)
                .expediteType(dto.getExpediteType())
                .expectedCompletionDate(completionDateTime)
                .build();
    }

    /**
     * Створює порожній DTO з базовими налаштуваннями.
     */
    private ExecutionParametersDTO createEmptyDTO() {
        return ExecutionParametersDTO.builder()
                .expediteType(ExpediteType.STANDARD)
                .completionTime("14:00")
                .lastUpdated(LocalDateTime.now())
                .build();
    }
}
