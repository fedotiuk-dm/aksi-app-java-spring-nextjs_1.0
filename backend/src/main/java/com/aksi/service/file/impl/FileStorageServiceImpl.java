package com.aksi.service.file.impl;

import com.aksi.service.file.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.InvalidPathException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * Реалізація сервісу для зберігання файлів у файловій системі.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class FileStorageServiceImpl implements FileStorageService {

    @Value("${app.file-storage.upload-dir:./uploads}")
    private String uploadDir;
    
    @Value("${app.base-url:http://backend:8080}")
    private String baseUrl;

    /**
     * Зберегти файл у файловій системі
     */
    @Override
    public String storeFile(MultipartFile file) throws IOException {
        // Перевірка, що файл не пустий
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot store empty file");
        }
        
        // Отримання оригінального імені файлу і генерація унікального імені
        String rawFilename = file.getOriginalFilename();
        String originalFilename = StringUtils.cleanPath(rawFilename != null ? rawFilename : "unknown");
        String fileExtension = getFileExtension(originalFilename);
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
        
        // Створення директорії для зберігання, якщо вона не існує
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Шлях до файлу
        Path destinationFile = uploadPath.resolve(uniqueFileName);
        
        // Копіювання файлу у вказане місце призначення
        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
        }
        
        log.info("Stored file {} as {}", originalFilename, uniqueFileName);
        
        return uniqueFileName;
    }

    /**
     * Отримати URL для доступу до файлу
     */
    @Override
    public String getFileUrl(String fileName) {
        return ServletUriComponentsBuilder.fromUriString(baseUrl)
                .path("/api/files/")
                .path(fileName)
                .toUriString();
    }

    /**
     * Видалити файл
     */
    @Override
    public boolean deleteFile(String fileName) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(fileName);
            return Files.deleteIfExists(filePath);
        } catch (IOException e) {
            log.error("Error deleting file: {}", fileName, e);
            return false;
        }
    }
    
    /**
     * Отримати файл як ресурс
     */
    @Override
    public Resource getFileAsResource(String fileName) throws IOException {
        try {
            Path filePath = Paths.get(uploadDir).resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                log.warn("File not found or not readable: {}", fileName);
                return null;
            }
        } catch (IOException e) {
            log.error("Error accessing file resource: {}", fileName, e);
            throw new IOException("Could not read file: " + fileName, e);
        } catch (InvalidPathException e) {
            log.error("Error getting file as resource, invalid path: {}", fileName, e);
            throw new IOException("Could not read file due to invalid path: " + fileName, e);
        }
    }
    
    /**
     * Отримати розширення файлу з його імені
     */
    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex > 0) {
            return filename.substring(lastDotIndex);
        }
        return "";
    }
}
