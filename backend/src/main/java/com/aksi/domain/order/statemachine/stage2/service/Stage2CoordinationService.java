package com.aksi.domain.order.statemachine.stage2.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.service.OrderService;
import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage2.dto.ItemManagementDTO;
import com.aksi.domain.order.statemachine.stage2.dto.ItemWizardSessionDTO;
import com.aksi.domain.order.statemachine.stage2.service.coordination.Step1BasicInfoCoordinator;
import com.aksi.domain.order.statemachine.stage2.service.coordination.Step2CharacteristicsCoordinator;
import com.aksi.domain.order.statemachine.stage2.service.coordination.Step3DefectsStainsCoordinator;
import com.aksi.domain.order.statemachine.stage2.service.coordination.Step4PricingCoordinator;
import com.aksi.domain.order.statemachine.stage2.service.coordination.Step5PhotosCoordinator;
import com.aksi.domain.order.statemachine.stage2.substep1.dto.BasicInfoDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.dto.CharacteristicsDTO;
import com.aksi.domain.order.statemachine.stage2.substep3.dto.DefectsStainsDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.dto.PricingCalculationDTO;
import com.aksi.domain.order.statemachine.stage2.substep5.dto.PhotoDocumentationDTO;
import com.aksi.domain.pricing.dto.ServiceCategoryDTO;
import com.aksi.domain.pricing.service.PriceListDomainService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Координаційний сервіс для Етапу 2: Менеджер предметів.
 *
 * Використовує готові доменні сервіси для роботи з:
 * - Предметами замовлень (OrderService)
 * - Категоріями та прайс-листом (PriceListDomainService)
 * - Розрахунками цін (PriceCalculationService)
 *
 * Дотримується принципу "тонкого шару організації" -
 * координує готові функції, а не створює нову бізнес-логіку.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class Stage2CoordinationService {

    // ========== Готові доменні сервіси ==========
    private final OrderService orderService;
    private final PriceListDomainService priceListDomainService;
    private final ItemWizardManagementService itemWizardManagementService;

    // ========== Координатори підетапів (Item Wizard 2.1 - 2.5) ==========
    private final Step1BasicInfoCoordinator step1BasicInfoCoordinator;
    private final Step2CharacteristicsCoordinator step2CharacteristicsCoordinator;
    private final Step3DefectsStainsCoordinator step3DefectsStainsCoordinator;
    private final Step4PricingCoordinator step4PricingCoordinator;
    private final Step5PhotosCoordinator step5PhotosCoordinator;

    // ========== Ініціалізація та управління етапом 2 ==========

    /**
     * Ініціалізує етап 2 для замовлення.
     * Використовує готові сервіси для отримання поточних предметів.
     */
    @Transactional(readOnly = true)
    public ItemManagementDTO initializeStage2(String wizardId, UUID orderId) {
        log.debug("Ініціалізація етапу 2 для wizardId: {} та orderId: {}", wizardId, orderId);

        try {
            // Використовуємо готовий OrderService для отримання предметів
            List<OrderItemDTO> existingItems = orderService.getOrderItems(orderId);

            // Розраховуємо загальну суму через готовий сервіс
            BigDecimal totalAmount = calculateTotalAmount(existingItems);

            return ItemManagementDTO.builder()
                .addedItems(existingItems)
                .totalAmount(totalAmount)
                .canProceedToNextStage(!existingItems.isEmpty())
                .currentStatus("INITIALIZED")
                .build();

        } catch (Exception e) {
            log.error("Помилка ініціалізації етапу 2: {}", e.getMessage(), e);
            return ItemManagementDTO.builder()
                .currentStatus("ERROR")
                .canProceedToNextStage(false)
                .build();
        }
    }

    /**
     * Завантажує поточний стан етапу 2.
     */
    @Transactional(readOnly = true)
    public ItemManagementDTO loadStage2State(String wizardId, UUID orderId) {
        log.debug("Завантаження стану етапу 2 для wizardId: {}", wizardId);

        return initializeStage2(wizardId, orderId);
    }

    // ========== Координація підетапів Item Wizard (2.1 - 2.5) ==========

    /**
     * Координує підетап 2.1: Основна інформація про предмет.
     * Делегує до Step1BasicInfoCoordinator.
     */
    public List<com.aksi.domain.order.statemachine.stage2.substep1.dto.ServiceCategoryDTO> getBasicInfoCategories() {
        log.debug("Отримання категорій для підетапу 2.1");
        return step1BasicInfoCoordinator.getAvailableCategories();
    }

    public BasicInfoDTO coordinateBasicInfoValidation(String wizardId, BasicInfoDTO basicInfoData) {
        log.debug("Координація валідації підетапу 2.1 для wizardId: {}", wizardId);
        return step1BasicInfoCoordinator.validateBasicInfo(basicInfoData);
    }

    public BasicInfoDTO saveBasicInfo(String wizardId, BasicInfoDTO basicInfo) {
        log.debug("Збереження основної інформації для wizardId: {}", wizardId);
        return step1BasicInfoCoordinator.saveBasicInfo(wizardId, basicInfo);
    }

    public BasicInfoDTO loadBasicInfo(String wizardId) {
        log.debug("Завантаження основної інформації для wizardId: {}", wizardId);
        return step1BasicInfoCoordinator.loadBasicInfo(wizardId);
    }

    /**
     * Координує підетап 2.2: Характеристики предмета.
     */
    public CharacteristicsDTO coordinateCharacteristicsValidation(String itemWizardId, CharacteristicsDTO stepData) {
        log.debug("Координація валідації характеристик для itemWizardId: {}", itemWizardId);
        return step2CharacteristicsCoordinator.validateCharacteristics(stepData);
    }

    public CharacteristicsDTO saveCharacteristics(String wizardId, CharacteristicsDTO characteristics) {
        log.debug("Збереження характеристик для wizardId: {}", wizardId);
        return step2CharacteristicsCoordinator.saveCharacteristics(wizardId, characteristics);
    }

    public CharacteristicsDTO loadCharacteristics(String wizardId) {
        log.debug("Завантаження характеристик для wizardId: {}", wizardId);
        return step2CharacteristicsCoordinator.loadCharacteristics(wizardId);
    }

    /**
     * Координує підетап 2.3: Забруднення та дефекти.
     */
    public DefectsStainsDTO coordinateDefectsStainsValidation(String itemWizardId, DefectsStainsDTO stepData) {
        log.debug("Координація валідації дефектів для itemWizardId: {}", itemWizardId);
        return step3DefectsStainsCoordinator.validateDefectsStains(stepData);
    }

    public DefectsStainsDTO saveDefectsStains(String wizardId, DefectsStainsDTO defectsStains) {
        log.debug("Збереження дефектів та забруднень для wizardId: {}", wizardId);
        return step3DefectsStainsCoordinator.saveDefectsStains(wizardId, defectsStains);
    }

    public DefectsStainsDTO loadDefectsStains(String wizardId) {
        log.debug("Завантаження дефектів та забруднень для wizardId: {}", wizardId);
        return step3DefectsStainsCoordinator.loadDefectsStains(wizardId);
    }

    /**
     * Координує підетап 2.4: Розрахунок ціни.
     */
    public PricingCalculationDTO loadPricingCalculation(String wizardId) {
        log.debug("Завантаження розрахунку ціни для wizardId: {}", wizardId);
        return step4PricingCoordinator.loadPricingCalculation(wizardId);
    }

    public PricingCalculationDTO savePricingCalculation(String wizardId, PricingCalculationDTO pricingData) {
        log.debug("Збереження розрахунку ціни для wizardId: {}", wizardId);
        return step4PricingCoordinator.savePricingCalculation(wizardId, pricingData);
    }

    public boolean isPricingReadyForCompletion(String wizardId) {
        log.debug("Перевірка готовності розрахунку для wizardId: {}", wizardId);
        return step4PricingCoordinator.isReadyForCompletion(wizardId);
    }

    public String getPricingSummary(String wizardId) {
        log.debug("Отримання підсумку розрахунку для wizardId: {}", wizardId);
        return step4PricingCoordinator.getPricingSummary(wizardId);
    }

    /**
     * Координує підетап 2.5: Фотодокументація.
     */
    public boolean coordinatePhotosValidation(String itemWizardId, PhotoDocumentationDTO stepData) {
        log.debug("Координація валідації фото для itemWizardId: {}", itemWizardId);
        return step5PhotosCoordinator.isReadyForCompletion(stepData);
    }

    public boolean hasSufficientPhotos(PhotoDocumentationDTO photos) {
        log.debug("Перевірка достатності фото");
        return step5PhotosCoordinator.hasSufficientPhotos(photos);
    }

    // ========== Управління циклічним підвізардом ==========

    /**
     * Запускає новий Item Wizard для додавання предмета.
     * Координує створення нової сесії підвізарда.
     */
    @Transactional
    public ItemWizardSessionDTO startNewItemWizard(String wizardId) {
        log.debug("Запуск нового Item Wizard для wizardId: {}", wizardId);

        return itemWizardManagementService.createNewSession(wizardId);
    }

    /**
     * Запускає Item Wizard для редагування існуючого предмета.
     * Використовує готовий OrderService для завантаження даних предмета.
     */
    @Transactional
    public ItemWizardSessionDTO startEditItemWizard(String wizardId, String itemId, UUID orderId) {
        log.debug("Запуск редагування предмета {} для wizardId: {}", itemId, wizardId);

        try {
            // Використовуємо готовий сервіс для отримання предмета
            OrderItemDTO existingItem = orderService.getOrderItem(orderId, UUID.fromString(itemId))
                .orElseThrow(() -> new RuntimeException("Предмет не знайдено: " + itemId));

            return itemWizardManagementService.createEditSession(wizardId, itemId, existingItem);

        } catch (Exception e) {
            log.error("Помилка запуску редагування предмета: {}", e.getMessage(), e);
            throw new RuntimeException("Не вдалося запустити редагування предмета", e);
        }
    }

    /**
     * Завершує Item Wizard та додає предмет до замовлення.
     * Використовує готові сервіси для збереження предмета.
     */
    @Transactional
    public OrderItemDTO completeItemWizard(String wizardId, String itemWizardId, UUID orderId) {
        log.debug("Завершення Item Wizard {} для wizardId: {}", itemWizardId, wizardId);

        try {
            // Збираємо дані з усіх кроків підвізарда
            OrderItemDTO completeItem = itemWizardManagementService.buildCompleteItem(itemWizardId);

            // Використовуємо готовий OrderService для додавання предмета
            OrderItemDTO savedItem = orderService.addOrderItem(orderId, completeItem);

            // Очищуємо сесію підвізарда
            itemWizardManagementService.clearSession(itemWizardId);

            log.info("Предмет успішно додано до замовлення: {}", savedItem.getId());
            return savedItem;

        } catch (Exception e) {
            log.error("Помилка завершення Item Wizard: {}", e.getMessage(), e);
            throw new RuntimeException("Не вдалося завершити підвізард предмета", e);
        }
    }

    // ========== Управління предметами ==========

    /**
     * Видаляє предмет з замовлення.
     * Використовує готовий OrderService.
     */
    @Transactional
    public boolean deleteItem(String wizardId, String itemId, UUID orderId) {
        log.debug("Видалення предмета {} з замовлення {}", itemId, orderId);

        try {
            // Використовуємо готовий сервіс для видалення
            orderService.deleteOrderItem(orderId, UUID.fromString(itemId));

            log.info("Предмет {} успішно видалено з замовлення {}", itemId, orderId);
            return true;

        } catch (Exception e) {
            log.error("Помилка видалення предмета: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Отримує всі предмети замовлення.
     * Використовує готовий OrderService.
     */
    @Transactional(readOnly = true)
    public List<OrderItemDTO> getAllItems(String wizardId, UUID orderId) {
        log.debug("Отримання всіх предметів для wizardId: {} та orderId: {}", wizardId, orderId);

        return orderService.getOrderItems(orderId);
    }

    // ========== Валідація та завершення етапу ==========

    /**
     * Перевіряє, чи можна завершити етап 2.
     * Використовує готові бізнес-правила з OrderService.
     */
    @Transactional(readOnly = true)
    public boolean canCompleteStage2(String wizardId, UUID orderId) {
        log.debug("Перевірка можливості завершення етапу 2 для wizardId: {}", wizardId);

        try {
            List<OrderItemDTO> items = orderService.getOrderItems(orderId);

            // Бізнес-правило: мінімум 1 предмет в замовленні
            boolean hasMinimumItems = !items.isEmpty();

            // Перевіряємо валідність всіх предметів
            boolean allItemsValid = items.stream()
                .allMatch(this::isItemValid);

            return hasMinimumItems && allItemsValid;

        } catch (Exception e) {
            log.error("Помилка перевірки готовності етапу 2: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Завершує етап 2 та готує дані для етапу 3.
     */
    @Transactional
    public ItemManagementDTO finalizeStage2(String wizardId, UUID orderId) {
        log.debug("Завершення етапу 2 для wizardId: {}", wizardId);

        if (!canCompleteStage2(wizardId, orderId)) {
            throw new RuntimeException("Етап 2 не готовий до завершення");
        }

        List<OrderItemDTO> finalItems = getAllItems(wizardId, orderId);
        BigDecimal finalTotal = calculateTotalAmount(finalItems);

        return ItemManagementDTO.builder()
            .addedItems(finalItems)
            .totalAmount(finalTotal)
            .canProceedToNextStage(true)
            .currentStatus("COMPLETED")
            .build();
    }

    // ========== Допоміжні методи ==========

    /**
     * Розраховує загальну суму предметів.
     * Використовує логіку з OrderItemDTO.
     */
    private BigDecimal calculateTotalAmount(List<OrderItemDTO> items) {
        return items.stream()
            .map(OrderItemDTO::getTotalPrice)
            .filter(price -> price != null)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Перевіряє валідність предмета.
     */
    private boolean isItemValid(OrderItemDTO item) {
        return item.getName() != null && !item.getName().trim().isEmpty()
            && item.getQuantity() != null && item.getQuantity() > 0
            && item.getUnitPrice() != null && item.getUnitPrice().compareTo(BigDecimal.ZERO) > 0;
    }

    // ========== Інтеграція з готовими доменними сервісами ==========

    /**
     * Отримує категорії послуг.
     * Прямо використовує готовий PriceListDomainService.
     */
    @Transactional(readOnly = true)
    public List<ServiceCategoryDTO> getServiceCategories() {
        log.debug("Отримання категорій послуг для Item Wizard");

        return priceListDomainService.getAllCategories();
    }

    // ========== ОПЕРАЦІЇ З КОНТЕКСТОМ STATE MACHINE ==========

    /**
     * Зберегти список предметів замовлення в контексті State Machine.
     */
    public void saveItemsToContext(StateContext<OrderState, OrderEvent> context,
                                  List<OrderItemDTO> items) {
        if (items == null) {
            log.warn("Спроба збереження null списку предметів");
            return;
        }

        context.getExtendedState().getVariables().put("stage2Items", items);
        log.debug("Список предметів збережено в контексті: {} предметів", items.size());
    }

    /**
     * Завантажити список предметів замовлення з контексту State Machine.
     */
    @SuppressWarnings("unchecked")
    public List<OrderItemDTO> loadItemsFromContext(StateContext<OrderState, OrderEvent> context) {
        Object data = context.getExtendedState().getVariables().get("stage2Items");
        if (data instanceof List<?> itemsList) {
            try {
                return (List<OrderItemDTO>) itemsList;
            } catch (ClassCastException e) {
                log.error("Помилка кастингу списку предметів: {}", e.getMessage());
            }
        }

        log.debug("Список предметів не знайдено в контексті State Machine, створюється новий");
        List<OrderItemDTO> newList = new java.util.ArrayList<>();
        context.getExtendedState().getVariables().put("stage2Items", newList);
        return newList;
    }

    /**
     * Додати предмет до списку в контексті State Machine.
     */
    public void addItemToContext(StateContext<OrderState, OrderEvent> context, OrderItemDTO item) {
        if (item == null) {
            log.warn("Спроба додання null предмета до контексту");
            return;
        }

        List<OrderItemDTO> items = loadItemsFromContext(context);
        items.add(item);
        saveItemsToContext(context, items);

        log.debug("Предмет додано до контексту: {} (всього предметів: {})",
                 item.getName(), items.size());
    }

    /**
     * Видалити предмет зі списку в контексті State Machine.
     */
    public boolean removeItemFromContext(StateContext<OrderState, OrderEvent> context, String itemId) {
        if (itemId == null) {
            log.warn("Спроба видалення предмета з null ID");
            return false;
        }

        List<OrderItemDTO> items = loadItemsFromContext(context);
        boolean removed = items.removeIf(item -> itemId.equals(item.getId()));

        if (removed) {
            saveItemsToContext(context, items);
            log.debug("Предмет з ID {} видалено з контексту (залишилось: {})", itemId, items.size());
        } else {
            log.warn("Предмет з ID {} не знайдено для видалення", itemId);
        }

        return removed;
    }

    /**
     * Перевірити завершеність етапу 2 через контекст State Machine.
     */
    public boolean isStage2CompleteFromContext(StateContext<OrderState, OrderEvent> context) {
        List<OrderItemDTO> items = loadItemsFromContext(context);

        boolean complete = !items.isEmpty() &&
                          items.stream().allMatch(this::isItemValid);

        log.debug("Перевірка завершеності етапу 2 через контекст: {} з {} предметів готові",
                 items.stream().mapToLong(item -> isItemValid(item) ? 1 : 0).sum(),
                 items.size());
        return complete;
    }

    /**
     * Отримати кількість предметів з контексту State Machine.
     */
    public int getItemsCountFromContext(StateContext<OrderState, OrderEvent> context) {
        List<OrderItemDTO> items = loadItemsFromContext(context);
        return items.size();
    }

    /**
     * Очистити дані етапу 2 з контексту State Machine.
     */
    public void clearStage2DataFromContext(StateContext<OrderState, OrderEvent> context) {
        context.getExtendedState().getVariables().remove("stage2Items");
        context.getExtendedState().getVariables().remove("currentItemWizard");
        log.debug("Дані етапу 2 очищено з контексту State Machine");
    }
}
