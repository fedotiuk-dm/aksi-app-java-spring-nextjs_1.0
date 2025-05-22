package com.aksi.domain.client.service;

import java.util.List;
import java.util.UUID;

import com.aksi.domain.client.dto.ClientPageResponse;
import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.client.dto.ClientSearchRequest;
import com.aksi.domain.client.dto.CreateClientRequest;
import com.aksi.domain.client.dto.UpdateClientRequest;

/**
 * Інтерфейс сервісу для роботи з клієнтами.
 */
public interface ClientService {

    /**
     * Отримання всіх клієнтів.
     * @return список всіх клієнтів
     * @deprecated Використовуйте getAllClientsPaged для підтримки пагінації
     */
    @Deprecated
    List<ClientResponse> getAllClients();

    /**
     * Отримання всіх клієнтів з пагінацією.
     * @param page номер сторінки (з 0)
     * @param size розмір сторінки
     * @return сторінка з клієнтами
     */
    ClientPageResponse getAllClientsPaged(int page, int size);

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
     * @deprecated Використовуйте searchClients(ClientSearchRequest) для підтримки пагінації
     */
    @Deprecated
    List<ClientResponse> searchClients(String keyword);

    /**
     * Пошук клієнтів з пагінацією.
     * @param request параметри пошуку і пагінації
     * @return сторінка з клієнтами
     */
    ClientPageResponse searchClients(ClientSearchRequest request);

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
