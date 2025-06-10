package com.aksi.domain.order.statemachine.stage3.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.dto.AdditionalRequirementsRequest;
import com.aksi.domain.order.dto.AdditionalRequirementsResponse;
import com.aksi.domain.order.service.OrderRequirementsService;

/**
 * Операційний сервіс для роботи з додатковою інформацією Stage3.
 * Тонка обгортка навколо доменного сервісу OrderRequirementsService.
 *
 * ЕТАП 3.2: Operations Services (тонкі обгортки)
 * Дозволені імпорти: ТІЛЬКИ доменні сервіси, DTO, Spring аннотації, Java стандартні
 * Заборонено: Stage3 Services, Validators, Actions, Guards, Config
 */
@Service
public class Stage3AdditionalInfoOperationsService {

    private final OrderRequirementsService requirementsService;

    public Stage3AdditionalInfoOperationsService(OrderRequirementsService requirementsService) {
        this.requirementsService = requirementsService;
    }

    /**
     * Оновлює додаткові вимоги для замовлення
     */
    public AdditionalRequirementsResponse updateRequirements(AdditionalRequirementsRequest request) {
        return requirementsService.updateRequirements(request);
    }

    /**
     * Отримує додаткові вимоги для замовлення
     */
    public AdditionalRequirementsResponse getRequirements(UUID orderId) {
        return requirementsService.getRequirements(orderId);
    }

    /**
     * Валідує текстові поля на довжину
     */
    public boolean validateTextLength(String text, int maxLength) {
        return text == null || text.length() <= maxLength;
    }

    /**
     * Очищає порожні рядки
     */
    public String sanitizeText(String text) {
        if (text == null || text.trim().isEmpty()) {
            return null;
        }
        return text.trim();
    }

    /**
     * Перевіряє чи є текст не порожнім
     */
    public boolean hasContent(String text) {
        return text != null && !text.trim().isEmpty();
    }
}
