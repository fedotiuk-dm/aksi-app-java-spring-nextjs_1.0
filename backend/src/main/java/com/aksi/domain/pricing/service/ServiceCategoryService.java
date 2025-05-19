package com.aksi.domain.pricing.service;

import java.util.List;
import java.util.UUID;

import com.aksi.domain.pricing.dto.ServiceCategoryDTO;

/**
 * Сервіс для роботи з категоріями послуг.
 */
public interface ServiceCategoryService {

    /**
     * Отримати список всіх активних категорій послуг.
     *
     * @return Список категорій послуг
     */
    List<ServiceCategoryDTO> getAllActiveCategories();

    /**
     * Отримати категорію послуг за ID.
     *
     * @param id ID категорії
     * @return Категорія послуг
     */
    ServiceCategoryDTO getCategoryById(UUID id);

    /**
     * Отримати категорію послуг за кодом.
     *
     * @param code Код категорії
     * @return Категорія послуг
     */
    ServiceCategoryDTO getCategoryByCode(String code);
}
