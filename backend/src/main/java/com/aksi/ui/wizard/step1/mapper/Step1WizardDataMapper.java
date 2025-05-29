package com.aksi.ui.wizard.step1.mapper;

import org.springframework.stereotype.Component;

import com.aksi.domain.branch.dto.BranchLocationDTO;
import com.aksi.domain.branch.entity.BranchLocationEntity;
import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.client.entity.AddressEntity;
import com.aksi.domain.client.entity.ClientEntity;

import lombok.extern.slf4j.Slf4j;

/**
 * Mapper для конвертації між DTO та Entity в контексті Order Wizard Step 1.
 * Спрощені маппінги для UI потреб етапу 1.
 */
@Component
@Slf4j
public class Step1WizardDataMapper {

    /**
     * Конвертувати ClientResponse в ClientEntity для wizard data.
     */
    public ClientEntity mapClientResponseToEntity(ClientResponse clientResponse) {
        if (clientResponse == null) {
            return null;
        }

        // Конвертувати рядкову адресу в AddressEntity якщо потрібно
        AddressEntity addressEntity = null;
        if (clientResponse.getAddress() != null && !clientResponse.getAddress().trim().isEmpty()) {
            addressEntity = AddressEntity.builder()
                .fullAddress(clientResponse.getAddress())
                .build();
        }

        return ClientEntity.builder()
            .id(clientResponse.getId())
            .firstName(clientResponse.getFirstName())
            .lastName(clientResponse.getLastName())
            .phone(clientResponse.getPhone())
            .email(clientResponse.getEmail())
            .address(addressEntity)
            .communicationChannels(clientResponse.getCommunicationChannels())
            .source(clientResponse.getSource())
            .sourceDetails(clientResponse.getSourceDetails())
            .build();
    }

    /**
     * Конвертувати ClientEntity в ClientResponse для відображення.
     */
    public ClientResponse mapClientEntityToResponse(ClientEntity clientEntity) {
        if (clientEntity == null) {
            return null;
        }

        // Конвертувати AddressEntity в рядок
        String addressString = null;
        if (clientEntity.getAddress() != null) {
            addressString = clientEntity.getAddress().formatFullAddress();
        }

        return ClientResponse.builder()
            .id(clientEntity.getId())
            .firstName(clientEntity.getFirstName())
            .lastName(clientEntity.getLastName())
            .fullName(clientEntity.getLastName() + " " + clientEntity.getFirstName())
            .phone(clientEntity.getPhone())
            .email(clientEntity.getEmail())
            .address(addressString)
            .communicationChannels(clientEntity.getCommunicationChannels())
            .source(clientEntity.getSource())
            .sourceDetails(clientEntity.getSourceDetails())
            .build();
    }

    /**
     * Конвертувати BranchLocationDTO в BranchLocationEntity для wizard data.
     */
    public BranchLocationEntity mapBranchLocationDTOToEntity(BranchLocationDTO branchLocationDTO) {
        if (branchLocationDTO == null) {
            return null;
        }

        BranchLocationEntity entity = BranchLocationEntity.builder()
            .id(branchLocationDTO.getId())
            .name(branchLocationDTO.getName())
            .address(branchLocationDTO.getAddress())
            .phone(branchLocationDTO.getPhone())
            .code(branchLocationDTO.getCode())
            .active(branchLocationDTO.getActive())
            .build();

        log.debug("Mapped BranchLocationDTO to Entity: {}", branchLocationDTO.getName());
        return entity;
    }

    /**
     * Конвертувати BranchLocationEntity в BranchLocationDTO для відображення.
     */
    public BranchLocationDTO mapBranchLocationEntityToDTO(BranchLocationEntity branchLocationEntity) {
        if (branchLocationEntity == null) {
            return null;
        }

        BranchLocationDTO dto = BranchLocationDTO.builder()
            .id(branchLocationEntity.getId())
            .name(branchLocationEntity.getName())
            .address(branchLocationEntity.getAddress())
            .phone(branchLocationEntity.getPhone())
            .code(branchLocationEntity.getCode())
            .active(branchLocationEntity.getActive())
            .createdAt(branchLocationEntity.getCreatedAt())
            .updatedAt(branchLocationEntity.getUpdatedAt())
            .build();

        log.debug("Mapped BranchLocationEntity to DTO: {}", branchLocationEntity.getName());
        return dto;
    }

    /**
     * Перевірити чи клієнт є новим (без ID).
     */
    public boolean isNewClient(ClientResponse clientResponse) {
        return clientResponse == null || clientResponse.getId() == null;
    }

    /**
     * Перевірити чи філія є вибраною (має ID).
     */
    public boolean isBranchSelected(BranchLocationDTO branchLocationDTO) {
        return branchLocationDTO != null && branchLocationDTO.getId() != null;
    }
}
