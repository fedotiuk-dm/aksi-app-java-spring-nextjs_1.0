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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.aksi.domain.order.dto.OrderItemPhotoDTO;
import com.aksi.domain.order.service.OrderItemPhotoService;
import com.aksi.util.ApiResponseUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST контролер для роботи з фотографіями предметів замовлення.
 */
@RestController
@RequestMapping("/order-items/{itemId}/photos")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Order Management - Item Photos",
     description = "Управління фотографіями предметів замовлень")
public class OrderItemPhotoController {

    private final OrderItemPhotoService orderItemPhotoService;

    /**
     * Отримати всі фотографії для предмета замовлення.
     *
     * @param itemId ID предмета замовлення
     * @return список фотографій
     */
    @GetMapping
    @Operation(summary = "Отримати всі фотографії предмета замовлення",
               description = "Повертає список всіх фотографій для вказаного предмета замовлення")
    @ApiResponse(responseCode = "200", description = "Список фотографій успішно отримано",
                content = @Content(array = @ArraySchema(schema = @Schema(implementation = OrderItemPhotoDTO.class))))
    public ResponseEntity<?> getPhotosByItemId(
            @Parameter(description = "ID предмета замовлення") @PathVariable UUID itemId) {

        log.info("Запит на отримання фотографій для предмета замовлення: {}", itemId);

        try {
            List<OrderItemPhotoDTO> photos = orderItemPhotoService.getPhotosByItemId(itemId);
            return ApiResponseUtils.ok(photos, "Отримано {} фотографій для предмета замовлення: {}",
                photos.size(), itemId);
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Предмет замовлення не знайдено",
                "Не вдалося отримати фотографії для предмета замовлення: {}. Причина: {}",
                itemId, e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні фотографій",
                "Виникла несподівана помилка при отриманні фотографій для предмета замовлення: {}. Причина: {}",
                itemId, e.getMessage());
        }
    }

    /**
     * Завантажити нову фотографію для предмета замовлення.
     *
     * @param itemId ID предмета замовлення
     * @param file файл фотографії
     * @param description опис фотографії (опціонально)
     * @return завантажена фотографія
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Завантажити фотографію предмета замовлення",
               description = "Завантажує нову фотографію для вказаного предмета замовлення")
    @ApiResponse(responseCode = "201", description = "Фотографія успішно завантажена",
                content = @Content(schema = @Schema(implementation = OrderItemPhotoDTO.class)))
    public ResponseEntity<?> uploadPhoto(
            @Parameter(description = "ID предмета замовлення") @PathVariable UUID itemId,
            @Parameter(description = "Файл фотографії") @RequestParam("file") MultipartFile file,
            @Parameter(description = "Опис фотографії (опціонально)") @RequestParam(required = false) String description) {

        log.info("Запит на завантаження фотографії для предмета замовлення: {}", itemId);

        try {
            OrderItemPhotoDTO uploadedPhoto = orderItemPhotoService.uploadPhoto(itemId, file, description);
            return ApiResponseUtils.created(uploadedPhoto, "Фотографію успішно завантажено для предмета замовлення: {}",
                itemId);
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.badRequest("Неможливо завантажити фотографію",
                "Не вдалося завантажити фотографію для предмета замовлення: {}. Причина: {}",
                itemId, e.getMessage());
        } catch (IOException e) {
            return ApiResponseUtils.badRequest("Помилка обробки файлу",
                "Помилка при обробці файлу фотографії для предмета замовлення: {}. Причина: {}",
                itemId, e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при завантаженні фотографії",
                "Виникла несподівана помилка при завантаженні фотографії для предмета замовлення: {}. Причина: {}",
                itemId, e.getMessage());
        }
    }

    /**
     * Оновити анотації та опис для фотографії.
     *
     * @param itemId ID предмета замовлення
     * @param photoId ID фотографії
     * @param annotations JSON з анотаціями (координатами позначок)
     * @param description новий опис фотографії
     * @return оновлена фотографія
     */
    @PutMapping("/{photoId}/annotations")
    @Operation(summary = "Оновити анотації фотографії",
               description = "Оновлює анотації (позначки) та опис для вказаної фотографії")
    @ApiResponse(responseCode = "200", description = "Анотації успішно оновлені",
                content = @Content(schema = @Schema(implementation = OrderItemPhotoDTO.class)))
    public ResponseEntity<?> updatePhotoAnnotations(
            @Parameter(description = "ID предмета замовлення") @PathVariable UUID itemId,
            @Parameter(description = "ID фотографії") @PathVariable UUID photoId,
            @Parameter(description = "JSON з анотаціями") @RequestParam String annotations,
            @Parameter(description = "Новий опис фотографії") @RequestParam(required = false) String description) {

        log.info("Запит на оновлення анотацій для фотографії: {} предмета замовлення: {}", photoId, itemId);

        try {
            OrderItemPhotoDTO updatedPhoto = orderItemPhotoService.updatePhotoAnnotations(photoId, annotations, description);
            return ApiResponseUtils.ok(updatedPhoto, "Анотації для фотографії: {} успішно оновлено", photoId);
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Фотографію не знайдено",
                "Не вдалося оновити анотації для фотографії: {}. Причина: {}",
                photoId, e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при оновленні анотацій",
                "Виникла несподівана помилка при оновленні анотацій для фотографії: {}. Причина: {}",
                photoId, e.getMessage());
        }
    }

    /**
     * Видалити фотографію.
     *
     * @param itemId ID предмета замовлення
     * @param photoId ID фотографії
     * @return статус успішного видалення
     */
    @DeleteMapping("/{photoId}")
    @Operation(summary = "Видалити фотографію",
               description = "Видаляє вказану фотографію предмета замовлення")
    @ApiResponse(responseCode = "204", description = "Фотографія успішно видалена")
    public ResponseEntity<?> deletePhoto(
            @Parameter(description = "ID предмета замовлення") @PathVariable UUID itemId,
            @Parameter(description = "ID фотографії") @PathVariable UUID photoId) {

        log.info("Запит на видалення фотографії: {} предмета замовлення: {}", photoId, itemId);

        try {
            boolean deleted = orderItemPhotoService.deletePhoto(photoId);

            if (deleted) {
                return ApiResponseUtils.noContent("Фотографію: {} успішно видалено", photoId);
            } else {
                return ApiResponseUtils.internalServerError("Не вдалося видалити фотографію",
                    "Не вдалося видалити фотографію: {} предмета замовлення: {}", photoId, itemId);
            }
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Фотографію не знайдено",
                "Не вдалося видалити фотографію: {}. Причина: {}",
                photoId, e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при видаленні фотографії",
                "Виникла несподівана помилка при видаленні фотографії: {} предмета замовлення: {}. Причина: {}",
                photoId, itemId, e.getMessage());
        }
    }

    /**
     * Отримати інформацію про конкретну фотографію.
     *
     * @param itemId ID предмета замовлення
     * @param photoId ID фотографії
     * @return інформація про фотографію
     */
    @GetMapping("/{photoId}")
    @Operation(summary = "Отримати фотографію за ID",
               description = "Отримує інформацію про конкретну фотографію предмета замовлення")
    @ApiResponse(responseCode = "200", description = "Інформація про фотографію успішно отримана",
                content = @Content(schema = @Schema(implementation = OrderItemPhotoDTO.class)))
    public ResponseEntity<?> getPhotoById(
            @Parameter(description = "ID предмета замовлення") @PathVariable UUID itemId,
            @Parameter(description = "ID фотографії") @PathVariable UUID photoId) {

        log.info("Запит на отримання інформації про фотографію: {} предмета замовлення: {}", photoId, itemId);

        try {
            OrderItemPhotoDTO photo = orderItemPhotoService.getPhotoById(photoId);
            return ApiResponseUtils.ok(photo, "Отримано інформацію про фотографію: {}", photoId);
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Фотографію не знайдено",
                "Не вдалося знайти фотографію: {} предмета замовлення: {}. Причина: {}",
                photoId, itemId, e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні інформації про фотографію",
                "Виникла несподівана помилка при отриманні інформації про фотографію: {} предмета замовлення: {}. Причина: {}",
                photoId, itemId, e.getMessage());
        }
    }
}
