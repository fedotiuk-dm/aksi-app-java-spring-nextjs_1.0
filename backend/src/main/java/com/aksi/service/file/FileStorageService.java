package com.aksi.service.file;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * Сервіс для зберігання та управління файлами.
 */
public interface FileStorageService {
    
    /**
     * Зберегти файл у файловій системі або хмарному сховищі.
     *
     * @param file файл для зберігання
     * @return Унікальне ім'я збереженого файлу
     * @throws IOException при помилці зберігання файлу
     */
    String storeFile(MultipartFile file) throws IOException;
    
    /**
     * Отримати URL файлу за його іменем.
     *
     * @param fileName ім'я файлу
     * @return URL для доступу до файлу
     */
    String getFileUrl(String fileName);
    
    /**
     * Видалити файл за його іменем.
     *
     * @param fileName ім'я файлу для видалення
     * @return true, якщо файл успішно видалено
     */
    boolean deleteFile(String fileName);
    
    /**
     * Отримати файл як ресурс за його іменем.
     *
     * @param fileName ім'я файлу
     * @return файл як ресурс або null, якщо файл не знайдено
     * @throws java.io.IOException якщо виникла помилка при доступі до файлу
     */
    org.springframework.core.io.Resource getFileAsResource(String fileName) throws java.io.IOException;
}
