package com.aksi.service.receipt;

import java.util.List;
import java.util.UUID;

import org.springframework.core.io.Resource;

import com.aksi.api.receipt.dto.EmailReceiptRequest;
import com.aksi.api.receipt.dto.EmailReceiptResponse;
import com.aksi.api.receipt.dto.ReceiptPreviewRequest;
import com.aksi.api.receipt.dto.ReceiptTemplate;

public interface ReceiptService {

  /**
   * Generate PDF receipt for order
   *
   * @param orderId Order ID
   * @param locale Locale for receipt generation
   * @return PDF as Resource
   */
  Resource generateOrderReceipt(UUID orderId, String locale);

  /**
   * Generate PDF receipt preview
   *
   * @param request Preview request with order data
   * @return PDF as Resource
   */
  Resource generateReceiptPreview(ReceiptPreviewRequest request);

  /**
   * Email receipt for order
   *
   * @param orderId Order ID
   * @param request Email request
   * @return Email response
   */
  EmailReceiptResponse emailOrderReceipt(Long orderId, EmailReceiptRequest request);

  /**
   * Get available receipt templates
   *
   * @return List of templates
   */
  List<ReceiptTemplate> getAvailableTemplates();
}
