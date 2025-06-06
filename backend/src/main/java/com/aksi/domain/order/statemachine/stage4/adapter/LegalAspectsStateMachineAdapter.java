package com.aksi.domain.order.statemachine.stage4.adapter;

import org.springframework.statemachine.StateContext;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage4.dto.LegalAspectsDTO;
import com.aksi.domain.order.statemachine.stage4.service.LegalAspectsStepService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Адаптер для підетапу 4.2 "Юридичні аспекти".
 *
 * Відокремлює логіку State Machine від бізнес-логіки підетапу,
 * дотримуючись принципу Single Responsibility.
 *
 * Підетап: 4.2 (Юридичні аспекти)
 * Функціональність:
 * - Чекбокс "Я погоджуюсь з умовами надання послуг" (обов'язковий)
 * - Посилання на державні документи для ознайомлення
 * - Цифровий підпис клієнта (вікно для підпису на сенсорному екрані)
 * - Збереження та валідація підпису
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class LegalAspectsStateMachineAdapter {

    private final LegalAspectsStepService legalAspectsStepService;

    /**
     * Завантажує дані юридичних аспектів.
     */
    public LegalAspectsDTO loadLegalAspects(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Завантаження юридичних аспектів");

        String wizardId = extractWizardId(context);
        return legalAspectsStepService.loadLegalAspects(wizardId);
    }

    /**
     * Зберігає згоду з умовами надання послуг.
     */
    public LegalAspectsDTO saveTermsAgreement(String wizardId, boolean agreedToTerms) {
        log.debug("State Machine: Збереження згоди з умовами: {}", agreedToTerms);

        LegalAspectsDTO legalAspects = legalAspectsStepService.loadLegalAspects(wizardId);
        if (legalAspects == null) {
            legalAspects = LegalAspectsDTO.builder().build();
        }
        legalAspects.setTermsAccepted(agreedToTerms);
        return legalAspectsStepService.saveLegalAspects(wizardId, legalAspects);
    }

    /**
     * Зберігає цифровий підпис клієнта.
     */
    public LegalAspectsDTO saveDigitalSignature(String wizardId, String signatureData) {
        log.debug("State Machine: Збереження цифрового підпису");

        LegalAspectsDTO legalAspects = legalAspectsStepService.loadLegalAspects(wizardId);
        if (legalAspects == null) {
            legalAspects = LegalAspectsDTO.builder().build();
        }
        legalAspects.setSignatureData(signatureData);
        legalAspects.setSignatureCompleted(true);
        return legalAspectsStepService.saveCustomerSignature(wizardId, legalAspects);
    }

    /**
     * Зберігає повні дані юридичних аспектів.
     */
    public LegalAspectsDTO saveLegalAspects(String wizardId, LegalAspectsDTO legalAspects) {
        log.debug("State Machine: Збереження юридичних аспектів");

        return legalAspectsStepService.saveLegalAspects(wizardId, legalAspects);
    }

    /**
     * Валідує чи клієнт погодився з умовами.
     */
    public boolean isTermsAgreed(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Перевірка згоди з умовами");

        String wizardId = extractWizardId(context);
        LegalAspectsDTO legalAspects = legalAspectsStepService.loadLegalAspects(wizardId);

        return legalAspects != null && legalAspects.getTermsAccepted();
    }

    /**
     * Валідує чи збережено цифровий підпис.
     */
    public boolean isDigitalSignatureSaved(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Перевірка наявності цифрового підпису");

        String wizardId = extractWizardId(context);
        LegalAspectsDTO legalAspects = legalAspectsStepService.loadLegalAspects(wizardId);

        return legalAspects != null &&
               legalAspects.getSignatureData() != null &&
               !legalAspects.getSignatureData().trim().isEmpty();
    }

    /**
     * Перевіряє чи можна перейти до наступного підетапу.
     */
    public boolean canProceedToReceiptGeneration(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Перевірка готовності до переходу до формування квитанції");

        String wizardId = extractWizardId(context);
        return legalAspectsStepService.canProceedToNextStep(wizardId);
    }

    /**
     * Валідує завершення юридичних аспектів.
     */
    public boolean validateLegalAspectsCompletion(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Валідація завершення юридичних аспектів");

        return isTermsAgreed(context) && isDigitalSignatureSaved(context);
    }

        /**
     * Очищує підпис клієнта (для повторного підпису).
     */
    public void clearDigitalSignature(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Очищення цифрового підпису");

        String wizardId = extractWizardId(context);
        LegalAspectsDTO legalAspects = legalAspectsStepService.loadLegalAspects(wizardId);
        if (legalAspects != null) {
            legalAspectsStepService.clearSignature(wizardId, legalAspects);
        }
    }

    /**
     * Позначає юридичні аспекти як завершені.
     */
    public void markLegalAspectsAsCompleted(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Позначення юридичних аспектів як завершених");

        String wizardId = extractWizardId(context);
        LegalAspectsDTO legalAspects = legalAspectsStepService.loadLegalAspects(wizardId);

        if (legalAspects != null && validateLegalAspectsCompletion(context)) {
            legalAspects.updateTimestamp();
            legalAspectsStepService.saveLegalAspects(wizardId, legalAspects);
        }
    }

    /**
     * Перевіряє чи завершено юридичні аспекти.
     */
    public boolean isLegalAspectsCompleted(StateContext<OrderState, OrderEvent> context) {
        String wizardId = extractWizardId(context);
        LegalAspectsDTO legalAspects = legalAspectsStepService.loadLegalAspects(wizardId);

        return legalAspects != null && legalAspects.isReadyForCompletion();
    }

    /**
     * Отримує wizardId з контексту State Machine.
     */
    private String extractWizardId(StateContext<OrderState, OrderEvent> context) {
        Object wizardIdObj = context.getExtendedState().getVariables().get("wizardId");
        if (wizardIdObj instanceof String) {
            return (String) wizardIdObj;
        }
        throw new IllegalStateException("WizardId не знайдено в контексті State Machine");
    }
}
