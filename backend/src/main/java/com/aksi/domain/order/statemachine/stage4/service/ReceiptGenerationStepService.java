package com.aksi.domain.order.statemachine.stage4.service;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.aksi.domain.order.dto.receipt.ReceiptDTO;
import com.aksi.domain.order.pdf.ReceiptPdfRenderer;
import com.aksi.domain.order.statemachine.service.OrderWizardPersistenceService;
import com.aksi.domain.order.statemachine.stage4.dto.ReceiptGenerationDTO;
import com.aksi.domain.order.statemachine.stage4.mapper.ReceiptGenerationMapper;
import com.aksi.domain.order.statemachine.stage4.validator.ReceiptGenerationValidator;
import com.aksi.service.email.EmailService;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Сервіс для управління підетапом 4.3 "Формування та друк квитанції".
 *
 * Відповідає за:
 * - Генерацію PDF-квитанції з ReceiptPdfRenderer
 * - Управління процесом друку
 * - Відправлення email з квитанцією
 * - Збереження стану через OrderWizardPersistenceService
 */
@Service
public class ReceiptGenerationStepService {

    private static final Logger logger = LoggerFactory.getLogger(ReceiptGenerationStepService.class);

    // Ключі для wizard persistence
    private static final String RECEIPT_GENERATION_KEY = "receiptGeneration";

    // Stage та step номери для persistence
    private static final int STAGE_NUMBER = 4;
    private static final int STEP_NUMBER = 3;

    private final OrderWizardPersistenceService persistenceService;
    private final ReceiptPdfRenderer pdfRenderer;
    private final EmailService emailService;
    private final ReceiptGenerationValidator validator;
    private final ReceiptGenerationMapper mapper;
    private final ObjectMapper objectMapper;

    public ReceiptGenerationStepService(
            OrderWizardPersistenceService persistenceService,
            ReceiptPdfRenderer pdfRenderer,
            EmailService emailService,
            ReceiptGenerationValidator validator,
            ReceiptGenerationMapper mapper,
            ObjectMapper objectMapper) {
        this.persistenceService = persistenceService;
        this.pdfRenderer = pdfRenderer;
        this.emailService = emailService;
        this.validator = validator;
        this.mapper = mapper;
        this.objectMapper = objectMapper;
    }

    /**
     * Завантажує дані підетапу 4.3 "Формування та друк квитанції".
     */
    public ReceiptGenerationDTO loadReceiptGeneration(String wizardId) {
        logger.debug("Завантаження генерації квитанції для wizard: {}", wizardId);

        try {
            Map<String, Object> wizardData = persistenceService.loadWizardData(wizardId);
            ReceiptGenerationDTO dto = loadSavedReceiptGeneration(wizardData);

            if (dto == null) {
                dto = createFromWizardData(wizardData);
            }

            if (dto == null) {
                dto = createDefaultReceiptGeneration();
            }

            return dto;

        } catch (Exception e) {
            logger.error("Помилка завантаження генерації квитанції для wizard {}: {}", wizardId, e.getMessage(), e);
            return createErrorReceiptGeneration("Помилка завантаження даних: " + e.getMessage());
        }
    }

    /**
     * Генерує PDF-квитанцію.
     */
    public ReceiptGenerationDTO generatePdfReceipt(String wizardId, ReceiptGenerationDTO receiptGeneration) {
        logger.debug("Генерація PDF квитанції для wizard: {}", wizardId);

        try {
            receiptGeneration.setLoading(true);

            // Валідуємо дані
            List<String> validationErrors = validator.validateForGeneration(receiptGeneration);
            if (!validationErrors.isEmpty()) {
                receiptGeneration.clearErrors();
                validationErrors.forEach(receiptGeneration::addError);
                receiptGeneration.setLoading(false);
                return receiptGeneration;
            }

            // Генеруємо PDF через існуючий рендерер
            byte[] pdfContent = pdfRenderer.generatePdfReceipt(
                receiptGeneration.getReceiptData(),
                receiptGeneration.isIncludeSignature()
            );

            if (pdfContent == null || pdfContent.length == 0) {
                receiptGeneration.setError("Помилка генерації PDF - пустий результат");
                receiptGeneration.setLoading(false);
                return receiptGeneration;
            }

            // Позначаємо як згенерований
            String fileName = receiptGeneration.getGeneratedFileName();
            receiptGeneration.markAsGenerated(pdfContent, fileName);

            logger.info("PDF квитанція згенерована для wizard: {} (розмір: {:.1f} KB)",
                wizardId, receiptGeneration.getPdfSizeKB());

            return saveReceiptGeneration(wizardId, receiptGeneration);

        } catch (Exception e) {
            logger.error("Помилка генерації PDF квитанції для wizard {}: {}", wizardId, e.getMessage(), e);
            receiptGeneration.setError("Помилка генерації PDF: " + e.getMessage());
            receiptGeneration.setLoading(false);
            return receiptGeneration;
        }
    }

    /**
     * Позначає квитанцію як надруковану.
     */
    public ReceiptGenerationDTO markAsPrinted(String wizardId, ReceiptGenerationDTO receiptGeneration) {
        logger.debug("Позначення квитанції як надрукованої для wizard: {}", wizardId);

        try {
            if (!receiptGeneration.isPdfGenerated()) {
                receiptGeneration.setError("Неможливо позначити як надруковано - PDF не згенеровано");
                return receiptGeneration;
            }

            receiptGeneration.markAsPrinted();

            logger.info("Квитанція позначена як надрукована для wizard: {}", wizardId);

            return saveReceiptGeneration(wizardId, receiptGeneration);

        } catch (Exception e) {
            logger.error("Помилка позначення як надруковано для wizard {}: {}", wizardId, e.getMessage(), e);
            receiptGeneration.setError("Помилка позначення як надруковано: " + e.getMessage());
            return receiptGeneration;
        }
    }

    /**
     * Надсилає квитанцію email'ом.
     */
    public ReceiptGenerationDTO sendEmailReceipt(String wizardId, ReceiptGenerationDTO receiptGeneration) {
        logger.debug("Надсилання квитанції email для wizard: {}", wizardId);

        try {
            receiptGeneration.setLoading(true);

            if (!receiptGeneration.canSendEmail()) {
                receiptGeneration.setError("Неможливо надіслати email - не виконані умови");
                receiptGeneration.setLoading(false);
                return receiptGeneration;
            }

            String subject = String.format("Квитанція №%s - Хімчистка", receiptGeneration.getReceiptNumber());
            String clientName = getClientNameFromReceipt(receiptGeneration.getReceiptData());

            String emailBody = String.format(
                "Шановний(на) %s!\n\n" +
                "Надсилаємо Вам квитанцію №%s.\n\n" +
                "Орієнтовна дата готовності: %s після 14:00\n\n" +
                "З повагою,\nКоманда хімчистки",
                clientName,
                receiptGeneration.getReceiptNumber(),
                formatCompletionDate(receiptGeneration.getReceiptData())
            );

            // Надсилаємо через EmailService
            emailService.sendEmailWithAttachment(
                receiptGeneration.getClientEmail(),
                subject,
                emailBody,
                receiptGeneration.getGeneratedFileName(),
                receiptGeneration.getPdfContent(),
                "application/pdf"
            );

            receiptGeneration.markEmailSent();
            receiptGeneration.setLoading(false);

            logger.info("Email з квитанцією надіслано для wizard: {} на адресу: {}",
                wizardId, receiptGeneration.getClientEmail());

            return saveReceiptGeneration(wizardId, receiptGeneration);

        } catch (Exception e) {
            logger.error("Помилка надсилання email для wizard {}: {}", wizardId, e.getMessage(), e);
            receiptGeneration.setError("Помилка надсилання email: " + e.getMessage());
            receiptGeneration.setLoading(false);
            return receiptGeneration;
        }
    }

    /**
     * Зберігає дані генерації квитанції.
     */
    public ReceiptGenerationDTO saveReceiptGeneration(String wizardId, ReceiptGenerationDTO receiptGeneration) {
        logger.debug("Збереження генерації квитанції для wizard: {}", wizardId);

        try {
            // Валідуємо дані
            List<String> validationErrors = validator.validate(receiptGeneration);
            if (!validationErrors.isEmpty()) {
                receiptGeneration.clearErrors();
                validationErrors.forEach(receiptGeneration::addError);
                return receiptGeneration;
            }

            // Оновлюємо timestamp
            receiptGeneration.updateTimestamp();

            // Зберігаємо дані в wizard persistence
            persistenceService.saveWizardData(wizardId, RECEIPT_GENERATION_KEY, receiptGeneration, STAGE_NUMBER, STEP_NUMBER);

            receiptGeneration.clearErrors();

            logger.info("Генерація квитанції збережена для wizard: {}", wizardId);
            return receiptGeneration;

        } catch (Exception e) {
            logger.error("Помилка збереження генерації квитанції для wizard {}: {}", wizardId, e.getMessage(), e);
            receiptGeneration.setError("Помилка збереження: " + e.getMessage());
            return receiptGeneration;
        }
    }

    /**
     * Скидає стан для повторної генерації.
     */
    public ReceiptGenerationDTO resetForRegeneration(String wizardId, ReceiptGenerationDTO receiptGeneration) {
        logger.debug("Скидання для повторної генерації wizard: {}", wizardId);

        try {
            receiptGeneration.resetForRegeneration();
            return saveReceiptGeneration(wizardId, receiptGeneration);

        } catch (Exception e) {
            logger.error("Помилка скидання для wizard {}: {}", wizardId, e.getMessage(), e);
            receiptGeneration.setError("Помилка скидання: " + e.getMessage());
            return receiptGeneration;
        }
    }

    /**
     * Перевіряє чи можна завершити wizard.
     */
    public boolean canCompleteWizard(String wizardId) {
        try {
            Map<String, Object> wizardData = persistenceService.loadWizardData(wizardId);
            ReceiptGenerationDTO dto = loadSavedReceiptGeneration(wizardData);

            return dto != null && dto.isCompleted();
        } catch (Exception e) {
            logger.error("Помилка перевірки завершення для wizard {}: {}", wizardId, e.getMessage(), e);
            return false;
        }
    }

    // Приватні методи helper

    private ReceiptGenerationDTO loadSavedReceiptGeneration(Map<String, Object> wizardData) {
        try {
            Object data = wizardData.get(RECEIPT_GENERATION_KEY);
            if (data == null) return null;

            if (data instanceof ReceiptGenerationDTO) {
                return (ReceiptGenerationDTO) data;
            } else {
                return objectMapper.convertValue(data, ReceiptGenerationDTO.class);
            }
        } catch (Exception e) {
            logger.error("Помилка завантаження збереженої генерації квитанції: {}", e.getMessage(), e);
            return null;
        }
    }

    private ReceiptGenerationDTO createFromWizardData(Map<String, Object> wizardData) {
        try {
            // Використовуємо mapper для створення ReceiptDTO з wizard data
            ReceiptDTO receiptData = mapper.createReceiptDTOFromWizardData(wizardData);

            if (receiptData == null) {
                logger.warn("Не вдалося створити ReceiptDTO з wizard data");
                return null;
            }

            ReceiptGenerationDTO dto = ReceiptGenerationDTO.builder()
                    .isLoading(false)
                    .hasErrors(false)
                    .build();

            dto.setReceiptDataAndPrepare(receiptData);

            return dto;

        } catch (Exception e) {
            logger.error("Помилка створення ReceiptGenerationDTO з wizard data: {}", e.getMessage(), e);
            return null;
        }
    }

    private String getClientNameFromReceipt(ReceiptDTO receiptData) {
        if (receiptData != null && receiptData.getClientInfo() != null) {
            String firstName = receiptData.getClientInfo().getFirstName();
            String lastName = receiptData.getClientInfo().getLastName();

            if (firstName != null && lastName != null) {
                return String.format("%s %s", lastName, firstName);
            } else if (lastName != null) {
                return lastName;
            } else if (firstName != null) {
                return firstName;
            }
        }
        return "Клієнт";
    }

    private String formatCompletionDate(ReceiptDTO receiptData) {
        if (receiptData != null && receiptData.getExpectedCompletionDate() != null) {
            return receiptData.getExpectedCompletionDate().toLocalDate().toString();
        }
        return "уточнюйте";
    }

    private ReceiptGenerationDTO createDefaultReceiptGeneration() {
        return ReceiptGenerationDTO.builder()
                .isLoading(false)
                .hasErrors(false)
                .build();
    }

    private ReceiptGenerationDTO createErrorReceiptGeneration(String errorMessage) {
        return ReceiptGenerationDTO.builder()
                .hasErrors(true)
                .errorMessage(errorMessage)
                .isLoading(false)
                .build();
    }
}
