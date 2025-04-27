package com.aksi.domain.pricing.service;

import com.aksi.domain.pricing.dto.PriceCalculationRequestDTO;
import com.aksi.domain.pricing.dto.PriceCalculationResponseDTO;

/**
 * Сервіс для розрахунку цін з урахуванням модифікаторів.
 */
public interface PriceCalculationService {
    
    /**
     * Розрахувати ціну з урахуванням вибраних модифікаторів.
     * 
     * @param request Запит на розрахунок ціни
     * @return Результат розрахунку ціни з деталізацією
     */
    PriceCalculationResponseDTO calculatePrice(PriceCalculationRequestDTO request);
    
    /**
     * Отримати базову ціну для категорії та найменування предмету.
     * 
     * @param categoryCode Код категорії
     * @param itemName Найменування предмету
     * @return Базова ціна з прайс-листа
     */
    PriceCalculationResponseDTO getBasePrice(String categoryCode, String itemName);
}
