package com.aksi.domain.order.statemachine.stage4.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.dto.CustomerSignatureRequest;
import com.aksi.domain.order.dto.OrderDetailedSummaryResponse;
import com.aksi.domain.order.dto.OrderFinalizationRequest;
import com.aksi.domain.order.dto.receipt.ReceiptDTO;
import com.aksi.domain.order.dto.receipt.ReceiptGenerationRequest;
import com.aksi.domain.order.statemachine.stage4.dto.LegalAcceptanceDTO;
import com.aksi.domain.order.statemachine.stage4.dto.OrderCompletionDTO;
import com.aksi.domain.order.statemachine.stage4.dto.OrderConfirmationDTO;
import com.aksi.domain.order.statemachine.stage4.dto.ReceiptConfigurationDTO;
import com.aksi.domain.order.statemachine.stage4.enums.Stage4State;
import com.aksi.domain.order.statemachine.stage4.mapper.Stage4LegalAcceptanceMapper;
import com.aksi.domain.order.statemachine.stage4.mapper.Stage4OrderCompletionMapper;
import com.aksi.domain.order.statemachine.stage4.mapper.Stage4OrderConfirmationMapper;
import com.aksi.domain.order.statemachine.stage4.mapper.Stage4ReceiptMapper;
import com.aksi.domain.order.statemachine.stage4.service.Stage4StateService.Stage4Context;
import com.aksi.domain.order.statemachine.stage4.util.FileStorageUtil;
import com.aksi.domain.order.statemachine.stage4.validator.ValidationResult;
import com.aksi.service.email.EmailService;

import lombok.RequiredArgsConstructor;

/**
 * Сервіс управління робочим процесом Stage4.
 * Обробляє бізнес-логіку та переходи між станами.
 */
@Service
@RequiredArgsConstructor
public class Stage4WorkflowService {

    private final Stage4ValidationService validationService;
    private final Stage4StateService stateService;
    private final Stage4OrderOperationsService orderOperations;
    private final Stage4ReceiptOperationsService receiptOperations;
    private final Stage4SignatureOperationsService signatureOperations;
    private final Stage4FinalizationOperationsService finalizationOperations;
    private final EmailService emailService;

    // Mappers
    private final Stage4OrderConfirmationMapper orderConfirmationMapper;
    private final Stage4LegalAcceptanceMapper legalAcceptanceMapper;
    private final Stage4ReceiptMapper receiptMapper;
    private final Stage4OrderCompletionMapper orderCompletionMapper;

    /**
     * Ініціалізує Stage4 для замовлення.
     *
     * @param sessionId ID сесії
     * @param orderId ID замовлення
     * @return контекст Stage4
     */
    public Stage4Context initializeStage4(UUID sessionId, UUID orderId) {
        Stage4Context context = stateService.createSession(sessionId);

        // Перевіряємо чи існує замовлення
        if (!orderOperations.orderExists(orderId)) {
            throw new IllegalArgumentException("Замовлення з ID " + orderId + " не існує");
        }

        // Отримуємо детальний підсумок замовлення
        OrderDetailedSummaryResponse orderSummary = orderOperations.getOrderDetailedSummary(orderId);

        // Створюємо DTO підтвердження замовлення
        OrderConfirmationDTO confirmationDTO = orderConfirmationMapper.createFromOrderSummary(
            sessionId, orderSummary);

        // Валідуємо та зберігаємо
        ValidationResult validationResult = validationService.validateOrderConfirmation(confirmationDTO);
        if (!validationResult.isValid()) {
            confirmationDTO = confirmationDTO.toBuilder()
                .hasValidationErrors(true)
                .validationMessage(String.join("; ", validationResult.getErrorMessages()))
                .build();
        }

        stateService.saveOrderConfirmation(sessionId, confirmationDTO);
        stateService.updateSessionState(sessionId, Stage4State.ORDER_SUMMARY_REVIEW);

        return context;
    }

    /**
     * Обробляє прийняття юридичних умов та збереження підпису.
     *
     * @param sessionId ID сесії
     * @param orderId ID замовлення
     * @param signatureData дані підпису
     * @param termsAccepted чи прийняті умови
     * @return оновлений контекст
     */
    public Stage4Context processLegalAcceptance(UUID sessionId, UUID orderId,
                                               String signatureData, boolean termsAccepted) {
        Stage4Context context = stateService.getSession(sessionId);
        if (context == null) {
            throw new IllegalStateException("Сесія не знайдена");
        }

        // Створюємо запит на підпис
        CustomerSignatureRequest signatureRequest = CustomerSignatureRequest.builder()
            .orderId(orderId)
            .signatureData(signatureData)
            .termsAccepted(termsAccepted)
            .signatureType("CUSTOMER_ACCEPTANCE")
            .build();

        // Створюємо DTO юридичного прийняття
        LegalAcceptanceDTO legalDTO = legalAcceptanceMapper.createFromSignatureRequest(
            sessionId, signatureRequest);

        // Зберігаємо підпис
        try {
            signatureOperations.saveSignature(signatureRequest);
            legalDTO = legalAcceptanceMapper.markSignatureCaptured(legalDTO);
            legalDTO = legalAcceptanceMapper.markLegalConfirmed(legalDTO);
        } catch (Exception e) {
            legalDTO = legalDTO.toBuilder()
                .hasValidationErrors(true)
                .validationMessage("Помилка збереження підпису: " + e.getMessage())
                .build();
        }

        // Валідуємо та зберігаємо
        ValidationResult validationResult = validationService.validateLegalAcceptance(legalDTO);
        if (!validationResult.isValid()) {
            legalDTO = legalDTO.toBuilder()
                .hasValidationErrors(true)
                .validationMessage(String.join("; ", validationResult.getErrorMessages()))
                .build();
        }

        stateService.saveLegalAcceptance(sessionId, legalDTO);
        stateService.updateSessionState(sessionId, Stage4State.LEGAL_ACCEPTANCE_COMPLETED);

        return context;
    }

    /**
     * Генерує квитанцію для замовлення.
     *
     * @param sessionId ID сесії
     * @param orderId ID замовлення
     * @param sendByEmail чи відправляти на email
     * @param generatePrintable чи генерувати друковану версію
     * @return оновлений контекст
     */
    public Stage4Context generateReceipt(UUID sessionId, UUID orderId,
                                        boolean sendByEmail, boolean generatePrintable) {
        Stage4Context context = stateService.getSession(sessionId);
        if (context == null) {
            throw new IllegalStateException("Сесія не знайдена");
        }

        // Створюємо конфігурацію квитанції
        ReceiptConfigurationDTO receiptDTO = receiptMapper.createForOrder(
            sessionId, orderId, sendByEmail, generatePrintable);

        try {
            // Генеруємо квитанцію
            ReceiptGenerationRequest generationRequest = receiptDTO.getGenerationRequest();
            ReceiptDTO generatedReceipt = receiptOperations.generateReceipt(generationRequest);

            // Генеруємо PDF
            byte[] pdfBytes = receiptOperations.generatePdfReceiptBytes(generationRequest);

            // Зберігаємо PDF у папку Downloads
            String orderNumber = generatedReceipt.getReceiptNumber();
            String pdfFilePath;

            try {
                // Перевіряємо доступність папки Downloads та зберігаємо файл
                if (FileStorageUtil.isDownloadsAccessible()) {
                    pdfFilePath = FileStorageUtil.savePdfReceipt(pdfBytes, orderId, orderNumber);
                    System.out.println("✅ PDF квитанція збережена: " + pdfFilePath);
                } else {
                    // Fallback до тимчасового шляху якщо Downloads недоступна
                    pdfFilePath = "temp_receipt_" + orderId + ".pdf";
                    System.err.println("⚠️ Папка Downloads недоступна, використовуємо тимчасовий шлях: " + pdfFilePath);
                }
            } catch (java.io.IOException | SecurityException | IllegalArgumentException e) {
                // Fallback у разі помилки збереження
                pdfFilePath = "fallback_receipt_" + orderId + ".pdf";
                System.err.println("❌ Помилка збереження PDF: " + e.getMessage() + ", використовуємо fallback шлях: " + pdfFilePath);
            }

            // Оновлюємо стан
            receiptDTO = receiptMapper.markPdfGenerated(receiptDTO, generatedReceipt, pdfFilePath);

            // Відправляємо email якщо потрібно
            if (sendByEmail) {
                String clientEmail = getClientEmailFromOrder(orderId);
                if (clientEmail != null && !clientEmail.trim().isEmpty()) {
                    String subject = "Квитанція замовлення #" + orderNumber;
                    String content = """
                        Доброго дня!

                        У додатку знаходиться квитанція для Вашого замовлення #%s.

                        Дякуємо за довіру!
                        З повагою, команда хімчистки""".formatted(orderNumber);

                    boolean emailSent = emailService.sendEmailWithAttachment(
                        clientEmail,
                        subject,
                        content,
                        "receipt_" + orderNumber + ".pdf",
                        pdfBytes,
                        "application/pdf"
                    );

                    if (emailSent) {
                        receiptDTO = receiptMapper.markEmailSent(receiptDTO);
                        System.out.println("✅ Email з квитанцією відправлено на: " + clientEmail);
                    } else {
                        System.err.println("❌ Помилка відправки email на: " + clientEmail);
                        receiptDTO = receiptDTO.toBuilder()
                            .validationMessage("Помилка відправки email")
                            .build();
                    }
                } else {
                    System.err.println("⚠️ Email клієнта не знайдено для замовлення: " + orderId);
                    receiptDTO = receiptDTO.toBuilder()
                        .validationMessage("Email клієнта не знайдено")
                        .build();
                }
            }

            receiptDTO = receiptMapper.prepareForOrderCompletion(receiptDTO);

        } catch (Exception e) {
            receiptDTO = receiptDTO.toBuilder()
                .hasValidationErrors(true)
                .validationMessage("Помилка генерації квитанції: " + e.getMessage())
                .build();
        }

        // Валідуємо та зберігаємо
        ValidationResult validationResult = validationService.validateReceiptConfiguration(receiptDTO);
        if (!validationResult.isValid()) {
            receiptDTO = receiptDTO.toBuilder()
                .hasValidationErrors(true)
                .validationMessage(String.join("; ", validationResult.getErrorMessages()))
                .build();
        }

        stateService.saveReceiptConfiguration(sessionId, receiptDTO);
        stateService.updateSessionState(sessionId, Stage4State.RECEIPT_GENERATED);

        return context;
    }

    /**
     * Завершує замовлення та Order Wizard.
     *
     * @param sessionId ID сесії
     * @param orderId ID замовлення
     * @param signatureData дані підпису
     * @param sendByEmail чи відправляти квитанцію на email
     * @param generatePrintable чи генерувати друковану версію
     * @param comments додаткові коментарі
     * @return оновлений контекст
     */
    public Stage4Context completeOrder(UUID sessionId, UUID orderId, String signatureData,
                                      boolean sendByEmail, boolean generatePrintable, String comments) {
        Stage4Context context = stateService.getSession(sessionId);
        if (context == null) {
            throw new IllegalStateException("Сесія не знайдена");
        }

        // Створюємо DTO завершення замовлення
        OrderCompletionDTO completionDTO = orderCompletionMapper.createForOrder(
            sessionId, orderId, signatureData, sendByEmail, generatePrintable, comments);

        try {
            // Завершуємо замовлення
            OrderFinalizationRequest finalizationRequest = completionDTO.getFinalizationRequest();
            finalizationOperations.finalizeOrder(finalizationRequest);

            // Оновлюємо стан
            completionDTO = orderCompletionMapper.markOrderProcessed(completionDTO);
            completionDTO = orderCompletionMapper.markOrderSaved(completionDTO, "ORD-" + orderId);
            completionDTO = orderCompletionMapper.completeWizard(completionDTO,
                "Замовлення успішно створено та Order Wizard завершено");

        } catch (Exception e) {
            completionDTO = completionDTO.toBuilder()
                .hasValidationErrors(true)
                .build();
        }

        // Валідуємо та зберігаємо
        ValidationResult validationResult = validationService.validateOrderCompletion(completionDTO);
        if (!validationResult.isValid()) {
            completionDTO = completionDTO.toBuilder()
                .hasValidationErrors(true)
                .build();
        }

        stateService.saveOrderCompletion(sessionId, completionDTO);
        stateService.updateSessionState(sessionId, Stage4State.STAGE4_COMPLETED);

        return context;
    }

    /**
     * Отримує поточний контекст сесії.
     *
     * @param sessionId ID сесії
     * @return контекст Stage4
     */
    public Stage4Context getSessionContext(UUID sessionId) {
        return stateService.getSession(sessionId);
    }

    // ========== Високорівневі методи для CoordinationService ==========

    /**
     * Ініціалізує Stage4 з автоматичним створенням сесії.
     *
     * @param orderId ID замовлення
     * @return ID створеної сесії
     */
    public UUID initializeStage4(UUID orderId) {
        UUID sessionId = UUID.randomUUID();
        initializeStage4(sessionId, orderId);
        return sessionId;
    }

    /**
     * Переглядає підсумок замовлення з автоматичним отриманням контексту.
     *
     * @param sessionId ID сесії
     * @return дані підтвердження замовлення
     */
    public OrderConfirmationDTO reviewOrderSummary(UUID sessionId) {
        Stage4Context context = stateService.getSession(sessionId);
        if (context == null) {
            throw new IllegalStateException("Сесія не знайдена");
        }

        OrderDetailedSummaryResponse orderSummary = orderOperations.getOrderDetailedSummary(context.getOrderId());
        OrderConfirmationDTO confirmationDTO = orderConfirmationMapper.createFromOrderSummary(sessionId, orderSummary);

        ValidationResult validationResult = validationService.validateOrderConfirmation(confirmationDTO);
        if (!validationResult.isValid()) {
            confirmationDTO = confirmationDTO.toBuilder()
                .hasValidationErrors(true)
                .validationMessage(String.join("; ", validationResult.getErrorMessages()))
                .build();
        }

        stateService.saveOrderConfirmation(sessionId, confirmationDTO);
        return confirmationDTO;
    }

    /**
     * Обробляє прийняття юридичних умов з автоматичним отриманням orderId.
     *
     * @param sessionId ID сесії
     * @param signatureData дані підпису
     * @return дані юридичного прийняття
     */
    public LegalAcceptanceDTO acceptLegalTerms(UUID sessionId, String signatureData) {
        Stage4Context context = stateService.getSession(sessionId);
        if (context == null) {
            throw new IllegalStateException("Сесія не знайдена");
        }

        Stage4Context updatedContext = processLegalAcceptance(sessionId, context.getOrderId(), signatureData, true);
        return updatedContext.getLegalAcceptance();
    }

    /**
     * Генерує квитанцію з упрощеними параметрами.
     *
     * @param sessionId ID сесії
     * @param sendByEmail чи відправляти на email
     * @return дані конфігурації квитанції
     */
    public ReceiptConfigurationDTO generateReceipt(UUID sessionId, boolean sendByEmail) {
        Stage4Context context = stateService.getSession(sessionId);
        if (context == null) {
            throw new IllegalStateException("Сесія не знайдена");
        }

        Stage4Context updatedContext = generateReceipt(sessionId, context.getOrderId(), sendByEmail, true);
        return updatedContext.getReceiptConfiguration();
    }

    /**
     * Завершує замовлення з мінімальними параметрами.
     *
     * @param sessionId ID сесії
     * @return дані завершення замовлення
     */
    public OrderCompletionDTO completeOrder(UUID sessionId) {
        Stage4Context context = stateService.getSession(sessionId);
        if (context == null) {
            throw new IllegalStateException("Сесія не знайдена");
        }

        Stage4Context updatedContext = completeOrder(sessionId, context.getOrderId(), "", false, true, "Замовлення завершено автоматично");
        return updatedContext.getOrderCompletion();
    }

    /**
     * Отримує email клієнта з замовлення.
     *
     * @param orderId ID замовлення
     * @return email клієнта або null якщо не знайдено
     */
    private String getClientEmailFromOrder(UUID orderId) {
        try {
            OrderDetailedSummaryResponse orderSummary = orderOperations.getOrderDetailedSummary(orderId);
            if (orderSummary != null && orderSummary.getClient() != null) {
                return orderSummary.getClient().getEmail();
            }
        } catch (Exception e) {
            System.err.println("❌ Помилка отримання email клієнта для замовлення " + orderId + ": " + e.getMessage());
        }
        return null;
    }
}
