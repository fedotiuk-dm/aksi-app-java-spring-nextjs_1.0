package com.aksi.domain.order.statemachine.stage3.guards;

import java.util.List;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage3.dto.OrderDiscountDTO;
import com.aksi.domain.order.statemachine.stage3.service.OrderDiscountStepService;
import com.aksi.domain.order.statemachine.stage3.validator.OrderDiscountValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Guards для підетапу 3.2 "Знижки (глобальні для замовлення)".
 *
 * Відповідає за перевірку умов переходів у state machine
 * для етапу роботи з глобальними знижками замовлення.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class OrderDiscountGuards {

    private final OrderDiscountStepService stepService;
    private final OrderDiscountValidator validator;

    /**
     * Перевіряє чи можна зберегти дані знижки.
     */
    public Guard<OrderState, OrderEvent> canSaveDiscountData() {
        return new Guard<OrderState, OrderEvent>() {
            @Override
            public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
                try {
                    String wizardId = getWizardIdFromContext(context);
                    if (wizardId == null) {
                        log.warn("WizardId відсутній в контексті для збереження знижки");
                        return false;
                    }

                    // Завантажуємо дані та перевіряємо базову валідацію
                    OrderDiscountDTO dto = stepService.loadDiscountStep(wizardId, List.of());
                    boolean isValid = validator.validate(dto).isEmpty();

                    logGuardResult("canSaveDiscountData", wizardId, isValid,
                        isValid ? "Дані знижки валідні" : "Дані знижки містять помилки");

                    return isValid;

                } catch (Exception e) {
                    logGuardError("canSaveDiscountData", null, e);
                    return false;
                }
            }
        };
    }

    /**
     * Перевіряє чи можна перейти до наступного етапу.
     */
    public Guard<OrderState, OrderEvent> canProceedToNextStage() {
        return new Guard<OrderState, OrderEvent>() {
            @Override
            public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
                try {
                    String wizardId = getWizardIdFromContext(context);
                    if (wizardId == null) {
                        log.warn("WizardId відсутній в контексті для переходу до наступного етапу");
                        return false;
                    }

                    // Завантажуємо дані та перевіряємо можливість переходу
                    OrderDiscountDTO dto = stepService.loadDiscountStep(wizardId, List.of());
                    boolean canProceed = validator.canProceedToNext(dto);

                    logGuardResult("canProceedToNextStage", wizardId, canProceed,
                        canProceed ? "Можна перейти до наступного етапу" : "Неможливо перейти через помилки валідації");

                    return canProceed;

                } catch (Exception e) {
                    logGuardError("canProceedToNextStage", null, e);
                    return false;
                }
            }
        };
    }

    /**
     * Перевіряє чи можна завершити підетап 3.2.
     */
    public Guard<OrderState, OrderEvent> canCompleteDiscountStep() {
        return new Guard<OrderState, OrderEvent>() {
            @Override
            public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
                try {
                    String wizardId = getWizardIdFromContext(context);
                    if (wizardId == null) {
                        log.warn("WizardId відсутній в контексті для завершення підетапу");
                        return false;
                    }

                    // Завантажуємо дані та перевіряємо валідацію
                    OrderDiscountDTO dto = stepService.loadDiscountStep(wizardId, List.of());
                    boolean isValid = validator.canProceedToNext(dto);

                    if (isValid) {
                        log.debug("Підетап знижки можна завершити для wizardId: {}", wizardId);
                    } else {
                        log.warn("Підетап знижки не можна завершити через помилки валідації для wizardId: {}", wizardId);
                    }

                    return isValid;

                } catch (Exception e) {
                    log.error("Помилка при перевірці можливості завершення підетапу знижки: {}", e.getMessage(), e);
                    return false;
                }
            }
        };
    }

    /**
     * Перевіряє чи можна редагувати дані знижки.
     */
    public Guard<OrderState, OrderEvent> canEditDiscountData() {
        return new Guard<OrderState, OrderEvent>() {
            @Override
            public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
                try {
                    String wizardId = getWizardIdFromContext(context);
                    if (wizardId == null) {
                        log.warn("WizardId відсутній в контексті для редагування знижки");
                        return false;
                    }

                    // Завжди можна редагувати знижку поки замовлення в процесі створення
                    log.debug("Редагування знижки дозволено для wizardId: {}", wizardId);
                    return true;

                } catch (Exception e) {
                    log.error("Помилка при перевірці можливості редагування знижки: {}", e.getMessage(), e);
                    return false;
                }
            }
        };
    }

    /**
     * Перевіряє чи обрана якась знижка (крім NO_DISCOUNT).
     */
    public Guard<OrderState, OrderEvent> hasDiscountSelected() {
        return new Guard<OrderState, OrderEvent>() {
            @Override
            public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
                try {
                    String wizardId = getWizardIdFromContext(context);
                    if (wizardId == null) {
                        return false;
                    }

                    OrderDiscountDTO dto = stepService.loadDiscountStep(wizardId, List.of());
                    boolean hasDiscount = dto.getDiscountType() != null &&
                                        !"NO_DISCOUNT".equals(dto.getDiscountType().name());

                    log.debug("Наявність обраної знижки для wizardId {}: {}", wizardId, hasDiscount);
                    return hasDiscount;

                } catch (Exception e) {
                    log.error("Помилка при перевірці обраної знижки: {}", e.getMessage(), e);
                    return false;
                }
            }
        };
    }

    /**
     * Перевіряє чи можна застосувати знижку до всіх товарів замовлення.
     */
    public Guard<OrderState, OrderEvent> canApplyDiscountToAllItems() {
        return new Guard<OrderState, OrderEvent>() {
            @Override
            public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
                try {
                    String wizardId = getWizardIdFromContext(context);
                    if (wizardId == null) {
                        return false;
                    }

                    // TODO: Реалізувати через аналіз категорій товарів замовлення
                    // Знижки не діють на прасування, прання і фарбування текстилю
                    log.debug("Перевірка можливості застосування знижки до всіх товарів для wizardId: {}", wizardId);

                    // Поки що повертаємо true - потрібна інтеграція з аналізом OrderDTO
                    return true;

                } catch (Exception e) {
                    log.error("Помилка при перевірці можливості застосування знижки до всіх товарів: {}", e.getMessage(), e);
                    return false;
                }
            }
        };
    }

    /**
     * Перевіряє чи потрібно показати попередження про обмеження знижки.
     */
    public Guard<OrderState, OrderEvent> shouldShowDiscountWarning() {
        return new Guard<OrderState, OrderEvent>() {
            @Override
            public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
                try {
                    String wizardId = getWizardIdFromContext(context);
                    if (wizardId == null) {
                        return false;
                    }

                    // Протилежність canApplyDiscountToAllItems
                    boolean showWarning = !canApplyDiscountToAllItems().evaluate(context);

                    if (showWarning) {
                        log.info("Потрібно показати попередження про обмеження знижки для wizardId: {}", wizardId);
                    }

                    return showWarning;

                } catch (Exception e) {
                    log.error("Помилка при перевірці необхідності показу попередження про знижку: {}", e.getMessage(), e);
                    return false;
                }
            }
        };
    }

    /**
     * Перевіряє чи є товари в замовленні для застосування знижки.
     */
    public Guard<OrderState, OrderEvent> hasItemsForDiscount() {
        return new Guard<OrderState, OrderEvent>() {
            @Override
            public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
                try {
                    String wizardId = getWizardIdFromContext(context);
                    if (wizardId == null) {
                        return false;
                    }

                    // TODO: Реалізувати через аналіз OrderDTO
                    // Перевірити чи є товари що підлягають знижкам
                    log.debug("Перевірка наявності товарів для знижки для wizardId: {}", wizardId);

                    // Поки що повертаємо true - потрібна інтеграція з OrderDTO
                    return true;

                } catch (Exception e) {
                    log.error("Помилка при перевірці наявності товарів для знижки: {}", e.getMessage(), e);
                    return false;
                }
            }
        };
    }

    /**
     * Перевіряє чи всі товари в замовленні не підлягають знижкам.
     */
    public Guard<OrderState, OrderEvent> areAllItemsNonDiscountable() {
        return new Guard<OrderState, OrderEvent>() {
            @Override
            public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
                try {
                    String wizardId = getWizardIdFromContext(context);
                    if (wizardId == null) {
                        return false;
                    }

                    // TODO: Реалізувати через аналіз категорій товарів
                    // Перевірити чи всі товари з категорій що не підлягають знижкам
                    log.debug("Перевірка чи всі товари не підлягають знижкам для wizardId: {}", wizardId);

                    // Поки що повертаємо false - потрібна інтеграція з OrderDTO
                    return false;

                } catch (Exception e) {
                    log.error("Помилка при перевірці товарів що не підлягають знижкам: {}", e.getMessage(), e);
                    return false;
                }
            }
        };
    }

    /**
     * Перевіряє чи відсоток користувацької знижки валідний.
     */
    public Guard<OrderState, OrderEvent> isCustomDiscountPercentageValid() {
        return new Guard<OrderState, OrderEvent>() {
            @Override
            public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
                try {
                    String wizardId = getWizardIdFromContext(context);
                    if (wizardId == null) {
                        return false;
                    }

                    OrderDiscountDTO dto = stepService.loadDiscountStep(wizardId, List.of());

                    // Якщо це не користувацька знижка, то перевірка проходить
                    if (!"CUSTOM".equals(dto.getDiscountType().name())) {
                        return true;
                    }

                    Integer percentage = dto.getDiscountPercentage();
                    if (percentage == null) {
                        log.warn("isCustomDiscountPercentageValid: percentage is null for wizardId: {}", wizardId);
                        return false;
                    }

                    // Перевіряємо діапазон 1-50%
                    boolean isValid = percentage >= 1 && percentage <= 50;

                    if (!isValid) {
                        log.warn("Невалідний відсоток користувацької знижки: {}% для wizardId: {}", percentage, wizardId);
                    }

                    return isValid;

                } catch (Exception e) {
                    log.error("Помилка при перевірці валідності відсотка користувацької знижки: {}", e.getMessage(), e);
                    return false;
                }
            }
        };
    }

    /**
     * Перевіряє чи опис користувацької знижки валідний.
     */
    public Guard<OrderState, OrderEvent> isCustomDiscountDescriptionValid() {
        return new Guard<OrderState, OrderEvent>() {
            @Override
            public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
                try {
                    String wizardId = getWizardIdFromContext(context);
                    if (wizardId == null) {
                        return false;
                    }

                    OrderDiscountDTO dto = stepService.loadDiscountStep(wizardId, List.of());

                    // Якщо це не користувацька знижка, то перевірка проходить
                    if (!"CUSTOM".equals(dto.getDiscountType().name())) {
                        return true;
                    }

                    String description = dto.getDiscountDescription();

                    // Опис має бути не пустим і не довшим за 255 символів
                    boolean isValid = description != null &&
                                    !description.trim().isEmpty() &&
                                    description.length() <= 255;

                    if (!isValid) {
                        log.warn("Невалідний опис користувацької знижки для wizardId: {}", wizardId);
                    }

                    return isValid;

                } catch (Exception e) {
                    log.error("Помилка при перевірці валідності опису користувацької знижки: {}", e.getMessage(), e);
                    return false;
                }
            }
        };
    }

    // Допоміжні методи

    /**
     * Витягує wizardId з контексту state machine.
     */
    private String getWizardIdFromContext(StateContext<OrderState, OrderEvent> context) {
        try {
            Object wizardId = context.getExtendedState().getVariables().get("wizardId");
            if (wizardId instanceof String) {
                return (String) wizardId;
            }
            log.warn("WizardId в контексті має невірний тип: {}", wizardId != null ? wizardId.getClass() : "null");
            return null;
        } catch (Exception e) {
            log.error("Помилка при витягуванні wizardId з контексту: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * Логує результат роботи guard'а.
     */
    private void logGuardResult(String guardName, String wizardId, boolean result, String reason) {
        if (result) {
            log.debug("Guard [{}] для wizardId [{}]: ДОЗВОЛЕНО - {}", guardName, wizardId, reason);
        } else {
            log.warn("Guard [{}] для wizardId [{}]: ЗАБОРОНЕНО - {}", guardName, wizardId, reason);
        }
    }

    /**
     * Логує помилку при роботі guard'а.
     */
    private void logGuardError(String guardName, String wizardId, Exception e) {
        log.error("Помилка в guard [{}] для wizardId [{}]: {}", guardName, wizardId, e.getMessage(), e);
    }
}
