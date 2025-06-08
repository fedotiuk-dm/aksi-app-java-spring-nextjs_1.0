package com.aksi.domain.order.statemachine.stage2.substep1.actions;

import java.util.Map;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage2.substep1.dto.BasicInfoDTO;
import com.aksi.domain.order.statemachine.stage2.substep1.service.BasicInfoStepService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * State Machine Action для збереження даних підетапу 2.1: Основна інформація про предмет
 *
 * Відповідає за:
 * - Витягування даних з контексту State Machine
 * - Валідацію через BasicInfoStepService
 * - Збереження валідованих даних назад у контекст
 * - Встановлення прапору готовності до наступного кроку
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class SaveBasicInfoAction implements Action<OrderState, OrderEvent> {

    private final BasicInfoStepService basicInfoStepService;

    @Override
    public void execute(StateContext<OrderState, OrderEvent> context) {
        log.debug("Виконання SaveBasicInfoAction");

        try {
            // Отримуємо ID визарда
            String wizardId = getWizardId(context);
            if (wizardId == null) {
                log.error("WizardId не знайдено в контексті State Machine");
                setActionError(context, "Відсутній ID візарда");
                return;
            }

            // Отримуємо дані з контексту
            Map<String, Object> wizardData = getWizardData(context, "basicInfoData");
            if (wizardData == null || wizardData.isEmpty()) {
                log.warn("Дані основної інформації предмета відсутні в контексті для wizardId: {}", wizardId);
                setActionError(context, "Відсутні дані основної інформації предмета");
                return;
            }

            // Створюємо BasicInfoDTO з wizardData
            BasicInfoDTO basicInfoDTO = createBasicInfoFromWizardData(wizardData);
            log.debug("Створено BasicInfoDTO з wizardData: {}", basicInfoDTO);

            // Валідуємо дані через сервіс
            BasicInfoDTO validatedDTO = basicInfoStepService.validateBasicInfo(basicInfoDTO);
            log.debug("Валідація завершена: valid={}, errors={}",
                    validatedDTO.getIsValid(), validatedDTO.getValidationErrors());

            // Зберігаємо валідовані дані
            BasicInfoDTO savedDTO = basicInfoStepService.saveBasicInfo(wizardId, validatedDTO);

            // Оновлюємо контекст
            updateContext(context, savedDTO);

            log.info("SaveBasicInfoAction успішно виконано для wizardId: {}, isValid: {}",
                    wizardId, savedDTO.getIsValid());

        } catch (Exception e) {
            log.error("Помилка при виконанні SaveBasicInfoAction", e);
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
     * Створює BasicInfoDTO з мапа даних візарда
     */
    private BasicInfoDTO createBasicInfoFromWizardData(Map<String, Object> wizardData) {
        return BasicInfoDTO.builder()
                .categoryId((String) wizardData.get("categoryId"))
                .categoryCode((String) wizardData.get("categoryCode"))
                .categoryName((String) wizardData.get("categoryName"))
                .itemId((String) wizardData.get("itemId"))
                .itemCode((String) wizardData.get("itemCode"))
                .itemName((String) wizardData.get("itemName"))
                .description((String) wizardData.get("description"))
                .quantity((Integer) wizardData.get("quantity"))
                .unitOfMeasure((String) wizardData.get("unitOfMeasure"))
                .basePrice((java.math.BigDecimal) wizardData.get("basePrice"))
                .build();
    }

    /**
     * Оновлює контекст збереженими даними
     */
    private void updateContext(StateContext<OrderState, OrderEvent> context, BasicInfoDTO savedDTO) {
        // Зберігаємо валідовані дані
        context.getExtendedState().getVariables().put("basicInfoValidated", savedDTO);

        // Встановлюємо прапор готовності
        context.getExtendedState().getVariables().put("basicInfoReady", savedDTO.getIsValid());

        // Зберігаємо помилки валідації, якщо є
        if (!savedDTO.getIsValid()) {
            context.getExtendedState().getVariables().put("basicInfoErrors", savedDTO.getValidationErrors());
        } else {
            context.getExtendedState().getVariables().remove("basicInfoErrors");
        }

        // Зберігаємо інформацію про категорію та предмет
        if (savedDTO.getCategoryId() != null) {
            context.getExtendedState().getVariables().put("selectedCategoryId", savedDTO.getCategoryId());
        }

        if (savedDTO.getItemId() != null) {
            context.getExtendedState().getVariables().put("selectedItemId", savedDTO.getItemId());
        }

        // Оновлюємо загальний статус підвізарда
        updateItemWizardProgress(context, savedDTO.getIsValid());
    }

    /**
     * Оновлює прогрес підвізарда
     */
    @SuppressWarnings("unchecked")
    private void updateItemWizardProgress(StateContext<OrderState, OrderEvent> context, boolean stepCompleted) {
        // Отримуємо поточний прогрес
        Object progressObj = context.getExtendedState().getVariables().get("itemWizardProgress");
        Map<String, Boolean> progress = progressObj instanceof Map ?
            (Map<String, Boolean>) progressObj : Map.of();

        // Оновлюємо статус кроку 2.1
        progress.put("basicInfoCompleted", stepCompleted);
        context.getExtendedState().getVariables().put("itemWizardProgress", progress);

        log.debug("Оновлено прогрес item wizard: basicInfoCompleted={}", stepCompleted);
    }

    /**
     * Встановлює помилку дії
     */
    private void setActionError(StateContext<OrderState, OrderEvent> context, String errorMessage) {
        context.getExtendedState().getVariables().put("actionError", errorMessage);
        context.getExtendedState().getVariables().put("basicInfoReady", false);
        log.error("SaveBasicInfoAction error: {}", errorMessage);
    }
}
