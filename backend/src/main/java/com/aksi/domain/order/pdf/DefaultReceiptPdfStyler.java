package com.aksi.domain.order.pdf;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.Image;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Реалізація стилізації PDF-квитанцій за замовчуванням.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DefaultReceiptPdfStyler implements ReceiptPdfStyler {

    private final ReceiptStyleConfig styleConfig;

    @Override
    public Paragraph addTitle(Document document, String title) {
        try {
            Paragraph titleParagraph = new Paragraph(title, styleConfig.getTitleFont());
            titleParagraph.setAlignment(Element.ALIGN_CENTER);
            titleParagraph.setSpacingAfter(15);
            document.add(titleParagraph);
            return titleParagraph;
        } catch (com.itextpdf.text.DocumentException e) {
            log.error("Error adding title to document", e);
            return null;
        } catch (NullPointerException e) {
            log.error("Null title or document", e);
            return null;
        }
    }

    @Override
    public Image addLogo(Document document) {
        try {
            Image logo = Image.getInstance(new ClassPathResource(styleConfig.getLogoPath()).getURL());
            logo.scaleToFit(100, 100);
            logo.setAlignment(Element.ALIGN_CENTER);
            document.add(logo);
            return logo;
        } catch (com.itextpdf.text.DocumentException e) {
            log.error("Error adding logo to document", e);
            return null;
        } catch (java.io.IOException e) {
            log.error("Error loading logo image", e);
            return null;
        } catch (NullPointerException e) {
            log.error("Null document or logo path", e);
            return null;
        }
    }

    @Override
    public Paragraph addSectionHeader(Document document, String title) {
        try {
            Paragraph header = new Paragraph(title, styleConfig.getHeaderFont());
            header.setSpacingBefore(10);
            header.setSpacingAfter(5);
            document.add(header);
            return header;
        } catch (com.itextpdf.text.DocumentException e) {
            log.error("Error adding section header to document", e);
            return null;
        } catch (NullPointerException e) {
            log.error("Null document or title", e);
            return null;
        }
    }

    @Override
    public PdfPCell createHeaderCell(String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text, styleConfig.getHeaderFont()));
        cell.setBackgroundColor(styleConfig.getTableHeaderColor());
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setPadding(styleConfig.getCellPadding());
        cell.setBorderColor(styleConfig.getTableBorderColor());
        return cell;
    }

    @Override
    public PdfPCell createCell(String text, boolean isAlternateRow) {
        PdfPCell cell = new PdfPCell(new Phrase(text, styleConfig.getNormalFont()));
        if (isAlternateRow) {
            cell.setBackgroundColor(styleConfig.getAlternateRowColor());
        }
        cell.setHorizontalAlignment(Element.ALIGN_LEFT);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setPadding(styleConfig.getCellPadding());
        cell.setBorderColor(styleConfig.getTableBorderColor());
        return cell;
    }

    @Override
    public void addKeyValueRow(PdfPTable table, String key, String value) {
        PdfPCell keyCell = new PdfPCell(new Phrase(key, styleConfig.getBoldFont()));
        keyCell.setBorder(Rectangle.NO_BORDER);
        keyCell.setHorizontalAlignment(Element.ALIGN_LEFT);
        keyCell.setPadding(styleConfig.getCellPadding());
        
        PdfPCell valueCell = new PdfPCell(new Phrase(value, styleConfig.getNormalFont()));
        valueCell.setBorder(Rectangle.NO_BORDER);
        valueCell.setHorizontalAlignment(Element.ALIGN_LEFT);
        valueCell.setPadding(styleConfig.getCellPadding());
        
        table.addCell(keyCell);
        table.addCell(valueCell);
    }

    @Override
    public void drawSignatureLine(PdfWriter writer, float yPosition) {
        PdfContentByte cb = writer.getDirectContent();
        cb.setLineWidth(0.5f);
        cb.moveTo(50, yPosition);
        cb.lineTo(250, yPosition);
        cb.stroke();
    }

    @Override
    public boolean addStyledSection(Document document, String title, PdfPTable content) {
        try {
            PdfPTable container = new PdfPTable(1);
            container.setWidthPercentage(100);
            container.setSpacingBefore(10);
            container.setSpacingAfter(10);
            
            // Заголовок секції
            PdfPCell titleCell = new PdfPCell(new Phrase(title, styleConfig.getHeaderFont()));
            titleCell.setBackgroundColor(styleConfig.getBrandPrimaryColor());
            titleCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            titleCell.setBorder(Rectangle.TOP | Rectangle.LEFT | Rectangle.RIGHT);
            titleCell.setBorderColor(styleConfig.getBrandPrimaryColor());
            titleCell.setPadding(styleConfig.getSectionPadding());
            container.addCell(titleCell);
            
            // Контент секції
            PdfPCell contentCell = new PdfPCell();
            contentCell.addElement(content);
            contentCell.setBorder(Rectangle.BOTTOM | Rectangle.LEFT | Rectangle.RIGHT);
            contentCell.setBorderColor(styleConfig.getTableBorderColor());
            contentCell.setPadding(styleConfig.getSectionPadding());
            container.addCell(contentCell);
            
            document.add(container);
            return true;
        } catch (com.itextpdf.text.DocumentException e) {
            log.error("Error adding styled section to document", e);
            return false;
        } catch (NullPointerException e) {
            log.error("Null document, title or content", e);
            return false;
        } catch (IllegalArgumentException e) {
            log.error("Invalid arguments for styled section", e);
            return false;
        }
    }

    @Override
    public Phrase createPhrase(String text, int fontStyle) {
        Font font = switch (fontStyle) {
            case Font.BOLD -> styleConfig.getBoldFont();
            case Font.ITALIC -> styleConfig.createFont(styleConfig.getPrimaryBaseFont(), 
                    styleConfig.getNormalFontSize(), Font.ITALIC, null);
            default -> styleConfig.getNormalFont();
        };
        return new Phrase(text, font);
    }
} 