package com.aksi.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import com.aksi.api.game.dto.CreatePriceConfigurationRequest;
import com.aksi.api.game.dto.PriceConfiguration;
import com.aksi.domain.game.PriceConfigurationEntity;

/**
 * Unit tests for PriceConfigurationMapper - tests only MapStruct functionality
 */
class PriceConfigurationMapperTest {

    private final PriceConfigurationMapper mapper = Mappers.getMapper(PriceConfigurationMapper.class);

    @Test
    @DisplayName("Should map price configuration DTO to entity")
    void shouldMapPriceConfigurationDtoToEntity() {
        // Given
        var dto = new CreatePriceConfigurationRequest();
        dto.setBasePrice(1000);
        dto.setCurrency("USD");
        dto.setPricePerLevel(50);
        dto.setSortOrder(1);

        // When
        PriceConfigurationEntity result = mapper.toPriceConfigurationEntity(dto);

        // Then
        assertNotNull(result);
        assertEquals(1000, result.getBasePrice());
        assertEquals("USD", result.getCurrency());
        assertEquals(50, result.getPricePerLevel());
        assertEquals(1, result.getSortOrder());
    }

    @Test
    @DisplayName("Should map price configuration entity to DTO")
    void shouldMapPriceConfigurationEntityToDto() {
        // Given
        var entity = PriceConfigurationEntity.builder()
            .basePrice(2000)
            .currency("EUR")
            .pricePerLevel(75)
            .sortOrder(2)
            .active(true)
            .build();

        // When
        PriceConfiguration result = mapper.toPriceConfigurationDto(entity);

        // Then
        assertNotNull(result);
        assertEquals(2000, result.getBasePrice());
        assertEquals("EUR", result.getCurrency());
        assertEquals(75, result.getPricePerLevel());
        assertEquals(2, result.getSortOrder());
        assertTrue(result.getActive());
    }

    @Test
    @DisplayName("Should map list of entities to list of DTOs")
    void shouldMapListOfEntitiesToListOfDtos() {
        // Given
        var entity1 = PriceConfigurationEntity.builder()
            .basePrice(1000)
            .currency("USD")
            .build();
        var entity2 = PriceConfigurationEntity.builder()
            .basePrice(2000)
            .currency("EUR")
            .build();

        // When
        var results = mapper.toPriceConfigurationDtoList(java.util.List.of(entity1, entity2));

        // Then
        assertNotNull(results);
        assertEquals(2, results.size());
        assertEquals(1000, results.get(0).getBasePrice());
        assertEquals("USD", results.get(0).getCurrency());
        assertEquals(2000, results.get(1).getBasePrice());
        assertEquals("EUR", results.get(1).getCurrency());
    }

    @Test
    @DisplayName("Should handle null inputs")
    void shouldHandleNullInputs() {
        // When & Then
        assertNull(mapper.toPriceConfigurationEntity(null));
        assertNull(mapper.toPriceConfigurationDto(null));
        assertNull(mapper.toPriceConfigurationDtoList(null));
    }
}
