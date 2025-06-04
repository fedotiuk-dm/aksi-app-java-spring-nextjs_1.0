package com.aksi.domain.order.statemachine.stage2.guards;

import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage2.service.ItemBasicInfoService;
import com.aksi.domain.order.statemachine.stage2.validator.ItemBasicInfoValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Guards для підетапу 2.1 "Основна інформація про предмет".
 *
 * Відповідає за перевірку умов переходів:
 * - Чи можна вибрати категорію
 * - Чи можна вибрати предмет
 * - Чи можна оновити кількість
 * - Чи можна перейти до наступного підетапу
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ItemBasicInfoGuards {

    private final ItemBasicInfoValidator itemBasicInfoValidator;
    private final ItemBasicInfoService itemBasicInfoService;

    /**
     * Перевіряє, чи можна вибрати категорію.
     */
    @Component("canSelectCategoryGuard")
    public class CanSelectCategoryGuard implements Guard<OrderState, OrderEvent> {

        @Override
        public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
            String categoryIdStr = (String) context.getExtendedState()
                .getVariables().get("selectedCategoryId");

            if (categoryIdStr == null) {
                log.debug("selectedCategoryId не знайдено в контексті");
                return false;
            }

            try {
                UUID categoryId = UUID.fromString(categoryIdStr);
                ItemBasicInfoValidator.ValidationResult result =
                    itemBasicInfoValidator.validateCategorySelection(categoryId);

                log.debug("Валідація вибору категорії {}: {}", categoryId, result.isValid());
                return result.isValid();

            } catch (IllegalArgumentException e) {
                log.warn("Неправильний формат UUID категорії: {}", categoryIdStr);
                return false;
            }
        }
    }

    /**
     * Перевіряє, чи можна вибрати предмет.
     */
    @Component("canSelectItemGuard")
    public class CanSelectItemGuard implements Guard<OrderState, OrderEvent> {

        @Override
        public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
            String itemIdStr = (String) context.getExtendedState()
                .getVariables().get("selectedItemId");

            if (itemIdStr == null) {
                log.debug("selectedItemId не знайдено в контексті");
                return false;
            }

            try {
                UUID itemId = UUID.fromString(itemIdStr);

                // Отримуємо поточну вибрану категорію
                var basicInfo = itemBasicInfoService.getCurrentBasicInfo(context);

                ItemBasicInfoValidator.ValidationResult result =
                    itemBasicInfoValidator.validateItemSelection(itemId, basicInfo.getSelectedCategory());

                log.debug("Валідація вибору предмета {}: {}", itemId, result.isValid());
                return result.isValid();

            } catch (IllegalArgumentException e) {
                log.warn("Неправильний формат UUID предмета: {}", itemIdStr);
                return false;
            } catch (Exception e) {
                log.error("Помилка валідації вибору предмета: {}", e.getMessage());
                return false;
            }
        }
    }

    /**
     * Перевіряє, чи можна оновити кількість.
     */
    @Component("canUpdateQuantityGuard")
    public class CanUpdateQuantityGuard implements Guard<OrderState, OrderEvent> {

        @Override
        public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
            Object quantity = context.getExtendedState().getVariables().get("quantity");

            if (quantity == null) {
                log.debug("quantity не знайдено в контексті");
                return false;
            }

            ItemBasicInfoValidator.ValidationResult result =
                itemBasicInfoValidator.validateQuantity(quantity);

            log.debug("Валідація кількості {}: {}", quantity, result.isValid());
            return result.isValid();
        }
    }

    /**
     * Перевіряє, чи можна перейти до підетапу 2.2.
     */
    @Component("canProceedToSubstage22Guard")
    public class CanProceedToSubstage22Guard implements Guard<OrderState, OrderEvent> {

        @Override
        public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
            log.debug("Перевірка можливості переходу до підетапу 2.2");

            try {
                boolean canProceed = itemBasicInfoService.validateSubstageCompletion(context);

                log.debug("Валідація завершення підетапу 2.1: {}", canProceed);
                return canProceed;

            } catch (Exception e) {
                log.error("Помилка валідації завершення підетапу 2.1: {}", e.getMessage());
                return false;
            }
        }
    }

    /**
     * Перевіряє, чи ініціалізований підетап 2.1.
     */
    @Component("isSubstage21InitializedGuard")
    public class IsSubstage21InitializedGuard implements Guard<OrderState, OrderEvent> {

        @Override
        public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
            Object basicInfoObj = context.getExtendedState().getVariables().get("itemBasicInfo");
            String currentSubstage = (String) context.getExtendedState().getVariables().get("currentSubstage");

            boolean isInitialized = basicInfoObj != null && "2.1".equals(currentSubstage);

            log.debug("Підетап 2.1 ініціалізований: {}", isInitialized);
            return isInitialized;
        }
    }

    /**
     * Перевіряє, чи є помилки валідації.
     */
    @Component("hasNoValidationErrorsGuard")
    public class HasNoValidationErrorsGuard implements Guard<OrderState, OrderEvent> {

        @Override
        public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
            var basicInfo = itemBasicInfoService.getCurrentBasicInfo(context);

            boolean hasNoErrors = basicInfo.getHasErrors() == null || !basicInfo.getHasErrors();

            log.debug("Відсутність помилок валідації: {}", hasNoErrors);
            return hasNoErrors;
        }
    }

    /**
     * Перевіряє, чи вибрана категорія.
     */
    @Component("isCategorySelectedGuard")
    public class IsCategorySelectedGuard implements Guard<OrderState, OrderEvent> {

        @Override
        public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
            var basicInfo = itemBasicInfoService.getCurrentBasicInfo(context);

            boolean categorySelected = basicInfo.getSelectedCategory() != null;

            log.debug("Категорія вибрана: {}", categorySelected);
            return categorySelected;
        }
    }

    /**
     * Перевіряє, чи вибраний предмет.
     */
    @Component("isItemSelectedGuard")
    public class IsItemSelectedGuard implements Guard<OrderState, OrderEvent> {

        @Override
        public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
            var basicInfo = itemBasicInfoService.getCurrentBasicInfo(context);

            boolean itemSelected = basicInfo.getSelectedItem() != null;

            log.debug("Предмет вибраний: {}", itemSelected);
            return itemSelected;
        }
    }
}
