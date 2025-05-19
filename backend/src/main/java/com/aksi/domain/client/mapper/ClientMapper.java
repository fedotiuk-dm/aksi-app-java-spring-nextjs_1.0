package com.aksi.domain.client.mapper;

import org.springframework.stereotype.Component;

import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.client.entity.ClientEntity;

/**
 * Маппер для перетворення між ClientEntity і ClientResponse.
 */
@Component
public class ClientMapper {

    /**
     * Перетворити ClientEntity у ClientResponse.
     * @param client параметр client
     * @return об'єкт ClientResponse, створений на основі даних клієнта
     */
    public ClientResponse toClientResponse(ClientEntity client) {
        if (client == null) {
            return null;
        }

        return ClientResponse.builder()
                .id(client.getId())
                .firstName(client.getFirstName())
                .lastName(client.getLastName())
                .phone(client.getPhone())
                .email(client.getEmail())
                .address(client.getAddress())
                .communicationChannels(client.getCommunicationChannels())
                .source(client.getSource())
                .sourceDetails(client.getSourceDetails())
                .build();
    }
}
