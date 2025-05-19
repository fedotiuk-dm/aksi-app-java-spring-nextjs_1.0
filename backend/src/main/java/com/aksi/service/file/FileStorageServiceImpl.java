package com.aksi.service.file;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

/**
 * Реалізація сервісу для зберігання та управління файлами.
 */
@Service
@Slf4j
public class FileStorageServiceImpl implements FileStorageService {

    private final Path fileStorageLocation;

    public FileStorageServiceImpl() {
        this.fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();
    }

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(fileStorageLocation);
            log.info("Директорія для зберігання файлів створена: {}", fileStorageLocation);
        } catch (IOException | SecurityException e) {
            log.error("Не вдалося створити директорію для зберігання файлів: {}", e.getMessage());
        }
    }

    @Override
    public String storeFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Файл не може бути пустим");
        }

        // Генеруємо унікальне ім'я файлу
        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";

        if (originalFilename != null && !originalFilename.isEmpty()) {
            String cleanName = StringUtils.cleanPath(originalFilename);
            int lastDotIndex = cleanName.lastIndexOf(".");
            if (lastDotIndex > 0) {
                fileExtension = cleanName.substring(lastDotIndex);
            }
        }
        String fileName = UUID.randomUUID().toString() + fileExtension;

        // Зберігаємо файл
        Path targetLocation = fileStorageLocation.resolve(fileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        log.info("Файл збережено: {}", fileName);
        return fileName;
    }

    @Override
    public String getFileUrl(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            return null;
        }

        return "/api/files/" + fileName;
    }

    @Override
    public boolean deleteFile(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            return false;
        }

        try {
            Path filePath = fileStorageLocation.resolve(fileName);
            return Files.deleteIfExists(filePath);
        } catch (IOException e) {
            log.error("Помилка при видаленні файлу {}: {}", fileName, e.getMessage());
            return false;
        }
    }

    @Override
    public Resource getFileAsResource(String fileName) throws IOException {
        if (fileName == null || fileName.isEmpty()) {
            return null;
        }

        Path filePath = fileStorageLocation.resolve(fileName).normalize();
        Resource resource = new UrlResource(filePath.toUri());

        if (resource.exists()) {
            return resource;
        } else {
            log.warn("Файл не знайдено: {}", fileName);
            return null;
        }
    }
}
