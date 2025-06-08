package com.aksi.domain.order.statemachine.stage2.mapper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.statemachine.stage2.dto.ItemWizardSessionDTO;
import com.aksi.domain.order.statemachine.stage2.enums.ItemWizardStep;

import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для заповнення ItemWizardSessionDTO даними з OrderItemDTO
 * при редагуванні предметів замовлення.
 */
@Component
@Slf4j
public class ItemWizardSessionPopulator {

    /**
     * Розбирає OrderItemDTO на дані кроків для редагування
     *
     * @param orderItem існуючий предмет замовлення
     * @param session сесія для заповнення даними
     */
    public void populateSessionFromOrderItem(OrderItemDTO orderItem, ItemWizardSessionDTO session) {
        log.debug("Заповнення сесії даними для редагування предмета: {}", orderItem.getName());

        try {
            // Крок 2.1: Basic Info
            Map<String, Object> basicInfo = new HashMap<>();
            basicInfo.put("itemName", orderItem.getName());
            basicInfo.put("categoryName", orderItem.getCategory());
            basicInfo.put("description", orderItem.getDescription());
            basicInfo.put("quantity", orderItem.getQuantity());
            basicInfo.put("unitOfMeasure", orderItem.getUnitOfMeasure());
            session.setStepData(ItemWizardStep.BASIC_INFO, basicInfo);

            // Крок 2.2: Characteristics
            Map<String, Object> characteristics = new HashMap<>();
            characteristics.put("material", orderItem.getMaterial());
            characteristics.put("color", orderItem.getColor());
            characteristics.put("fillerType", orderItem.getFillerType());
            characteristics.put("fillerCompressed", orderItem.getFillerCompressed());
            characteristics.put("wearDegree", orderItem.getWearDegree());
            characteristics.put("specialInstructions", orderItem.getSpecialInstructions());
            session.setStepData(ItemWizardStep.CHARACTERISTICS, characteristics);

            // Крок 2.3: Defects & Stains
            Map<String, Object> defectsStains = new HashMap<>();
            defectsStains.put("selectedStains", parseStringToList(orderItem.getStains()));
            defectsStains.put("otherStains", orderItem.getOtherStains());
            defectsStains.put("selectedDefects", parseStringToList(orderItem.getDefects()));
            defectsStains.put("defectsAndRisks", orderItem.getDefectsAndRisks());
            defectsStains.put("noGuaranteeReason", orderItem.getNoGuaranteeReason());
            defectsStains.put("defectsNotes", orderItem.getDefectsNotes());
            session.setStepData(ItemWizardStep.DEFECTS_STAINS, defectsStains);

            // Крок 2.4: Pricing
            Map<String, Object> pricing = new HashMap<>();
            pricing.put("unitPrice", orderItem.getUnitPrice());
            pricing.put("finalPrice", orderItem.getTotalPrice());
            pricing.put("selectedModifiers", List.of()); // Додати логіку витягування модифікаторів якщо потрібно
            session.setStepData(ItemWizardStep.PRICING, pricing);

            // Крок 2.5: Photos (поки порожній, додати логіку якщо потрібно)
            Map<String, Object> photos = new HashMap<>();
            photos.put("photoUrls", List.of());
            session.setStepData(ItemWizardStep.PHOTOS, photos);

            // Встановити режим редагування
            session.setIsEditMode(true);
            session.setEditingItemId(orderItem.getId() != null ? orderItem.getId().toString() : null);

            log.info("Сесію успішно заповнено даними предмета для редагування");

        } catch (Exception e) {
            log.error("Помилка заповнення сесії для редагування: {}", e.getMessage(), e);
            throw new RuntimeException("Не вдалося заповнити сесію для редагування", e);
        }
    }

    /**
     * Конвертує рядок у список для редагування
     */
    private List<String> parseStringToList(String str) {
        if (str == null || str.trim().isEmpty()) {
            return List.of();
        }
        return List.of(str.split(",\\s*"));
    }
}
