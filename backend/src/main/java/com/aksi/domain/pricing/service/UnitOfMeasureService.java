package com.aksi.domain.pricing.service;

import java.util.List;
import java.util.UUID;

/**
 * Сервіс для роботи з одиницями виміру предметів.
 */
public interface UnitOfMeasureService {

    /**
     * Отримати рекомендовану одиницю виміру для певної категорії та типу предмета.
     *
     * @param categoryId ID категорії послуг
     * @param itemName Назва предмета
     * @return Рекомендована одиниця виміру
     */
    String getRecommendedUnitOfMeasure(UUID categoryId, String itemName);

    /**
     * Отримати всі доступні одиниці виміру для обраної категорії.
     *
     * @param categoryId ID категорії послуг
     * @return Список доступних одиниць виміру
     */
    List<String> getAvailableUnitsForCategory(UUID categoryId);

    /**
     * Перевірити, чи підтримує предмет конкретну одиницю виміру.
     *
     * @param categoryId ID категорії послуг
     * @param itemName Назва предмета
     * @param unitOfMeasure Одиниця виміру для перевірки
     * @return true, якщо одиниця виміру підтримується для даного предмета
     */
    boolean isUnitSupportedForItem(UUID categoryId, String itemName, String unitOfMeasure);
}
