package com.aksi.domain.order.model;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * Інтерфейс для категорій послуг з обмеженнями
 */
public interface RestrictedCategory {
    /**
     * Стандартні категорії з обмеженнями: прасування, прання, фарбування
     */
    Set<String> RESTRICTED_CATEGORY_CODES = new HashSet<>(
            Arrays.asList("IRONING", "WASHING", "DYEING"));
} 