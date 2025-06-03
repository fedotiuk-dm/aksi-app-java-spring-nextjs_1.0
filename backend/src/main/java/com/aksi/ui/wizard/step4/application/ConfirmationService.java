package com.aksi.ui.wizard.step4.application;

import java.util.function.Consumer;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.dto.receipt.ReceiptGenerationRequest;
import com.aksi.domain.order.service.ReceiptService;
import com.aksi.ui.wizard.dto.OrderWizardData;
import com.aksi.ui.wizard.step4.domain.ConfirmationState;
import com.aksi.ui.wizard.step4.events.ConfirmationEvents;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Application Service для координації етапу підтвердження замовлення.
 * Містить бізнес-логіку координації між domain models та зовнішніми сервісами.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ConfirmationService {

    private final ReceiptService receiptService;

    // Event handler
    private Consumer<ConfirmationEvents> eventHandler;

    /**
     * Встановлює обробник подій.
     */
    public void setEventHandler(Consumer<ConfirmationEvents> eventHandler) {
        this.eventHandler = eventHandler;
        log.debug("Event handler встановлено для ConfirmationService");
    }

    /**
     * Ініціалізує етап підтвердження.
     */
    public ConfirmationState initializeConfirmation(OrderWizardData wizardData, String sessionId) {
        try {
            publishEvent(ConfirmationEvents.loadingStarted("initialization", "Ініціалізація етапу підтвердження"));

            var state = ConfirmationState.createInitial(wizardData, sessionId);

            publishEvent(ConfirmationEvents.confirmationInitialized(state, wizardData, sessionId));
            publishEvent(ConfirmationEvents.validationCompleted(
                    state.isValid(),
                    state.getValidationErrors(),
                    state.getWarnings(),
                    state.getItemsCount(),
                    state.getTotalAmount()
            ));

            publishEvent(ConfirmationEvents.loadingCompleted("initialization", true, "Етап підтвердження ініціалізовано"));
            publishProgressUpdate(state, "Ініціалізація завершена", 10);

            log.info("Confirmation initialized for session: {}", sessionId);
            return state;

        } catch (Exception e) {
            log.error("Error initializing confirmation: {}", e.getMessage(), e);
            publishEvent(ConfirmationEvents.error("initialization", e.getMessage(), e, "INIT_ERROR"));
            publishEvent(ConfirmationEvents.loadingCompleted("initialization", false, "Помилка ініціалізації"));
            throw e;
        }
    }

    /**
     * Обробляє зміну статусу угоди.
     */
    public ConfirmationState handleAgreementChange(ConfirmationState currentState, boolean isAccepted) {
        try {
            var newState = isAccepted ? currentState.acceptAgreement() : currentState.rejectAgreement();

            publishEvent(ConfirmationEvents.stateUpdated(newState, "Agreement status changed", "agreement"));
            publishEvent(ConfirmationEvents.agreementChanged(isAccepted, newState.isCanCompleteOrder()));
            publishUIStateUpdate(newState);

            log.debug("Agreement status changed to: {}", isAccepted);
            return newState;

        } catch (Exception e) {
            log.error("Error handling agreement change: {}", e.getMessage(), e);
            publishEvent(ConfirmationEvents.error("agreement_change", e.getMessage(), e, "AGREEMENT_ERROR"));
            return currentState;
        }
    }

    /**
     * Генерує квитанцію для замовлення.
     */
    public ConfirmationState generateReceipt(ConfirmationState currentState) {
        try {
            publishEvent(ConfirmationEvents.loadingStarted(ConfirmationState.OPERATION_RECEIPT_GENERATION, "Генерація квитанції"));
            publishProgressUpdate(currentState, "Генерація квитанції...", 40);

            var wizardData = currentState.getWizardData();
            var receiptNumber = currentState.getReceiptNumber();
            var orderId = wizardData.getDraftOrder().getId();

            // Перевіряємо чи є ID замовлення
            if (orderId == null) {
                throw new IllegalStateException("Order ID is null. Order must be saved before generating receipt.");
            }

            publishEvent(ConfirmationEvents.receiptRequested(wizardData, receiptNumber, "PDF"));

            // Генеруємо квитанцію з реальним ID замовлення
            var request = ReceiptGenerationRequest.builder()
                    .orderId(orderId)
                    .format("PDF")
                    .includeSignature(true)
                    .build();

            byte[] receiptBytes = receiptService.generatePdfReceiptBytes(request);
            String fileName = String.format("receipt_%s.pdf", receiptNumber);

            var newState = currentState.withReceiptGenerated(receiptBytes, fileName);

            publishEvent(ConfirmationEvents.receiptCompleted(
                    receiptBytes, fileName, "PDF", receiptBytes.length));
            publishEvent(ConfirmationEvents.stateUpdated(newState, "Receipt generated", "receipt"));
            publishUIStateUpdate(newState);
            publishProgressUpdate(newState, "Квитанція згенерована", 70);

            publishEvent(ConfirmationEvents.loadingCompleted(ConfirmationState.OPERATION_RECEIPT_GENERATION, true,
                    "Квитанція успішно згенерована"));

            log.info("Receipt generated for order ID: {} with receipt number: {}", orderId, receiptNumber);
            return newState;

        } catch (Exception e) {
            log.error("Error generating receipt: {}", e.getMessage(), e);
            publishEvent(ConfirmationEvents.receiptFailed(e.getMessage(), "RECEIPT_GENERATION_ERROR", e));
            publishEvent(ConfirmationEvents.loadingCompleted(ConfirmationState.OPERATION_RECEIPT_GENERATION, false,
                    "Помилка генерації квитанції"));
            return currentState;
        }
    }

    /**
     * Відправляє квитанцію на email.
     */
    public ConfirmationState sendReceiptByEmail(ConfirmationState currentState) {
        try {
            if (!currentState.isCanSendEmail()) {
                throw new IllegalStateException("Cannot send email: prerequisites not met");
            }

            publishEvent(ConfirmationEvents.loadingStarted(ConfirmationState.OPERATION_EMAIL_SENDING, "Відправка на email"));

            var clientEmail = currentState.getClientEmail();
            var clientName = currentState.getWizardData().getSelectedClient().getLastName() + " " +
                           currentState.getWizardData().getSelectedClient().getFirstName();
            var receiptNumber = currentState.getReceiptNumber();
            var receiptBytes = currentState.getGeneratedReceiptBytes();

            publishEvent(ConfirmationEvents.emailRequested(clientEmail, clientName, receiptNumber, receiptBytes));

            // TODO: Реалізувати реальну відправку email
            // Поки що імітуємо успішну відправку
            Thread.sleep(1000); // Імітація затримки

            var newState = currentState.withEmailSent();
            String messageId = "msg_" + System.currentTimeMillis();

            publishEvent(ConfirmationEvents.emailCompleted(clientEmail, messageId));
            publishEvent(ConfirmationEvents.stateUpdated(newState, "Email sent", "email"));
            publishUIStateUpdate(newState);

            publishEvent(ConfirmationEvents.loadingCompleted(ConfirmationState.OPERATION_EMAIL_SENDING, true,
                    "Email успішно відправлено"));

            log.info("Receipt sent by email to: {}", clientEmail);
            return newState;

        } catch (Exception e) {
            log.error("Error sending email: {}", e.getMessage(), e);
            publishEvent(ConfirmationEvents.emailFailed(currentState.getClientEmail(), e.getMessage(), e));
            publishEvent(ConfirmationEvents.loadingCompleted(ConfirmationState.OPERATION_EMAIL_SENDING, false,
                    "Помилка відправки email"));
            return currentState;
        }
    }

    /**
     * Завершує замовлення.
     */
    public ConfirmationState completeOrder(ConfirmationState currentState) {
        try {
            if (!currentState.isCanCompleteOrder()) {
                throw new IllegalStateException("Cannot complete order: prerequisites not met");
            }

            publishEvent(ConfirmationEvents.loadingStarted(ConfirmationState.OPERATION_ORDER_COMPLETION, "Завершення замовлення"));
            publishProgressUpdate(currentState, "Збереження замовлення...", 90);

            var wizardData = currentState.getWizardData();
            publishEvent(ConfirmationEvents.orderRequested(wizardData, currentState, currentState.isReceiptGenerated()));

            // TODO: Зберегти замовлення в базу даних
            // Поки що імітуємо збереження
            Thread.sleep(1500); // Імітація затримки

            var newState = currentState.completeOrder();
            String orderNumber = "ORD_" + System.currentTimeMillis();
            var receiptNumber = currentState.getReceiptNumber();
            var finalAmount = currentState.getTotalAmount();

            publishEvent(ConfirmationEvents.orderCompleted(orderNumber, receiptNumber, finalAmount));
            publishEvent(ConfirmationEvents.stateUpdated(newState, "Order completed", "completion"));
            publishProgressUpdate(newState, "Замовлення завершено", 100);

            publishEvent(ConfirmationEvents.loadingCompleted(ConfirmationState.OPERATION_ORDER_COMPLETION, true,
                    "Замовлення успішно завершено"));

            log.info("Order completed: {} with receipt: {}", orderNumber, receiptNumber);
            return newState;

        } catch (Exception e) {
            log.error("Error completing order: {}", e.getMessage(), e);
            publishEvent(ConfirmationEvents.orderFailed(e.getMessage(), "ORDER_COMPLETION_ERROR", e));
            publishEvent(ConfirmationEvents.loadingCompleted(ConfirmationState.OPERATION_ORDER_COMPLETION, false,
                    "Помилка завершення замовлення"));
            return currentState;
        }
    }

    /**
     * Обробляє запит навігації.
     */
    public void handleNavigationRequest(ConfirmationState currentState, ConfirmationEvents.NavigationType navigationType) {
        try {
            String targetDestination = switch (navigationType) {
                case PREVIOUS -> "step3_order_parameters";
                case CANCEL -> "order_list";
                case COMPLETE -> "order_completion";
                case VIEW_RECEIPT -> "receipt_view";
            };

            publishEvent(ConfirmationEvents.navigationRequested(navigationType, targetDestination, currentState));
            log.debug("Navigation requested: {} to {}", navigationType, targetDestination);

        } catch (Exception e) {
            log.error("Error handling navigation request: {}", e.getMessage(), e);
            publishEvent(ConfirmationEvents.error("navigation", e.getMessage(), e, "NAVIGATION_ERROR"));
        }
    }

    /**
     * Валідує поточний стан.
     */
    public ConfirmationState validateCurrentState(ConfirmationState currentState) {
        try {
            publishEvent(ConfirmationEvents.validationCompleted(
                    currentState.isValid(),
                    currentState.getValidationErrors(),
                    currentState.getWarnings(),
                    currentState.getItemsCount(),
                    currentState.getTotalAmount()
            ));

            if (!currentState.getWarnings().isEmpty()) {
                publishEvent(ConfirmationEvents.warningsDisplayed(
                        currentState.getWarnings(),
                        "Рекомендується перевірити дані"
                ));
            }

            return currentState;

        } catch (Exception e) {
            log.error("Error validating state: {}", e.getMessage(), e);
            publishEvent(ConfirmationEvents.error("validation", e.getMessage(), e, "VALIDATION_ERROR"));
            return currentState;
        }
    }

    /**
     * Публікує подію.
     */
    private void publishEvent(ConfirmationEvents event) {
        if (eventHandler != null) {
            try {
                eventHandler.accept(event);
            } catch (Exception e) {
                log.error("Error publishing event {}: {}", event.getClass().getSimpleName(), e.getMessage(), e);
            }
        }
    }

    /**
     * Публікує оновлення UI стану.
     */
    private void publishUIStateUpdate(ConfirmationState state) {
        publishEvent(ConfirmationEvents.uiStateChanged(
                state.isLoading(),
                !state.isValid(),
                state.getStatusMessage(),
                state.isCanCompleteOrder(),
                state.isCanSendEmail(),
                state.isReceiptGenerated()
        ));
    }

    /**
     * Публікує оновлення прогресу.
     */
    private void publishProgressUpdate(ConfirmationState state, String statusText, int percentage) {
        publishEvent(ConfirmationEvents.progressUpdated("confirmation", percentage, statusText));
    }
}
