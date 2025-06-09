package com.aksi.domain.order.statemachine.stage1.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.client.dto.ClientPageResponse;
import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.client.dto.ClientSearchRequest;
import com.aksi.domain.client.service.ClientService;
import com.aksi.domain.order.statemachine.stage1.dto.ClientSearchCriteriaDTO;
import com.aksi.domain.order.statemachine.stage1.dto.ClientSearchResultDTO;
import com.aksi.domain.order.statemachine.stage1.mapper.ClientSearchMapper;

/**
 * Тонка обгортка навколо ClientService для операцій пошуку в етапі 1.1.
 * Відповідає тільки за адаптацію викликів до основного доменного сервісу.
 */
@Service
public class ClientSearchOperationsService {

    private final ClientService clientService;

    public ClientSearchOperationsService(ClientService clientService) {
        this.clientService = clientService;
    }

    /**
     * Виконує пошук клієнтів за критеріями.
     */
    public ClientSearchResultDTO searchClients(ClientSearchCriteriaDTO criteria) {
        long startTime = System.currentTimeMillis();

        try {
            List<ClientResponse> clients;

            // Вибираємо тип пошуку залежно від критеріїв
            if (criteria.hasSpecificCriteria()) {
                clients = searchBySpecificCriteria(criteria);
            } else if (criteria.getGeneralSearchTerm() != null) {
                clients = searchByGeneralTerm(criteria.getGeneralSearchTerm());
            } else {
                clients = List.of();
            }

            // Створюємо результат пошуку
            ClientSearchResultDTO result = ClientSearchMapper.createSearchResult(clients, criteria);
            result.setSearchTimeMs(System.currentTimeMillis() - startTime);

            return result;

        } catch (Exception e) {
            // У разі помилки повертаємо порожній результат
            ClientSearchResultDTO result = ClientSearchMapper.createEmptyResult(criteria);
            result.setSearchTimeMs(System.currentTimeMillis() - startTime);
            return result;
        }
    }

    /**
     * Отримує клієнта за ID.
     */
    public ClientResponse getClientById(UUID clientId) {
        try {
            return clientService.getClientById(clientId);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Перевіряє чи існує клієнт з такими даними (пошук дублікатів).
     */
    public boolean checkClientExists(ClientResponse client) {
        try {
            ClientSearchCriteriaDTO duplicateSearch =
                ClientSearchMapper.createDuplicateSearchCriteria(client);
            ClientSearchResultDTO result = searchClients(duplicateSearch);

            // Перевіряємо чи знайдені клієнти - це дійсно дублікати
            return result.hasResults() &&
                   result.getClients().stream()
                          .anyMatch(foundClient -> isDuplicate(client, foundClient));
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Отримує список всіх активних клієнтів (для випадку порожнього пошуку).
     */
    public List<ClientResponse> getAllActiveClients() {
        try {
            ClientPageResponse pageResponse = clientService.getAllClientsPaged(0, 100);
            return pageResponse.getContent();
        } catch (Exception e) {
            return List.of();
        }
    }

    /**
     * Пошук за специфічними критеріями.
     */
    private List<ClientResponse> searchBySpecificCriteria(ClientSearchCriteriaDTO criteria) {
        // Будуємо пошуковий термін з найбільш специфічного критерію
        String searchTerm = buildSearchTerm(criteria);
        if (searchTerm.isEmpty()) {
            return List.of();
        }

        ClientSearchRequest request = ClientSearchRequest.builder()
                .query(searchTerm)
                .page(0)
                .size(100) // Достатньо для більшості випадків
                .build();

        ClientPageResponse pageResponse = clientService.searchClients(request);
        return pageResponse.getContent();
    }

    /**
     * Будує пошуковий термін з критеріїв.
     */
    private String buildSearchTerm(ClientSearchCriteriaDTO criteria) {
        // Пріоритет: телефон > email > ім'я+прізвище > прізвище > ім'я
        if (hasText(criteria.getPhone())) {
            return criteria.getPhone().trim();
        } else if (hasText(criteria.getEmail())) {
            return criteria.getEmail().trim();
        } else if (hasText(criteria.getLastName()) && hasText(criteria.getFirstName())) {
            return (criteria.getFirstName() + " " + criteria.getLastName()).trim();
        } else if (hasText(criteria.getLastName())) {
            return criteria.getLastName().trim();
        } else if (hasText(criteria.getFirstName())) {
            return criteria.getFirstName().trim();
        } else if (hasText(criteria.getAddress())) {
            return criteria.getAddress().trim();
        } else {
            return "";
        }
    }

    /**
     * Пошук за загальним терміном.
     */
    private List<ClientResponse> searchByGeneralTerm(String searchTerm) {
        ClientSearchRequest request = ClientSearchRequest.builder()
                .query(searchTerm)
                .page(0)
                .size(100)
                .build();

        ClientPageResponse pageResponse = clientService.searchClients(request);
        return pageResponse.getContent();
    }

    /**
     * Перевіряє чи два клієнти є дублікатами.
     */
    private boolean isDuplicate(ClientResponse client1, ClientResponse client2) {
        if (client1 == null || client2 == null) {
            return false;
        }

        // Не враховуємо один і той самий клієнт
        if (client1.getId().equals(client2.getId())) {
            return false;
        }

        // Перевіряємо по телефону (найбільш надійний критерій)
        if (hasText(client1.getPhone()) && hasText(client2.getPhone())) {
            String phone1 = normalizePhone(client1.getPhone());
            String phone2 = normalizePhone(client2.getPhone());
            if (phone1.equals(phone2)) {
                return true;
            }
        }

        // Перевіряємо по email
        if (hasText(client1.getEmail()) && hasText(client2.getEmail())) {
            if (client1.getEmail().equalsIgnoreCase(client2.getEmail())) {
                return true;
            }
        }

        return false;
    }

    /**
     * Нормалізує номер телефону для порівняння.
     */
    private String normalizePhone(String phone) {
        return phone.replaceAll("[\\s\\-\\(\\)\\+]", "");
    }

    /**
     * Перевіряє чи рядок не порожній.
     */
    private boolean hasText(String text) {
        return text != null && !text.trim().isEmpty();
    }
}
