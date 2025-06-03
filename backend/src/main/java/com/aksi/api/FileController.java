package com.aksi.api;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.service.file.FileStorageService;
import com.aksi.util.ApiResponseUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

/**
 * REST контролер для доступу до файлів.
 */
@RestController
@RequestMapping("/files")
@Slf4j
@Tag(name = "Files API", description = "API для доступу до файлів")
public class FileController {

    private final FileStorageService fileStorageService;

    /**
     * Конструктор для ін'єкції залежностей.
     * @param fileStorageService параметр fileStorageService
     */
    @Autowired
    public FileController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    /**
     * Отримати файл за його іменем.
     *
     * @param fileName ім'я файлу
     * @return файл як ресурс або відповідь з помилкою
     */
    @GetMapping("/{fileName:.+}")
    @Operation(summary = "Отримати файл",
               description = "Повертає файл за його унікальним іменем")
    public ResponseEntity<?> getFile(@PathVariable String fileName) {
        try {
            // Використовуємо сервіс для отримання файлу як ресурсу
            Resource resource = fileStorageService.getFileAsResource(fileName);

            if (resource != null && resource.exists()) {
                // Визначення типу контенту
                String contentType = determineContentType(fileName);

                // Тут ми не використовуємо ApiResponseUtils, оскільки повертаємо безпосередньо файл
                // з додатковими заголовками
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ApiResponseUtils.notFound("Файл не знайдено",
                    "Файл з іменем {} не знайдено у сховищі", fileName);
            }
        } catch (IOException e) {
            return ApiResponseUtils.badRequest("Помилка доступу до файлу",
                "Помилка при доступі до файлу {}: {}", fileName, e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні файлу",
                "Неочікувана помилка при отриманні файлу {}: {}", fileName, e.getMessage());
        }
    }

    /**
     * Визначити тип контенту за розширенням файлу.
     */
    private String determineContentType(String fileName) {
        String extension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();

        return switch (extension) {
            case "jpg", "jpeg" -> "image/jpeg";
            case "png" -> "image/png";
            case "gif" -> "image/gif";
            case "webp" -> "image/webp";
            default -> "application/octet-stream";
        };
    }
}
