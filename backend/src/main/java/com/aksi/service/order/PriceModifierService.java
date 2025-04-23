package com.aksi.service.order;

import com.aksi.dto.order.PriceModifierDto;

import java.util.List;
import java.util.UUID;

/**
 * Сервіс для роботи з модифікаторами цін (знижками та надбавками)
 */
public interface PriceModifierService {
    
    /**
     * Отримати всі доступні модифікатори цін
     * @return список всіх модифікаторів цін
     */
    List<PriceModifierDto> getAllPriceModifiers();
    
    /**
     * Отримати модифікатори цін, застосовні до вказаної категорії товарів
     * @param categoryId ідентифікатор категорії товарів
     * @return список модифікаторів, які можуть бути застосовані до вказаної категорії
     */
    List<PriceModifierDto> getPriceModifiersForCategory(UUID categoryId);
    
    /**
     * Отримати загальні модифікатори, які застосовуються до всіх категорій
     * @return список загальних модифікаторів цін
     */
    List<PriceModifierDto> getGeneralPriceModifiers();
    
    /**
     * Отримати модифікатори для текстильних виробів
     * @return список модифікаторів для текстилю
     */
    List<PriceModifierDto> getTextilePriceModifiers();
    
    /**
     * Отримати модифікатори для шкіряних виробів
     * @return список модифікаторів для шкіри
     */
    List<PriceModifierDto> getLeatherPriceModifiers();
}
