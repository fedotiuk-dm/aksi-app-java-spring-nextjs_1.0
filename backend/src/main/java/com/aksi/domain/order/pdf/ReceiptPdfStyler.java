package com.aksi.domain.order.pdf;

import com.itextpdf.text.Document;
import com.itextpdf.text.Image;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

/**
 * Інтерфейс для стилізації елементів PDF-квитанції.
 * Визначає методи для створення та стилізації різних елементів.
 */
public interface ReceiptPdfStyler {

    /**
     * Додає заголовок до документа.
     * 
     * @param document документ PDF
     * @param title текст заголовка
     * @return створений параграф
     */
    Paragraph addTitle(Document document, String title);
    
    /**
     * Додає лого до документа.
     * 
     * @param document документ PDF
     * @return додане зображення
     */
    Image addLogo(Document document);
    
    /**
     * Додає заголовок секції до документа.
     * 
     * @param document документ PDF
     * @param title текст заголовка секції
     * @return створений параграф
     */
    Paragraph addSectionHeader(Document document, String title);
    
    /**
     * Створює комірку заголовка таблиці.
     * 
     * @param text текст заголовка
     * @return створена комірка
     */
    PdfPCell createHeaderCell(String text);
    
    /**
     * Створює комірку таблиці з текстом.
     * 
     * @param text текст комірки
     * @param isAlternateRow чи це рядок з альтернативним кольором
     * @return створена комірка
     */
    PdfPCell createCell(String text, boolean isAlternateRow);
    
    /**
     * Створює комірку таблиці з ключем та значенням.
     * 
     * @param key ключ
     * @param value значення
     * @param table таблиця, до якої додаються комірки
     */
    void addKeyValueRow(PdfPTable table, String key, String value);
    
    /**
     * Додає лінію для підпису до документа.
     * 
     * @param writer PDF writer
     * @param yPosition позиція лінії по осі Y
     */
    void drawSignatureLine(PdfWriter writer, float yPosition);
    
    /**
     * Додає стилізовану секцію до документа.
     * 
     * @param document документ PDF
     * @param title заголовок секції
     * @param content контент секції (таблиця)
     * @return true, якщо додавання пройшло успішно
     */
    boolean addStyledSection(Document document, String title, PdfPTable content);
    
    /**
     * Створює фразу з форматованим текстом.
     * 
     * @param text текст фрази
     * @param fontStyle стиль шрифту (NORMAL, BOLD, ITALIC)
     * @return створена фраза
     */
    Phrase createPhrase(String text, int fontStyle);
} 
