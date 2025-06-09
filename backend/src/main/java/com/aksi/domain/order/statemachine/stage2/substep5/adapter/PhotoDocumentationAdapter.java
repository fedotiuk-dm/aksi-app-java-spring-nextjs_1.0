package com.aksi.domain.order.statemachine.stage2.substep5.adapter;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.aksi.domain.order.statemachine.stage2.substep5.dto.PhotoDocumentationDTO;
import com.aksi.domain.order.statemachine.stage2.substep5.dto.SubstepResultDTO;
import com.aksi.domain.order.statemachine.stage2.substep5.service.PhotoDocumentationCoordinationService;

/**
 * REST API адаптер для підетапу 2.5: Фотодокументація.
 * Тільки делегування до CoordinationService.
 */
@RestController
@RequestMapping("/order-wizard/stage2/substep5/photo-documentation")
public class PhotoDocumentationAdapter {

    private final PhotoDocumentationCoordinationService coordinationService;

    public PhotoDocumentationAdapter(PhotoDocumentationCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    /**
     * Ініціалізація фотодокументації для предмета.
     */
    @PostMapping("/initialize/{itemId}")
    public ResponseEntity<SubstepResultDTO> initializePhotoDocumentation(@PathVariable UUID itemId) {
        SubstepResultDTO result = coordinationService.initializePhotoDocumentation(itemId);
        return ResponseEntity.ok(result);
    }

    /**
     * Додавання фотографії.
     */
    @PostMapping("/{sessionId}/photos")
    public ResponseEntity<SubstepResultDTO> addPhoto(
            @PathVariable UUID sessionId,
            @RequestParam("file") MultipartFile file) {

        if (!coordinationService.canAddPhoto(sessionId, file)) {
            return ResponseEntity.badRequest()
                .body(coordinationService.createErrorResult(
                    coordinationService.getCurrentState(sessionId),
                    "Неможливо додати фотографію",
                    "Перевірте розмір файлу та кількість фотографій"
                ));
        }

        SubstepResultDTO result = coordinationService.addPhoto(sessionId, file);
        return ResponseEntity.ok(result);
    }

    /**
     * Видалення фотографії.
     */
    @DeleteMapping("/{sessionId}/photos/{photoId}")
    public ResponseEntity<SubstepResultDTO> removePhoto(
            @PathVariable UUID sessionId,
            @PathVariable UUID photoId) {

        SubstepResultDTO result = coordinationService.removePhoto(sessionId, photoId);
        return ResponseEntity.ok(result);
    }

    /**
     * Завершення фотодокументації.
     */
    @PostMapping("/{sessionId}/complete")
    public ResponseEntity<SubstepResultDTO> completePhotoDocumentation(@PathVariable UUID sessionId) {
        if (!coordinationService.canCompleteDocumentation(sessionId)) {
            return ResponseEntity.badRequest()
                .body(coordinationService.createErrorResult(
                    coordinationService.getCurrentState(sessionId),
                    "Неможливо завершити фотодокументацію",
                    "Додайте принаймні одну фотографію"
                ));
        }

        SubstepResultDTO result = coordinationService.completePhotoDocumentation(sessionId);
        return ResponseEntity.ok(result);
    }

    /**
     * Отримання статусу фотодокументації.
     */
    @GetMapping("/{sessionId}/status")
    public ResponseEntity<SubstepResultDTO> getDocumentationStatus(@PathVariable UUID sessionId) {
        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        SubstepResultDTO result = coordinationService.getPhotoDocumentationStatus(sessionId);
        return ResponseEntity.ok(result);
    }

    /**
     * Отримання даних фотодокументації.
     */
    @GetMapping("/{sessionId}/data")
    public ResponseEntity<PhotoDocumentationDTO> getDocumentationData(@PathVariable UUID sessionId) {
        PhotoDocumentationDTO data = coordinationService.getPhotoDocumentationData(sessionId);

        if (data == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(data);
    }

    /**
     * Закриття сесії фотодокументації.
     */
    @DeleteMapping("/{sessionId}")
    public ResponseEntity<Void> closeSession(@PathVariable UUID sessionId) {
        coordinationService.closeSession(sessionId);
        return ResponseEntity.noContent().build();
    }
}
