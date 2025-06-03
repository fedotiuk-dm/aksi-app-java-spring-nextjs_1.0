package com.aksi.domain.order.statemachine.stage2.actions;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage2.service.ItemManagerService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Дії для головного екрану менеджера предметів (етап 2.0).
 *
 * Відповідає за:
 * - Відображення таблиці доданих предметів
 * - Управління кнопками додавання/редагування/видалення
 * - Оновлення загальної вартості
 * - Навігацію між головним екраном та підвізардом
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ItemManagerActions {

    private final ItemManagerService itemManagerService;

    /**
     * Дія входу в головний екран менеджера предметів.
     * Ініціалізує стан та завантажує існуючі предмети.
     */
    @Component("enterItemManagerAction")
    public class EnterItemManagerAction implements Action<OrderState, OrderEvent> {

        @Override
        public void execute(StateContext<OrderState, OrderEvent> context) {
            log.info("Вхід до головного екрану менеджера предметів");

            String orderId = (String) context.getExtendedState().getVariables().get("orderId");

            try {
                // Завантажуємо існуючі предмети замовлення
                itemManagerService.loadOrderItems(orderId, context);

                // Розраховуємо загальну вартість
                itemManagerService.calculateTotalPrice(orderId, context);

                // Ініціалізуємо UI стан
                itemManagerService.initializeUIState(context);

                log.info("Головний екран менеджера предметів успішно ініціалізований для замовлення: {}", orderId);

            } catch (Exception e) {
                log.error("Помилка при ініціалізації головного екрану менеджера предметів для замовлення: {}", orderId, e);
                context.getExtendedState().getVariables().put("systemError", e.getMessage());
            }
        }
    }

    /**
     * Дія початку додавання нового предмета.
     * Готує до запуску підвізарда предметів.
     */
    @Component("prepareAddNewItemAction")
    public static class PrepareAddNewItemAction implements Action<OrderState, OrderEvent> {

        private final ItemManagerService itemManagerService;

        public PrepareAddNewItemAction(ItemManagerService itemManagerService) {
            this.itemManagerService = itemManagerService;
        }

        @Override
        public void execute(StateContext<OrderState, OrderEvent> context) {
            log.info("Підготовка до додавання нового предмета");

            try {
                // Підготовуємо новий предмет
                itemManagerService.prepareNewItem(context);

                // Встановлюємо режим створення (не редагування)
                context.getExtendedState().getVariables().put("itemEditMode", false);

                log.info("Підготовка до додавання нового предмета завершена");

            } catch (Exception e) {
                log.error("Помилка при підготовці нового предмета", e);
                context.getExtendedState().getVariables().put("systemError", e.getMessage());
            }
        }
    }

    /**
     * Дія підготовки до редагування існуючого предмета.
     */
    @Component("prepareEditItemAction")
    public static class PrepareEditItemAction implements Action<OrderState, OrderEvent> {

        private final ItemManagerService itemManagerService;

        public PrepareEditItemAction(ItemManagerService itemManagerService) {
            this.itemManagerService = itemManagerService;
        }

        @Override
        public void execute(StateContext<OrderState, OrderEvent> context) {
            log.info("Підготовка до редагування предмета");

            String itemId = (String) context.getExtendedState().getVariables().get("selectedItemId");

            try {
                // Завантажуємо предмет для редагування
                itemManagerService.prepareItemForEdit(itemId, context);

                // Встановлюємо режим редагування
                context.getExtendedState().getVariables().put("itemEditMode", true);

                log.info("Підготовка до редагування предмета {} завершена", itemId);

            } catch (Exception e) {
                log.error("Помилка при підготовці предмета для редагування: {}", itemId, e);
                context.getExtendedState().getVariables().put("systemError", e.getMessage());
            }
        }
    }

    /**
     * Дія видалення предмета з замовлення.
     */
    @Component("deleteItemFromOrderAction")
    public static class DeleteItemFromOrderAction implements Action<OrderState, OrderEvent> {

        private final ItemManagerService itemManagerService;

        public DeleteItemFromOrderAction(ItemManagerService itemManagerService) {
            this.itemManagerService = itemManagerService;
        }

        @Override
        public void execute(StateContext<OrderState, OrderEvent> context) {
            log.info("Видалення предмета з замовлення");

            String itemId = (String) context.getExtendedState().getVariables().get("selectedItemId");
            String orderId = (String) context.getExtendedState().getVariables().get("orderId");

            try {
                // Видаляємо предмет
                itemManagerService.deleteItem(itemId, context);

                // Перераховуємо загальну вартість
                itemManagerService.calculateTotalPrice(orderId, context);

                // Оновлюємо список предметів
                itemManagerService.refreshItemsList(orderId, context);

                log.info("Предмет {} успішно видалено", itemId);

            } catch (Exception e) {
                log.error("Помилка при видаленні предмета: {}", itemId, e);
                context.getExtendedState().getVariables().put("systemError", e.getMessage());
            }
        }
    }

    /**
     * Дія переходу до наступного етапу (етап 3).
     * Валідує наявність предметів та переходить до етапу загальних параметрів.
     */
    @Component("proceedToStage3Action")
    public static class ProceedToStage3Action implements Action<OrderState, OrderEvent> {

        private final ItemManagerService itemManagerService;

        public ProceedToStage3Action(ItemManagerService itemManagerService) {
            this.itemManagerService = itemManagerService;
        }

        @Override
        public void execute(StateContext<OrderState, OrderEvent> context) {
            log.info("Перехід від менеджера предметів до етапу 3");

            String orderId = (String) context.getExtendedState().getVariables().get("orderId");

            try {
                // Валідуємо наявність предметів
                boolean hasItems = itemManagerService.validateOrderHasItems(orderId, context);

                if (!hasItems) {
                    log.warn("Спроба переходу без предметів в замовленні: {}", orderId);
                    context.getExtendedState().getVariables().put("validationError", "Замовлення не містить предметів");
                    return;
                }

                // Фінальний розрахунок загальної вартості
                itemManagerService.calculateTotalPrice(orderId, context);

                // Підготовка до завершення етапу
                itemManagerService.finalizeStage2(orderId, context);

                log.info("Етап 2 (менеджер предметів) завершено, перехід до етапу 3");

            } catch (Exception e) {
                log.error("Помилка при завершенні етапу 2 для замовлення: {}", orderId, e);
                context.getExtendedState().getVariables().put("systemError", e.getMessage());
            }
        }
    }
}
