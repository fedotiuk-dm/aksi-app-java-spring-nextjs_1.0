package com.aksi.domain.order.statemachine.stage2.substep5.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.aksi.domain.order.dto.OrderItemPhotoDTO;
import com.aksi.service.file.FileStorageService;

/**
 * Сервіс операцій для підетапу 2.5: Фотодокументація.
 * Тонка обгортка для domain сервісів.
 */
@Service
public class PhotoDocumentationOperationsService {

    private final FileStorageService fileStorageService;

    public PhotoDocumentationOperationsService(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    /**
     * Збереження файлу фотографії.
     */
    public String storePhotoFile(MultipartFile file) throws IOException {
        return fileStorageService.storeFile(file);
    }

    /**
     * Отримання URL файлу.
     */
    public String getPhotoUrl(String fileName) {
        return fileStorageService.getFileUrl(fileName);
    }

    /**
     * Видалення файлу фотографії.
     */
    public boolean deletePhotoFile(String fileName) {
        return fileStorageService.deleteFile(fileName);
    }

    /**
     * Створення DTO фотографії на основі збереженого файлу.
     */
    public OrderItemPhotoDTO createPhotoDTO(UUID itemId, String fileName, String originalName) {
        String fileUrl = getPhotoUrl(fileName);

        return OrderItemPhotoDTO.builder()
                .id(UUID.randomUUID())
                .itemId(itemId)
                .fileUrl(fileUrl)
                .thumbnailUrl(fileUrl) // Поки використовуємо той самий URL
                .description("Фото предмета: " + originalName)
                .createdAt(LocalDateTime.now())
                .build();
    }

    /**
     * Перевірка існування файлу.
     */
    public boolean photoFileExists(String fileName) {
        try {
            return fileStorageService.getFileAsResource(fileName) != null;
        } catch (IOException e) {
            return false;
        }
    }

    /**
     * Отримання розміру файлу в байтах.
     */
    public long getFileSize(MultipartFile file) {
        return file != null ? file.getSize() : 0L;
    }

    /**
     * Отримання типу контенту файлу.
     */
    public String getContentType(MultipartFile file) {
        return file != null ? file.getContentType() : null;
    }

    /**
     * Отримання оригінального імені файлу.
     */
    public String getOriginalFileName(MultipartFile file) {
        return file != null ? file.getOriginalFilename() : null;
    }

    /**
     * Перевірка чи файл є зображенням.
     */
    public boolean isImageFile(MultipartFile file) {
        String contentType = getContentType(file);
        return contentType != null && contentType.startsWith("image/");
    }
}
