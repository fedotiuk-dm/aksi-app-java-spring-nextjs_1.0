package com.aksi.domain.order.statemachine.stage2.guards;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage2.validator.ItemManagerValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Guards для етапу 2.0 - головний екран менеджера предметів.
 *
 * Відповідає за перевірку умов переходів між станами:
 * - Чи можна перейти до наступного етапу
 * - Чи можна видалити предмет
 * - Чи можна редагувати предмет
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ItemManagerGuards {

    private final ItemManagerValidator itemManagerValidator;

    /**
     * Перевіряє, чи можна перейти до етапу 3 (чи є предмети в замовленні).
     */
    @Component("canProceedToStage3Guard")
    public class CanProceedToStage3Guard implements Guard<OrderState, OrderEvent> {

        @Override
        public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
            String orderId = (String) context.getExtendedState().getVariables().get("orderId");

            if (orderId == null) {
                log.warn("OrderId не знайдено в контексті");
                return false;
            }

            ItemManagerValidator.ValidationResult result = itemManagerValidator.validateCanProceedToNextStage(orderId);

            log.debug("Валідація переходу до етапу 3 для замовлення {}: {}", orderId, result.isValid());

            return result.isValid();
        }
    }

    /**
     * Перевіряє, чи можна видалити предмет (чи існує він).
     */
    @Component("canDeleteItemGuard")
    public class CanDeleteItemGuard implements Guard<OrderState, OrderEvent> {

        @Override
        public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
            String itemId = (String) context.getExtendedState().getVariables().get("selectedItemId");

            if (itemId == null) {
                log.warn("SelectedItemId не знайдено в контексті");
                return false;
            }

            ItemManagerValidator.ValidationResult result = itemManagerValidator.validateItemForDeletion(itemId);

            log.debug("Валідація видалення предмета {}: {}", itemId, result.isValid());

            return result.isValid();
        }
    }

    /**
     * Перевіряє, чи можна редагувати предмет (чи існує він).
     */
    @Component("canEditItemGuard")
    public class CanEditItemGuard implements Guard<OrderState, OrderEvent> {

        @Override
        public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
            String itemId = (String) context.getExtendedState().getVariables().get("selectedItemId");

            if (itemId == null) {
                log.warn("SelectedItemId не знайдено в контексті");
                return false;
            }

            ItemManagerValidator.ValidationResult result = itemManagerValidator.validateItemForEdit(itemId);

            log.debug("Валідація редагування предмета {}: {}", itemId, result.isValid());

            return result.isValid();
        }
    }

    /**
     * Перевіряє, чи можна запустити підвізард (чи не активний він уже).
     */
    @Component("canStartSubWizardGuard")
    public class CanStartSubWizardGuard implements Guard<OrderState, OrderEvent> {

        @Override
        public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
            Boolean mainScreenActive = (Boolean) context.getExtendedState().getVariables().get("mainScreenActive");

            // Можна запустити підвізард тільки якщо головний екран активний
            boolean canStart = mainScreenActive != null && mainScreenActive;

            log.debug("Головний екран активний: {}, можна запустити підвізард: {}", mainScreenActive, canStart);

            return canStart;
        }
    }
}
