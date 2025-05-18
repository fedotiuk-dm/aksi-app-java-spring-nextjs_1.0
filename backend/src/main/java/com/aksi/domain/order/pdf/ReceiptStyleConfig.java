package com.aksi.domain.order.pdf;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.pdf.BaseFont;

import lombok.Getter;

/**
 * Конфігурація стилів для PDF-квитанцій.
 * Містить константи кольорів, шрифтів та інших елементів стилізації.
 */
@Component
@Getter
public class ReceiptStyleConfig {

    // Шляхи до ресурсів
    private final String logoPath;
    private final String primaryFontPath;
    private final String secondaryFontPath;

    // Кольори
    private final BaseColor brandPrimaryColor = new BaseColor(0, 112, 192); // Синій AKSI
    private final BaseColor brandSecondaryColor = new BaseColor(232, 242, 252); // Світло-синій
    private final BaseColor tableHeaderColor = new BaseColor(240, 240, 240);
    private final BaseColor tableBorderColor = new BaseColor(200, 200, 200);
    private final BaseColor alternateRowColor = new BaseColor(245, 245, 250);

    // Розміри
    private final float titleFontSize = 16f;
    private final float headerFontSize = 12f;
    private final float normalFontSize = 10f;
    private final float smallFontSize = 8f;
    private final float sectionPadding = 10f;
    private final float cellPadding = 5f;

    // Шрифти
    private BaseFont primaryBaseFont;
    private BaseFont secondaryBaseFont;
    private Font titleFont;
    private Font headerFont;
    private Font normalFont;
    private Font smallFont;
    private Font boldFont;

    public ReceiptStyleConfig(
            @Value("${receipt.style.logo-path:static/images/logo.png}") String logoPath,
            @Value("${receipt.style.primary-font:static/fonts/DejaVuSans.ttf}") String primaryFontPath,
            @Value("${receipt.style.secondary-font:static/fonts/DejaVuSerif.ttf}") String secondaryFontPath) {
        this.logoPath = logoPath;
        this.primaryFontPath = primaryFontPath;
        this.secondaryFontPath = secondaryFontPath;
        initializeFonts();
    }

    /**
     * Ініціалізація шрифтів при створенні конфігурації.
     */
    private void initializeFonts() {
        try {
            // Спробуємо завантажити користувацькі шрифти
            this.primaryBaseFont = BaseFont.createFont(primaryFontPath, BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
            this.secondaryBaseFont = BaseFont.createFont(secondaryFontPath, BaseFont.IDENTITY_H, BaseFont.EMBEDDED);

            // Створюємо шрифти з різними стилями
            this.titleFont = new Font(primaryBaseFont, titleFontSize, Font.BOLD, brandPrimaryColor);
            this.headerFont = new Font(primaryBaseFont, headerFontSize, Font.BOLD);
            this.normalFont = new Font(primaryBaseFont, normalFontSize, Font.NORMAL);
            this.smallFont = new Font(secondaryBaseFont, smallFontSize, Font.NORMAL);
            this.boldFont = new Font(primaryBaseFont, normalFontSize, Font.BOLD);
        } catch (com.itextpdf.text.DocumentException | java.io.IOException e) {
            // У випадку помилки використовуємо стандартні шрифти
            FontFactory.register(FontFactory.HELVETICA, "default");
            this.titleFont = FontFactory.getFont(FontFactory.HELVETICA, titleFontSize, Font.BOLD, brandPrimaryColor);
            this.headerFont = FontFactory.getFont(FontFactory.HELVETICA, headerFontSize, Font.BOLD);
            this.normalFont = FontFactory.getFont(FontFactory.HELVETICA, normalFontSize, Font.NORMAL);
            this.smallFont = FontFactory.getFont(FontFactory.HELVETICA, smallFontSize, Font.NORMAL);
            this.boldFont = FontFactory.getFont(FontFactory.HELVETICA, normalFontSize, Font.BOLD);
        }
    }

    /**
     * Створює шрифт з базового шрифту з новими параметрами.
     *
     * @param baseFont базовий шрифт
     * @param size розмір шрифту
     * @param style стиль шрифту (Font.NORMAL, Font.BOLD, тощо)
     * @param color колір шрифту
     * @return новий об'єкт шрифту
     */
    public Font createFont(BaseFont baseFont, float size, int style, BaseColor color) {
        return new Font(baseFont != null ? baseFont : primaryBaseFont, size, style, color);
    }
} 