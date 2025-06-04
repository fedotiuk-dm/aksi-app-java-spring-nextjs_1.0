package com.aksi.domain.pricing.service;

import java.util.List;
import java.util.UUID;

import com.aksi.domain.pricing.dto.PriceListItemDTO;

/**
 * Сервіс для роботи з прайс-листом послуг.
 */
public interface PriceListService {

    /**
     * Отримати всі активні елементи прайс-листа.
     *
     * @return Список елементів прайс-листа
     */
    List<PriceListItemDTO> getAllActiveItems();

    /**
     * Отримати елементи прайс-листа за категорією.
     *
     * @param categoryId ID категорії
     * @return Список елементів прайс-листа
     */
    List<PriceListItemDTO> getItemsByCategory(UUID categoryId);

    /**
     * Отримати елементи прайс-листа за кодом категорії.
     *
     * @param categoryCode Код категорії
     * @return Список елементів прайс-листа
     */
    List<PriceListItemDTO> getItemsByCategoryCode(String categoryCode);

    /**
     * Отримати елемент прайс-листа за ID.
     *
     * @param id ID елемента прайс-листа
     * @return Елемент прайс-листа
     */
    PriceListItemDTO getItemById(UUID id);

    /**
     * Отримати одиниці виміру для певної категорії.
     *
     * @param categoryId ID категорії
     * @return Список доступних одиниць виміру
     */
    List<String> getAvailableUnitsOfMeasure(UUID categoryId);

    /**
     * Отримати елемент прайс-листа за назвою.
     *
     * @param name Назва елемента
     * @return Елемент прайс-листа або null, якщо не знайдено
     */
    PriceListItemDTO getItemByName(String name);

    /**
     * Отримати елемент прайс-листа за назвою в рамках категорії.
     *
     * @param name Назва елемента
     * @param categoryId ID категорії
     * @return Елемент прайс-листа або null, якщо не знайдено
     */
    PriceListItemDTO getItemByNameAndCategory(String name, UUID categoryId);
}
