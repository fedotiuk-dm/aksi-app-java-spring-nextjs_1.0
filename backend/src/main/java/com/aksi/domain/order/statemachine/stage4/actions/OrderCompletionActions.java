package com.aksi.domain.order.statemachine.stage4.actions;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage4.service.LegalAspectsStepService;
import com.aksi.domain.order.statemachine.stage4.service.OrderSummaryStepService;
import com.aksi.domain.order.statemachine.stage4.service.ReceiptGenerationStepService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Дії для завершення замовлення та формування квитанції (етап 4).
 *
 * Відповідає за:
 * - Перегляд замовлення з детальним розрахунком (4.1)
 * - Юридичні аспекти та підпис (4.2)
 * - Генерацію та друк квитанції (4.3)
 * - Завершення процесу (4.4)
 *
 * Реалізовано з використанням реальних API сервісів stage4.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OrderCompletionActions {

    private final OrderSummaryStepService orderSummaryStepService;
    private final LegalAspectsStepService legalAspectsStepService;
    private final ReceiptGenerationStepService receiptGenerationStepService;

    /**
     * Дія входу в етап завершення замовлення.
     * Підготовка до перегляду замовлення з детальним розрахунком.
     */
    @Component("enterOrderCompletionStageAction")
    public class EnterOrderCompletionStageAction implements Action<OrderState, OrderEvent> {

        @Override
        public void execute(StateContext<OrderState, OrderEvent> context) {
            log.info("Вхід до етапу завершення замовлення");

            String orderId = (String) context.getExtendedState().getVariables().get("orderId");

            try {
                // Завантажуємо повний підсумок замовлення
                var orderSummary = orderSummaryStepService.loadOrderSummary(orderId);
                context.getExtendedState().getVariables().put("orderSummary", orderSummary);

                // Виконуємо фінальні розрахунки
                var recalculatedSummary = orderSummaryStepService.recalculateOrderSummary(orderId);
                context.getExtendedState().getVariables().put("orderSummary", recalculatedSummary);

                // Встановлюємо прапор ініціалізації кроку 4.1
                context.getExtendedState().getVariables().put("step4_1_initialized", true);

                log.info("Етап завершення замовлення успішно ініціалізований для замовлення: {}", orderId);

            } catch (Exception e) {
                log.error("Помилка при ініціалізації етапу завершення для замовлення: {}", orderId, e);
                context.getExtendedState().getVariables().put("systemError", e.getMessage());
            }
        }
    }

    /**
     * Дія збереження підсумку замовлення (крок 4.1).
     */
    @Component("saveOrderSummaryAction")
    public class SaveOrderSummaryAction implements Action<OrderState, OrderEvent> {

        @Override
        public void execute(StateContext<OrderState, OrderEvent> context) {
            log.info("Збереження підсумку замовлення");

            String orderId = (String) context.getExtendedState().getVariables().get("orderId");

            try {
                // Отримуємо orderSummary з контексту
                var orderSummary = context.getExtendedState().getVariables().get("orderSummary");

                // Валідуємо наявність підсумку
                if (orderSummary == null) {
                    context.getExtendedState().getVariables().put("validationError", "Підсумок замовлення не знайдено");
                    return;
                }

                // Зберігаємо підсумок замовлення (використовуємо orderSummary)
                context.getExtendedState().getVariables().put("orderSummarySaved", true);
                context.getExtendedState().getVariables().put("confirmedOrderSummary", orderSummary);

                // Валідуємо можливість переходу до наступного кроку
                boolean canProceed = orderSummaryStepService.canProceedToNextStep(orderId);
                context.getExtendedState().getVariables().put("canProceedToLegalAspects", canProceed);

                log.info("Підсумок замовлення успішно збережено для замовлення: {}", orderId);

            } catch (Exception e) {
                log.error("Помилка збереження підсумку замовлення: {}", orderId, e);
                context.getExtendedState().getVariables().put("validationError",
                    "Помилка збереження підсумку: " + e.getMessage());
            }
        }
    }

    /**
     * Дія переходу до юридичних аспектів (крок 4.2).
     */
    @Component("proceedToLegalAspectsAction")
    public class ProceedToLegalAspectsAction implements Action<OrderState, OrderEvent> {

        @Override
        public void execute(StateContext<OrderState, OrderEvent> context) {
            log.info("Перехід до юридичних аспектів");

            String orderId = (String) context.getExtendedState().getVariables().get("orderId");

            try {
                // Завантажуємо юридичні аспекти для wizardId
                String wizardId = (String) context.getExtendedState().getVariables().get("wizardId");
                var legalAspects = legalAspectsStepService.loadLegalAspects(wizardId);
                context.getExtendedState().getVariables().put("legalAspects", legalAspects);

                log.info("Крок юридичних аспектів ініціалізований для замовлення: {}", orderId);

            } catch (Exception e) {
                log.error("Помилка при ініціалізації юридичних аспектів для замовлення: {}", orderId, e);
                context.getExtendedState().getVariables().put("systemError", e.getMessage());
            }
        }
    }

    /**
     * Дія збереження згоди з умовами (крок 4.2).
     */
    @Component("saveTermsAgreementAction")
    public class SaveTermsAgreementAction implements Action<OrderState, OrderEvent> {

        @Override
        public void execute(StateContext<OrderState, OrderEvent> context) {
            log.info("Збереження згоди з умовами надання послуг");

            String orderId = (String) context.getExtendedState().getVariables().get("orderId");

            try {
                // Отримуємо дані згоди з headers та поточні юридичні аспекти
                Object termsAgreedObj = context.getMessageHeaders().get("termsAgreed");
                var legalAspects = context.getExtendedState().getVariables().get("legalAspects");
                String wizardId = (String) context.getExtendedState().getVariables().get("wizardId");

                if (legalAspects instanceof com.aksi.domain.order.statemachine.stage4.dto.LegalAspectsDTO legalAspectsDTO) {

                    // Оновлюємо згоду з умовами
                    if (termsAgreedObj instanceof Boolean termsAgreed) {
                        legalAspectsDTO.setTermsAccepted(termsAgreed);
                    }

                    // Зберігаємо оновлені дані
                    var updatedLegalAspects = legalAspectsStepService.saveLegalAspects(wizardId, legalAspectsDTO);
                    context.getExtendedState().getVariables().put("legalAspects", updatedLegalAspects);
                }

                log.info("Згода з умовами збережена для замовлення: {}", orderId);

            } catch (Exception e) {
                log.error("Помилка збереження згоди з умовами для замовлення: {}", orderId, e);
                context.getExtendedState().getVariables().put("validationError",
                    "Помилка збереження згоди: " + e.getMessage());
            }
        }
    }

    /**
     * Дія збереження цифрового підпису клієнта (крок 4.2).
     */
    @Component("saveClientSignatureAction")
    public class SaveClientSignatureAction implements Action<OrderState, OrderEvent> {

        @Override
        public void execute(StateContext<OrderState, OrderEvent> context) {
            log.info("Збереження цифрового підпису клієнта");

            String orderId = (String) context.getExtendedState().getVariables().get("orderId");

            try {
                // Отримуємо дані підпису з headers та поточні юридичні аспекти
                Object signatureDataObj = context.getMessageHeaders().get("signatureData");
                var legalAspects = context.getExtendedState().getVariables().get("legalAspects");
                String wizardId = (String) context.getExtendedState().getVariables().get("wizardId");

                if (legalAspects instanceof com.aksi.domain.order.statemachine.stage4.dto.LegalAspectsDTO legalAspectsDTO) {

                    // Оновлюємо дані підпису
                    if (signatureDataObj instanceof String signatureData) {
                        legalAspectsDTO.setSignatureData(signatureData);
                    }

                    // Зберігаємо підпис через сервіс
                    var updatedLegalAspects = legalAspectsStepService.saveCustomerSignature(wizardId, legalAspectsDTO);
                    context.getExtendedState().getVariables().put("legalAspects", updatedLegalAspects);

                    // Перевіряємо готовність до наступного кроку
                    boolean isLegalStepComplete = legalAspectsStepService.canProceedToNextStep(wizardId);
                    context.getExtendedState().getVariables().put("isLegalStepComplete", isLegalStepComplete);
                }

                log.info("Цифровий підпис збережено для замовлення: {}", orderId);

            } catch (Exception e) {
                log.error("Помилка збереження підпису для замовлення: {}", orderId, e);
                context.getExtendedState().getVariables().put("validationError",
                    "Помилка збереження підпису: " + e.getMessage());
            }
        }
    }

    /**
     * Дія переходу до генерації квитанції (крок 4.3).
     */
    @Component("proceedToReceiptGenerationAction")
    public class ProceedToReceiptGenerationAction implements Action<OrderState, OrderEvent> {

        @Override
        public void execute(StateContext<OrderState, OrderEvent> context) {
            log.info("Перехід до генерації квитанції");

            String orderId = (String) context.getExtendedState().getVariables().get("orderId");

            try {
                // Завантажуємо дані генерації квитанції
                String wizardId = (String) context.getExtendedState().getVariables().get("wizardId");
                var receiptGeneration = receiptGenerationStepService.loadReceiptGeneration(wizardId);
                context.getExtendedState().getVariables().put("receiptGeneration", receiptGeneration);

                // Генеруємо PDF квитанцію
                var generatedReceipt = receiptGenerationStepService.generatePdfReceipt(wizardId, receiptGeneration);
                context.getExtendedState().getVariables().put("receiptGeneration", generatedReceipt);

                log.info("Квитанція згенерована для замовлення: {}", orderId);

            } catch (Exception e) {
                log.error("Помилка генерації квитанції для замовлення: {}", orderId, e);
                context.getExtendedState().getVariables().put("systemError", e.getMessage());
            }
        }
    }

    /**
     * Дія друку квитанції (крок 4.3).
     */
    @Component("printReceiptAction")
    public class PrintReceiptAction implements Action<OrderState, OrderEvent> {

        @Override
        public void execute(StateContext<OrderState, OrderEvent> context) {
            log.info("Друк квитанції");

            String orderId = (String) context.getExtendedState().getVariables().get("orderId");

            try {
                // Отримуємо поточні дані генерації квитанції
                var receiptGeneration = context.getExtendedState().getVariables().get("receiptGeneration");
                String wizardId = (String) context.getExtendedState().getVariables().get("wizardId");

                if (receiptGeneration instanceof com.aksi.domain.order.statemachine.stage4.dto.ReceiptGenerationDTO receiptGenerationDTO) {

                    // Позначаємо як надруковано
                    var updatedReceipt = receiptGenerationStepService.markAsPrinted(wizardId, receiptGenerationDTO);
                    context.getExtendedState().getVariables().put("receiptGeneration", updatedReceipt);
                }

                log.info("Квитанція надрукована для замовлення: {}", orderId);

            } catch (Exception e) {
                log.error("Помилка друку квитанції для замовлення: {}", orderId, e);
                context.getExtendedState().getVariables().put("systemError", e.getMessage());
            }
        }
    }

    /**
     * Дія відправки PDF-копії на email (крок 4.3).
     */
    @Component("sendPdfToEmailAction")
    public class SendPdfToEmailAction implements Action<OrderState, OrderEvent> {

        @Override
        public void execute(StateContext<OrderState, OrderEvent> context) {
            log.info("Відправка PDF-копії квитанції на email");

            String orderId = (String) context.getExtendedState().getVariables().get("orderId");

            try {
                // Отримуємо поточні дані генерації квитанції та email
                var receiptGeneration = context.getExtendedState().getVariables().get("receiptGeneration");
                String wizardId = (String) context.getExtendedState().getVariables().get("wizardId");
                Object emailObj = context.getMessageHeaders().get("clientEmail");

                if (receiptGeneration instanceof com.aksi.domain.order.statemachine.stage4.dto.ReceiptGenerationDTO receiptGenerationDTO) {

                    // Встановлюємо email якщо передано
                    if (emailObj instanceof String clientEmail) {
                        receiptGenerationDTO.setClientEmail(clientEmail);
                    }

                    // Відправляємо email через сервіс
                    var updatedReceipt = receiptGenerationStepService.sendEmailReceipt(wizardId, receiptGenerationDTO);
                    context.getExtendedState().getVariables().put("receiptGeneration", updatedReceipt);
                }

                log.info("PDF-копію квитанції відправлено на email для замовлення: {}", orderId);

            } catch (Exception e) {
                log.error("Помилка відправки PDF для замовлення: {}", orderId, e);
                context.getExtendedState().getVariables().put("emailError", e.getMessage());
                // Не виносимо в systemError, оскільки це не критична помилка
            }
        }
    }

    /**
     * Дія завершення процесу оформлення замовлення (крок 4.4).
     */
    @Component("completeOrderProcessAction")
    public class CompleteOrderProcessAction implements Action<OrderState, OrderEvent> {

        @Override
        public void execute(StateContext<OrderState, OrderEvent> context) {
            log.info("Завершення процесу оформлення замовлення");

            String orderId = (String) context.getExtendedState().getVariables().get("orderId");

            try {
                // Перевіряємо чи wizard може бути завершений
                String wizardId = (String) context.getExtendedState().getVariables().get("wizardId");
                boolean canComplete = receiptGenerationStepService.canCompleteWizard(wizardId);

                if (canComplete) {
                    // Встановлюємо статус завершення
                    context.getExtendedState().getVariables().put("orderCompleted", true);
                    context.getExtendedState().getVariables().put("completionTimestamp", System.currentTimeMillis());

                    log.info("Процес оформлення замовлення {} успішно завершено", orderId);
                } else {
                    context.getExtendedState().getVariables().put("validationError",
                        "Не всі кроки завершені для фіналізації замовлення");
                    log.warn("Неможливо завершити замовлення {} - не всі кроки виконані", orderId);
                }

            } catch (Exception e) {
                log.error("Помилка завершення процесу для замовлення: {}", orderId, e);
                context.getExtendedState().getVariables().put("systemError", e.getMessage());
            }
        }
    }
}
