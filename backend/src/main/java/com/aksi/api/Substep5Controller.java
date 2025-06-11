package com.aksi.api;

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

import com.aksi.domain.order.statemachine.stage2.substep5.adapter.PhotoDocumentationAdapter;
import com.aksi.domain.order.statemachine.stage2.substep5.dto.PhotoDocumentationDTO;
import com.aksi.domain.order.statemachine.stage2.substep5.dto.SubstepResultDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * REST API контроллер для Stage 2 Substep 5 - Фотодокументація.
 *
 * Відповідальність:
 * - Тільки підетап 5: завантаження фото та документації
 * - Делегування до PhotoDocumentationAdapter
 *
 * Принципи:
 * - Один файл = одна відповідальність (тільки substep5)
 * - Тонкий контроллер - тільки HTTP обробка
 * - Вся логіка винесена в адаптер
 */
@RestController
@RequestMapping("/v1/order-wizard/stage2/substep5")
@Tag(name = "Substep 5 API", description = "API для підетапу 5 - Фотодокументація")
public class Substep5Controller {

    private final PhotoDocumentationAdapter photoDocumentationAdapter;

    public Substep5Controller(PhotoDocumentationAdapter photoDocumentationAdapter) {
        this.photoDocumentationAdapter = photoDocumentationAdapter;
    }

    // =================== ФОТОДОКУМЕНТАЦІЯ ===================

    @Operation(summary = "Ініціалізація підетапу 5 - Фотодокументація")
    @PostMapping("/initialize/{itemId}")
    public ResponseEntity<SubstepResultDTO> initializeSubstep5(@PathVariable UUID itemId) {
        return photoDocumentationAdapter.initializePhotoDocumentation(itemId);
    }

    @Operation(summary = "Додавання фотографії")
    @PostMapping("/{sessionId}/photos")
    public ResponseEntity<SubstepResultDTO> addPhoto(
            @PathVariable UUID sessionId,
            @RequestParam("file") MultipartFile file) {
        return photoDocumentationAdapter.addPhoto(sessionId, file);
    }

    @Operation(summary = "Видалення фотографії")
    @DeleteMapping("/{sessionId}/photos/{photoId}")
    public ResponseEntity<SubstepResultDTO> removePhoto(
            @PathVariable UUID sessionId,
            @PathVariable UUID photoId) {
        return photoDocumentationAdapter.removePhoto(sessionId, photoId);
    }

    @Operation(summary = "Завершення фотодокументації")
    @PostMapping("/{sessionId}/complete")
    public ResponseEntity<SubstepResultDTO> completePhotoDocumentation(@PathVariable UUID sessionId) {
        return photoDocumentationAdapter.completePhotoDocumentation(sessionId);
    }

    @Operation(summary = "Отримання статусу фотодокументації")
    @GetMapping("/{sessionId}/status")
    public ResponseEntity<SubstepResultDTO> getDocumentationStatus(@PathVariable UUID sessionId) {
        return photoDocumentationAdapter.getDocumentationStatus(sessionId);
    }

    @Operation(summary = "Отримання даних фотодокументації")
    @GetMapping("/{sessionId}/data")
    public ResponseEntity<PhotoDocumentationDTO> getDocumentationData(@PathVariable UUID sessionId) {
        return photoDocumentationAdapter.getDocumentationData(sessionId);
    }

    @Operation(summary = "Закриття сесії фотодокументації")
    @DeleteMapping("/{sessionId}")
    public ResponseEntity<Void> closeSession(@PathVariable UUID sessionId) {
        return photoDocumentationAdapter.closeSession(sessionId);
    }
}
