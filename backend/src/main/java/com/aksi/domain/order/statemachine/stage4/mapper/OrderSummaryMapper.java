package com.aksi.domain.order.statemachine.stage4.mapper;

import java.time.LocalDateTime;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.dto.OrderDTO;
import com.aksi.domain.order.statemachine.stage4.dto.OrderSummaryDTO;

import lombok.extern.slf4j.Slf4j;

/**
 * Mapper для підетапу 4.1 "Перегляд замовлення з детальним розрахунком".
 *
 * Відповідає за конвертацію між:
 * - OrderDTO та OrderSummaryDTO
 * - Оновлення розрахунків з актуальних даних
 */
@Component
@Slf4j
public class OrderSummaryMapper {

    /**
     * Створює OrderSummaryDTO з OrderDTO.
     */
    public OrderSummaryDTO fromOrderDTO(OrderDTO orderDTO) {
        if (orderDTO == null) {
            return createEmptyDTO();
        }

        log.debug("Конвертація OrderDTO в OrderSummaryDTO для замовлення: {}", orderDTO.getId());

        // TODO: Перевірити відповідність полів між OrderDTO та OrderSummaryDTO
        // TODO: Додати обробку поля discountType якщо воно з'явиться в OrderDTO
        // TODO: Додати обробку поля paymentMethod якщо воно з'явиться в OrderDTO
        // TODO: Валідувати правильність розрахунків перед створенням DTO

        return OrderSummaryDTO.builder()
                .receiptNumber(orderDTO.getReceiptNumber())
                .tagNumber(orderDTO.getTagNumber())
                .client(orderDTO.getClient())
                .branchLocation(orderDTO.getBranchLocation())
                .createdDate(orderDTO.getCreatedDate())
                .expectedCompletionDate(orderDTO.getExpectedCompletionDate())
                .items(orderDTO.getItems())
                .subtotalAmount(orderDTO.getTotalAmount())
                .discountAmount(orderDTO.getDiscountAmount())
                .expediteType(orderDTO.getExpediteType())
                .finalAmount(orderDTO.getFinalAmount())
                .prepaymentAmount(orderDTO.getPrepaymentAmount())
                .balanceAmount(orderDTO.getBalanceAmount())
                .customerNotes(orderDTO.getCustomerNotes())
                .internalNotes(orderDTO.getInternalNotes())
                .isLoading(false)
                .hasErrors(false)
                .isReviewed(false)
                .lastUpdated(LocalDateTime.now())
                .build();
    }

    /**
     * Оновлює OrderSummaryDTO з актуальних даних OrderDTO.
     */
    public void updateWithCurrentOrder(OrderSummaryDTO summaryDTO, OrderDTO orderDTO) {
        if (summaryDTO == null || orderDTO == null) {
            return;
        }

        log.debug("Оновлення OrderSummaryDTO з актуальних даних OrderDTO");

        // TODO: Додати валідацію змін для відстеження що саме було оновлено
        // TODO: Додати логування змін критичних полів (суми, дати, тощо)
        // TODO: Розглянути можливість часткового оновлення замість повного

        // Оновлюємо основну інформацію
        summaryDTO.setReceiptNumber(orderDTO.getReceiptNumber());
        summaryDTO.setTagNumber(orderDTO.getTagNumber());
        summaryDTO.setClient(orderDTO.getClient());
        summaryDTO.setBranchLocation(orderDTO.getBranchLocation());
        summaryDTO.setCreatedDate(orderDTO.getCreatedDate());
        summaryDTO.setExpectedCompletionDate(orderDTO.getExpectedCompletionDate());

        // Оновлюємо предмети
        summaryDTO.setItems(orderDTO.getItems());

        // Оновлюємо розрахунки
        summaryDTO.setSubtotalAmount(orderDTO.getTotalAmount());
        summaryDTO.setDiscountAmount(orderDTO.getDiscountAmount());
        summaryDTO.setExpediteType(orderDTO.getExpediteType());
        summaryDTO.setFinalAmount(orderDTO.getFinalAmount());

        // Оновлюємо оплату
        summaryDTO.setPrepaymentAmount(orderDTO.getPrepaymentAmount());
        summaryDTO.setBalanceAmount(orderDTO.getBalanceAmount());

        // Оновлюємо примітки
        summaryDTO.setCustomerNotes(orderDTO.getCustomerNotes());
        summaryDTO.setInternalNotes(orderDTO.getInternalNotes());

        // Позначаємо як оновлено
        summaryDTO.setLastUpdated(LocalDateTime.now());

        // Скидаємо позначку про перегляд, оскільки дані оновились
        summaryDTO.setIsReviewed(false);
    }

    /**
     * Створює порожній OrderSummaryDTO.
     */
    private OrderSummaryDTO createEmptyDTO() {
        return OrderSummaryDTO.builder()
                .isLoading(false)
                .hasErrors(false)
                .isReviewed(false)
                .lastUpdated(LocalDateTime.now())
                .build();
    }
}
