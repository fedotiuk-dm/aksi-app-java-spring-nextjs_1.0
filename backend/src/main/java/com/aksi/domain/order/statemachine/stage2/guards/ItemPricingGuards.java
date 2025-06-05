package com.aksi.domain.order.statemachine.stage2.guards;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.entity.OrderEntity;
import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.service.OrderWizardPersistenceService;
import com.aksi.domain.order.statemachine.stage2.dto.ItemPricingDTO;
import com.aksi.domain.order.statemachine.stage2.service.ItemPricingStepService;
import com.aksi.domain.order.statemachine.stage2.validator.ItemPricingValidator;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Guards для підетапу 2.4 "Знижки та надбавки (калькулятор ціни)".
 *
 * Містить умови для переходів state machine між станами pricing.
 * Кожен Guard реалізований як окремий static компонент з власними залежностями.
 */
public class ItemPricingGuards {

    // Клас-контейнер для static Guard-ів
    private ItemPricingGuards() {
        // Приватний конструктор для утилітарного класу
    }

    /**
     * Перевіряє чи можна перейти до підетапу pricing з попереднього кроку.
     */
    @Component("canProceedToPricingGuard")
    public static class CanProceedToPricingGuard implements Guard<OrderState, OrderEvent> {

        private static final Logger logger = LoggerFactory.getLogger(CanProceedToPricingGuard.class);

        private final ItemPricingStepService pricingService;

        public CanProceedToPricingGuard(ItemPricingStepService pricingService) {
            this.pricingService = pricingService;
        }

        @Override
        public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
            String wizardId = extractWizardId(context);
            if (wizardId == null) {
                logger.warn("Відсутній wizardId у контексті");
                return false;
            }

            try {
                // Завантажуємо дані для pricing
                ItemPricingDTO pricingData = pricingService.loadPricingData(wizardId);

                // Перевіряємо чи є базові дані для розрахунку
                boolean canProceed = pricingData != null && pricingData.isValid();

                logger.debug("Перевірка переходу до pricing для wizard {}: {}",
                           wizardId, canProceed ? "ДОЗВОЛЕНО" : "ЗАБОРОНЕНО");
                return canProceed;

            } catch (Exception e) {
                logger.error("Помилка перевірки переходу до pricing для wizard {}: {}",
                           wizardId, e.getMessage(), e);
                return false;
            }
        }
    }

    /**
     * Перевіряє чи можна перейти з підетапу pricing до наступного кроку.
     */
    @Component("canProceedFromPricingGuard")
    public static class CanProceedFromPricingGuard implements Guard<OrderState, OrderEvent> {

        private static final Logger logger = LoggerFactory.getLogger(CanProceedFromPricingGuard.class);

        private final ItemPricingStepService pricingService;

        public CanProceedFromPricingGuard(ItemPricingStepService pricingService) {
            this.pricingService = pricingService;
        }

        @Override
        public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
            String wizardId = extractWizardId(context);
            if (wizardId == null) {
                logger.warn("Відсутній wizardId у контексті");
                return false;
            }

            try {
                boolean canProceed = pricingService.canProceedToNextStep(wizardId);
                logger.debug("Перевірка переходу з pricing для wizard {}: {}",
                           wizardId, canProceed ? "ДОЗВОЛЕНО" : "ЗАБОРОНЕНО");
                return canProceed;

            } catch (Exception e) {
                logger.error("Помилка перевірки переходу з pricing для wizard {}: {}",
                           wizardId, e.getMessage(), e);
                return false;
            }
        }
    }

    /**
     * Перевіряє чи можна повернутися до попереднього кроку з pricing.
     */
    @Component("canGoBackFromPricingGuard")
    public static class CanGoBackFromPricingGuard implements Guard<OrderState, OrderEvent> {

        private static final Logger logger = LoggerFactory.getLogger(CanGoBackFromPricingGuard.class);

        @Override
        public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
            String wizardId = extractWizardId(context);
            logger.debug("Перевірка повернення з pricing для wizard {}: ДОЗВОЛЕНО", wizardId);
            return true; // Завжди можна повернутися назад
        }
    }

    /**
     * Перевіряє чи валідні дані pricing.
     */
    @Component("isPricingDataValidGuard")
    public static class IsPricingDataValidGuard implements Guard<OrderState, OrderEvent> {

        private static final Logger logger = LoggerFactory.getLogger(IsPricingDataValidGuard.class);

        private final ItemPricingValidator validator;
        private final OrderWizardPersistenceService persistenceService;
        private final ObjectMapper objectMapper;

        public IsPricingDataValidGuard(
                ItemPricingValidator validator,
                OrderWizardPersistenceService persistenceService,
                ObjectMapper objectMapper) {
            this.validator = validator;
            this.persistenceService = persistenceService;
            this.objectMapper = objectMapper;
        }

        @Override
        public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
            String wizardId = extractWizardId(context);
            if (wizardId == null) {
                return false;
            }

            try {
                var wizardData = persistenceService.loadWizardData(wizardId);
                Object pricingData = wizardData.get("itemPricing");

                if (pricingData == null) {
                    logger.debug("Дані pricing відсутні для wizard {}", wizardId);
                    return false;
                }

                ItemPricingDTO dto = objectMapper.convertValue(pricingData, ItemPricingDTO.class);
                boolean isValid = validator.isValid(dto);

                logger.debug("Валідація pricing для wizard {}: {}",
                           wizardId, isValid ? "ПРОЙШЛА" : "НЕ ПРОЙШЛА");
                return isValid;

            } catch (Exception e) {
                logger.error("Помилка валідації pricing для wizard {}: {}", wizardId, e.getMessage(), e);
                return false;
            }
        }
    }

    /**
     * Перевіряє чи розрахована ціна.
     */
    @Component("isPriceCalculatedGuard")
    public static class IsPriceCalculatedGuard implements Guard<OrderState, OrderEvent> {

        private static final Logger logger = LoggerFactory.getLogger(IsPriceCalculatedGuard.class);

        private final OrderWizardPersistenceService persistenceService;
        private final ObjectMapper objectMapper;

        public IsPriceCalculatedGuard(
                OrderWizardPersistenceService persistenceService,
                ObjectMapper objectMapper) {
            this.persistenceService = persistenceService;
            this.objectMapper = objectMapper;
        }

        @Override
        public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
            String wizardId = extractWizardId(context);
            if (wizardId == null) {
                return false;
            }

            try {
                var wizardData = persistenceService.loadWizardData(wizardId);
                Object pricingData = wizardData.get("itemPricing");

                if (pricingData == null) {
                    return false;
                }

                ItemPricingDTO dto = objectMapper.convertValue(pricingData, ItemPricingDTO.class);
                boolean isCalculated = dto.isPriceCalculated();

                logger.debug("Перевірка розрахованої ціни для wizard {}: {}",
                           wizardId, isCalculated ? "РОЗРАХОВАНА" : "НЕ РОЗРАХОВАНА");
                return isCalculated;

            } catch (Exception e) {
                logger.error("Помилка перевірки розрахованої ціни для wizard {}: {}",
                           wizardId, e.getMessage(), e);
                return false;
            }
        }
    }

    /**
     * Перевіряє чи повний підетап pricing.
     */
    @Component("isPricingStepCompleteGuard")
    public static class IsPricingStepCompleteGuard implements Guard<OrderState, OrderEvent> {

        private static final Logger logger = LoggerFactory.getLogger(IsPricingStepCompleteGuard.class);

        private final ItemPricingStepService pricingService;
        private final ItemPricingValidator validator;

        public IsPricingStepCompleteGuard(
                ItemPricingStepService pricingService,
                ItemPricingValidator validator) {
            this.pricingService = pricingService;
            this.validator = validator;
        }

        @Override
        public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
            String wizardId = extractWizardId(context);
            if (wizardId == null) {
                return false;
            }

            try {
                // Завантажуємо дані
                ItemPricingDTO pricingData = pricingService.loadPricingData(wizardId);

                if (pricingData == null) {
                    return false;
                }

                // Перевіряємо повноту
                boolean isComplete = validator.isValid(pricingData) &&
                                   pricingData.isPriceCalculated() &&
                                   pricingData.getFinalTotalPrice() != null;

                logger.debug("Перевірка повноти pricing для wizard {}: {}",
                           wizardId, isComplete ? "ПОВНИЙ" : "НЕПОВНИЙ");
                return isComplete;

            } catch (Exception e) {
                logger.error("Помилка перевірки повноти pricing для wizard {}: {}",
                           wizardId, e.getMessage(), e);
                return false;
            }
        }
    }

    /**
     * Перевіряє чи потрібно показати попередження про ризики ціни.
     */
    @Component("shouldShowPriceRiskWarningGuard")
    public static class ShouldShowPriceRiskWarningGuard implements Guard<OrderState, OrderEvent> {

        private static final Logger logger = LoggerFactory.getLogger(ShouldShowPriceRiskWarningGuard.class);

        private final OrderWizardPersistenceService persistenceService;
        private final ObjectMapper objectMapper;

        public ShouldShowPriceRiskWarningGuard(
                OrderWizardPersistenceService persistenceService,
                ObjectMapper objectMapper) {
            this.persistenceService = persistenceService;
            this.objectMapper = objectMapper;
        }

        @Override
        public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
            String wizardId = extractWizardId(context);
            if (wizardId == null) {
                return false;
            }

            try {
                var wizardData = persistenceService.loadWizardData(wizardId);
                Object pricingData = wizardData.get("itemPricing");

                if (pricingData == null) {
                    return false;
                }

                ItemPricingDTO dto = objectMapper.convertValue(pricingData, ItemPricingDTO.class);

                // Показуємо попередження якщо:
                // 1. Знижка не застосовується до категорії, але вибрана
                // 2. Велика кількість модифікаторів (може збільшити ціну значно)
                // 3. Фінальна ціна значно відрізняється від базової

                boolean shouldWarn = false;

                // Перевірка знижки
                if (dto.getHasDiscount() != null && dto.getHasDiscount() &&
                    dto.getDiscountApplicable() != null && !dto.getDiscountApplicable()) {
                    shouldWarn = true;
                }

                // Перевірка кількості модифікаторів
                if (dto.getSelectedModifierCodes() != null && dto.getSelectedModifierCodes().size() > 5) {
                    shouldWarn = true;
                }

                // Перевірка різниці у ціні (більше 200% від базової)
                if (dto.getBaseTotalPrice() != null && dto.getFinalTotalPrice() != null) {
                    double ratio = dto.getFinalTotalPrice().divide(dto.getBaseTotalPrice(), 2, java.math.RoundingMode.HALF_UP).doubleValue();
                    if (ratio > 3.0) { // Більше 300% від базової ціни
                        shouldWarn = true;
                    }
                }

                logger.debug("Перевірка попередження про ризики ціни для wizard {}: {}",
                           wizardId, shouldWarn ? "ПОТРІБНО" : "НЕ ПОТРІБНО");
                return shouldWarn;

            } catch (Exception e) {
                logger.error("Помилка перевірки попередження про ризики для wizard {}: {}",
                           wizardId, e.getMessage(), e);
                return false;
            }
        }
    }

    // === Утиліти ===

    /**
     * Витягує wizardId з контексту state machine.
     */
    private static String extractWizardId(StateContext<OrderState, OrderEvent> context) {
        // Спочатку шукаємо в headers
        Object wizardIdObj = context.getMessageHeaders().get("wizardId");
        if (wizardIdObj != null) {
            return wizardIdObj.toString();
        }

        // Потім в extended state
        wizardIdObj = context.getExtendedState().getVariables().get("wizardId");
        if (wizardIdObj != null) {
            return wizardIdObj.toString();
        }

        // Якщо є entity order, беремо його ID
        Object orderObj = context.getExtendedState().getVariables().get("order");
        if (orderObj instanceof OrderEntity) {
            OrderEntity order = (OrderEntity) orderObj;
            return order.getId().toString();
        }

        return null;
    }
}
