package com.aksi.domain.order.statemachine.stage3.mapper;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.dto.OrderDTO;
import com.aksi.domain.order.statemachine.stage3.dto.OrderAdditionalInfoDTO;

import lombok.extern.slf4j.Slf4j;

/**
 * Mapper для підетапу 3.4 "Додаткова інформація".
 *
 * Відповідає за конвертацію між:
 * - OrderAdditionalInfoDTO та OrderDTO
 * - Створення DTO з базових даних
 * - Оновлення OrderDTO з додатковою інформацією
 */
@Component
@Slf4j
public class OrderAdditionalInfoMapper {

    /**
     * Створює OrderAdditionalInfoDTO з OrderDTO.
     */
    public OrderAdditionalInfoDTO fromOrderDTO(OrderDTO orderDTO) {
        if (orderDTO == null) {
            return createEmptyDTO();
        }

        log.debug("Конвертація OrderDTO в OrderAdditionalInfoDTO для замовлення: {}", orderDTO.getId());

        return OrderAdditionalInfoDTO.builder()
                .orderId(orderDTO.getId())
                .orderNotes(orderDTO.getInternalNotes())
                .customerRequirements(orderDTO.getCustomerNotes())
                .hasCriticalInfo(extractHasCriticalInfo(orderDTO))
                .criticalInfoText(extractCriticalInfoText(orderDTO))
                .requiresAdditionalConfirmation(extractRequiresAdditionalConfirmation(orderDTO))
                .confirmationReason(extractConfirmationReason(orderDTO))
                .hasErrors(false)
                .isComplete(true)
                .lastUpdated(LocalDateTime.now())
                .build();
    }

    /**
     * Оновлює OrderDTO з OrderAdditionalInfoDTO.
     */
    public void updateOrderDTO(OrderDTO orderDTO, OrderAdditionalInfoDTO additionalInfoDTO) {
        if (orderDTO == null || additionalInfoDTO == null) {
            return;
        }

        log.debug("Оновлення OrderDTO з OrderAdditionalInfoDTO");

        // Оновлюємо базові поля
        orderDTO.setInternalNotes(additionalInfoDTO.getOrderNotes());
        orderDTO.setCustomerNotes(additionalInfoDTO.getCustomerRequirements());

        // Додаємо інформацію про критичні дані та підтвердження до внутрішніх приміток
        // оскільки OrderDTO може не мати окремих полів для них
        String enhancedNotes = buildEnhancedNotes(additionalInfoDTO);
        if (enhancedNotes != null && !enhancedNotes.trim().isEmpty()) {
            orderDTO.setInternalNotes(enhancedNotes);
        }
    }

    /**
     * Створює OrderAdditionalInfoDTO з нуля для нового замовлення.
     */
    public OrderAdditionalInfoDTO createForNewOrder(UUID orderId) {
        if (orderId == null) {
            return createEmptyDTO();
        }

        log.debug("Створення OrderAdditionalInfoDTO для нового замовлення: {}", orderId);

        return OrderAdditionalInfoDTO.builder()
                .orderId(orderId)
                .orderNotes(null)
                .customerRequirements(null)
                .hasCriticalInfo(false)
                .criticalInfoText(null)
                .requiresAdditionalConfirmation(false)
                .confirmationReason(null)
                .hasErrors(false)
                .isComplete(false)
                .lastUpdated(LocalDateTime.now())
                .build();
    }

    /**
     * Оновлює примітки до замовлення.
     */
    public void updateOrderNotes(OrderAdditionalInfoDTO dto, String notes) {
        if (dto == null) {
            return;
        }

        log.debug("Оновлення примітки до замовлення");

        dto.setOrderNotes(notes);
        dto.updateLastModified();
    }

    /**
     * Оновлює вимоги клієнта.
     */
    public void updateCustomerRequirements(OrderAdditionalInfoDTO dto, String requirements) {
        if (dto == null) {
            return;
        }

        log.debug("Оновлення вимог клієнта");

        dto.setCustomerRequirements(requirements);
        dto.updateLastModified();
    }

    /**
     * Оновлює критичну інформацію.
     */
    public void updateCriticalInfo(OrderAdditionalInfoDTO dto, boolean hasCriticalInfo, String criticalInfoText) {
        if (dto == null) {
            return;
        }

        log.debug("Оновлення критичної інформації: {}", hasCriticalInfo);

        dto.setHasCriticalInfo(hasCriticalInfo);
        dto.setCriticalInfoText(hasCriticalInfo ? criticalInfoText : null);
        dto.updateLastModified();
    }

    /**
     * Оновлює інформацію про додаткове підтвердження.
     */
    public void updateAdditionalConfirmation(OrderAdditionalInfoDTO dto, boolean requiresConfirmation, String reason) {
        if (dto == null) {
            return;
        }

        log.debug("Оновлення додаткового підтвердження: {}", requiresConfirmation);

        dto.setRequiresAdditionalConfirmation(requiresConfirmation);
        dto.setConfirmationReason(requiresConfirmation ? reason : null);
        dto.updateLastModified();
    }

    /**
     * Очищає всю додаткову інформацію.
     */
    public void clearAllAdditionalInfo(OrderAdditionalInfoDTO dto) {
        if (dto == null) {
            return;
        }

        log.debug("Очищення всієї додаткової інформації");

        dto.setOrderNotes(null);
        dto.setCustomerRequirements(null);
        dto.setHasCriticalInfo(false);
        dto.setCriticalInfoText(null);
        dto.setRequiresAdditionalConfirmation(false);
        dto.setConfirmationReason(null);
        dto.clearErrors();
        dto.updateLastModified();
    }

    /**
     * Створює копію DTO для редагування.
     */
    public OrderAdditionalInfoDTO createEditableCopy(OrderAdditionalInfoDTO original) {
        if (original == null) {
            return createEmptyDTO();
        }

        return OrderAdditionalInfoDTO.builder()
                .orderId(original.getOrderId())
                .orderNotes(original.getOrderNotes())
                .customerRequirements(original.getCustomerRequirements())
                .hasCriticalInfo(original.getHasCriticalInfo())
                .criticalInfoText(original.getCriticalInfoText())
                .requiresAdditionalConfirmation(original.getRequiresAdditionalConfirmation())
                .confirmationReason(original.getConfirmationReason())
                .hasErrors(false)
                .isComplete(original.getIsComplete())
                .lastUpdated(LocalDateTime.now())
                .build();
    }

    // Приватні допоміжні методи

    /**
     * Витягує інформацію про наявність критичних даних з OrderDTO.
     */
    private Boolean extractHasCriticalInfo(OrderDTO orderDTO) {
        // Можна шукати ключові слова в примітках або перевіряти спеціальні поля
        String notes = orderDTO.getInternalNotes();
        if (notes != null) {
            String lowerNotes = notes.toLowerCase();
            return lowerNotes.contains("критичн") || lowerNotes.contains("увага") || lowerNotes.contains("важливо");
        }
        return false;
    }

    /**
     * Витягує текст критичної інформації з OrderDTO.
     */
    private String extractCriticalInfoText(OrderDTO orderDTO) {
        // Можна парсити примітки для пошуку критичної інформації
        // Поки що просто повертаємо null
        return null;
    }

    /**
     * Витягує інформацію про необхідність додаткового підтвердження.
     */
    private Boolean extractRequiresAdditionalConfirmation(OrderDTO orderDTO) {
        // Можна шукати ключові слова що вказують на необхідність підтвердження
        String notes = orderDTO.getInternalNotes();
        if (notes != null) {
            String lowerNotes = notes.toLowerCase();
            return lowerNotes.contains("підтверд") || lowerNotes.contains("узгод") || lowerNotes.contains("погодж");
        }
        return false;
    }

    /**
     * Витягує причину додаткового підтвердження.
     */
    private String extractConfirmationReason(OrderDTO orderDTO) {
        // Поки що просто повертаємо null
        return null;
    }

    /**
     * Будує розширені примітки з включенням критичної інформації та підтвердження.
     */
    private String buildEnhancedNotes(OrderAdditionalInfoDTO dto) {
        StringBuilder notes = new StringBuilder();

        // Додаємо основні примітки
        if (dto.hasOrderNotes()) {
            notes.append(dto.getOrderNotes());
        }

        // Додаємо критичну інформацію
        if (Boolean.TRUE.equals(dto.getHasCriticalInfo()) && dto.getCriticalInfoText() != null) {
            if (notes.length() > 0) notes.append("\n\n");
            notes.append("⚠️ КРИТИЧНА ІНФОРМАЦІЯ: ").append(dto.getCriticalInfoText());
        }

        // Додаємо інформацію про підтвердження
        if (Boolean.TRUE.equals(dto.getRequiresAdditionalConfirmation()) && dto.getConfirmationReason() != null) {
            if (notes.length() > 0) notes.append("\n\n");
            notes.append("❗ ПОТРЕБУЄ ПІДТВЕРДЖЕННЯ: ").append(dto.getConfirmationReason());
        }

        // Додаємо вимоги клієнта
        if (dto.hasCustomerRequirements()) {
            if (notes.length() > 0) notes.append("\n\n");
            notes.append("👤 ВИМОГИ КЛІЄНТА: ").append(dto.getCustomerRequirements());
        }

        return notes.length() > 0 ? notes.toString() : null;
    }

    /**
     * Створює порожній DTO з базовими налаштуваннями.
     */
    private OrderAdditionalInfoDTO createEmptyDTO() {
        return OrderAdditionalInfoDTO.builder()
                .orderNotes(null)
                .customerRequirements(null)
                .hasCriticalInfo(false)
                .criticalInfoText(null)
                .requiresAdditionalConfirmation(false)
                .confirmationReason(null)
                .hasErrors(false)
                .isComplete(false)
                .lastUpdated(LocalDateTime.now())
                .build();
    }
}
