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
 * Сервіс для розбору OrderItemDTO на дані підетапів Item Wizard
 *
 * Використовується при редагуванні існуючих предметів - розбирає
 * OrderItemDTO на окремі дані кожного підетапу для завантаження в сесію.
 */
@Component
@Slf4j
public class ItemEditDataMapper {

    /**
     * Заповнює сесію Item Wizard даними з існуючого OrderItemDTO
     */
    public void populateSessionFromOrderItem(OrderItemDTO orderItem, ItemWizardSessionDTO session) {
        log.debug("Заповнення сесії {} даними з предмета {}",
                  session.getItemWizardId(), orderItem.getId());

        try {
            populateBasicInfo(orderItem, session);
            populateCharacteristics(orderItem, session);
            populateDefectsStains(orderItem, session);
            populatePricing(orderItem, session);
            populatePhotos(orderItem, session);

            log.debug("✅ Сесія {} успішно заповнена даними предмета",
                      session.getItemWizardId());

        } catch (Exception e) {
            log.error("❌ Помилка заповнення сесії даними предмета: {}", e.getMessage(), e);
            throw new RuntimeException("Не вдалося заповнити сесію даними предмета", e);
        }
    }

    /**
     * Заповнює Basic Info (підетап 2.1)
     */
    private void populateBasicInfo(OrderItemDTO orderItem, ItemWizardSessionDTO session) {
        Map<String, Object> basicInfo = new HashMap<>();

        // Основні дані предмета
        basicInfo.put("itemName", orderItem.getName());
        basicInfo.put("categoryName", orderItem.getCategory());
        basicInfo.put("quantity", orderItem.getQuantity());
        basicInfo.put("unitOfMeasure", orderItem.getUnitOfMeasure());
        basicInfo.put("unitPrice", orderItem.getUnitPrice());

        // Додаткові дані (опис як альтернатива каталожному номеру)
        if (orderItem.getDescription() != null) {
            basicInfo.put("description", orderItem.getDescription());
        }

        session.setStepData(ItemWizardStep.BASIC_INFO, basicInfo);

        log.debug("Заповнено Basic Info: {}", basicInfo.keySet());
    }

    /**
     * Заповнює Characteristics (підетап 2.2)
     */
    private void populateCharacteristics(OrderItemDTO orderItem, ItemWizardSessionDTO session) {
        Map<String, Object> characteristics = new HashMap<>();

        // Матеріал та колір
        if (orderItem.getMaterial() != null) {
            characteristics.put("material", orderItem.getMaterial());
        }
        if (orderItem.getColor() != null) {
            characteristics.put("color", orderItem.getColor());
        }

        // Наповнювач
        if (orderItem.getFillerType() != null) {
            characteristics.put("fillerType", orderItem.getFillerType());
        }
        if (orderItem.getFillerCompressed() != null) {
            characteristics.put("fillerCompressed", orderItem.getFillerCompressed());
        }

        // Ступінь зносу
        if (orderItem.getWearDegree() != null) {
            characteristics.put("wearDegree", orderItem.getWearDegree());
        }

        // Витягуємо примітки характеристик з defectsNotes
        String notes = orderItem.getDefectsNotes();
        if (notes != null && notes.contains("Характеристики:")) {
            String charNotes = extractNotesSection(notes, "Характеристики:");
            if (charNotes != null) {
                characteristics.put("notes", charNotes);
            }
        }

        session.setStepData(ItemWizardStep.CHARACTERISTICS, characteristics);

        log.debug("Заповнено Characteristics: {}", characteristics.keySet());
    }

    /**
     * Заповнює Defects & Stains (підетап 2.3)
     */
    private void populateDefectsStains(OrderItemDTO orderItem, ItemWizardSessionDTO session) {
        Map<String, Object> defectsStains = new HashMap<>();

        // Плями
        if (orderItem.getStains() != null && !orderItem.getStains().trim().isEmpty()) {
            // Розбиваємо рядок плям на список (припускаємо розділення комами)
            String[] stainsArray = orderItem.getStains().split(",");
            List<String> stainsList = List.of(stainsArray);
            defectsStains.put("selectedStains", stainsList);
        }

        // Інші плями
        if (orderItem.getOtherStains() != null) {
            defectsStains.put("customStain", orderItem.getOtherStains());
        }

        // Дефекти
        if (orderItem.getDefects() != null && !orderItem.getDefects().trim().isEmpty()) {
            defectsStains.put("defects", orderItem.getDefects());
        }

        // Дефекти та ризики
        if (orderItem.getDefectsAndRisks() != null) {
            defectsStains.put("defectsAndRisks", orderItem.getDefectsAndRisks());
        }

        // Причина "без гарантій"
        if (orderItem.getNoGuaranteeReason() != null) {
            defectsStains.put("noWarranty", true);
            defectsStains.put("noWarrantyReason", orderItem.getNoGuaranteeReason());
        }

        // Примітки дефектів
        if (orderItem.getDefectsNotes() != null) {
            defectsStains.put("defectNotes", orderItem.getDefectsNotes());
        }

        session.setStepData(ItemWizardStep.DEFECTS_STAINS, defectsStains);

        log.debug("Заповнено Defects & Stains: {}", defectsStains.keySet());
    }

    /**
     * Заповнює Pricing (підетап 2.4)
     */
    private void populatePricing(OrderItemDTO orderItem, ItemWizardSessionDTO session) {
        Map<String, Object> pricing = new HashMap<>();

        // Ціни
        pricing.put("unitPrice", orderItem.getUnitPrice());
        pricing.put("finalPrice", orderItem.getTotalPrice());

        // Розрахункові деталі (можна розширити при потребі)
        pricing.put("quantity", orderItem.getQuantity());

        // Модифікатори поки що порожні (можна додати коли буде структура)
        pricing.put("selectedModifiers", List.of());

        session.setStepData(ItemWizardStep.PRICING, pricing);

        log.debug("Заповнено Pricing: {}", pricing.keySet());
    }

    /**
     * Заповнює Photos (підетап 2.5)
     */
    private void populatePhotos(OrderItemDTO orderItem, ItemWizardSessionDTO session) {
        Map<String, Object> photos = new HashMap<>();

        // Поки що фото не реалізовано в OrderItemDTO
        photos.put("photoUrls", List.of());
        photos.put("photosSkipped", true);
        photos.put("skipReason", "Фото не додавались при створенні");

        session.setStepData(ItemWizardStep.PHOTOS, photos);

        log.debug("Заповнено Photos: {}", photos.keySet());
    }

    /**
     * Витягує секцію приміток з загального рядка приміток
     */
    private String extractNotesSection(String allNotes, String sectionPrefix) {
        try {
            if (allNotes == null || !allNotes.contains(sectionPrefix)) {
                return null;
            }

            int startIndex = allNotes.indexOf(sectionPrefix) + sectionPrefix.length();
            int endIndex = allNotes.indexOf(";", startIndex);

            if (endIndex == -1) {
                endIndex = allNotes.length();
            }

            String section = allNotes.substring(startIndex, endIndex).trim();
            return section.isEmpty() ? null : section;

        } catch (Exception e) {
            log.debug("Помилка витягування секції '{}' з приміток: {}", sectionPrefix, e.getMessage());
            return null;
        }
    }

    /**
     * Перевіряє чи заповнені всі необхідні дані для редагування
     */
    public boolean validateOrderItemForEdit(OrderItemDTO orderItem) {
        if (orderItem == null) {
            return false;
        }

        // Перевіряємо обов'язкові поля
        boolean hasBasicData = orderItem.getName() != null && !orderItem.getName().trim().isEmpty()
                            && orderItem.getQuantity() != null && orderItem.getQuantity() > 0
                            && orderItem.getUnitPrice() != null;

        log.debug("Валідація предмета для редагування: {}", hasBasicData ? "✅ OK" : "❌ FAIL");

        return hasBasicData;
    }
}
