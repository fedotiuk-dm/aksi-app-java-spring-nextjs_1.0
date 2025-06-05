package com.aksi.domain.order.statemachine.stage2.guards;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage2.service.ItemStainDefectStepService;

/**
 * Guards для підетапу 2.3 "Забруднення, дефекти та ризики".
 *
 * Відповідає за перевірку умов переходів між станами:
 * - Можливість переходу до наступного кроку
 * - Валідність збережених даних плям та дефектів
 * - Перевірка критичних ризиків
 * - Готовність до завершення підетапу
 */
@Component
public class ItemStainDefectGuards {

    private static final Logger logger = LoggerFactory.getLogger(ItemStainDefectGuards.class);

    private final ItemStainDefectStepService stainDefectService;

    public ItemStainDefectGuards(ItemStainDefectStepService stainDefectService) {
        this.stainDefectService = stainDefectService;
    }

    /**
     * Перевіряє можливість переходу від підетапу 2.3 до наступного кроку.
     * Підетап є необов'язковим, але якщо дані заповнені - вони мають бути валідними.
     */
    @Component("canProceedFromStainDefectGuard")
    public static class CanProceedFromStainDefectGuard implements Guard<OrderState, OrderEvent> {

        private final ItemStainDefectStepService stainDefectService;

        public CanProceedFromStainDefectGuard(ItemStainDefectStepService stainDefectService) {
            this.stainDefectService = stainDefectService;
        }

        @Override
        public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
            String wizardId = (String) context.getExtendedState().getVariables().get("wizardId");

            if (wizardId == null) {
                logger.warn("WizardId відсутній у контексті");
                return false;
            }

            try {
                boolean canProceed = stainDefectService.canProceedToNextStep(wizardId);

                logger.debug("Перевірка переходу з підетапу плям та дефектів для wizard {}: {}",
                           wizardId, canProceed ? "ДОЗВОЛЕНО" : "ЗАБОРОНЕНО");

                // Зберігаємо результат у контексті для подальшого використання
                context.getExtendedState().getVariables().put("stainDefectValidation", canProceed);

                return canProceed;

            } catch (Exception e) {
                logger.error("Помилка при перевірці можливості переходу з підетапу плям та дефектів для wizard {}: {}",
                           wizardId, e.getMessage(), e);
                return false;
            }
        }
    }

    /**
     * Перевіряє, чи є критичні ризики у вибраних дефектах.
     * Використовується для відображення попереджень.
     */
    @Component("hasCriticalRisksGuard")
    public static class HasCriticalRisksGuard implements Guard<OrderState, OrderEvent> {

        private final ItemStainDefectStepService stainDefectService;

        public HasCriticalRisksGuard(ItemStainDefectStepService stainDefectService) {
            this.stainDefectService = stainDefectService;
        }

        @Override
        public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
            String wizardId = (String) context.getExtendedState().getVariables().get("wizardId");

            if (wizardId == null) {
                return false;
            }

            try {
                boolean hasCriticalRisks = stainDefectService.hasCriticalRisks(wizardId);

                logger.debug("Перевірка критичних ризиків для wizard {}: {}",
                           wizardId, hasCriticalRisks ? "ВИЯВЛЕНО" : "НЕ ВИЯВЛЕНО");

                // Зберігаємо результат у контексті
                context.getExtendedState().getVariables().put("hasCriticalRisks", hasCriticalRisks);

                return hasCriticalRisks;

            } catch (Exception e) {
                logger.error("Помилка при перевірці критичних ризиків для wizard {}: {}",
                           wizardId, e.getMessage(), e);
                return false;
            }
        }
    }

    /**
     * Перевіряє, чи можна перейти до попереднього кроку.
     * Завжди дозволено, оскільки підетап необов'язковий.
     */
    @Component("canGoBackFromStainDefectGuard")
    public static class CanGoBackFromStainDefectGuard implements Guard<OrderState, OrderEvent> {

        @Override
        public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
            // Завжди можна повернутися назад
            logger.debug("Перехід назад з підетапу плям та дефектів: ДОЗВОЛЕНО");
            return true;
        }
    }

    /**
     * Перевіряє валідність збережених даних плям та дефектів.
     */
    @Component("isStainDefectDataValidGuard")
    public static class IsStainDefectDataValidGuard implements Guard<OrderState, OrderEvent> {

        private final ItemStainDefectStepService stainDefectService;

        public IsStainDefectDataValidGuard(ItemStainDefectStepService stainDefectService) {
            this.stainDefectService = stainDefectService;
        }

        @Override
        public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
            String wizardId = (String) context.getExtendedState().getVariables().get("wizardId");

            if (wizardId == null) {
                return false;
            }

            try {
                boolean isValid = stainDefectService.canProceedToNextStep(wizardId);

                logger.debug("Валідація даних плям та дефектів для wizard {}: {}",
                           wizardId, isValid ? "ВАЛІДНІ" : "НЕВАЛІДНІ");

                return isValid;

            } catch (Exception e) {
                logger.error("Помилка валідації даних плям та дефектів для wizard {}: {}",
                           wizardId, e.getMessage(), e);
                return false;
            }
        }
    }

    /**
     * Перевіряє, чи потрібно показати попередження через критичні ризики.
     */
    @Component("shouldShowRiskWarningGuard")
    public static class ShouldShowRiskWarningGuard implements Guard<OrderState, OrderEvent> {

        private final ItemStainDefectStepService stainDefectService;

        public ShouldShowRiskWarningGuard(ItemStainDefectStepService stainDefectService) {
            this.stainDefectService = stainDefectService;
        }

        @Override
        public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
            String wizardId = (String) context.getExtendedState().getVariables().get("wizardId");

            if (wizardId == null) {
                return false;
            }

            try {
                // Перевіряємо наявність критичних ризиків
                boolean hasCriticalRisks = stainDefectService.hasCriticalRisks(wizardId);

                // Перевіряємо чи вже показували попередження
                Boolean warningShown = (Boolean) context.getExtendedState().getVariables().get("riskWarningShown");
                boolean shouldShow = hasCriticalRisks && (warningShown == null || !warningShown);

                if (shouldShow) {
                    logger.info("Потрібно показати попередження про критичні ризики для wizard: {}", wizardId);
                    context.getExtendedState().getVariables().put("riskWarningShown", true);
                }

                return shouldShow;

            } catch (Exception e) {
                logger.error("Помилка при перевірці необхідності показу попередження для wizard {}: {}",
                           wizardId, e.getMessage(), e);
                return false;
            }
        }
    }

    /**
     * Перевіряє готовність підетапу до завершення.
     * Включає валідацію даних та обробку критичних ризиків.
     */
    @Component("isStainDefectStepCompleteGuard")
    public static class IsStainDefectStepCompleteGuard implements Guard<OrderState, OrderEvent> {

        private final ItemStainDefectStepService stainDefectService;

        public IsStainDefectStepCompleteGuard(ItemStainDefectStepService stainDefectService) {
            this.stainDefectService = stainDefectService;
        }

        @Override
        public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
            String wizardId = (String) context.getExtendedState().getVariables().get("wizardId");

            if (wizardId == null) {
                return false;
            }

            try {
                // Перевіряємо базову валідність
                boolean isValid = stainDefectService.canProceedToNextStep(wizardId);

                if (isValid) {
                    // Якщо є критичні ризики, перевіряємо чи користувач підтвердив
                    boolean hasCriticalRisks = stainDefectService.hasCriticalRisks(wizardId);

                    if (hasCriticalRisks) {
                        Boolean risksConfirmed = (Boolean) context.getExtendedState().getVariables().get("criticalRisksConfirmed");
                        isValid = risksConfirmed != null && risksConfirmed;

                        if (!isValid) {
                            logger.debug("Критичні ризики не підтверджені для wizard: {}", wizardId);
                        }
                    }
                }

                logger.debug("Готовність підетапу плям та дефектів для wizard {}: {}",
                           wizardId, isValid ? "ГОТОВИЙ" : "НЕ ГОТОВИЙ");

                return isValid;

            } catch (Exception e) {
                logger.error("Помилка при перевірці готовності підетапу плям та дефектів для wizard {}: {}",
                           wizardId, e.getMessage(), e);
                return false;
            }
        }
    }
}
