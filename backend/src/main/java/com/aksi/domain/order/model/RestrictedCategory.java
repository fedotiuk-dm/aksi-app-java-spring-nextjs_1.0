package com.aksi.domain.order.model;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

/**
 * Інтерфейс для категорій послуг з обмеженнями.
 * Визначає загальні методи та константи для різних типів обмежень.
 */
public interface RestrictedCategory {
    /**
     * Стандартні категорії з обмеженнями: прасування, прання, фарбування
     */
    Set<String> RESTRICTED_CATEGORY_CODES = Collections.unmodifiableSet(
            new HashSet<>(Arrays.asList("IRONING", "WASHING", "DYEING")));

    /**
     * Перевіряє, чи входить категорія у список обмежених
     *
     * @param categoryCode код категорії послуги
     * @return true, якщо категорія має обмеження
     */
    boolean isRestricted(String categoryCode);
} 
