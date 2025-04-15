package com.aksi.service.client;

import com.aksi.dto.client.*;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

/**
 * Інтерфейс сервісу для роботи з клієнтами
 */
public interface ClientService {
    
    /**
     * Отримання списку клієнтів з пагінацією, сортуванням та пошуком
     * @param request параметри пошуку
     * @return сторінка з клієнтами
     */
    Page<ClientResponse> searchClients(ClientSearchRequest request);
    
    /**
     * Отримання клієнта за ідентифікатором
     * @param id ідентифікатор клієнта
     * @return дані клієнта
     */
    ClientResponse getClientById(UUID id);
    
    /**
     * Створення нового клієнта
     * @param request дані для створення клієнта
     * @return створений клієнт
     */
    ClientResponse createClient(ClientCreateRequest request);
    
    /**
     * Оновлення клієнта
     * @param id ідентифікатор клієнта
     * @param request дані для оновлення клієнта
     * @return оновлений клієнт
     */
    ClientResponse updateClient(UUID id, ClientUpdateRequest request);
    
    /**
     * Видалення клієнта
     * @param id ідентифікатор клієнта
     */
    void deleteClient(UUID id);
    
    /**
     * Отримання найбільш лояльних клієнтів
     * @param limit кількість клієнтів
     * @return список найбільш лояльних клієнтів
     */
    List<ClientResponse> getTopLoyalClients(int limit);
    
    /**
     * Отримання клієнтів з найбільшою сумою замовлень
     * @param limit кількість клієнтів
     * @return список клієнтів з найбільшою сумою замовлень
     */
    List<ClientResponse> getTopSpendingClients(int limit);
} 