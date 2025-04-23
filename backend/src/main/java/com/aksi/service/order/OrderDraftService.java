package com.aksi.service.order;

import com.aksi.dto.order.OrderDraftDto;
import com.aksi.dto.order.OrderDraftRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

/**
 * Сервіс для роботи з чернетками замовлень.
 */
public interface OrderDraftService {

    /**
     * Створити нову чернетку замовлення.
     *
     * @param request запит на створення чернетки
     * @param username ім'я користувача, який створює чернетку
     * @return створена чернетка
     */
    OrderDraftDto createDraft(OrderDraftRequest request, String username);
    
    /**
     * Оновити існуючу чернетку замовлення.
     *
     * @param id ID чернетки
     * @param request дані для оновлення
     * @param username ім'я користувача, який оновлює чернетку
     * @return оновлена чернетка
     */
    OrderDraftDto updateDraft(UUID id, OrderDraftRequest request, String username);
    
    /**
     * Отримати чернетку за ID.
     *
     * @param id ID чернетки
     * @return чернетка замовлення
     */
    OrderDraftDto getDraftById(UUID id);
    
    /**
     * Отримати всі чернетки для клієнта.
     *
     * @param clientId ID клієнта
     * @param pageable параметри пагінації
     * @return сторінка з чернетками
     */
    Page<OrderDraftDto> getDraftsByClient(UUID clientId, Pageable pageable);
    
    /**
     * Отримати всі чернетки, створені користувачем.
     *
     * @param username ім'я користувача
     * @param pageable параметри пагінації
     * @return сторінка з чернетками
     */
    Page<OrderDraftDto> getDraftsByUser(String username, Pageable pageable);
    
    /**
     * Видалити чернетку.
     *
     * @param id ID чернетки
     */
    void deleteDraft(UUID id);
    
    /**
     * Позначити чернетку як конвертовану в замовлення.
     *
     * @param draftId ID чернетки
     * @param orderId ID замовлення
     * @return оновлена чернетка
     */
    OrderDraftDto markAsConverted(UUID draftId, UUID orderId);
}
