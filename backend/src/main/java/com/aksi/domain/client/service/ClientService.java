package com.aksi.domain.client.service;

import java.util.UUID;

import com.aksi.api.client.dto.*;

/**
 * Сервіс для роботи з клієнтами хімчистки. Містить бізнес-логіку домену Client.
 */
public interface ClientService {

  /**
   * Створити нового клієнта.
   */
  ClientResponse createClient(CreateClientRequest request);

  /**
   * Отримати клієнта за ID.
   */
  ClientResponse getClientById(UUID id);

  /**
   * Отримати список клієнтів з пагінацією.
   */
  ClientPageResponse getClients(Integer page, Integer size, String sort);

  /**
   * Оновити існуючого клієнта.
   */
  ClientResponse updateClient(UUID id, UpdateClientRequest request);

  /**
   * Видалити клієнта (м'яке видалення).
   */
  void deleteClient(UUID id);

  /**
   * Отримати статистику клієнта.
   */
  ClientStatistics getClientStatistics(UUID id);
}
