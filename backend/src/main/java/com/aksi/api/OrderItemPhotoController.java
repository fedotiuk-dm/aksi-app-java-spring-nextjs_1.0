package com.aksi.api;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.aksi.dto.order.OrderItemPhotoDto;
import com.aksi.service.order.OrderItemPhotoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST контролер для управління фотографіями предметів замовлення.
 */
@RestController
@RequestMapping("/order-items")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Order Item Photos API", description = "API для управління фотографіями предметів замовлення")
public class OrderItemPhotoController {

    private final OrderItemPhotoService orderItemPhotoService;

    /**
     * Завантажити фотографію для предмета замовлення
     *
     * @param itemId ID предмета замовлення
     * @param file файл зображення
     * @param description опис фотографії (опціонально)
     * @return DTO завантаженої фотографії
     */
    @PostMapping(value = "/{itemId}/photos", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Завантажити фотографію",
               description = "Завантажує нову фотографію для предмета замовлення")
    public ResponseEntity<OrderItemPhotoDto> uploadPhoto(
            @Parameter(description = "ID предмета замовлення")
            @PathVariable UUID itemId,
            
            @Parameter(description = "Файл зображення для завантаження")
            @RequestPart("file") MultipartFile file,
            
            @Parameter(description = "Опис фотографії (опціонально)")
            @RequestPart(name = "description", required = false) String description) {
        
        try {
            log.debug("REST request to upload photo for order item ID: {}", itemId);
            OrderItemPhotoDto photoDto = orderItemPhotoService.uploadPhoto(itemId, file, description);
            return ResponseEntity.ok(photoDto);
        } catch (IOException e) {
            log.error("Error uploading photo for order item ID: {}", itemId, e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Отримати всі фотографії для предмета замовлення
     *
     * @param itemId ID предмета замовлення
     * @return список DTO фотографій
     */
    @GetMapping("/{itemId}/photos")
    @Operation(summary = "Отримати всі фотографії",
               description = "Повертає всі фотографії для конкретного предмета замовлення")
    public ResponseEntity<List<OrderItemPhotoDto>> getItemPhotos(
            @Parameter(description = "ID предмета замовлення")
            @PathVariable UUID itemId) {
        
        log.debug("REST request to get all photos for order item ID: {}", itemId);
        List<OrderItemPhotoDto> photos = orderItemPhotoService.getPhotosForOrderItem(itemId);
        return ResponseEntity.ok(photos);
    }

    /**
     * Отримати конкретну фотографію за її ID
     *
     * @param itemId ID предмета замовлення
     * @param photoId ID фотографії
     * @return DTO фотографії
     */
    @GetMapping("/{itemId}/photos/{photoId}")
    @Operation(summary = "Отримати фотографію",
               description = "Повертає конкретну фотографію за її ID")
    public ResponseEntity<OrderItemPhotoDto> getPhoto(
            @Parameter(description = "ID предмета замовлення")
            @PathVariable UUID itemId,
            
            @Parameter(description = "ID фотографії")
            @PathVariable UUID photoId) {
        
        log.debug("REST request to get photo ID: {} for order item ID: {}", photoId, itemId);
        OrderItemPhotoDto photo = orderItemPhotoService.getPhoto(photoId);
        
        // Перевірка, що фотографія належить до вказаного предмета замовлення
        if (!photo.getOrderItemId().equals(itemId)) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(photo);
    }

    /**
     * Оновити деталі фотографії (опис та/або анотації)
     *
     * @param itemId ID предмета замовлення
     * @param photoId ID фотографії
     * @param description новий опис фотографії
     * @param annotationData нові дані анотацій
     * @return оновлене DTO фотографії
     */
    @PutMapping("/{itemId}/photos/{photoId}")
    @Operation(summary = "Оновити деталі фотографії",
               description = "Оновлює опис та/або анотації фотографії")
    public ResponseEntity<OrderItemPhotoDto> updatePhotoDetails(
            @Parameter(description = "ID предмета замовлення")
            @PathVariable UUID itemId,
            
            @Parameter(description = "ID фотографії")
            @PathVariable UUID photoId,
            
            @Parameter(description = "Новий опис фотографії (опціонально)")
            @RequestParam(required = false) String description,
            
            @Parameter(description = "Нові дані анотацій у форматі JSON (опціонально)")
            @RequestParam(required = false) String annotationData) {
        
        log.debug("REST request to update details for photo ID: {} of order item ID: {}", photoId, itemId);
        
        // Отримуємо фотографію, щоб перевірити, що вона належить до вказаного предмета замовлення
        OrderItemPhotoDto existingPhoto = orderItemPhotoService.getPhoto(photoId);
        if (!existingPhoto.getOrderItemId().equals(itemId)) {
            return ResponseEntity.notFound().build();
        }
        
        OrderItemPhotoDto updatedPhoto = orderItemPhotoService.updatePhotoDetails(photoId, description, annotationData);
        return ResponseEntity.ok(updatedPhoto);
    }

    /**
     * Видалити фотографію
     *
     * @param itemId ID предмета замовлення
     * @param photoId ID фотографії
     * @return статус видалення
     */
    @DeleteMapping("/{itemId}/photos/{photoId}")
    @Operation(summary = "Видалити фотографію",
               description = "Видаляє фотографію за її ID")
    public ResponseEntity<Void> deletePhoto(
            @Parameter(description = "ID предмета замовлення")
            @PathVariable UUID itemId,
            
            @Parameter(description = "ID фотографії")
            @PathVariable UUID photoId) {
        
        log.debug("REST request to delete photo ID: {} of order item ID: {}", photoId, itemId);
        
        // Отримуємо фотографію, щоб перевірити, що вона належить до вказаного предмета замовлення
        try {
            OrderItemPhotoDto existingPhoto = orderItemPhotoService.getPhoto(photoId);
            if (!existingPhoto.getOrderItemId().equals(itemId)) {
                return ResponseEntity.notFound().build();
            }
            
            orderItemPhotoService.deletePhoto(photoId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Error deleting photo ID: {}", photoId, e);
            return ResponseEntity.notFound().build();
        }
    }
}
