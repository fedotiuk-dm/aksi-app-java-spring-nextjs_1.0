package com.aksi.service.order.impl;

import com.aksi.domain.order.entity.Order;
import com.aksi.domain.order.repository.OrderRepository;
import com.aksi.service.email.EmailService;
import com.aksi.service.order.ReceiptService;
import com.aksi.util.PdfReceiptGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

/**
 * Імплементація сервісу для роботи з квитанціями замовлень
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class ReceiptServiceImpl implements ReceiptService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd.MM.yyyy");

    private final OrderRepository orderRepository;
    private final EmailService emailService;
    private final PdfReceiptGenerator pdfReceiptGenerator;

    @Override
    @Transactional(readOnly = true)
    public ByteArrayOutputStream generateReceipt(UUID orderId) {
        log.info("Generating receipt for order ID: {}", orderId);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        return pdfReceiptGenerator.generatePdfReceipt(order);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean sendReceiptByEmail(UUID orderId, String email) {
        log.info("Sending receipt by email for order ID: {}", orderId);
        try {
            // Отримуємо замовлення
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

            // Визначаємо електронну пошту для відправки
            String recipientEmail = email;
            if (!StringUtils.hasText(recipientEmail)) {
                if (order.getClient() != null && StringUtils.hasText(order.getClient().getEmail())) {
                    recipientEmail = order.getClient().getEmail();
                } else {
                    log.error("No email provided and no email found in client profile");
                    return false;
                }
            }

            // Генеруємо PDF-квитанцію
            ByteArrayOutputStream pdfStream = generateReceipt(orderId);
            byte[] pdfBytes = pdfStream.toByteArray();
            String fileName = "receipt_" + order.getReceiptNumber() + ".pdf";

            // Підготовка повідомлення електронної пошти
            String subject = "Ваша квитанція для замовлення " + order.getReceiptNumber();
            String content = "Шановний(а) " + order.getClient().getFullName() + ",\n\n" +
                    "Дякуємо за використання наших послуг хімчистки. До цього листа додана квитанція для замовлення " +
                    order.getReceiptNumber() + ".\n\n" +
                    "Дата замовлення: " + order.getCreatedAt().format(DATE_FORMATTER) + "\n" +
                    "Очікувана дата готовності: " + order.getExpectedCompletionDate().format(DATE_FORMATTER) + "\n\n" +
                    "Якщо у вас є питання, будь ласка, зв'яжіться з нами.\n\n" +
                    "З повагою,\nПослуги хімчистки";

            // Відправка електронної пошти через emailService
            try {
                emailService.sendEmailWithAttachment(recipientEmail, subject, content, fileName, pdfBytes, "application/pdf");
                log.info("Email with receipt sent successfully to: {}", recipientEmail);
            } catch (Exception e) {
                log.error("Failed to send email: {}", e.getMessage());
                // Логуємо деталі для діагностики
                log.info("Email details - To: {}, Subject: {}", recipientEmail, subject);
                log.info("Attachment: {}, size: {} bytes", fileName, pdfBytes.length);
                return false;
            }

            return true;
        } catch (Exception e) {
            log.error("Error sending receipt by email: {}", e.getMessage(), e);
            return false;
        }
    }
}
