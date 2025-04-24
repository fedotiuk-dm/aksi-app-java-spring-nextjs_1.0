package com.aksi.mapper;

import com.aksi.domain.client.entity.Client;
import com.aksi.dto.client.ClientCreateRequest;
import com.aksi.dto.client.ClientDTO;
import com.aksi.dto.client.ClientResponse;
import com.aksi.dto.client.ClientUpdateRequest;
import org.mapstruct.*;

import java.util.List;

/**
 * Маппер для перетворення між різними представленнями клієнта
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, builder = @Builder(disableBuilder = true))
public interface ClientMapper {
    
    /**
     * Перетворює сутність Client в ClientDTO
     * @param client сутність клієнта
     * @return DTO клієнта
     */
    @BeanMapping(ignoreByDefault = false)
    @Mapping(target = "firstName", source = "firstName")
    @Mapping(target = "lastName", source = "lastName")
    @Mapping(target = "active", expression = "java(client.getStatus() == com.aksi.domain.client.entity.ClientStatus.ACTIVE)")
    @Mapping(target = "source", expression = "java(client.getSource() != null ? client.getSource().name() : null)")
    @Mapping(target = "loyaltyLevel", expression = "java(client.getLoyaltyLevel() != null ? client.getLoyaltyLevel().ordinal() : 0)")
    ClientDTO toDTO(Client client);
    
    /**
     * Перетворює список сутностей Client в список ClientDTO
     * @param clients список сутностей клієнтів
     * @return список DTO клієнтів
     */
    List<ClientDTO> toDTOList(List<Client> clients);
    
    /**
     * Перетворює запит на створення клієнта в сутність Client
     * @param request запит на створення клієнта
     * @return сутність клієнта
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "lastOrderDate", ignore = true)
    @Mapping(target = "totalSpent", ignore = true)
    @Mapping(target = "orderCount", constant = "0")
    @Mapping(target = "status", expression = "java(request.getStatus() != null ? request.getStatus() : com.aksi.domain.client.entity.ClientStatus.ACTIVE)")
    @Mapping(target = "loyaltyPoints", constant = "0")
    @Mapping(target = "loyaltyLevel", expression = "java(request.getLoyaltyLevel() != null ? request.getLoyaltyLevel() : com.aksi.domain.client.entity.LoyaltyLevel.STANDARD)")
    @Mapping(target = "tags", source = "tags")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Client toEntity(ClientCreateRequest request);
    
    /**
     * Оновлює існуючу сутність клієнта з даними з запиту на оновлення
     * @param request запит на оновлення клієнта
     * @param client існуюча сутність клієнта
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "lastOrderDate", ignore = true)
    @Mapping(target = "totalSpent", ignore = true)
    @Mapping(target = "orderCount", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateFromRequest(ClientUpdateRequest request, @MappingTarget Client client);
    
    /**
     * Перетворює сутність Client в ClientResponse
     * @param client сутність клієнта
     * @return відповідь з даними клієнта
     */
    @Mapping(target = "firstName", source = "firstName")
    @Mapping(target = "lastName", source = "lastName")
    @Mapping(target = "phone", source = "phone")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "address", source = "address")
    @Mapping(target = "notes", source = "notes")
    @Mapping(target = "source", source = "source")
    @Mapping(target = "sourceDetails", source = "sourceDetails")
    @Mapping(target = "birthDate", source = "birthDate")
    @Mapping(target = "lastOrderDate", source = "lastOrderDate")
    @Mapping(target = "totalSpent", source = "totalSpent")
    @Mapping(target = "orderCount", source = "orderCount")
    @Mapping(target = "status", source = "status")
    @Mapping(target = "loyaltyPoints", source = "loyaltyPoints")
    @Mapping(target = "loyaltyLevel", source = "loyaltyLevel")
    @Mapping(target = "tags", source = "tags")
    @Mapping(target = "createdAt", source = "createdAt")
    ClientResponse toResponse(Client client);
    
    /**
     * Перетворює список сутностей Client в список ClientResponse
     * @param clients список сутностей клієнтів
     * @return список відповідей з даними клієнтів
     */
    List<ClientResponse> toResponseList(List<Client> clients);
} 