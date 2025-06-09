package com.aksi.domain.order.statemachine.stage1.mapper;

import org.springframework.stereotype.Component;

import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.client.dto.CreateClientRequest;
import com.aksi.domain.order.statemachine.stage1.dto.ClientSelectionDTO;

/**
 * Маппер для трансформацій клієнтських даних в Stage1.
 */
@Component
public class Stage1ClientMapper {

    /**
     * Створити ClientSelectionDTO для існуючого клієнта.
     */
    public ClientSelectionDTO toExistingClientSelection(ClientResponse client) {
        return ClientSelectionDTO.builder()
                .mode("SELECT_EXISTING")
                .selectedClientId(client.getId())
                .selectedClient(client)
                .build();
    }

    /**
     * Створити ClientSelectionDTO для нового клієнта.
     */
    public ClientSelectionDTO toNewClientSelection(CreateClientRequest newClientData) {
        return ClientSelectionDTO.builder()
                .mode("CREATE_NEW")
                .newClientData(newClientData)
                .build();
    }

    /**
     * Оновити ClientSelectionDTO після створення клієнта.
     */
    public ClientSelectionDTO withCreatedClient(ClientSelectionDTO selection, ClientResponse createdClient) {
        return ClientSelectionDTO.builder()
                .mode(selection.getMode())
                .selectedClientId(createdClient.getId())
                .selectedClient(createdClient)
                .newClientData(selection.getNewClientData())
                .createdClient(createdClient)
                .build();
    }

    /**
     * Отримати фінального клієнта з ClientSelectionDTO.
     */
    public ClientResponse getFinalClient(ClientSelectionDTO selection) {
        if ("CREATE_NEW".equals(selection.getMode())) {
            return selection.getCreatedClient();
        } else {
            return selection.getSelectedClient();
        }
    }
}
