package com.aksi.service.receipt;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.receipt.dto.EmailReceiptRequest;
import com.aksi.api.receipt.dto.EmailReceiptResponse;
import com.aksi.api.receipt.dto.ReceiptPreviewRequest;
import com.aksi.api.receipt.dto.ReceiptTemplate;
import com.aksi.domain.order.OrderEntity;
import com.aksi.exception.NotFoundException;
import com.aksi.repository.OrderRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Receipt service implementation Acts as a thin layer delegating to ReceiptFacade */
@Slf4j
@Service
@RequiredArgsConstructor
public class ReceiptServiceImpl implements ReceiptService {

  private final OrderRepository orderRepository;
  private final ReceiptFacade receiptFacade;

  @Override
  @Transactional(readOnly = true)
  public Resource generateOrderReceipt(UUID orderId, String locale) {
    log.debug("Generating receipt for order ID: {} with locale: {}", orderId, locale);

    OrderEntity order =
        orderRepository
            .findById(orderId)
            .orElseThrow(() -> new NotFoundException("Order not found: " + orderId));

    try {
      byte[] pdfData = receiptFacade.generateReceipt(order, locale);
      return buildPdfResource(pdfData, String.format("receipt-%s.pdf", orderId));
    } catch (IOException e) {
      throw new RuntimeException("Failed to generate receipt", e);
    }
  }

  @Override
  public Resource generateReceiptPreview(ReceiptPreviewRequest request) {
    String templateId = request.getTemplateId() != null ? request.getTemplateId() : "default";
    String locale = request.getLocale() != null ? request.getLocale() : "uk";

    try {
      byte[] pdfData = receiptFacade.generateReceipt(request.getOrderData(), templateId, locale);
      return buildPdfResource(pdfData, "receipt-preview.pdf");
    } catch (IOException e) {
      throw new RuntimeException("Failed to generate receipt preview", e);
    }
  }

  @Override
  public EmailReceiptResponse emailOrderReceipt(UUID orderId, EmailReceiptRequest request) {
    // Email functionality not implemented yet
    EmailReceiptResponse response = new EmailReceiptResponse();
    response.setSuccess(false);
    response.setSentAt(Instant.now());
    response.setEmail(request.getEmail());
    // Note: setError method might not exist in generated DTO
    return response;
  }

  @Override
  public List<ReceiptTemplate> getAvailableTemplates() {
    return receiptFacade.getTemplates();
  }

  private Resource buildPdfResource(byte[] pdfData, String filename) {
    return new ByteArrayResource(pdfData) {
      @Override
      public String getFilename() {
        return filename;
      }
    };
  }
}
