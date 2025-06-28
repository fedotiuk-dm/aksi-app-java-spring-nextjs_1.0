package com.aksi.domain.client.delegate;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import com.aksi.api.client.ClientContactsApiDelegate;
import com.aksi.api.client.dto.ClientContactsResponse;
import com.aksi.api.client.dto.UpdateClientContactsRequest;
import com.aksi.domain.client.mapper.ClientMapper;
import com.aksi.domain.client.service.ClientContactService;

/**
 * ============================================================================
 * CLIENT CONTACTS API DELEGATE - УПРАВЛІННЯ КОНТАКТНОЮ ІНФОРМАЦІЄЮ КЛІЄНТІВ
 * ============================================================================
 *
 * ВІДПОВІДАЛЬНІСТЬ:
 * • GET /api/clients/{id}/contacts - отримання контактної інформації клієнта
 * • PUT /api/clients/{id}/contacts - оновлення контактної інформації клієнта
 *
 * АРХІТЕКТУРНІ ПРИНЦИПИ:
 * • Тонкий шар між API та Service рівнем
 * • DTO конвертація через ClientMapper
 * • Functional Programming: Optional + map/filter
 * • Proper HTTP Status Codes: 200 OK, 404 Not Found, 400 Bad Request
 */
@Component
public class ClientContactsApiDelegateImpl implements ClientContactsApiDelegate {

    private final ClientContactService contactsService;
    private final ClientMapper clientMapper;

    public ClientContactsApiDelegateImpl(
        ClientContactService contactsService,
        ClientMapper clientMapper
    ) {
        this.contactsService = contactsService;
        this.clientMapper = clientMapper;
    }

    /**
     * GET /api/clients/{id}/contacts - Отримання контактної інформації клієнта
     */
    @Override
    public ResponseEntity<ClientContactsResponse> getClientContacts(UUID id) {
        return contactsService.getClientContacts(id)
            .map(contactInfo -> {
                ClientContactsResponse response = clientMapper.toContactsResponse(contactInfo);
                return ResponseEntity.ok(response);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * PUT /api/clients/{id}/contacts - Оновлення контактної інформації клієнта
     */
    @Override
    public ResponseEntity<ClientContactsResponse> updateClientContacts(
        UUID id,
        UpdateClientContactsRequest updateRequest
    ) {
        try {
            // Конверсія API DTO до service DTO
            ClientContactService.ContactUpdateRequest serviceRequest =
                clientMapper.toContactUpdateRequest(updateRequest);

            // Оновлення через сервіс
            return contactsService.updateClientContacts(id, serviceRequest)
                .map(updatedContactInfo -> {
                    ClientContactsResponse response = clientMapper.toContactsResponse(updatedContactInfo);
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
