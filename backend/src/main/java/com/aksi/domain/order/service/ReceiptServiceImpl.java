package com.aksi.domain.order.service;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.branch.entity.BranchLocationEntity;
import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.order.dto.receipt.EmailReceiptRequest;
import com.aksi.domain.order.dto.receipt.ReceiptBranchInfoDTO;
import com.aksi.domain.order.dto.receipt.ReceiptClientInfoDTO;
import com.aksi.domain.order.dto.receipt.ReceiptDTO;
import com.aksi.domain.order.dto.receipt.ReceiptFinancialInfoDTO;
import com.aksi.domain.order.dto.receipt.ReceiptGenerationRequest;
import com.aksi.domain.order.dto.receipt.ReceiptItemDTO;
import com.aksi.domain.order.dto.receipt.ReceiptPriceModifierDTO;
import com.aksi.domain.order.entity.OrderEntity;
import com.aksi.domain.order.entity.OrderItemEntity;
import com.aksi.domain.order.entity.OrderItemPriceModifierEntity;
import com.aksi.domain.order.model.ExpediteType;
import com.aksi.domain.order.pdf.ReceiptPdfRenderer;
import com.aksi.domain.order.repository.CustomerSignatureRepository;
import com.aksi.domain.order.repository.OrderItemRepository;
import com.aksi.domain.order.repository.OrderRepository;
import com.aksi.domain.order.repository.PriceModifierRepository;
import com.aksi.exception.ResourceNotFoundException;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Імплементація сервісу для роботи з квитанціями
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class ReceiptServiceImpl implements ReceiptService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PriceModifierRepository priceModifierRepository;
    private final CustomerSignatureRepository customerSignatureRepository;
    private final JavaMailSender emailSender;
    private final ReceiptPdfRenderer pdfRenderer;

    private static final String DEFAULT_LEGAL_TERMS = "Здаючи речі до хімчистки, клієнт погоджується з правилами і умовами "
            + "обслуговування, встановленими компанією. Компанія зобов'язується забезпечити якісне обслуговування, але не несе "
            + "відповідальності за природне зношення речей, існуючі дефекти та пошкодження, які могли бути непомітними під час "
            + "прийому. У разі втрати або пошкодження речей з вини компанії, компенсація здійснюється відповідно до чинного "
            + "законодавства України. Термін зберігання виконаного замовлення становить 30 днів з моменту готовності. "
            + "Після цього терміну компанія не гарантує збереження речей.";

    @Override
    @Transactional(readOnly = true)
    public ReceiptDTO generateReceipt(ReceiptGenerationRequest request) {
        log.info("Generating receipt for order ID: {}", request.getOrderId());
        
        OrderEntity order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + request.getOrderId()));
                
        ClientEntity client = order.getClient();
        
        BranchLocationEntity branch = order.getBranchLocation();
        
        // В даному випадку ми не маємо інформації про створення замовлення, використовуємо заглушку
        String operatorName = "Оператор AKSI";
        
        ReceiptDTO receipt = new ReceiptDTO();
        receipt.setOrderId(order.getId());
        receipt.setReceiptNumber(order.getReceiptNumber());
        receipt.setTagNumber(order.getTagNumber());
        receipt.setCreatedDate(order.getCreatedDate());
        receipt.setExpectedCompletionDate(order.getExpectedCompletionDate());
        receipt.setExpediteType(order.getExpediteType());
        receipt.setPaymentMethod(order.getPaymentMethod());
        receipt.setLegalTerms(DEFAULT_LEGAL_TERMS);
        
        // Шукаємо підпис клієнта, якщо доступний
        customerSignatureRepository.findByOrderIdAndSignatureType(order.getId(), "CUSTOMER_ACCEPTANCE")
                .ifPresent(signature -> receipt.setCustomerSignatureData(signature.getSignatureData()));
        
        // Отримуємо інформацію про філію
        ReceiptBranchInfoDTO branchInfo = new ReceiptBranchInfoDTO();
        branchInfo.setBranchName(branch.getName());
        branchInfo.setAddress(branch.getAddress());
        branchInfo.setPhone(branch.getPhone());
        branchInfo.setOperatorName(operatorName);
        receipt.setBranchInfo(branchInfo);
        
        // Отримуємо інформацію про клієнта
        ReceiptClientInfoDTO clientInfo = new ReceiptClientInfoDTO();
        clientInfo.setFirstName(client.getFirstName());
        clientInfo.setLastName(client.getLastName());
        clientInfo.setPhone(client.getPhone());
        clientInfo.setEmail(client.getEmail());
        
        // Встановлюємо адресу, якщо є (спрощено без перевірки каналів комунікації)
        clientInfo.setAddress("Адреса клієнта");
        
        receipt.setClientInfo(clientInfo);
        
        // Отримуємо предмети замовлення
        List<OrderItemEntity> orderItems = orderItemRepository.findByOrderId(order.getId());
        
        List<ReceiptItemDTO> itemsDTO = new ArrayList<>();
        for (int i = 0; i < orderItems.size(); i++) {
            OrderItemEntity item = orderItems.get(i);
            
            ReceiptItemDTO itemDTO = new ReceiptItemDTO();
            itemDTO.setOrderNumber(i + 1);
            itemDTO.setName(item.getName());
            itemDTO.setServiceCategory(item.getCategory());
            itemDTO.setQuantity(new BigDecimal(item.getQuantity()));
            itemDTO.setUnitOfMeasure(item.getUnitOfMeasure());
            itemDTO.setBasePrice(item.getUnitPrice());
            itemDTO.setFinalPrice(item.getTotalPrice());
            
            // Додаємо модифікатори ціни, якщо є
            List<OrderItemPriceModifierEntity> modifiers = priceModifierRepository.findByOrderItemId(item.getId());
            if (modifiers != null && !modifiers.isEmpty()) {
                List<ReceiptPriceModifierDTO> modifiersDTO = modifiers.stream()
                        .map(modifier -> {
                            ReceiptPriceModifierDTO modifierDTO = new ReceiptPriceModifierDTO();
                            modifierDTO.setName(modifier.getName());
                            modifierDTO.setDescription(modifier.getDescription());
                            
                            // Встановлюємо або відсоткове або фіксоване значення
                            if (modifier.getModifierType().name().contains("PERCENTAGE")) {
                                modifierDTO.setPercentageValue(modifier.getValue().intValue());
                            } else {
                                modifierDTO.setFixedValue(modifier.getValue());
                            }
                            
                            modifierDTO.setImpact(modifier.getAmount());
                            return modifierDTO;
                        }).collect(Collectors.toList());
                itemDTO.setPriceModifiers(modifiersDTO);
            }
            
            itemsDTO.add(itemDTO);
        }
        receipt.setItems(itemsDTO);
        
        // Фінансова інформація
        ReceiptFinancialInfoDTO financialInfo = new ReceiptFinancialInfoDTO();
        financialInfo.setTotalAmount(order.getTotalAmount());
        
        // Якщо є знижка
        if (order.getDiscountType() != null && order.getDiscountAmount() != null) {
            financialInfo.setDiscountType(order.getDiscountType().name());
            financialInfo.setDiscountAmount(order.getDiscountAmount());
        }
        
        // Якщо є надбавка за терміновість
        if (order.getExpediteType() != ExpediteType.STANDARD) {
            // При потребі тут можна було б розрахувати надбавку, якщо не зберігається в сутності
            financialInfo.setExpediteSurcharge(new BigDecimal("0.00"));
        }
        
        financialInfo.setFinalAmount(order.getFinalAmount());
        
        // Якщо є передоплата
        if (order.getPrepaymentAmount() != null && order.getPrepaymentAmount().compareTo(java.math.BigDecimal.ZERO) > 0) {
            financialInfo.setPrepaymentAmount(order.getPrepaymentAmount());
            financialInfo.setBalanceAmount(order.getBalanceAmount());
        }
        
        receipt.setFinancialInfo(financialInfo);
        
        return receipt;
    }

    @Override
    public byte[] generatePdfReceipt(ReceiptGenerationRequest request) {
        ReceiptDTO receipt = generateReceipt(request);
        return pdfRenderer.generatePdfReceipt(receipt, request.isIncludeSignature());
    }

    @Override
    public void emailReceipt(EmailReceiptRequest request) {
        log.info("Emailing receipt for order ID: {}", request.getOrderId());
        
        // Створюємо запит на генерацію квитанції з ID замовлення
        ReceiptDTO receipt = generateReceipt(new ReceiptGenerationRequest(request.getOrderId(), "PDF", request.isIncludeSignature()));
        
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setTo(request.getRecipientEmail());
            helper.setSubject(request.getSubject());
            
            // Формуємо HTML-текст листа
            String emailText = "<html><body>"
                    + "<h2>Квитанція № " + receipt.getReceiptNumber() + "</h2>"
                    + "<p>Шановний(а) " + receipt.getClientInfo().getFirstName() + " " 
                    + receipt.getClientInfo().getLastName() + ",</p>"
                    + "<p>Дякуємо за ваше замовлення. У прикріпленому файлі знаходиться квитанція.</p>"
                    + "<p>Очікувана дата готовності: " 
                    + receipt.getExpectedCompletionDate().format(DateTimeFormatter.ofPattern("dd.MM.yyyy")) 
                    + " (після 14:00)</p>"
                    + "<p>З повагою,<br>Хімчистка AKSI</p>"
                    + "</body></html>";
            
            // Використовуємо повідомлення з запиту, якщо воно є
            if (request.getMessage() != null && !request.getMessage().isEmpty()) {
                emailText = request.getMessage();
            }
            
            helper.setText(emailText, true);
            
            // Додаємо PDF-квитанцію як вкладення
            byte[] pdfBytes = pdfRenderer.generatePdfReceipt(receipt, request.isIncludeSignature());
            helper.addAttachment("receipt_" + receipt.getReceiptNumber() + ".pdf", 
                    new org.springframework.core.io.ByteArrayResource(pdfBytes));
            
            emailSender.send(message);
            log.info("Receipt email sent successfully to: {}", request.getRecipientEmail());
        } catch (jakarta.mail.MessagingException e) {
            log.error("Error sending email message", e);
            throw new RuntimeException("Failed to send receipt email", e);
        } catch (IllegalArgumentException e) {
            log.error("Invalid argument in email preparation", e);
            throw new RuntimeException("Failed to prepare receipt email", e);
        } catch (RuntimeException e) {
            log.error("Error generating PDF for email", e);
            throw new RuntimeException("Failed to generate receipt PDF", e);
        }
    }
} 
