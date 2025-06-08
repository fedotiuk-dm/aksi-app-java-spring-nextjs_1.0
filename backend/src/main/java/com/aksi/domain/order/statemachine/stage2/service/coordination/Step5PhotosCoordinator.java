package com.aksi.domain.order.statemachine.stage2.service.coordination;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.aksi.domain.order.statemachine.stage2.substep5.dto.PhotoDocumentationDTO;
import com.aksi.domain.order.statemachine.stage2.substep5.service.PhotosStepService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Координатор для підетапу 2.5: Фотодокументація предмета.
 *
 * Відповідальності:
 * - Координація роботи з PhotosStepService
 * - Управління завантаженням та видаленням фото
 * - Керування процесом пропуску фотографування
 * - Валідація фотодокументації
 *
 * Принцип: один файл = одна логіка координації фотодокументації.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class Step5PhotosCoordinator {

    private final PhotosStepService photosStepService;

    /**
     * Завантажує фото для предмета.
     */
    public PhotoDocumentationDTO uploadPhoto(String wizardId, MultipartFile file, PhotoDocumentationDTO currentPhotos) {
        log.debug("Координація завантаження фото для wizardId: {}", wizardId);
        return photosStepService.uploadPhoto(wizardId, file, currentPhotos);
    }

    /**
     * Видаляє фото за ID.
     */
    public PhotoDocumentationDTO deletePhoto(String wizardId, String photoId, PhotoDocumentationDTO currentPhotos) {
        log.debug("Координація видалення фото {} для wizardId: {}", photoId, wizardId);
        return photosStepService.deletePhoto(wizardId, photoId, currentPhotos);
    }

    /**
     * Пропускає фотографування з вказаною причиною.
     */
    public PhotoDocumentationDTO skipPhotos(String wizardId, String reason, PhotoDocumentationDTO currentPhotos) {
        log.debug("Координація пропуску фотографування для wizardId: {} з причиною: {}", wizardId, reason);
        return photosStepService.skipPhotos(wizardId, reason, currentPhotos);
    }

    /**
     * Скасовує пропуск фотографування.
     */
    public PhotoDocumentationDTO cancelSkip(String wizardId, PhotoDocumentationDTO currentPhotos) {
        log.debug("Координація скасування пропуску фотографування для wizardId: {}", wizardId);
        return photosStepService.cancelSkip(wizardId, currentPhotos);
    }

    /**
     * Встановлює головне фото предмета.
     */
    public PhotoDocumentationDTO setPrimaryPhoto(String wizardId, String photoId, PhotoDocumentationDTO currentPhotos) {
        log.debug("Координація встановлення головного фото {} для wizardId: {}", photoId, wizardId);
        return photosStepService.setPrimaryPhoto(wizardId, photoId, currentPhotos);
    }

    /**
     * Валідує крок фотодокументації.
     */
    public Boolean validateStep(PhotoDocumentationDTO photos) {
        log.debug("Координація валідації кроку фотодокументації");
        return photosStepService.validateStep(photos);
    }

        /**
     * Перевіряє чи є достатньо фото для завершення підетапу.
     */
    public boolean hasSufficientPhotos(PhotoDocumentationDTO photos) {
        log.debug("Координація перевірки достатності фото");

        if (photos == null) {
            return false;
        }

        // Якщо фотографування пропущено з валідною причиною - вважаємо достатнім
        if (Boolean.TRUE.equals(photos.getPhotosSkipped()) && photos.getSkipReason() != null && !photos.getSkipReason().trim().isEmpty()) {
            return true;
        }

        // Якщо є фото - перевіряємо чи є хоча б одне
        return Boolean.TRUE.equals(photos.hasPhotos());
    }

    /**
     * Отримує кількість завантажених фото.
     */
    public int getPhotosCount(PhotoDocumentationDTO photos) {
        log.debug("Координація отримання кількості фото");

        if (photos == null) {
            return 0;
        }

        return photos.getPhotosCount() != null ? photos.getPhotosCount() : 0;
    }

    /**
     * Перевіряє чи можна додати ще фото (обмеження до 5 фото).
     */
    public boolean canAddMorePhotos(PhotoDocumentationDTO photos) {
        log.debug("Координація перевірки можливості додати більше фото");

        final int MAX_PHOTOS = 5;
        int currentCount = getPhotosCount(photos);

        return currentCount < MAX_PHOTOS;
    }

    /**
     * Перевіряє готовність для завершення підетапу фотодокументації.
     */
    public boolean isReadyForCompletion(PhotoDocumentationDTO photos) {
        log.debug("Координація перевірки готовності для завершення");

        // Валідуємо крок і перевіряємо достатність фото
        Boolean stepValid = validateStep(photos);
        boolean sufficientPhotos = hasSufficientPhotos(photos);

        return Boolean.TRUE.equals(stepValid) && sufficientPhotos;
    }
}
