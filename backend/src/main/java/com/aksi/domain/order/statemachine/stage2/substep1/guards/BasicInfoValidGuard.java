package com.aksi.domain.order.statemachine.stage2.substep1.guards;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage2.substep1.dto.BasicInfoDTO;
import com.aksi.domain.order.statemachine.stage2.substep1.validator.BasicInfoValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * State Machine Guard для перевірки валідності підетапу 2.1: Основна інформація про предмет
 *
 * Відповідає за:
 * - Перевірку наявності збережених даних основної інформації
 * - Валідацію готовності до переходу на наступний крок
 * - Перевірку обов'язкових полів та бізнес-правил
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class BasicInfoValidGuard implements Guard<OrderState, OrderEvent> {

    private final BasicInfoValidator validator;

    @Override
    public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
        log.debug("Перевірка валідності основної інформації про предмет");

        try {
            // Отримуємо збережені валідовані дані
            BasicInfoDTO basicInfo = getValidatedBasicInfo(context);

            if (basicInfo == null) {
                log.warn("Валідовані дані основної інформації відсутні в контексті");
                return false;
            }

            // Перевіряємо готовність до наступного кроку
            boolean isReady = validator.isReadyForNextStep(basicInfo);
            log.debug("Результат перевірки готовності: {}", isReady);

            // Додаткові перевірки
            boolean hasValidData = basicInfo.getIsValid() == Boolean.TRUE;
            boolean hasMinimalRequirements = checkMinimalRequirements(basicInfo);

            boolean canProceed = isReady && hasValidData && hasMinimalRequirements;

            log.info("BasicInfoValidGuard: canProceed={}, isReady={}, hasValidData={}, hasMinimalRequirements={}",
                    canProceed, isReady, hasValidData, hasMinimalRequirements);

            return canProceed;

        } catch (Exception e) {
            log.error("Помилка при перевірці валідності основної інформації", e);
            return false;
        }
    }

    /**
     * Отримує валідовані дані з контексту
     */
    private BasicInfoDTO getValidatedBasicInfo(StateContext<OrderState, OrderEvent> context) {
        Object data = context.getExtendedState().getVariables().get("basicInfoValidated");
        return data instanceof BasicInfoDTO ? (BasicInfoDTO) data : null;
    }

    /**
     * Перевіряє мінімальні вимоги для переходу
     */
    private boolean checkMinimalRequirements(BasicInfoDTO basicInfo) {
        // Перевіряємо обов'язкові поля
        boolean hasRequiredFields = basicInfo.isComplete();

        // Перевіряємо чи базова ціна встановлена (для предметів з прайсу)
        boolean hasPriceInfo = basicInfo.isPriceListItemSelected()
            ? basicInfo.getBasePrice() != null && basicInfo.getBasePrice().compareTo(java.math.BigDecimal.ZERO) > 0
            : true; // Для кастомних предметів ціна може бути встановлена пізніше

        log.debug("Мінімальні вимоги: hasRequiredFields={}, hasPriceInfo={}",
                hasRequiredFields, hasPriceInfo);

        return hasRequiredFields && hasPriceInfo;
    }
}
