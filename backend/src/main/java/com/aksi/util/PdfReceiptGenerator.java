package com.aksi.util;

import com.aksi.domain.client.entity.Client;
import com.aksi.domain.order.entity.Order;
import com.aksi.domain.order.entity.OrderItem;
import com.aksi.domain.order.entity.OrderItemStain;
import com.aksi.domain.order.entity.OrderItemDefect;
import com.aksi.domain.order.entity.UrgencyType;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

/**
 * Клас для генерації PDF-квитанцій
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class PdfReceiptGenerator {
    // Константи для форматування PDF
    private static final Font TITLE_FONT = new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD);
    private static final Font SUBTITLE_FONT = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
    private static final Font NORMAL_FONT = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL);
    private static final Font SMALL_FONT = new Font(Font.FontFamily.HELVETICA, 8, Font.NORMAL);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd.MM.yyyy");

    @Value("${aksi.app.base-url:http://localhost:3000}")
    private String appUrl;

    /**
     * Генерує PDF-квитанцію для замовлення
     *
     * @param order замовлення
     * @return ByteArrayOutputStream з PDF-документом
     */
    public ByteArrayOutputStream generatePdfReceipt(Order order) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        
        Document document = new Document(PageSize.A4);
        try {
            PdfWriter.getInstance(document, outputStream);
            document.open();
            
            // Додавання шапки з логотипом (якщо є)
            addHeader(document, order);
            
            // Додавання інформації про замовлення
            document.add(addOrderInfoSection(order));
            
            // Додавання інформації про клієнта
            document.add(addClientInfoSection(order.getClient()));
            
            // Додавання таблиці з речами
            document.add(addItemsTableSection(order));
            
            // Додаємо секцію плям та дефектів
            document.add(addStainsDefectsSection(order));
            
            // Додавання фінансової інформації
            document.add(addFinancialInfoSection(order));
            
            // Додавання юридичної інформації
            document.add(addLegalInfoSection());
            
            // Додавання секції для підпису
            document.add(addSignatureSection());
            
            // Додавання футера
            addFooter(document, order);
            
            document.close();
            return outputStream;
        } catch (DocumentException e) {
            log.error("Error generating PDF receipt: {}", e.getMessage(), e);
            throw new RuntimeException("Could not generate receipt", e);
        } catch (Exception e) {
            log.error("Unexpected error generating PDF receipt: {}", e.getMessage(), e);
            throw new RuntimeException("Unexpected error generating receipt", e);
        }
    }

    /**
     * Додає шапку документа
     */
    private void addHeader(Document document, Order order) throws DocumentException {
        Paragraph header = new Paragraph();
        header.setAlignment(Element.ALIGN_CENTER);
        
        // Заголовок документа
        header.add(new Chunk("ХІМЧИСТКА", TITLE_FONT));
        header.add(Chunk.NEWLINE);
        header.add(new Chunk("Квитанція №" + order.getReceiptNumber(), SUBTITLE_FONT));
        header.add(Chunk.NEWLINE);
        
        document.add(header);
    }

    /**
     * Додає розділ з інформацією про замовлення
     */
    private Paragraph addOrderInfoSection(Order order) {
        Paragraph orderInfo = new Paragraph();
        orderInfo.setSpacingBefore(10);
        orderInfo.setSpacingAfter(10);
        
        // Додавання заголовка
        orderInfo.add(new Chunk("Інформація про замовлення", SUBTITLE_FONT));
        orderInfo.add(Chunk.NEWLINE);
        orderInfo.add(Chunk.NEWLINE);
        
        // Номер замовлення
        orderInfo.add(new Chunk("Номер замовлення: " + order.getReceiptNumber(), NORMAL_FONT));
        orderInfo.add(Chunk.NEWLINE);
        
        // Дати прийому та орієнтовної видачі
        orderInfo.add(new Chunk("Дата прийому: " + order.getCreatedAt().format(DATE_FORMATTER), NORMAL_FONT));
        orderInfo.add(Chunk.NEWLINE);
        orderInfo.add(new Chunk("Орієнтовна дата видачі: " + order.getExpectedCompletionDate().format(DATE_FORMATTER) + " (після 14:00)", NORMAL_FONT));
        orderInfo.add(Chunk.NEWLINE);
        
        // Перевірка наявності пункту прийому
        if (StringUtils.hasText(order.getReceptionPoint())) {
            orderInfo.add(new Chunk("Пункт прийому: " + order.getReceptionPoint(), NORMAL_FONT));
            orderInfo.add(Chunk.NEWLINE);
        }
        
        return orderInfo;
    }

    /**
     * Додає розділ з інформацією про клієнта
     */
    private Paragraph addClientInfoSection(Client client) {
        Paragraph clientInfo = new Paragraph();
        clientInfo.setSpacingBefore(10);
        clientInfo.setSpacingAfter(10);
        
        // Заголовок
        clientInfo.add(new Chunk("Інформація про клієнта", SUBTITLE_FONT));
        clientInfo.add(Chunk.NEWLINE);
        clientInfo.add(Chunk.NEWLINE);
        
        // Ім'я
        clientInfo.add(new Chunk("ПІБ: " + client.getFullName(), NORMAL_FONT));
        clientInfo.add(Chunk.NEWLINE);
        
        // Телефон
        clientInfo.add(new Chunk("Телефон: " + client.getPhone(), NORMAL_FONT));
        clientInfo.add(Chunk.NEWLINE);
        
        // Email (якщо є)
        if (StringUtils.hasText(client.getEmail())) {
            clientInfo.add(new Chunk("Email: " + client.getEmail(), NORMAL_FONT));
            clientInfo.add(Chunk.NEWLINE);
        }
        
        // Адреса (якщо є)
        if (StringUtils.hasText(client.getAddress())) {
            clientInfo.add(new Chunk("Адреса: " + client.getAddress(), NORMAL_FONT));
            clientInfo.add(Chunk.NEWLINE);
        }
        
        return clientInfo;
    }

    /**
     * Додає таблицю з речами замовлення
     */
    private Paragraph addItemsTableSection(Order order) throws DocumentException {
        Paragraph itemsSection = new Paragraph();
        itemsSection.setSpacingBefore(10);
        itemsSection.setSpacingAfter(10);
        
        // Заголовок розділу
        itemsSection.add(new Chunk("Речі в замовленні", SUBTITLE_FONT));
        itemsSection.add(Chunk.NEWLINE);
        itemsSection.add(Chunk.NEWLINE);
        
        // Створення таблиці
        PdfPTable table = new PdfPTable(7); // 7 колонок
        table.setWidthPercentage(100);
        try {
            table.setWidths(new float[]{0.5f, 2.5f, 1.5f, 1f, 1f, 1f, 1.5f});
        } catch (DocumentException e) {
            log.error("Error setting table widths: {}", e.getMessage());
        }
        
        // Заголовки таблиці
        table.addCell(createCell("№", true));
        table.addCell(createCell("Найменування", true));
        table.addCell(createCell("Категорія", true));
        table.addCell(createCell("Кількість", true));
        table.addCell(createCell("Матеріал", true));
        table.addCell(createCell("Колір", true));
        table.addCell(createCell("Ціна", true));
        
        // Додавання речей до таблиці
        int itemNumber = 1;
        for (OrderItem item : order.getItems()) {
            table.addCell(createCell(String.valueOf(itemNumber++), false));
            table.addCell(createCell(item.getName(), false));
            
            // Додати назву категорії послуги
            String categoryName = "-";
            if (item.getServiceCategory() != null && item.getServiceCategory().getName() != null) {
                categoryName = item.getServiceCategory().getName();
            }
            table.addCell(createCell(categoryName, false));
            
            table.addCell(createCell(String.valueOf(item.getQuantity()), false));
            table.addCell(createCell(item.getMaterial(), false));
            table.addCell(createCell(item.getColor(), false));
            
            // Використовуємо фінальну ціну позиції замовлення
            table.addCell(createCell(String.format("%.2f", item.getFinalPrice()), false));
        }
        
        itemsSection.add(table);
        
        return itemsSection;
    }

    /**
     * Додає розділ з інформацією про плями та дефекти
     */
    private Paragraph addStainsDefectsSection(Order order) {
        Paragraph stainDefectsSection = new Paragraph();
        stainDefectsSection.setSpacingBefore(10);
        stainDefectsSection.setSpacingAfter(10);
        
        // Заголовок
        stainDefectsSection.add(new Chunk("Виявлені плями та дефекти", SUBTITLE_FONT));
        stainDefectsSection.add(Chunk.NEWLINE);
        stainDefectsSection.add(Chunk.NEWLINE);
        
        boolean hasStainsOrDefects = false;
        
        for (OrderItem item : order.getItems()) {
            boolean hasItemStainsOrDefects = (!item.getStains().isEmpty() || !item.getDefects().isEmpty());
            
            if (hasItemStainsOrDefects) {
                hasStainsOrDefects = true;
                // Назва предмету
                stainDefectsSection.add(new Chunk(item.getName() + " (" + item.getMaterial() + ", " + item.getColor() + ")", NORMAL_FONT));
                stainDefectsSection.add(Chunk.NEWLINE);
                
                // Плями
                if (!item.getStains().isEmpty()) {
                    stainDefectsSection.add(new Chunk("Плями: ", SMALL_FONT));
                    for (int i = 0; i < item.getStains().size(); i++) {
                        OrderItemStain stain = item.getStains().get(i);
                        String stainInfo = stain.getType().toString();
                        if (stain.getStainDescription() != null && !stain.getStainDescription().isEmpty()) {
                            stainInfo += " (" + stain.getStainDescription() + ")";
                        }
                        stainDefectsSection.add(new Chunk(stainInfo, SMALL_FONT));
                        if (i < item.getStains().size() - 1) {
                            stainDefectsSection.add(new Chunk(", ", SMALL_FONT));
                        }
                    }
                    stainDefectsSection.add(Chunk.NEWLINE);
                }
                
                // Дефекти
                if (!item.getDefects().isEmpty()) {
                    stainDefectsSection.add(new Chunk("Дефекти: ", SMALL_FONT));
                    for (int i = 0; i < item.getDefects().size(); i++) {
                        OrderItemDefect defect = item.getDefects().get(i);
                        String defectInfo = defect.getType().toString();
                        if (defect.getDescription() != null && !defect.getDescription().isEmpty()) {
                            defectInfo += " (" + defect.getDescription() + ")";
                        }
                        stainDefectsSection.add(new Chunk(defectInfo, SMALL_FONT));
                        if (i < item.getDefects().size() - 1) {
                            stainDefectsSection.add(new Chunk(", ", SMALL_FONT));
                        }
                    }
                    stainDefectsSection.add(Chunk.NEWLINE);
                }
                
                stainDefectsSection.add(Chunk.NEWLINE);
            }
        }
        
        if (!hasStainsOrDefects) {
            stainDefectsSection.add(new Chunk("Плями та дефекти не виявлено", NORMAL_FONT));
            stainDefectsSection.add(Chunk.NEWLINE);
        }
        
        return stainDefectsSection;
    }

    /**
     * Додає розділ з фінансовою інформацією
     */
    private Paragraph addFinancialInfoSection(Order order) {
        Paragraph financialInfo = new Paragraph();
        financialInfo.setSpacingBefore(10);
        financialInfo.setSpacingAfter(10);
        
        // Заголовок
        financialInfo.add(new Chunk("Фінансова інформація", SUBTITLE_FONT));
        financialInfo.add(Chunk.NEWLINE);
        financialInfo.add(Chunk.NEWLINE);
        
        // Створення таблиці для фінансової інформації
        PdfPTable financialTable = new PdfPTable(2);
        financialTable.setWidthPercentage(100);
        
        try {
            financialTable.setWidths(new float[]{3f, 1f});
        } catch (DocumentException e) {
            log.error("Error setting financial table widths: {}", e.getMessage());
        }
        
        // Загальна вартість речей
        financialTable.addCell(createCell("Загальна вартість речей:", false));
        financialTable.addCell(createCell(String.format("%.2f грн", order.getBasePrice()), false));
        
        // Надбавка за терміновість
        if (order.getUrgencyType() != null && !UrgencyType.STANDARD.equals(order.getUrgencyType())) {
            String urgencyName = "";
            String urgencyPercentage = "";
            
            if (UrgencyType.HOURS_48.equals(order.getUrgencyType())) {
                urgencyName = "Термінове (48 год)";
                urgencyPercentage = "+50%";
            } else if (UrgencyType.HOURS_24.equals(order.getUrgencyType())) {
                urgencyName = "Термінове (24 год)";
                urgencyPercentage = "+100%";
            }
            
            if (!urgencyName.isEmpty()) {
                financialTable.addCell(createCell(urgencyName + " " + urgencyPercentage, false));
                // Обчислюємо надбавку як різницю між загальною та базовою ціною
                BigDecimal urgencyCharge = order.getTotalPrice().subtract(order.getBasePrice());
                // У випадку, якщо є знижка, доплата може бути негативною, тоді вважаємо її нулем
                if (urgencyCharge.compareTo(BigDecimal.ZERO) > 0) {
                    financialTable.addCell(createCell(String.format("%.2f грн", urgencyCharge), false));
                } else {
                    financialTable.addCell(createCell("0.00 грн", false));
                }
            }
        }
        
        // Знижка (якщо є)
        if (order.getDiscountType() != null && order.getCustomDiscountPercentage() != null && order.getCustomDiscountPercentage() > 0) {
            financialTable.addCell(createCell("Знижка " + order.getCustomDiscountPercentage() + "%:", false));
            // Приблизний розрахунок суми знижки
            BigDecimal discountAmount = order.getBasePrice().multiply(
                BigDecimal.valueOf(order.getCustomDiscountPercentage()).divide(BigDecimal.valueOf(100))
            );
            financialTable.addCell(createCell(String.format("- %.2f грн", discountAmount), false));
        }
        
        // Разом до сплати (загальна сума)
        PdfPCell totalLabelCell = createCell("Разом до сплати:", true);
        totalLabelCell.setPaddingTop(5);
        financialTable.addCell(totalLabelCell);
        
        PdfPCell totalValueCell = createCell(String.format("%.2f грн", order.getTotalPrice()), true);
        totalValueCell.setPaddingTop(5);
        totalValueCell.setBackgroundColor(BaseColor.LIGHT_GRAY);
        financialTable.addCell(totalValueCell);
        
        // Оплата (якщо замовлення частково або повністю оплачено)
        if (order.getAmountPaid() != null && order.getAmountPaid().compareTo(BigDecimal.ZERO) > 0) {
            financialTable.addCell(createCell("Оплачено:", false));
            financialTable.addCell(createCell(String.format("%.2f грн", order.getAmountPaid()), false));
            
            // Залишок до оплати
            if (order.getAmountDue() != null && order.getAmountDue().compareTo(BigDecimal.ZERO) > 0) {
                financialTable.addCell(createCell("Залишок до оплати:", false));
                financialTable.addCell(createCell(String.format("%.2f грн", order.getAmountDue()), false));
            }
        }
        
        financialInfo.add(financialTable);
        
        return financialInfo;
    }

    /**
     * Додає розділ з юридичною інформацією
     */
    private Paragraph addLegalInfoSection() {
        Paragraph legalInfo = new Paragraph();
        legalInfo.setSpacingBefore(10);
        legalInfo.setSpacingAfter(10);
        
        // Заголовок
        legalInfo.add(new Chunk("Умови та положення", SUBTITLE_FONT));
        legalInfo.add(Chunk.NEWLINE);
        legalInfo.add(Chunk.NEWLINE);
        
        // Текст юридичної інформації
        legalInfo.add(new Chunk(
            "1. Термін зберігання замовлення після виконання - 30 днів. Після завершення цього " +
            "терміну, компанія не несе відповідальності за збереження речей.\n" +
            "2. У разі втрати квитанції, видача замовлення здійснюється за умови пред'явлення документа, що посвідчує особу.\n" +
            "3. Претензії щодо якості приймаються протягом 2 днів з моменту отримання замовлення.\n" +
            "4. Для отримання замовлення необхідно пред'явити цю квитанцію.",
            SMALL_FONT
        ));
        
        return legalInfo;
    }

    /**
     * Додає розділ для підпису
     */
    private Paragraph addSignatureSection() {
        Paragraph signatureSection = new Paragraph();
        signatureSection.setSpacingBefore(20);
        signatureSection.setSpacingAfter(10);
        
        // Заголовок
        signatureSection.add(new Chunk("Підписи", SUBTITLE_FONT));
        signatureSection.add(Chunk.NEWLINE);
        signatureSection.add(Chunk.NEWLINE);
        
        // Поле для підпису співробітника
        signatureSection.add(new Chunk("Співробітник: ___________________", NORMAL_FONT));
        signatureSection.add(Chunk.NEWLINE);
        signatureSection.add(Chunk.NEWLINE);
        
        // Поле для підпису клієнта
        signatureSection.add(new Chunk("Клієнт: ___________________", NORMAL_FONT));
        signatureSection.add(Chunk.NEWLINE);
        
        return signatureSection;
    }

    /**
     * Додає футер до документа
     */
    private void addFooter(Document document, Order order) {
        try {
            // Генеруємо QR-код для відслідковування замовлення
            BufferedImage qrImage = QRCodeGenerator.generateQRCode(
                appUrl + "/tracking/" + order.getId(),
                150, 150
            );
            if (qrImage != null) {
                Image pdfQrImage = Image.getInstance(qrImage, null);
                pdfQrImage.setAlignment(Element.ALIGN_CENTER);
                document.add(pdfQrImage);
            }
        } catch (Exception e) {
            log.warn("Unexpected error adding QR code: {}", e.getMessage());
            // Продовжуємо без QR-коду
        }
        
        // Додавання контактної інформації
        Paragraph footerText = new Paragraph();
        footerText.setAlignment(Element.ALIGN_CENTER);
        footerText.add(new Chunk("Контактна інформація: +380 12 345 6789  |  info@aksi.com  |  www.aksi.com", SMALL_FONT));
        
        try {
            document.add(footerText);
        } catch (DocumentException e) {
            log.warn("Could not add footer text: {}", e.getMessage());
        }
    }

    /**
     * Допоміжний метод для створення комірки таблиці
     */
    private PdfPCell createCell(String text, boolean isHeader) {
        PdfPCell cell = new PdfPCell(new Phrase(text, isHeader ? SUBTITLE_FONT : NORMAL_FONT));
        cell.setPadding(5);
        cell.setBorderWidth(0.5f);
        if (isHeader) {
            cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        }
        return cell;
    }
}
