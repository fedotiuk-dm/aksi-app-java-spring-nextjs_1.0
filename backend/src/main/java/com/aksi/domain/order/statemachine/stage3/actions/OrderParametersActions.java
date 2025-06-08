package com.aksi.domain.order.statemachine.stage3.actions;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage3.service.OrderParametersService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Дії для управління загальними параметрами замовлення (етап 3).
 *
 * Відповідає за:
 * - Встановлення дати виконання
 * - Управління термінової доставки
 * - Застосування знижок
 * - Налаштування способу оплати
 * - Фінальну валідацію етапу
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OrderParametersActions {

    private final OrderParametersService orderParametersService;

    /**
     * Дія входу в етап загальних параметрів замовлення.
     * Ініціалізує стан та завантажує поточні параметри.
     */
    @Component("enterOrderParametersStageAction")
    public class EnterOrderParametersStageAction implements Action<OrderState, OrderEvent> {

        @Override
        public void execute(StateContext<OrderState, OrderEvent> context) {
            log.info("Вхід до етапу загальних параметрів замовлення");

            String orderId = (String) context.getExtendedState().getVariables().get("orderId");

            try {
                // Завантажуємо поточні параметри замовлення
                orderParametersService.loadOrderParameters(orderId, context);

                // Розраховуємо автоматичну дату виконання на основі предметів
                orderParametersService.calculateEstimatedDeliveryDate(orderId, context);

                // Ініціалізуємо значення за замовчуванням
                orderParametersService.initializeDefaultParameters(context);

                log.info("Етап загальних параметрів успішно ініціалізований для замовлення: {}", orderId);

            } catch (Exception e) {
                log.error("Помилка при ініціалізації етапу загальних параметрів для замовлення: {}", orderId, e);
                context.getExtendedState().getVariables().put("systemError", e.getMessage());
            }
        }
    }

    /**
     * Дія збереження параметрів виконання (дата та терміновість).
     */
    @Component("saveExecutionParametersAction")
    public class SaveExecutionParametersAction implements Action<OrderState, OrderEvent> {

        @Override
        public void execute(StateContext<OrderState, OrderEvent> context) {
            log.info("Збереження параметрів виконання замовлення");

            String orderId = (String) context.getExtendedState().getVariables().get("orderId");

            try {
                // Отримуємо параметри з headers
                Object deliveryDateObj = context.getMessageHeaders().get("deliveryDate");
                Object expediteTypeObj = context.getMessageHeaders().get("expediteType");

                // Зберігаємо параметри виконання
                orderParametersService.saveExecutionParameters(orderId, deliveryDateObj, expediteTypeObj, context);

                // Перераховуємо вартість з урахуванням терміновості
                orderParametersService.recalculateWithExpediteCharges(orderId, context);

                log.info("Параметри виконання успішно збережено для замовлення: {}", orderId);

            } catch (Exception e) {
                log.error("Помилка збереження параметрів виконання для замовлення: {}", orderId, e);
                context.getExtendedState().getVariables().put("validationError",
                    "Помилка збереження параметрів виконання: " + e.getMessage());
            }
        }
    }

    /**
     * Дія застосування знижки до замовлення.
     */
    @Component("applyDiscountAction")
    public class ApplyDiscountAction implements Action<OrderState, OrderEvent> {

        @Override
        public void execute(StateContext<OrderState, OrderEvent> context) {
            log.info("Застосування знижки до замовлення");

            String orderId = (String) context.getExtendedState().getVariables().get("orderId");

            try {
                // Отримуємо тип знижки з headers
                Object discountTypeObj = context.getMessageHeaders().get("discountType");
                Object customDiscountObj = context.getMessageHeaders().get("customDiscountPercentage");

                // Валідуємо можливість застосування знижки
                boolean canApplyDiscount = orderParametersService.validateDiscountEligibility(orderId, context);

                if (!canApplyDiscount) {
                    context.getExtendedState().getVariables().put("validationError",
                        "Знижка не може бути застосована до цього замовлення");
                    return;
                }

                // Застосовуємо знижку
                orderParametersService.applyDiscount(orderId, discountTypeObj, customDiscountObj, context);

                // Перераховуємо загальну вартість
                orderParametersService.recalculateTotalWithDiscount(orderId, context);

                log.info("Знижка успішно застосована до замовлення: {}", orderId);

            } catch (Exception e) {
                log.error("Помилка застосування знижки до замовлення: {}", orderId, e);
                context.getExtendedState().getVariables().put("validationError",
                    "Помилка застосування знижки: " + e.getMessage());
            }
        }
    }

    /**
     * Дія налаштування способу оплати та розрахунку.
     */
    @Component("setupPaymentAction")
    public static class SetupPaymentAction implements Action<OrderState, OrderEvent> {

        private final OrderParametersService orderParametersService;

        public SetupPaymentAction(OrderParametersService orderParametersService) {
            this.orderParametersService = orderParametersService;
        }

        @Override
        public void execute(StateContext<OrderState, OrderEvent> context) {
            log.info("Налаштування способу оплати");

            String orderId = (String) context.getExtendedState().getVariables().get("orderId");

            try {
                // Отримуємо дані оплати з headers
                Object paymentMethodObj = context.getMessageHeaders().get("paymentMethod");
                Object paidAmountObj = context.getMessageHeaders().get("paidAmount");

                // Зберігаємо спосіб оплати
                orderParametersService.savePaymentMethod(orderId, paymentMethodObj, context);

                // Розраховуємо суми
                orderParametersService.calculatePaymentAmounts(orderId, paidAmountObj, context);

                // Валідуємо фінансові дані
                orderParametersService.validatePaymentData(orderId, context);

                log.info("Спосіб оплати успішно налаштовано для замовлення: {}", orderId);

            } catch (Exception e) {
                log.error("Помилка налаштування оплати для замовлення: {}", orderId, e);
                context.getExtendedState().getVariables().put("validationError",
                    "Помилка налаштування оплати: " + e.getMessage());
            }
        }
    }

    /**
     * Дія збереження додаткової інформації замовлення.
     */
    @Component("saveAdditionalInfoAction")
    public static class SaveAdditionalInfoAction implements Action<OrderState, OrderEvent> {

        private final OrderParametersService orderParametersService;

        public SaveAdditionalInfoAction(OrderParametersService orderParametersService) {
            this.orderParametersService = orderParametersService;
        }

        @Override
        public void execute(StateContext<OrderState, OrderEvent> context) {
            log.info("Збереження додаткової інформації замовлення");

            String orderId = (String) context.getExtendedState().getVariables().get("orderId");

            try {
                // Отримуємо додаткову інформацію з headers
                Object notesObj = context.getMessageHeaders().get("orderNotes");
                Object clientRequirementsObj = context.getMessageHeaders().get("clientRequirements");

                // Зберігаємо додаткову інформацію
                orderParametersService.saveAdditionalInfo(orderId, notesObj, clientRequirementsObj, context);

                log.info("Додаткова інформація успішно збережена для замовлення: {}", orderId);

            } catch (Exception e) {
                log.error("Помилка збереження додаткової інформації для замовлення: {}", orderId, e);
                context.getExtendedState().getVariables().put("validationError",
                    "Помилка збереження додаткової інформації: " + e.getMessage());
            }
        }
    }

    /**
     * Дія валідації та переходу до етапу 4.
     */
    @Component("proceedToStage4Action")
    public static class ProceedToStage4Action implements Action<OrderState, OrderEvent> {

        private final OrderParametersService orderParametersService;

        public ProceedToStage4Action(OrderParametersService orderParametersService) {
            this.orderParametersService = orderParametersService;
        }

        @Override
        public void execute(StateContext<OrderState, OrderEvent> context) {
            log.info("Перехід від етапу 3 до етапу 4");

            String orderId = (String) context.getExtendedState().getVariables().get("orderId");

            try {
                // Виконуємо повну валідацію етапу 3
                boolean isValidStage3 = orderParametersService.validateStage3Completion(orderId, context);

                if (!isValidStage3) {
                    log.warn("Спроба переходу з невалідними даними етапу 3 для замовлення: {}", orderId);
                    context.getExtendedState().getVariables().put("validationError",
                        "Не всі обов'язкові параметри заповнені");
                    return;
                }

                // Фінальний перерахунок всіх сум
                orderParametersService.performFinalCalculations(orderId, context);

                // Підготовка до завершення етапу 3
                orderParametersService.finalizeStage3(orderId, context);

                // Підготовка даних для етапу 4
                orderParametersService.prepareForStage4(orderId, context);

                log.info("Етап 3 успішно завершено, підготовка до етапу 4 для замовлення: {}", orderId);

            } catch (Exception e) {
                log.error("Помилка при переході до етапу 4 для замовлення: {}", orderId, e);
                context.getExtendedState().getVariables().put("systemError", e.getMessage());
            }
        }
    }
}
