package com.aksi.domain.order.statemachine.stage2.substep3.actions;

import java.util.Map;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage2.substep3.dto.DefectsStainsDTO;
import com.aksi.domain.order.statemachine.stage2.substep3.mapper.DefectsStainsMapper;
import com.aksi.domain.order.statemachine.stage2.substep3.service.DefectsStainsStepService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * State Machine Action для збереження даних підетапу 2.3: Дефекти та плями
 *
 * Відповідає за:
 * - Витягування даних з контексту State Machine
 * - Валідацію через DefectsStainsStepService
 * - Збереження валідованих даних назад у контекст
 * - Встановлення прапору готовності до наступного кроку
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class SaveDefectsStainsAction implements Action<OrderState, OrderEvent> {

    private final DefectsStainsStepService defectsStainsStepService;
    private final DefectsStainsMapper defectsStainsMapper;

    @Override
    public void execute(StateContext<OrderState, OrderEvent> context) {
        log.debug("Виконання SaveDefectsStainsAction");

        try {
            // Отримуємо ID визарда
            String wizardId = getWizardId(context);
            if (wizardId == null) {
                log.error("WizardId не знайдено в контексті State Machine");
                setActionError(context, "Відсутній ID візарда");
                return;
            }

            // Отримуємо дані з контексту
            Map<String, Object> wizardData = getWizardData(context, "defectsStainsData");
            if (wizardData == null || wizardData.isEmpty()) {
                log.warn("Дані про дефекти та плями відсутні в контексті для wizardId: {}", wizardId);
                setActionError(context, "Відсутні дані про дефекти та плями");
                return;
            }

            // Перетворюємо Map на DTO
            DefectsStainsDTO defectsStainsDTO = defectsStainsMapper.fromWizardData(wizardData);
            log.debug("Створено DefectsStainsDTO з wizardData: {}", defectsStainsDTO);

            // Валідуємо та збагачуємо дані через сервіс
            DefectsStainsDTO validatedDTO = defectsStainsStepService.validateDefectsStains(defectsStainsDTO);
            log.debug("Валідація завершена: valid={}, errors={}",
                    validatedDTO.getIsValid(), validatedDTO.getValidationErrors());

            // Зберігаємо валідовані дані
            DefectsStainsDTO savedDTO = defectsStainsStepService.saveDefectsStains(wizardId, validatedDTO);

            // Оновлюємо контекст
            updateContext(context, savedDTO);

            log.info("SaveDefectsStainsAction успішно виконано для wizardId: {}, isValid: {}",
                    wizardId, savedDTO.getIsValid());

        } catch (Exception e) {
            log.error("Помилка при виконанні SaveDefectsStainsAction", e);
            setActionError(context, "Внутрішня помилка при збереженні даних: " + e.getMessage());
        }
    }

    /**
     * Отримує ID візарда з контексту
     */
    private String getWizardId(StateContext<OrderState, OrderEvent> context) {
        Object wizardId = context.getExtendedState().getVariables().get("wizardId");
        return wizardId instanceof String ? (String) wizardId : null;
    }

    /**
     * Отримує дані визарда з контексту
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> getWizardData(StateContext<OrderState, OrderEvent> context, String key) {
        Object data = context.getExtendedState().getVariables().get(key);
        return data instanceof Map ? (Map<String, Object>) data : null;
    }

    /**
     * Оновлює контекст збереженими даними
     */
    private void updateContext(StateContext<OrderState, OrderEvent> context, DefectsStainsDTO savedDTO) {
        // Зберігаємо валідовані дані
        context.getExtendedState().getVariables().put("defectsStainsValidated", savedDTO);

        // Встановлюємо прапор готовності
        context.getExtendedState().getVariables().put("defectsStainsReady", savedDTO.getIsValid());

        // Зберігаємо помилки валідації, якщо є
        if (!savedDTO.getIsValid()) {
            context.getExtendedState().getVariables().put("defectsStainsErrors", savedDTO.getValidationErrors());
        } else {
            context.getExtendedState().getVariables().remove("defectsStainsErrors");
        }

        // Зберігаємо рекомендації та попередження
        if (!savedDTO.getRecommendedModifiers().isEmpty()) {
            context.getExtendedState().getVariables().put("defectsStainsModifiers", savedDTO.getRecommendedModifiers());
        }

        if (!savedDTO.getRiskWarnings().isEmpty()) {
            context.getExtendedState().getVariables().put("defectsStainsWarnings", savedDTO.getRiskWarnings());
        }

        if (!savedDTO.getProcessingRecommendations().isEmpty()) {
            context.getExtendedState().getVariables().put("defectsStainsRecommendations", savedDTO.getProcessingRecommendations());
        }

        // Оновлюємо загальний статус підвізарда
        updateItemWizardProgress(context, savedDTO.getIsValid());
    }

    /**
     * Оновлює прогрес підвізарда
     */
    private void updateItemWizardProgress(StateContext<OrderState, OrderEvent> context, boolean stepCompleted) {
        // Отримуємо поточний прогрес
        Object progressObj = context.getExtendedState().getVariables().get("itemWizardProgress");
        Map<String, Boolean> progress = progressObj instanceof Map ?
            (Map<String, Boolean>) progressObj : Map.of();

        // Оновлюємо статус кроку 2.3
        progress.put("defectsStainsCompleted", stepCompleted);
        context.getExtendedState().getVariables().put("itemWizardProgress", progress);

        log.debug("Оновлено прогрес item wizard: defectsStainsCompleted={}", stepCompleted);
    }

    /**
     * Встановлює помилку дії
     */
    private void setActionError(StateContext<OrderState, OrderEvent> context, String errorMessage) {
        context.getExtendedState().getVariables().put("actionError", errorMessage);
        context.getExtendedState().getVariables().put("defectsStainsReady", false);
        log.error("SaveDefectsStainsAction error: {}", errorMessage);
    }
}
