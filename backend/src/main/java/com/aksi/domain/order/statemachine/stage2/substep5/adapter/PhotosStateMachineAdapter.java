package com.aksi.domain.order.statemachine.stage2.substep5.adapter;

import java.util.Map;

import org.springframework.statemachine.StateContext;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage2.substep5.dto.PhotoDocumentationDTO;
import com.aksi.domain.order.statemachine.stage2.substep5.service.PhotosStepService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * State Machine адаптер для підетапу 2.5: Фотодокументація.
 *
 * Принцип "один файл = одна відповідальність":
 * Координує між State Machine та PhotosStepService.
 *
 * Відповідальності:
 * - Отримання та збереження даних з State Machine контексту
 * - Виклики PhotosStepService для бізнес-операцій
 * - Оновлення контексту після операцій
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class PhotosStateMachineAdapter {

    private final PhotosStepService photosStepService;

    private static final String PHOTOS_DATA_KEY = "photosData";
    private static final String WIZARD_ID_KEY = "wizardId";

    /**
     * Ініціалізувати підетап фотодокументації
     */
    public PhotoDocumentationDTO initializePhotosStep(StateContext<OrderState, OrderEvent> context) {
        log.debug("Ініціалізація підетапу фотодокументації");

        String wizardId = getWizardId(context);
        if (wizardId == null) {
            log.error("Wizard ID не знайдено в контексті");
            return PhotoDocumentationDTO.builder().build();
        }

        // Перевіряємо чи є вже дані фотодокументації
        PhotoDocumentationDTO existingPhotos = getPhotosData(context);
        if (existingPhotos != null) {
            log.debug("Знайдено існуючі дані фотодокументації для wizard: {}", wizardId);
            return existingPhotos;
        }

        // Створюємо нові дані
        PhotoDocumentationDTO newPhotos = PhotoDocumentationDTO.builder().build();
        savePhotosData(context, newPhotos);

        log.info("Підетап фотодокументації ініціалізовано для wizard: {}", wizardId);
        return newPhotos;
    }

    /**
     * Завантажити фотографію
     */
    public PhotoDocumentationDTO uploadPhoto(StateContext<OrderState, OrderEvent> context, MultipartFile file) {
        log.debug("Завантаження фото в State Machine адаптері");

        String wizardId = getWizardId(context);
        PhotoDocumentationDTO currentPhotos = getPhotosData(context);

        if (wizardId == null || currentPhotos == null) {
            log.error("Wizard ID або дані фотодокументації не знайдені");
            return currentPhotos != null ? currentPhotos : PhotoDocumentationDTO.builder().build();
        }

        // Викликаємо сервіс для завантаження
        PhotoDocumentationDTO updatedPhotos = photosStepService.uploadPhoto(wizardId, file, currentPhotos);

        // Зберігаємо оновлені дані в контексті
        savePhotosData(context, updatedPhotos);

        log.info("Фото завантажено через State Machine адаптер для wizard: {}", wizardId);
        return updatedPhotos;
    }

    /**
     * Видалити фотографію
     */
    public PhotoDocumentationDTO deletePhoto(StateContext<OrderState, OrderEvent> context, String photoId) {
        log.debug("Видалення фото {} через State Machine адаптер", photoId);

        String wizardId = getWizardId(context);
        PhotoDocumentationDTO currentPhotos = getPhotosData(context);

        if (wizardId == null || currentPhotos == null) {
            log.error("Wizard ID або дані фотодокументації не знайдені");
            return currentPhotos != null ? currentPhotos : PhotoDocumentationDTO.builder().build();
        }

        // Викликаємо сервіс для видалення
        PhotoDocumentationDTO updatedPhotos = photosStepService.deletePhoto(wizardId, photoId, currentPhotos);

        // Зберігаємо оновлені дані в контексті
        savePhotosData(context, updatedPhotos);

        log.info("Фото {} видалено через State Machine адаптер для wizard: {}", photoId, wizardId);
        return updatedPhotos;
    }

    /**
     * Пропустити фотодокументацію
     */
    public PhotoDocumentationDTO skipPhotos(StateContext<OrderState, OrderEvent> context, String reason) {
        log.debug("Пропуск фотодокументації через State Machine адаптер");

        String wizardId = getWizardId(context);
        PhotoDocumentationDTO currentPhotos = getPhotosData(context);

        if (wizardId == null || currentPhotos == null) {
            log.error("Wizard ID або дані фотодокументації не знайдені");
            return currentPhotos != null ? currentPhotos : PhotoDocumentationDTO.builder().build();
        }

        // Викликаємо сервіс для пропуску
        PhotoDocumentationDTO updatedPhotos = photosStepService.skipPhotos(wizardId, reason, currentPhotos);

        // Зберігаємо оновлені дані в контексті
        savePhotosData(context, updatedPhotos);

        log.info("Фотодокументація пропущена через State Machine адаптер для wizard: {}", wizardId);
        return updatedPhotos;
    }

    /**
     * Скасувати пропуск фотодокументації
     */
    public PhotoDocumentationDTO cancelSkip(StateContext<OrderState, OrderEvent> context) {
        log.debug("Скасування пропуску фотодокументації через State Machine адаптер");

        String wizardId = getWizardId(context);
        PhotoDocumentationDTO currentPhotos = getPhotosData(context);

        if (wizardId == null || currentPhotos == null) {
            log.error("Wizard ID або дані фотодокументації не знайдені");
            return currentPhotos != null ? currentPhotos : PhotoDocumentationDTO.builder().build();
        }

        // Викликаємо сервіс для скасування пропуску
        PhotoDocumentationDTO updatedPhotos = photosStepService.cancelSkip(wizardId, currentPhotos);

        // Зберігаємо оновлені дані в контексті
        savePhotosData(context, updatedPhotos);

        log.info("Пропуск фотодокументації скасовано через State Machine адаптер для wizard: {}", wizardId);
        return updatedPhotos;
    }

    /**
     * Встановити фото як головне
     */
    public PhotoDocumentationDTO setPrimaryPhoto(StateContext<OrderState, OrderEvent> context, String photoId) {
        log.debug("Встановлення головного фото {} через State Machine адаптер", photoId);

        String wizardId = getWizardId(context);
        PhotoDocumentationDTO currentPhotos = getPhotosData(context);

        if (wizardId == null || currentPhotos == null) {
            log.error("Wizard ID або дані фотодокументації не знайдені");
            return currentPhotos != null ? currentPhotos : PhotoDocumentationDTO.builder().build();
        }

        // Викликаємо сервіс для встановлення головного фото
        PhotoDocumentationDTO updatedPhotos = photosStepService.setPrimaryPhoto(wizardId, photoId, currentPhotos);

        // Зберігаємо оновлені дані в контексті
        savePhotosData(context, updatedPhotos);

        log.info("Головне фото {} встановлено через State Machine адаптер для wizard: {}", photoId, wizardId);
        return updatedPhotos;
    }

    /**
     * Валідація готовності підетапу до завершення
     */
    public Boolean validatePhotosStep(StateContext<OrderState, OrderEvent> context) {
        PhotoDocumentationDTO photosData = getPhotosData(context);

        if (photosData == null) {
            log.warn("Дані фотодокументації не знайдені для валідації");
            return false;
        }

        // Використовуємо бізнес-логіку DTO або сервіс для валідації
        Boolean isValid = photosStepService.validateStep(photosData);

        log.debug("Валідація підетапу фотодокументації: {}", isValid);
        return isValid;
    }

    // ===== ПРИВАТНІ МЕТОДИ ДЛЯ РОБОТИ З КОНТЕКСТОМ =====

    /**
     * Отримати ID візарда з контексту
     */
    private String getWizardId(StateContext<OrderState, OrderEvent> context) {
        Map<Object, Object> variables = context.getExtendedState().getVariables();
        return (String) variables.get(WIZARD_ID_KEY);
    }

    /**
     * Отримати дані фотодокументації з контексту
     */
    private PhotoDocumentationDTO getPhotosData(StateContext<OrderState, OrderEvent> context) {
        Map<Object, Object> variables = context.getExtendedState().getVariables();
        return (PhotoDocumentationDTO) variables.get(PHOTOS_DATA_KEY);
    }

    /**
     * Зберегти дані фотодокументації в контексті
     */
    private void savePhotosData(StateContext<OrderState, OrderEvent> context, PhotoDocumentationDTO photosData) {
        Map<Object, Object> variables = context.getExtendedState().getVariables();
        variables.put(PHOTOS_DATA_KEY, photosData);
    }
}
