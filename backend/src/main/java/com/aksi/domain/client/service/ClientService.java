package com.aksi.domain.client.service;

import java.util.List;
import java.util.UUID;

import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.client.dto.CreateClientRequest;
import com.aksi.domain.client.dto.UpdateClientRequest;

/**
 * Інтерфейс сервісу для роботи з клієнтами.
 */
public interface ClientService {

    /**
     * Отримання всіх клієнтів.
     * @return список всіх клієнтів
     */
    List<ClientResponse> getAllClients();

    /**
     * Отримання клієнта за ідентифікатором.
     * @param id ідентифікатор клієнта
     * @return дані клієнта
     */
    ClientResponse getClientById(UUID id);

    /**
     * Пошук клієнтів за ключовим словом.
     * @param keyword ключове слово для пошуку
     * @return список знайдених клієнтів
     */
    List<ClientResponse> searchClients(String keyword);

    /**
     * Створення нового клієнта.
     * @param request дані для створення клієнта
     * @return створений клієнт
     */
    ClientResponse createClient(CreateClientRequest request);

    /**
     * Оновлення даних клієнта.
     * @param id ідентифікатор клієнта
     * @param request дані для оновлення
     * @return оновлені дані клієнта
     */
    ClientResponse updateClient(UUID id, UpdateClientRequest request);

    /**
     * Видалення клієнта.
     * @param id ідентифікатор клієнта
     */
    void deleteClient(UUID id);
}
