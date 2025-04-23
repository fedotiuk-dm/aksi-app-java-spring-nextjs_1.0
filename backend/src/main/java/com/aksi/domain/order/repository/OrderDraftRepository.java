package com.aksi.domain.order.repository;

import com.aksi.domain.client.entity.Client;
import com.aksi.domain.order.entity.OrderDraft;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Репозиторій для роботи з чернетками замовлень.
 */
@Repository
public interface OrderDraftRepository extends JpaRepository<OrderDraft, UUID> {
    
    /**
     * Знайти всі чернетки для конкретного клієнта.
     *
     * @param client клієнт
     * @param pageable параметри пагінації
     * @return сторінка з чернетками
     */
    Page<OrderDraft> findByClient(Client client, Pageable pageable);
    
    /**
     * Знайти всі чернетки, створені конкретним користувачем.
     *
     * @param createdBy ім'я користувача
     * @param pageable параметри пагінації
     * @return сторінка з чернетками
     */
    Page<OrderDraft> findByCreatedBy(String createdBy, Pageable pageable);
    
    /**
     * Знайти всі чернетки клієнта, які не були конвертовані в замовлення.
     *
     * @param client клієнт
     * @param convertedToOrder флаг конвертації в замовлення
     * @return список чернеток
     */
    List<OrderDraft> findByClientAndConvertedToOrder(Client client, boolean convertedToOrder);
    
    /**
     * Знайти всі чернетки за ID клієнта, які не були конвертовані в замовлення.
     *
     * @param clientId ID клієнта
     * @param convertedToOrder флаг конвертації в замовлення
     * @param pageable параметри пагінації
     * @return сторінка з чернетками
     */
    Page<OrderDraft> findByClient_IdAndConvertedToOrder(UUID clientId, boolean convertedToOrder, Pageable pageable);
    
    /**
     * Знайти всі чернетки створені користувачем, які не були конвертовані в замовлення.
     *
     * @param createdBy ім'я користувача
     * @param convertedToOrder флаг конвертації в замовлення
     * @param pageable параметри пагінації
     * @return сторінка з чернетками
     */
    Page<OrderDraft> findByCreatedByAndConvertedToOrder(String createdBy, boolean convertedToOrder, Pageable pageable);
}
