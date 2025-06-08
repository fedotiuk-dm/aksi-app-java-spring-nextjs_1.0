package com.aksi.domain.order.statemachine.stage2.substep1.adapter;

import java.util.List;

import org.springframework.statemachine.StateContext;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage2.substep1.dto.BasicInfoDTO;
import com.aksi.domain.order.statemachine.stage2.substep1.dto.PriceListItemDTO;
import com.aksi.domain.order.statemachine.stage2.substep1.dto.ServiceCategoryDTO;
import com.aksi.domain.order.statemachine.stage2.substep1.service.BasicInfoStepService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * State Machine адаптер для підетапу 2.1: Основна інформація про предмет.
 *
 * Принцип "один файл = одна відповідальність":
 * Координує між State Machine та BasicInfoStepService.
 *
 * Відповідальності:
 * - Отримання та збереження даних з State Machine контексту
 * - Виклики BasicInfoStepService для бізнес-операцій
 * - Оновлення контексту після операцій
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class BasicInfoStateMachineAdapter {

    private final BasicInfoStepService basicInfoStepService;

    private static final String BASIC_INFO_DATA_KEY = "basicInfoData";
    private static final String WIZARD_ID_KEY = "wizardId";

    /**
     * Ініціалізувати підетап основної інформації
     */
    public BasicInfoDTO initializeBasicInfoStep(StateContext<OrderState, OrderEvent> context) {
        log.debug("Ініціалізація підетапу основної інформації");

        String wizardId = getWizardId(context);
        if (wizardId == null) {
            log.error("Wizard ID не знайдено в контексті");
            return BasicInfoDTO.builder().build();
        }

        // Перевіряємо чи є вже дані основної інформації
        BasicInfoDTO existingInfo = getBasicInfoData(context);
        if (existingInfo != null) {
            log.debug("Знайдено існуючі дані основної інформації для wizard: {}", wizardId);
            return existingInfo;
        }

        // Створюємо нові дані
        BasicInfoDTO newInfo = BasicInfoDTO.builder().build();
        saveBasicInfoData(context, newInfo);

        log.info("Підетап основної інформації ініціалізовано для wizard: {}", wizardId);
        return newInfo;
    }

    /**
     * Отримати список категорій послуг
     */
    public List<ServiceCategoryDTO> getServiceCategories(StateContext<OrderState, OrderEvent> context) {
        log.debug("Отримання списку категорій послуг через State Machine адаптер");

        List<ServiceCategoryDTO> categories = basicInfoStepService.getAvailableCategories();

        log.info("Отримано {} категорій послуг", categories.size());
        return categories;
    }

    /**
     * Отримати предмети за категорією
     */
    public List<PriceListItemDTO> getItemsByCategory(StateContext<OrderState, OrderEvent> context, String categoryCode) {
        log.debug("Отримання предметів за категорією {} через State Machine адаптер", categoryCode);

        List<PriceListItemDTO> items = basicInfoStepService.getItemsByCategory(categoryCode);

        log.info("Отримано {} предметів для категорії {}", items.size(), categoryCode);
        return items;
    }

    /**
     * Вибрати предмет з прайс-листа та автозаповнити дані
     */
    public BasicInfoDTO selectPriceListItem(StateContext<OrderState, OrderEvent> context, String itemId) {
        log.debug("Вибір предмета {} з прайс-листа через State Machine адаптер", itemId);

        String wizardId = getWizardId(context);
        BasicInfoDTO currentInfo = getBasicInfoData(context);

        if (wizardId == null || currentInfo == null) {
            log.error("Wizard ID або дані основної інформації не знайдені");
            return currentInfo != null ? currentInfo : BasicInfoDTO.builder().build();
        }

        // Викликаємо сервіс для автозаповнення даних з прайс-листа
        BasicInfoDTO updatedInfo = basicInfoStepService.autoFillFromPriceListItem(currentInfo, itemId);

        // Зберігаємо оновлені дані в контексті
        saveBasicInfoData(context, updatedInfo);

        log.info("Предмет {} вибрано з прайс-листа через State Machine адаптер для wizard: {}", itemId, wizardId);
        return updatedInfo;
    }

    /**
     * Встановити кастомну назву предмета
     */
    public BasicInfoDTO setCustomItemName(StateContext<OrderState, OrderEvent> context, String itemName) {
        log.debug("Встановлення кастомної назви предмета '{}' через State Machine адаптер", itemName);

        String wizardId = getWizardId(context);
        BasicInfoDTO currentInfo = getBasicInfoData(context);

        if (wizardId == null || currentInfo == null) {
            log.error("Wizard ID або дані основної інформації не знайдені");
            return currentInfo != null ? currentInfo : BasicInfoDTO.builder().build();
        }

        // Оновлюємо назву предмета
        BasicInfoDTO updatedInfo = currentInfo.toBuilder()
                .itemName(itemName)
                .itemId(null) // Скидаємо itemId при кастомній назві
                .itemCode(null)
                .build();

        // Зберігаємо оновлені дані в контексті
        saveBasicInfoData(context, updatedInfo);

        log.info("Кастомну назву предмета '{}' встановлено через State Machine адаптер для wizard: {}", itemName, wizardId);
        return updatedInfo;
    }

    /**
     * Встановити кількість предметів
     */
    public BasicInfoDTO setQuantity(StateContext<OrderState, OrderEvent> context, Integer quantity, String unitOfMeasure) {
        log.debug("Встановлення кількості {} {} через State Machine адаптер", quantity, unitOfMeasure);

        String wizardId = getWizardId(context);
        BasicInfoDTO currentInfo = getBasicInfoData(context);

        if (wizardId == null || currentInfo == null) {
            log.error("Wizard ID або дані основної інформації не знайдені");
            return currentInfo != null ? currentInfo : BasicInfoDTO.builder().build();
        }

        // Оновлюємо кількість та одиницю виміру
        BasicInfoDTO updatedInfo = currentInfo.toBuilder()
                .quantity(quantity)
                .unitOfMeasure(unitOfMeasure)
                .build();

        // Зберігаємо оновлені дані в контексті
        saveBasicInfoData(context, updatedInfo);

        log.info("Кількість {} {} встановлено через State Machine адаптер для wizard: {}", quantity, unitOfMeasure, wizardId);
        return updatedInfo;
    }

    /**
     * Валідація готовності підетапу до завершення
     */
    public Boolean validateBasicInfoStep(StateContext<OrderState, OrderEvent> context) {
        BasicInfoDTO basicInfoData = getBasicInfoData(context);

        if (basicInfoData == null) {
            log.warn("Дані основної інформації не знайдені для валідації");
            return false;
        }

        // Використовуємо метод сервіса для перевірки готовності
        boolean isReady = basicInfoStepService.isReadyForNextStep(basicInfoData);

        log.debug("Валідація підетапу основної інформації: {}", isReady);
        return isReady;
    }

    /**
     * Отримує Wizard ID з контексту State Machine
     */
    private String getWizardId(StateContext<OrderState, OrderEvent> context) {
        Object wizardId = context.getExtendedState().getVariables().get(WIZARD_ID_KEY);
        return wizardId instanceof String ? (String) wizardId : null;
    }

    /**
     * Отримує дані основної інформації з контексту State Machine
     */
    private BasicInfoDTO getBasicInfoData(StateContext<OrderState, OrderEvent> context) {
        Object data = context.getExtendedState().getVariables().get(BASIC_INFO_DATA_KEY);
        return data instanceof BasicInfoDTO ? (BasicInfoDTO) data : null;
    }

    /**
     * Зберігає дані основної інформації в контексті State Machine
     */
    private void saveBasicInfoData(StateContext<OrderState, OrderEvent> context, BasicInfoDTO basicInfoData) {
        context.getExtendedState().getVariables().put(BASIC_INFO_DATA_KEY, basicInfoData);
        log.debug("Дані основної інформації збережено в контексті State Machine");
    }
}
