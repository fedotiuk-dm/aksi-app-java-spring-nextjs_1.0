package com.aksi.service.email;

/**
 * Сервіс для відправки електронних листів.
 */
public interface EmailService {

    /**
     * Відправляє простий текстовий лист.
     *
     * @param to адреса отримувача
     * @param subject тема листа
     * @param content текст листа
     * @return true якщо лист успішно відправлено
     */
    boolean sendEmail(String to, String subject, String content);

    /**
     * Відправляє лист з вкладенням.
     *
     * @param to адреса отримувача
     * @param subject тема листа
     * @param content текст листа
     * @param attachmentFilename ім'я файлу вкладення
     * @param attachmentData дані вкладення
     * @param attachmentContentType тип контенту вкладення
     * @return true якщо лист успішно відправлено
     */
    boolean sendEmailWithAttachment(String to, String subject, String content,
                                   String attachmentFilename, byte[] attachmentData,
                                   String attachmentContentType);
}
