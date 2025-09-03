package com.aksi.domain.game.hibernate;

import com.aksi.domain.game.formula.CalculationFormulaEntity;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator;

/**
 * JSON utility class for working with CalculationFormula objects in Hibernate.
 * Provides polymorphic serialization/deserialization with Jackson support.
 */
public class CalculationFormulaJsonType {

    private final ObjectMapper objectMapper;

    public CalculationFormulaJsonType() {
        // Configure ObjectMapper for polymorphism
        this.objectMapper = new ObjectMapper();
        this.objectMapper.activateDefaultTyping(
            LaissezFaireSubTypeValidator.instance,
            ObjectMapper.DefaultTyping.OBJECT_AND_NON_CONCRETE
        );
    }

    /**
     * Serialize CalculationFormula to JSON string
     */
    public String toString(CalculationFormulaEntity value) {
        if (value == null) {
            return null;
        }

        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize CalculationFormula: " + value, e);
        }
    }

    /**
     * Deserialize JSON string to CalculationFormula
     */
    public CalculationFormulaEntity fromString(String string) {
        if (string == null || string.trim().isEmpty()) {
            return null;
        }

        try {
            return objectMapper.readValue(string, CalculationFormulaEntity.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to deserialize CalculationFormula: " + string, e);
        }
    }

    /**
     * Deep copy CalculationFormula using serialization
     */
    public CalculationFormulaEntity deepCopy(CalculationFormulaEntity value) {
        if (value == null) {
            return null;
        }

        try {
            String json = objectMapper.writeValueAsString(value);
            return objectMapper.readValue(json, CalculationFormulaEntity.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to deep copy CalculationFormula", e);
        }
    }
}
