package com.aksi.domain.order.pdf;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.dto.receipt.ReceiptDTO;
import com.aksi.domain.order.dto.receipt.ReceiptItemDTO;
import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.Image;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Реалізація рендеринга PDF-квитанцій за замовчуванням.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DefaultReceiptPdfRenderer implements ReceiptPdfRenderer {

    private final ReceiptPdfStyler styler;
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm");

    @Override
    public byte[] generatePdfReceipt(ReceiptDTO receiptData, boolean includeSignature) {
        log.info("Generating PDF receipt for order ID: {}", receiptData.getOrderId());
        
        try {
            DocumentWriterPair pair = initializeDocument();
            Document document = pair.getDocument();
            PdfWriter writer = pair.getWriter();
            ByteArrayOutputStream outputStream = pair.getOutputStream();
            
            // Додаємо лого і заголовок
            styler.addLogo(document);
            styler.addTitle(document, "КВИТАНЦІЯ");
            
            // Номер квитанції
            Paragraph receiptInfo = new Paragraph(
                    "Квитанція № " + receiptData.getReceiptNumber() + 
                    " від " + receiptData.getCreatedDate().format(DATE_FORMATTER),
                    styler.createPhrase("", com.itextpdf.text.Font.BOLD).getFont());
            receiptInfo.setAlignment(Element.ALIGN_CENTER);
            receiptInfo.setSpacingAfter(10);
            document.add(receiptInfo);
            
            // Додаємо всі секції документа
            renderBranchInfo(document, writer, receiptData);
            renderClientInfo(document, writer, receiptData);
            renderOrderInfo(document, writer, receiptData);
            renderItemsTable(document, writer, receiptData);
            renderFinancialInfo(document, writer, receiptData);
            renderLegalInfo(document, writer, receiptData);
            renderSignature(document, writer, receiptData, includeSignature);
            
            // Нижній колонтитул
            document.add(new Paragraph(" "));
            Paragraph footer = new Paragraph(
                    "Дякуємо за замовлення! Телефон для довідок: +38 (050) 123-45-67",
                    styler.createPhrase("", com.itextpdf.text.Font.NORMAL).getFont());
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);
            
            document.close();
            
            return outputStream.toByteArray();
            
        } catch (com.itextpdf.text.DocumentException e) {
            log.error("Error in PDF document structure", e);
            throw new RuntimeException("Error generating PDF receipt", e);
        } catch (IllegalArgumentException e) {
            log.error("Invalid argument in PDF generation", e);
            throw new RuntimeException("Error generating PDF receipt", e);
        } catch (RuntimeException e) {
            log.error("Runtime error during PDF generation", e);
            throw e;
        }
    }

    @Override
    public DocumentWriterPair initializeDocument() {
        try {
            Document document = new Document(PageSize.A4);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            PdfWriter writer = PdfWriter.getInstance(document, outputStream);
            
            document.open();
            return new DocumentWriterPair(document, writer, outputStream);
        } catch (com.itextpdf.text.DocumentException e) {
            log.error("Error initializing PDF document", e);
            throw new RuntimeException("Error initializing PDF document", e);
        } catch (RuntimeException e) {
            log.error("Runtime error during PDF initialization", e);
            throw e;
        }
    }

    @Override
    public void renderOrderInfo(Document document, PdfWriter writer, ReceiptDTO receiptData) {
        try {
            styler.addSectionHeader(document, "Деталі замовлення");
            
            PdfPTable orderTable = new PdfPTable(2);
            orderTable.setWidthPercentage(100);
            
            styler.addKeyValueRow(orderTable, "Номер замовлення:", receiptData.getReceiptNumber());
            
            if (receiptData.getTagNumber() != null) {
                styler.addKeyValueRow(orderTable, "Унікальна мітка:", receiptData.getTagNumber());
            }
            
            styler.addKeyValueRow(orderTable, "Дата створення:", 
                    receiptData.getCreatedDate().format(DATE_FORMATTER));
            styler.addKeyValueRow(orderTable, "Очікувана дата завершення:", 
                    receiptData.getExpectedCompletionDate().format(DATE_FORMATTER) + " (після 14:00)");
            
            if (receiptData.getExpediteType() != null) {
                styler.addKeyValueRow(orderTable, "Тип терміновості:", 
                        formatExpediteType(receiptData.getExpediteType().name()));
            }
            
            document.add(orderTable);
            document.add(new Paragraph(" "));
        } catch (com.itextpdf.text.DocumentException e) {
            log.error("Error rendering order info", e);
        } catch (NullPointerException e) {
            log.error("Null data in order info", e);
        }
    }

    @Override
    public void renderBranchInfo(Document document, PdfWriter writer, ReceiptDTO receiptData) {
        try {
            styler.addSectionHeader(document, "Інформація про філію");
            
            PdfPTable branchTable = new PdfPTable(2);
            branchTable.setWidthPercentage(100);
            
            styler.addKeyValueRow(branchTable, "Назва:", receiptData.getBranchInfo().getBranchName());
            styler.addKeyValueRow(branchTable, "Адреса:", receiptData.getBranchInfo().getAddress());
            styler.addKeyValueRow(branchTable, "Телефон:", receiptData.getBranchInfo().getPhone());
            styler.addKeyValueRow(branchTable, "Оператор:", receiptData.getBranchInfo().getOperatorName());
            
            document.add(branchTable);
            document.add(new Paragraph(" "));
        } catch (com.itextpdf.text.DocumentException e) {
            log.error("Error rendering branch info", e);
        } catch (NullPointerException e) {
            log.error("Null data in branch info", e);
        }
    }

    @Override
    public void renderClientInfo(Document document, PdfWriter writer, ReceiptDTO receiptData) {
        try {
            styler.addSectionHeader(document, "Інформація про клієнта");
            
            PdfPTable clientTable = new PdfPTable(2);
            clientTable.setWidthPercentage(100);
            
            styler.addKeyValueRow(clientTable, "Клієнт:", 
                    receiptData.getClientInfo().getLastName() + " " + 
                    receiptData.getClientInfo().getFirstName());
            styler.addKeyValueRow(clientTable, "Телефон:", receiptData.getClientInfo().getPhone());
            
            if (receiptData.getClientInfo().getEmail() != null) {
                styler.addKeyValueRow(clientTable, "Email:", receiptData.getClientInfo().getEmail());
            }
            
            if (receiptData.getClientInfo().getAddress() != null) {
                styler.addKeyValueRow(clientTable, "Адреса:", receiptData.getClientInfo().getAddress());
            }
            
            document.add(clientTable);
            document.add(new Paragraph(" "));
        } catch (com.itextpdf.text.DocumentException e) {
            log.error("Error rendering client info", e);
        } catch (NullPointerException e) {
            log.error("Null data in client info", e);
        }
    }

    @Override
    public void renderItemsTable(Document document, PdfWriter writer, ReceiptDTO receiptData) {
        try {
            styler.addSectionHeader(document, "Список предметів");
            
            PdfPTable itemsTable = new PdfPTable(new float[] {0.3f, 2f, 1f, 0.8f, 1f, 1.5f});
            itemsTable.setWidthPercentage(100);
            
            // Заголовки таблиці
            itemsTable.addCell(styler.createHeaderCell("№"));
            itemsTable.addCell(styler.createHeaderCell("Найменування"));
            itemsTable.addCell(styler.createHeaderCell("Категорія"));
            itemsTable.addCell(styler.createHeaderCell("Кіл-ть"));
            itemsTable.addCell(styler.createHeaderCell("Ціна"));
            itemsTable.addCell(styler.createHeaderCell("Сума"));
            
            // Рядки з предметами
            boolean isAlternateRow = false;
            for (ReceiptItemDTO item : receiptData.getItems()) {
                isAlternateRow = !isAlternateRow;
                
                itemsTable.addCell(styler.createCell(String.valueOf(item.getOrderNumber()), isAlternateRow));
                itemsTable.addCell(styler.createCell(item.getName(), isAlternateRow));
                itemsTable.addCell(styler.createCell(item.getServiceCategory(), isAlternateRow));
                itemsTable.addCell(styler.createCell(
                        item.getQuantity() + " " + item.getUnitOfMeasure(), isAlternateRow));
                itemsTable.addCell(styler.createCell(
                        formatCurrency(item.getBasePrice()), isAlternateRow));
                itemsTable.addCell(styler.createCell(
                        formatCurrency(item.getFinalPrice()), isAlternateRow));
            }
            
            document.add(itemsTable);
            document.add(new Paragraph(" "));
        } catch (com.itextpdf.text.DocumentException e) {
            log.error("Error rendering items table", e);
        } catch (NullPointerException e) {
            log.error("Null data in items table", e);
        }
    }

    @Override
    public void renderFinancialInfo(Document document, PdfWriter writer, ReceiptDTO receiptData) {
        try {
            styler.addSectionHeader(document, "Фінансова інформація");
            
            PdfPTable financialTable = new PdfPTable(2);
            financialTable.setWidthPercentage(100);
            
            styler.addKeyValueRow(financialTable, "Загальна вартість:", 
                    formatCurrency(receiptData.getFinancialInfo().getTotalAmount()));
            
            if (receiptData.getFinancialInfo().getDiscountAmount() != null && 
                receiptData.getFinancialInfo().getDiscountAmount().compareTo(java.math.BigDecimal.ZERO) > 0) {
                
                styler.addKeyValueRow(financialTable, 
                        "Знижка (" + receiptData.getFinancialInfo().getDiscountType() + "):", 
                        formatCurrency(receiptData.getFinancialInfo().getDiscountAmount()));
            }
            
            if (receiptData.getFinancialInfo().getExpediteSurcharge() != null && 
                receiptData.getFinancialInfo().getExpediteSurcharge().compareTo(java.math.BigDecimal.ZERO) > 0) {
                
                styler.addKeyValueRow(financialTable, "Надбавка за терміновість:", 
                        formatCurrency(receiptData.getFinancialInfo().getExpediteSurcharge()));
            }
            
            // Фінальна сума виділяється жирним
            PdfPCell keyCell = new PdfPCell(new Phrase("Фінальна сума:", 
                    styler.createPhrase("", com.itextpdf.text.Font.BOLD).getFont()));
            keyCell.setBorder(0);
            financialTable.addCell(keyCell);
            
            PdfPCell valueCell = new PdfPCell(new Phrase(
                    formatCurrency(receiptData.getFinancialInfo().getFinalAmount()), 
                    styler.createPhrase("", com.itextpdf.text.Font.BOLD).getFont()));
            valueCell.setBorder(0);
            financialTable.addCell(valueCell);
            
            if (receiptData.getFinancialInfo().getPrepaymentAmount() != null && 
                receiptData.getFinancialInfo().getPrepaymentAmount().compareTo(java.math.BigDecimal.ZERO) > 0) {
                
                styler.addKeyValueRow(financialTable, "Передоплата:", 
                        formatCurrency(receiptData.getFinancialInfo().getPrepaymentAmount()));
                
                styler.addKeyValueRow(financialTable, "Залишок до сплати:", 
                        formatCurrency(receiptData.getFinancialInfo().getBalanceAmount()));
            }
            
            styler.addKeyValueRow(financialTable, "Спосіб оплати:", 
                    receiptData.getPaymentMethod() != null ? 
                    formatPaymentMethod(receiptData.getPaymentMethod().name()) : "Не вказано");
            
            document.add(financialTable);
            document.add(new Paragraph(" "));
        } catch (com.itextpdf.text.DocumentException e) {
            log.error("Error rendering financial info", e);
        } catch (NullPointerException e) {
            log.error("Null data in financial info", e);
        } catch (IllegalArgumentException e) {
            log.error("Invalid argument in financial info", e);
        }
    }

    @Override
    public void renderLegalInfo(Document document, PdfWriter writer, ReceiptDTO receiptData) {
        try {
            styler.addSectionHeader(document, "Юридична інформація");
            
            Paragraph legalParagraph = new Paragraph(receiptData.getLegalTerms(), 
                    styler.createPhrase("", com.itextpdf.text.Font.NORMAL).getFont());
            
            document.add(legalParagraph);
            document.add(new Paragraph(" "));
        } catch (com.itextpdf.text.DocumentException e) {
            log.error("Error rendering legal info", e);
        } catch (NullPointerException e) {
            log.error("Null data in legal info", e);
        }
    }

    @Override
    public void renderSignature(Document document, PdfWriter writer, ReceiptDTO receiptData, boolean includeSignature) {
        try {
            styler.addSectionHeader(document, "Підписи");
            
            // Місце для підпису клієнта
            if (includeSignature && receiptData.getCustomerSignatureData() != null) {
                try {
                    // Перетворення base64 даних підпису в зображення
                    byte[] signatureBytes = Base64.getDecoder().decode(
                            receiptData.getCustomerSignatureData().split(",")[1]);
                    Image signatureImage = Image.getInstance(signatureBytes);
                    signatureImage.scaleToFit(200, 50);
                    document.add(signatureImage);
                } catch (com.itextpdf.text.DocumentException | java.io.IOException e) {
                    log.error("Error adding signature image to document", e);
                    // Якщо помилка з підписом, додаємо порожнє місце
                } catch (IllegalArgumentException e) {
                    log.error("Invalid signature data format", e);
                    // Якщо помилка з підписом, додаємо порожнє місце
                    styler.drawSignatureLine(writer, 150);
                }
            } else {
                // Малюємо лінію для підпису
                styler.drawSignatureLine(writer, 150);
            }
            
            Paragraph signText = new Paragraph("Підпис клієнта", 
                    styler.createPhrase("", com.itextpdf.text.Font.NORMAL).getFont());
            signText.setAlignment(Element.ALIGN_LEFT);
            document.add(signText);
        } catch (com.itextpdf.text.DocumentException e) {
            log.error("Error rendering signature", e);
        } catch (NullPointerException e) {
            log.error("Null data in signature rendering", e);
        } catch (IllegalArgumentException e) {
            log.error("Invalid argument in signature rendering", e);
        }
    }
    
    // Службові методи
    
    private String formatCurrency(BigDecimal amount) {
        if (amount == null) {
            return "0.00 грн";
        }
        return String.format("%.2f грн", amount);
    }
    
    private String formatExpediteType(String type) {
        return switch (type) {
            case "STANDARD" -> "Звичайне";
            case "EXPRESS_48H" -> "Термінове (48 годин)";
            case "EXPRESS_24H" -> "Термінове (24 години)";
            default -> type;
        };
    }
    
    private String formatPaymentMethod(String method) {
        return switch (method) {
            case "CASH" -> "Готівка";
            case "CARD" -> "Картка";
            case "TRANSFER" -> "Банківський переказ";
            default -> method;
        };
    }
} 