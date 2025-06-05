package com.aksi.domain.order.statemachine.stage3.guards;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage3.dto.ExecutionParametersDTO;
import com.aksi.domain.order.statemachine.stage3.service.ExecutionParametersStepService;
import com.aksi.domain.order.statemachine.stage3.validator.ExecutionParametersValidator;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Guards для підетапу 3.1 "Параметри виконання".
 *
 * Відповідає за перевірки переходів між станами state machine
 * для налаштування параметрів виконання замовлення.
 */
@Component
public class ExecutionParametersGuards {

    private static final Logger logger = LoggerFactory.getLogger(ExecutionParametersGuards.class);

    private static final String WIZARD_ID_KEY = "wizardId";
    private static final String EXECUTION_PARAMS_KEY = "executionParameters";

    private final ExecutionParametersStepService executionParametersService;
    private final ExecutionParametersValidator validator;
    private final ObjectMapper objectMapper;

    public ExecutionParametersGuards(
            ExecutionParametersStepService executionParametersService,
            ExecutionParametersValidator validator,
            ObjectMapper objectMapper) {
        this.executionParametersService = executionParametersService;
        this.validator = validator;
        this.objectMapper = objectMapper;
    }

    /**
     * Перевіряє чи можна перейти до етапу 3.1 (параметри виконання).
     */
    public Guard<OrderState, OrderEvent> canProceedToExecutionParametersStep() {
        return context -> {
            try {
                String wizardId = getWizardId(context);
                if (wizardId == null) {
                    logger.warn("WizardId відсутній для переходу до параметрів виконання");
                    return false;
                }

                // Перевіряємо чи завершений попередній етап (етап 2 - предмети)
                boolean previousStageComplete = checkPreviousStageCompletion(context, wizardId);

                if (!previousStageComplete) {
                    logger.debug("Попередній етап не завершений для wizard: {}", wizardId);
                    return false;
                }

                logger.debug("Дозволено перехід до параметрів виконання для wizard: {}", wizardId);
                return true;

            } catch (Exception e) {
                logger.error("Помилка перевірки переходу до параметрів виконання: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє чи можна перейти з етапу 3.1 до наступного етапу.
     */
    public Guard<OrderState, OrderEvent> canProceedFromExecutionParametersStep() {
        return context -> {
            try {
                String wizardId = getWizardId(context);
                if (wizardId == null) {
                    logger.warn("WizardId відсутній для переходу з параметрів виконання");
                    return false;
                }

                // Перевіряємо через сервіс
                boolean canProceed = executionParametersService.canProceedToNextStep(wizardId);

                if (!canProceed) {
                    logger.debug("Параметри виконання не готові для переходу, wizard: {}", wizardId);
                    return false;
                }

                logger.debug("Дозволено перехід з параметрів виконання для wizard: {}", wizardId);
                return true;

            } catch (Exception e) {
                logger.error("Помилка перевірки переходу з параметрів виконання: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє чи можна повернутися назад з етапу 3.1.
     */
    public Guard<OrderState, OrderEvent> canGoBackFromExecutionParametersStep() {
        return context -> {
            try {
                String wizardId = getWizardId(context);
                if (wizardId == null) {
                    return false;
                }

                // Завжди дозволяємо повернутися назад для редагування
                logger.debug("Дозволено повернення назад з параметрів виконання для wizard: {}", wizardId);
                return true;

            } catch (Exception e) {
                logger.error("Помилка перевірки можливості повернення з параметрів виконання: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє чи валідні дані параметрів виконання.
     */
    public Guard<OrderState, OrderEvent> isExecutionParametersDataValid() {
        return context -> {
            try {
                ExecutionParametersDTO dto = getExecutionParametersFromContext(context);
                if (dto == null) {
                    logger.debug("Дані параметрів виконання відсутні");
                    return false;
                }

                boolean isValid = validator.isValid(dto);

                if (!isValid) {
                    logger.debug("Дані параметрів виконання невалідні");
                    return false;
                }

                logger.debug("Дані параметрів виконання валідні");
                return true;

            } catch (Exception e) {
                logger.error("Помилка валідації даних параметрів виконання: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє чи є терміновість у замовленні.
     */
    public Guard<OrderState, OrderEvent> hasExpediteSelected() {
        return context -> {
            try {
                ExecutionParametersDTO dto = getExecutionParametersFromContext(context);
                if (dto == null) {
                    return false;
                }

                boolean hasExpedite = dto.isExpedited();
                logger.debug("Терміновість вибрана: {}", hasExpedite);
                return hasExpedite;

            } catch (Exception e) {
                logger.error("Помилка перевірки терміновості: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє чи можна застосувати терміновість до всіх предметів.
     */
    public Guard<OrderState, OrderEvent> canApplyExpediteToAllItems() {
        return context -> {
            try {
                ExecutionParametersDTO dto = getExecutionParametersFromContext(context);
                if (dto == null) {
                    return false;
                }

                boolean canApply = dto.canApplyExpediteToAllItems();

                if (!canApply) {
                    logger.debug("Терміновість не може бути застосована до всіх предметів");
                }

                return canApply;

            } catch (Exception e) {
                logger.error("Помилка перевірки можливості застосування терміновості: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє чи завершений етап параметрів виконання.
     */
    public Guard<OrderState, OrderEvent> isExecutionParametersStepComplete() {
        return context -> {
            try {
                String wizardId = getWizardId(context);
                if (wizardId == null) {
                    return false;
                }

                ExecutionParametersDTO dto = getExecutionParametersFromContext(context);
                if (dto == null) {
                    // Пробуємо завантажити з сервісу
                    dto = executionParametersService.loadExecutionParameters(wizardId);
                }

                if (dto == null) {
                    return false;
                }

                boolean isComplete = dto.getIsCompleted() && validator.canProceedToNext(dto);
                logger.debug("Етап параметрів виконання завершений: {}", isComplete);
                return isComplete;

            } catch (Exception e) {
                logger.error("Помилка перевірки завершеності етапу параметрів виконання: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє чи потрібно показати попередження про ризики.
     */
    public Guard<OrderState, OrderEvent> shouldShowExpediteRiskWarning() {
        return context -> {
            try {
                ExecutionParametersDTO dto = getExecutionParametersFromContext(context);
                if (dto == null) {
                    return false;
                }

                // Показуємо попередження для шкіряних виробів з терміновістю
                boolean showWarning = dto.isExpedited() && dto.getHasLeatherItems();

                if (showWarning) {
                    logger.debug("Потрібне попередження про ризики терміновості для шкіряних виробів");
                }

                return showWarning;

            } catch (Exception e) {
                logger.error("Помилка перевірки потреби попередження: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    // Приватні helper методи

    private String getWizardId(StateContext<OrderState, OrderEvent> context) {
        Object wizardId = context.getExtendedState().getVariables().get(WIZARD_ID_KEY);
        return wizardId instanceof String ? (String) wizardId : null;
    }

    private ExecutionParametersDTO getExecutionParametersFromContext(StateContext<OrderState, OrderEvent> context) {
        try {
            Object dataObj = context.getExtendedState().getVariables().get(EXECUTION_PARAMS_KEY);

            if (dataObj == null) {
                return null;
            }

            if (dataObj instanceof ExecutionParametersDTO) {
                return (ExecutionParametersDTO) dataObj;
            } else {
                return objectMapper.convertValue(dataObj, ExecutionParametersDTO.class);
            }

        } catch (Exception e) {
            logger.error("Помилка отримання даних параметрів виконання з контексту: {}", e.getMessage(), e);
            return null;
        }
    }

    private boolean checkPreviousStageCompletion(StateContext<OrderState, OrderEvent> context, String wizardId) {
        try {
            // TODO: Реалізувати перевірку завершеності етапу 2 (предмети)
            // Поки повертаємо true для тестування

            // Перевірка наявності предметів у замовленні
            Object orderItemsObj = context.getExtendedState().getVariables().get("orderItems");
            if (orderItemsObj == null) {
                logger.debug("Предмети замовлення відсутні для wizard: {}", wizardId);
                return false;
            }

            logger.debug("Попередній етап завершений для wizard: {}", wizardId);
            return true;

        } catch (Exception e) {
            logger.error("Помилка перевірки завершеності попереднього етапу для wizard {}: {}", wizardId, e.getMessage(), e);
            return false;
        }
    }
}
