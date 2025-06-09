package com.aksi.domain.order.statemachine.stage1.mapper;

import java.util.List;

import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.order.statemachine.stage1.dto.ClientSearchCriteriaDTO;
import com.aksi.domain.order.statemachine.stage1.dto.ClientSearchResultDTO;

/**
 * Mapper для клієнтського пошуку в етапі 1.1.
 * Відповідає тільки за перетворення між DTO.
 */
public class ClientSearchMapper {

    /**
     * Створює критерії пошуку з загального терміну.
     */
    public static ClientSearchCriteriaDTO createGeneralSearchCriteria(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return new ClientSearchCriteriaDTO();
        }
        return new ClientSearchCriteriaDTO(searchTerm.trim());
    }

    /**
     * Створює критерії пошуку з конкретних полів.
     */
    public static ClientSearchCriteriaDTO createSpecificSearchCriteria(
            String lastName, String firstName, String phone, String email, String address) {
        return new ClientSearchCriteriaDTO(
            trimToNull(lastName),
            trimToNull(firstName),
            trimToNull(phone),
            trimToNull(email),
            trimToNull(address)
        );
    }

    /**
     * Створює результат пошуку з списку клієнтів.
     */
    public static ClientSearchResultDTO createSearchResult(
            List<ClientResponse> clients, ClientSearchCriteriaDTO criteria) {
        ClientSearchResultDTO result = new ClientSearchResultDTO(clients, criteria);
        result.setExactSearch(criteria != null && criteria.hasSpecificCriteria());
        return result;
    }

    /**
     * Створює порожній результат пошуку.
     */
    public static ClientSearchResultDTO createEmptyResult(ClientSearchCriteriaDTO criteria) {
        return createSearchResult(List.of(), criteria);
    }

    /**
     * Перевіряє чи критерії валідні для пошуку.
     */
    public static boolean isValidSearchCriteria(ClientSearchCriteriaDTO criteria) {
        return criteria != null && criteria.hasSearchCriteria();
    }

    /**
     * Створює критерії пошуку для конкретного клієнта (для пошуку дублікатів).
     */
    public static ClientSearchCriteriaDTO createDuplicateSearchCriteria(ClientResponse client) {
        if (client == null) {
            return new ClientSearchCriteriaDTO();
        }

        return createSpecificSearchCriteria(
            client.getLastName(),
            client.getFirstName(),
            client.getPhone(),
            client.getEmail(),
            null // адресу не використовуємо для пошуку дублікатів
        );
    }

    /**
     * Обрізає рядок та повертає null якщо він порожній.
     */
    private static String trimToNull(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
