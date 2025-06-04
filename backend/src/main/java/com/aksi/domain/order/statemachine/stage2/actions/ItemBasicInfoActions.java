package com.aksi.domain.order.statemachine.stage2.actions;

import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage2.dto.ItemBasicInfoDTO;
import com.aksi.domain.order.statemachine.stage2.dto.TempOrderItemDTO;
import com.aksi.domain.order.statemachine.stage2.mapper.ItemBasicInfoMapper;
import com.aksi.domain.order.statemachine.stage2.service.ItemBasicInfoService;
import com.aksi.domain.pricing.dto.PriceListItemDTO;
import com.aksi.domain.pricing.dto.ServiceCategoryDTO;
import com.aksi.domain.pricing.service.PriceListService;
import com.aksi.domain.pricing.service.ServiceCategoryService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Actions для підетапу 2.1 "Основна інформація про предмет".
 *
 * Відповідає за:
 * - Ініціалізацію підетапу 2.1
 * - Обробку вибору категорії та предмета
 * - Оновлення кількості
 * - Валідацію та перехід до наступного підетапу
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ItemBasicInfoActions {

    private final ItemBasicInfoService itemBasicInfoService;
    private final ItemBasicInfoMapper itemBasicInfoMapper;
    private final ServiceCategoryService serviceCategoryService;
    private final PriceListService priceListService;

    /**
     * Дія ініціалізації підетапу 2.1.
     * Завантажує категорії та створює порожній DTO.
     */
    @Component("initializeItemBasicInfoAction")
    public class InitializeItemBasicInfoAction implements Action<OrderState, OrderEvent> {

        @Override
        public void execute(StateContext<OrderState, OrderEvent> context) {
            log.info("Ініціалізація підетапу 2.1 - Основна інформація про предмет");

            try {
                // Перевіряємо, чи це створення нового предмета або редагування існуючого
                TempOrderItemDTO currentItem = (TempOrderItemDTO) context.getExtendedState()
                    .getVariables().get("currentItem");
                Boolean isEditMode = (Boolean) context.getExtendedState()
                    .getVariables().get("itemEditMode");

                if (isEditMode != null && isEditMode && currentItem != null) {
                    // Режим редагування - завантажуємо існуючі дані
                    log.debug("Ініціалізація підетапу 2.1 в режимі редагування");
                    initializeForEdit(context, currentItem);
                } else {
                    // Режим створення нового предмета
                    log.debug("Ініціалізація підетапу 2.1 для нового предмета");
                    itemBasicInfoService.initializeSubstage(context);
                }

                log.info("Підетап 2.1 успішно ініціалізовано");

            } catch (Exception e) {
                log.error("Помилка ініціалізації підетапу 2.1: {}", e.getMessage(), e);
                context.getExtendedState().getVariables().put("systemError", e.getMessage());
            }
        }

        private void initializeForEdit(StateContext<OrderState, OrderEvent> context, TempOrderItemDTO currentItem) {
            // Ініціалізуємо підетап зі списком категорій
            itemBasicInfoService.initializeSubstage(context);

            // Конвертуємо TempOrderItemDTO в ItemBasicInfoDTO
            ItemBasicInfoDTO basicInfo = itemBasicInfoMapper.fromTempOrderItemDTO(currentItem);

            // Завантажуємо повні об'єкти категорії та предмета за їх назвами
            if (currentItem.getCategory() != null) {
                ServiceCategoryDTO category = serviceCategoryService.getCategoryByName(currentItem.getCategory());
                if (category != null) {
                    basicInfo.setSelectedCategory(category);

                    // Завантажуємо предмети для цієї категорії
                    basicInfo.setAvailableItems(priceListService.getItemsByCategory(category.getId()));

                    // Знаходимо вибраний предмет
                    if (currentItem.getName() != null) {
                        PriceListItemDTO selectedItem = priceListService.getItemByNameAndCategory(currentItem.getName(), category.getId());
                        if (selectedItem != null) {
                            basicInfo.setSelectedItem(selectedItem);
                            basicInfo.setBasePrice(selectedItem.getBasePrice());
                            basicInfo.setUnitOfMeasure(selectedItem.getUnitOfMeasure());
                        }
                    }
                }
            }

            context.getExtendedState().getVariables().put("itemBasicInfo", basicInfo);
        }
    }

    /**
     * Дія вибору категорії послуги.
     */
    @Component("selectServiceCategoryAction")
    public static class SelectServiceCategoryAction implements Action<OrderState, OrderEvent> {

        private final ItemBasicInfoService itemBasicInfoService;

        public SelectServiceCategoryAction(ItemBasicInfoService itemBasicInfoService) {
            this.itemBasicInfoService = itemBasicInfoService;
        }

        @Override
        public void execute(StateContext<OrderState, OrderEvent> context) {
            log.info("Вибір категорії послуги");

            try {
                String categoryIdStr = (String) context.getExtendedState()
                    .getVariables().get("selectedCategoryId");

                if (categoryIdStr == null) {
                    log.warn("selectedCategoryId не знайдено в контексті");
                    return;
                }

                UUID categoryId = UUID.fromString(categoryIdStr);
                itemBasicInfoService.selectCategory(categoryId, context);

                log.info("Категорію {} успішно вибрано", categoryId);

            } catch (RuntimeException e) {
                log.error("Помилка вибору категорії: {}", e.getMessage(), e);
                context.getExtendedState().getVariables().put("actionError", e.getMessage());
            }
        }
    }

    /**
     * Дія вибору конкретного предмета.
     */
    @Component("selectItemAction")
    public static class SelectItemAction implements Action<OrderState, OrderEvent> {

        private final ItemBasicInfoService itemBasicInfoService;

        public SelectItemAction(ItemBasicInfoService itemBasicInfoService) {
            this.itemBasicInfoService = itemBasicInfoService;
        }

        @Override
        public void execute(StateContext<OrderState, OrderEvent> context) {
            log.info("Вибір предмета");

            try {
                String itemIdStr = (String) context.getExtendedState()
                    .getVariables().get("selectedItemId");

                if (itemIdStr == null) {
                    log.warn("selectedItemId не знайдено в контексті");
                    return;
                }

                UUID itemId = UUID.fromString(itemIdStr);
                itemBasicInfoService.selectItem(itemId, context);

                log.info("Предмет {} успішно вибрано", itemId);

            } catch (RuntimeException e) {
                log.error("Помилка вибору предмета: {}", e.getMessage(), e);
                context.getExtendedState().getVariables().put("actionError", e.getMessage());
            }
        }
    }

    /**
     * Дія оновлення кількості.
     */
    @Component("updateQuantityAction")
    public static class UpdateQuantityAction implements Action<OrderState, OrderEvent> {

        private final ItemBasicInfoService itemBasicInfoService;

        public UpdateQuantityAction(ItemBasicInfoService itemBasicInfoService) {
            this.itemBasicInfoService = itemBasicInfoService;
        }

        @Override
        public void execute(StateContext<OrderState, OrderEvent> context) {
            log.info("Оновлення кількості");

            try {
                Object quantity = context.getExtendedState().getVariables().get("quantity");

                if (quantity == null) {
                    log.warn("quantity не знайдено в контексті");
                    return;
                }

                itemBasicInfoService.updateQuantity(quantity, context);

                log.info("Кількість успішно оновлено: {}", quantity);

            } catch (RuntimeException e) {
                log.error("Помилка оновлення кількості: {}", e.getMessage(), e);
                context.getExtendedState().getVariables().put("actionError", e.getMessage());
            }
        }
    }

    /**
     * Дія валідації та переходу до підетапу 2.2.
     */
    @Component("proceedToSubstage22Action")
    public static class ProceedToSubstage22Action implements Action<OrderState, OrderEvent> {

        private final ItemBasicInfoService itemBasicInfoService;
        private final ItemBasicInfoMapper itemBasicInfoMapper;

        public ProceedToSubstage22Action(ItemBasicInfoService itemBasicInfoService,
                                        ItemBasicInfoMapper itemBasicInfoMapper) {
            this.itemBasicInfoService = itemBasicInfoService;
            this.itemBasicInfoMapper = itemBasicInfoMapper;
        }

        @Override
        public void execute(StateContext<OrderState, OrderEvent> context) {
            log.info("Перехід від підетапу 2.1 до підетапу 2.2");

            try {
                // Валідуємо повноту підетапу 2.1
                boolean isValid = itemBasicInfoService.validateSubstageCompletion(context);

                if (!isValid) {
                    log.warn("Підетап 2.1 не пройшов валідацію");
                    return;
                }

                // Оновлюємо TempOrderItemDTO даними з підетапу 2.1
                updateTempOrderItem(context);

                // Встановлюємо поточний крок на 2
                TempOrderItemDTO currentItem = (TempOrderItemDTO) context.getExtendedState()
                    .getVariables().get("currentItem");
                if (currentItem != null) {
                    currentItem.setWizardStep(2);
                }

                log.info("Успішний перехід до підетапу 2.2");

            } catch (RuntimeException e) {
                log.error("Помилка переходу до підетапу 2.2: {}", e.getMessage(), e);
                context.getExtendedState().getVariables().put("actionError", e.getMessage());
            }
        }

        private void updateTempOrderItem(StateContext<OrderState, OrderEvent> context) {
            ItemBasicInfoDTO basicInfo = itemBasicInfoService.getCurrentBasicInfo(context);
            TempOrderItemDTO currentItem = (TempOrderItemDTO) context.getExtendedState()
                .getVariables().get("currentItem");

            if (currentItem == null) {
                // Створюємо новий TempOrderItemDTO
                currentItem = itemBasicInfoMapper.toTempOrderItemDTO(basicInfo);
            } else {
                // Оновлюємо існуючий
                currentItem.setCategory(basicInfo.getSelectedCategory().getName());
                currentItem.setName(basicInfo.getSelectedItem().getName());
                currentItem.setQuantity(basicInfo.getQuantity());
                currentItem.setUnitOfMeasure(basicInfo.getUnitOfMeasure());
                currentItem.setUnitPrice(basicInfo.getSelectedItem().getBasePrice());
                currentItem.setTotalPrice(basicInfo.getBasePrice());
                currentItem.setDescription(basicInfo.getSelectedItem().getName());
            }

            context.getExtendedState().getVariables().put("currentItem", currentItem);
        }
    }

    /**
     * Дія очищення даних підетапу 2.1.
     */
    @Component("clearItemBasicInfoAction")
    public static class ClearItemBasicInfoAction implements Action<OrderState, OrderEvent> {

        private final ItemBasicInfoService itemBasicInfoService;

        public ClearItemBasicInfoAction(ItemBasicInfoService itemBasicInfoService) {
            this.itemBasicInfoService = itemBasicInfoService;
        }

        @Override
        public void execute(StateContext<OrderState, OrderEvent> context) {
            log.info("Очищення даних підетапу 2.1");

            try {
                itemBasicInfoService.clearSubstageData(context);

                log.info("Дані підетапу 2.1 очищено");

            } catch (Exception e) {
                log.error("Помилка очищення даних підетапу 2.1: {}", e.getMessage(), e);
            }
        }
    }
}
