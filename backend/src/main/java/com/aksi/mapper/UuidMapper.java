package com.aksi.mapper;

import java.util.UUID;

import org.mapstruct.Named;
import org.springframework.stereotype.Component;

/**
 * Utility mapper for handling UUID conversions.
 * This class is used to avoid ambiguous mappings when multiple mappers 
 * need to convert UUID values.
 */
@Component
public class UuidMapper {
    
    /**
     * Conversion method for UUID to UUID (identity mapping).
     * 
     * @param value UUID to convert
     * @return The same UUID value
     */
    @Named("uuidToUuid")
    public UUID map(UUID value) {
        return value;
    }
}
