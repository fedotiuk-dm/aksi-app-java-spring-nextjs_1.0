package com.aksi.domain.order.statemachine.stage1.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.client.dto.CreateClientRequest;

/**
 * MapStruct mapper для спрощення роботи з клієнтами в Order Wizard
 */
@Mapper(componentModel = "spring")
public interface ClientWizardMapper {

    /**
     * Перетворює ClientResponse у CreateClientRequest для створення нового клієнта
     * Використовується коли фронт передає дані нового клієнта
     */
    @Mapping(target = "lastName", source = "lastName")
    @Mapping(target = "firstName", source = "firstName")
    @Mapping(target = "phone", source = "phone")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "address", source = "address")
    @Mapping(target = "structuredAddress", source = "structuredAddress")
    @Mapping(target = "communicationChannels", source = "communicationChannels")
    @Mapping(target = "source", source = "source")
    @Mapping(target = "sourceDetails", source = "sourceDetails")
    CreateClientRequest toCreateClientRequest(ClientResponse clientResponse);
}
