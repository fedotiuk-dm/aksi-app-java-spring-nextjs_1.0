package com.aksi.domain.order.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.order.dto.CustomerSignatureRequest;
import com.aksi.domain.order.dto.CustomerSignatureResponse;
import com.aksi.domain.order.dto.OrderDTO;
import com.aksi.domain.order.dto.OrderFinalizationRequest;
import com.aksi.domain.order.dto.receipt.EmailReceiptRequest;
import com.aksi.domain.order.dto.receipt.ReceiptGenerationRequest;
import com.aksi.domain.order.entity.OrderEntity;
import com.aksi.domain.order.model.OrderStatusEnum;
import com.aksi.exception.EntityNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Імплементація сервісу для завершення процесу оформлення замовлення
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderFinalizationServiceImpl implements OrderFinalizationService {

    private final OrderService orderService;
    private final CustomerSignatureService signatureService;
    private final ReceiptService receiptService;

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public OrderDTO finalizeOrder(OrderFinalizationRequest request) {
        log.info("Завершення замовлення з ID: {}", request.getOrderId());

        // 1. Зберігаємо підпис клієнта, якщо він наданий
        if (request.getSignatureData() != null && !request.getSignatureData().isEmpty()) {
            CustomerSignatureRequest signatureRequest = CustomerSignatureRequest.builder()
                    .orderId(request.getOrderId())
                    .signatureData(request.getSignatureData())
                    .termsAccepted(request.getTermsAccepted())
                    .signatureType("CUSTOMER_ACCEPTANCE")
                    .build();

            CustomerSignatureResponse savedSignature = signatureService.saveSignature(signatureRequest);
            log.debug("Збережено підпис клієнта з ID: {}", savedSignature.getId());
        }

        // 2. Змінюємо статус замовлення на NEW та оновлюємо додаткові поля для завершення
        OrderEntity orderEntity = orderService.findOrderEntityById(request.getOrderId());
        orderEntity.setStatus(OrderStatusEnum.NEW);
        orderEntity.setUpdatedDate(LocalDateTime.now());
        orderEntity.setFinalizedAt(LocalDateTime.now());
        orderEntity.setTermsAccepted(request.getTermsAccepted() != null && request.getTermsAccepted());

        // Оновлюємо коментарі до замовлення, якщо вони є
        if (request.getComments() != null && !request.getComments().isEmpty()) {
            orderEntity.setCompletionComments(request.getComments());
        }

        OrderDTO updatedOrder = orderService.saveOrder(orderEntity);

        // 3. Якщо потрібно надіслати чек електронною поштою
        if (request.getSendReceiptByEmail() != null && request.getSendReceiptByEmail()) {
            // Формуємо запит на відправку чеку по email
            try {
                EmailReceiptRequest emailRequest = EmailReceiptRequest.builder()
                        .orderId(request.getOrderId())
                        .includeSignature(true)
                        .build();

                // Отримуємо email клієнта з замовлення
                String clientEmail = updatedOrder.getClient().getEmail();

                // Якщо email доступний, відправляємо чек
                if (clientEmail != null && !clientEmail.isEmpty()) {
                    emailRequest.setRecipientEmail(clientEmail);
                    emailRequest.setSubject("Ваше замовлення №" + updatedOrder.getReceiptNumber() + " в хімчистці AKSI");

                    // Відправляємо email
                    sendReceiptByEmail(emailRequest);

                    // Оновлюємо прапорець відправки email
                    orderEntity.setEmailed(true);
                    orderService.saveOrder(orderEntity);

                    log.info("Чек успішно надіслано на email: {}", clientEmail);
                } else {
                    log.warn("Не вдалося надіслати чек: email клієнта не вказано");
                }
            } catch (Exception e) {
                // У разі помилки з відправкою чеку, просто логуємо помилку, але продовжуємо обробку
                log.error("Помилка при відправці чеку електронною поштою", e);
            }
        }

        // 4. Якщо потрібно створити друковану версію чеку
        if (request.getGeneratePrintableReceipt() != null && request.getGeneratePrintableReceipt()) {
            // Встановлюємо прапорець друку
            orderEntity.setPrinted(true);
            orderService.saveOrder(orderEntity);
        }

        log.info("Замовлення {} успішно завершено", request.getOrderId());
        return updatedOrder;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void sendReceiptByEmail(EmailReceiptRequest request) {
        log.info("Надсилання чеку електронною поштою для замовлення: {}", request.getOrderId());
        try {
            receiptService.emailReceipt(request);
            log.info("Чек успішно надіслано на email: {}", request.getRecipientEmail());
        } catch (Exception e) {
            log.error("Помилка при відправці чеку електронною поштою", e);
            throw e;
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public byte[] getOrderReceipt(UUID orderId, boolean includeSignature) {
        log.info("Отримання PDF чеку для замовлення: {}", orderId);

        // Перевіряємо існування замовлення
        orderService.getOrderById(orderId)
            .orElseThrow(() -> EntityNotFoundException.withTypeAndId("Замовлення не знайдено", orderId));

        // Створюємо запит на генерацію чеку
        ReceiptGenerationRequest receiptRequest = new ReceiptGenerationRequest(
                orderId,
                "PDF",
                includeSignature);

        // Генеруємо PDF
        byte[] pdfContent = receiptService.generatePdfReceipt(receiptRequest);
        log.info("PDF чек успішно згенеровано для замовлення: {}", orderId);

        return pdfContent;
    }
}
