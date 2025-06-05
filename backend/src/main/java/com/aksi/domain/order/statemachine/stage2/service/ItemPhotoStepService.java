package com.aksi.domain.order.statemachine.stage2.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.aksi.domain.order.dto.OrderItemPhotoDTO;
import com.aksi.domain.order.service.OrderItemPhotoService;
import com.aksi.domain.order.statemachine.service.OrderWizardPersistenceService;
import com.aksi.domain.order.statemachine.stage2.dto.ItemPhotoDTO;
import com.aksi.domain.order.statemachine.stage2.dto.ItemPhotoDTO.PhotoInfo;
import com.aksi.domain.order.statemachine.stage2.dto.ItemPhotoDTO.PhotoStatus;
import com.aksi.domain.order.statemachine.stage2.dto.TempOrderItemDTO;
import com.aksi.domain.order.statemachine.stage2.mapper.ItemPhotoMapper;
import com.aksi.domain.order.statemachine.stage2.validator.ItemPhotoValidator;

/**
 * Сервіс для управління підетапом 2.5 "Фотодокументація".
 */
@Service
@Transactional(readOnly = true)
public class ItemPhotoStepService {

    private static final Logger logger = LoggerFactory.getLogger(ItemPhotoStepService.class);

    // Ключі для wizard persistence
    private static final String TEMP_ITEM_KEY = "tempOrderItem";
    private static final String PHOTO_KEY = "itemPhoto";

    // Stage та step номери для persistence
    private static final int STAGE_NUMBER = 2;
    private static final int STEP_NUMBER = 5;

    // Обмеження за замовчуванням
    private static final int DEFAULT_MAX_PHOTOS = 5;
    private static final int DEFAULT_MAX_FILE_SIZE_MB = 5;

    private final OrderWizardPersistenceService persistenceService;
    private final OrderItemPhotoService orderItemPhotoService;
    private final ItemPhotoValidator validator;
    private final ItemPhotoMapper mapper;

    public ItemPhotoStepService(
            OrderWizardPersistenceService persistenceService,
            OrderItemPhotoService orderItemPhotoService,
            ItemPhotoValidator validator,
            ItemPhotoMapper mapper) {
        this.persistenceService = persistenceService;
        this.orderItemPhotoService = orderItemPhotoService;
        this.validator = validator;
        this.mapper = mapper;
    }

    /**
     * Завантажує дані для підетапу 2.5 фотодокументації.
     */
    public ItemPhotoDTO loadPhotoStep(String wizardId) {
        logger.debug("Завантаження підетапу 2.5 для візарда: {}", wizardId);

        try {
            // Завантажуємо всі дані wizard
            Map<String, Object> wizardData = persistenceService.loadWizardData(wizardId);

            // Перевіряємо збережені дані підетапу
            Object savedPhotoDataObj = wizardData.get(PHOTO_KEY);
            if (savedPhotoDataObj instanceof ItemPhotoDTO savedPhotoData) {
                logger.debug("Знайдено збережені дані фотодокументації для візарда: {}", wizardId);
                return savedPhotoData;
            }

            // Створюємо нові дані на основі TempOrderItem
            Object tempItemObj = wizardData.get(TEMP_ITEM_KEY);
            TempOrderItemDTO tempItem = tempItemObj instanceof TempOrderItemDTO ?
                (TempOrderItemDTO) tempItemObj : null;

            ItemPhotoDTO photoData = createPhotoDataFromTempItem(tempItem, wizardId);

            // Зберігаємо створені дані
            persistenceService.saveWizardData(wizardId, PHOTO_KEY, photoData, STAGE_NUMBER, STEP_NUMBER);

            logger.info("Створено новий підетап 2.5 для візарда: {}", wizardId);
            return photoData;

        } catch (Exception e) {
            logger.error("Помилка завантаження підетапу 2.5 для візарда {}: {}", wizardId, e.getMessage(), e);
            return createErrorPhotoData("Помилка завантаження даних фотодокументації");
        }
    }

    /**
     * Зберігає дані підетапу 2.5.
     */
    @Transactional
    public ItemPhotoDTO savePhotoStep(String wizardId, ItemPhotoDTO photoData) {
        logger.debug("Збереження підетапу 2.5 для візарда: {}", wizardId);

        try {
            // Валідуємо дані
            if (!validator.validate(photoData)) {
                String errorMessage = "Дані фотодокументації не пройшли валідацію";
                logger.warn("Валідація не пройдена для візарда {}: {}", wizardId, errorMessage);
                return photoData.toBuilder()
                    .hasErrors(true)
                    .errorMessage(errorMessage)
                    .build();
            }

            // Оновлюємо статистику
            photoData.updateTotalPhotos();
            photoData.updateTotalSize();

            // Зберігаємо дані підетапу
            persistenceService.saveWizardData(wizardId, PHOTO_KEY, photoData, STAGE_NUMBER, STEP_NUMBER);

            // Оновлюємо TempOrderItemDTO
            updateTempOrderItemWithPhotoData(wizardId, photoData);

            logger.info("Підетап 2.5 збережено для візарда: {}", wizardId);

            return photoData.toBuilder()
                .hasErrors(false)
                .errorMessage(null)
                .isCompleted(photoData.isReadyToComplete())
                .build();

        } catch (Exception e) {
            logger.error("Помилка збереження підетапу 2.5 для візарда {}: {}", wizardId, e.getMessage(), e);
            return photoData.toBuilder()
                .hasErrors(true)
                .errorMessage("Помилка збереження: " + e.getMessage())
                .build();
        }
    }

    /**
     * Завантажує фотографію для предмета.
     */
    @Transactional
    public ItemPhotoDTO uploadPhoto(String wizardId, MultipartFile file, String description) {
        logger.debug("Завантаження фото для візарда: {}, файл: {}", wizardId, file.getOriginalFilename());

        try {
            // Завантажуємо поточні дані
            ItemPhotoDTO currentData = loadPhotoStep(wizardId);

            // Перевіряємо обмеження
            if (!currentData.canAddMorePhotos()) {
                String errorMessage = String.format("Досягнуто максимальну кількість фото (%d)", currentData.getMaxPhotos());
                logger.warn("Спроба завантажити зайве фото для візарда {}: {}", wizardId, errorMessage);
                currentData.addError(errorMessage);
                return currentData;
            }

            // Валідуємо файл
            if (!validator.validatePhotoFile(file, currentData.getMaxFileSizeMB())) {
                String errorMessage = String.format("Файл %s не відповідає вимогам", file.getOriginalFilename());
                logger.warn("Файл не пройшов валідацію для візарда {}: {}", wizardId, errorMessage);
                currentData.addError(errorMessage);
                return currentData;
            }

            // Отримуємо тимчасовий ID предмета
            UUID tempItemId = getTempItemId(wizardId);

            // Встановлюємо стан завантаження
            currentData.setUploadingState(true, file.getOriginalFilename(), 0);

            // Завантажуємо фото через основний сервіс
            OrderItemPhotoDTO uploadedPhoto = orderItemPhotoService.uploadPhoto(tempItemId, file, description);

            // Перетворюємо в PhotoInfo і додаємо до списку
            PhotoInfo photoInfo = convertToPhotoInfo(uploadedPhoto);
            currentData.addPhoto(photoInfo);

            // Скидаємо стан завантаження
            currentData.setUploadingState(false, null, 100);

            // Зберігаємо оновлені дані
            ItemPhotoDTO savedData = savePhotoStep(wizardId, currentData);

            logger.info("Фото успішно завантажено для візарда: {}, фото ID: {}", wizardId, uploadedPhoto.getId());
            return savedData;

        } catch (Exception e) {
            logger.error("Помилка завантаження фото для візарда {}: {}", wizardId, e.getMessage(), e);

            ItemPhotoDTO errorData = loadPhotoStep(wizardId);
            errorData.setUploadingState(false, null, 0);
            errorData.addError("Помилка завантаження фото: " + e.getMessage());
            return errorData;
        }
    }

    /**
     * Видаляє фотографію.
     */
    @Transactional
    public ItemPhotoDTO deletePhoto(String wizardId, String photoId) {
        logger.debug("Видалення фото {} для візарда: {}", photoId, wizardId);

        try {
            // Завантажуємо поточні дані
            ItemPhotoDTO currentData = loadPhotoStep(wizardId);

            // Видаляємо фото через основний сервіс
            try {
                orderItemPhotoService.deletePhoto(UUID.fromString(photoId));
                logger.debug("Фото {} видалено з БД", photoId);
            } catch (Exception e) {
                logger.warn("Не вдалося видалити фото {} з БД: {}", photoId, e.getMessage());
            }

            // Видаляємо зі списку
            currentData.removePhoto(photoId);

            // Зберігаємо оновлені дані
            ItemPhotoDTO savedData = savePhotoStep(wizardId, currentData);

            logger.info("Фото {} успішно видалено для візарда: {}", photoId, wizardId);
            return savedData;

        } catch (Exception e) {
            logger.error("Помилка видалення фото {} для візарда {}: {}", photoId, wizardId, e.getMessage(), e);

            ItemPhotoDTO errorData = loadPhotoStep(wizardId);
            errorData.addError("Помилка видалення фото: " + e.getMessage());
            return errorData;
        }
    }

    /**
     * Валідує готовність підетапу до завершення.
     */
    public boolean validateCompletionReadiness(String wizardId) {
        logger.debug("Валідація готовності підетапу 2.5 для візарда: {}", wizardId);

        try {
            ItemPhotoDTO photoData = loadPhotoStep(wizardId);
            boolean isReady = photoData.isReadyToComplete();

            logger.debug("Підетап 2.5 готовий до завершення для візарда {}: {}", wizardId, isReady);
            return isReady;

        } catch (Exception e) {
            logger.error("Помилка валідації готовності підетапу 2.5 для візарда {}: {}", wizardId, e.getMessage(), e);
            return false;
        }
    }

    // === Приватні допоміжні методи ===

    /**
     * Створює ItemPhotoDTO на основі TempOrderItemDTO.
     */
    private ItemPhotoDTO createPhotoDataFromTempItem(TempOrderItemDTO tempItem, String wizardId) {
        ItemPhotoDTO.ItemPhotoDTOBuilder builder = ItemPhotoDTO.builder()
            .maxPhotos(DEFAULT_MAX_PHOTOS)
            .maxFileSizeMB(DEFAULT_MAX_FILE_SIZE_MB)
            .photosRequired(false)
            .showCameraButton(true)
            .showUploadButton(true)
            .showPreviews(true)
            .compressionEnabled(true)
            .compressionQuality(80)
            .isLoading(false);

        // Якщо є дані про фото в TempOrderItem - завантажуємо їх
        if (tempItem != null && tempItem.hasPhotos() && tempItem.getPhotoIds() != null) {
            List<PhotoInfo> existingPhotos = new ArrayList<>();
            // Можна додати логіку завантаження існуючих фото
            builder.uploadedPhotos(existingPhotos);
        }

        ItemPhotoDTO photoData = builder.build();
        photoData.updateTotalPhotos();
        photoData.updateTotalSize();

        return photoData;
    }

    /**
     * Оновлює TempOrderItemDTO з даними фотодокументації.
     */
    private void updateTempOrderItemWithPhotoData(String wizardId, ItemPhotoDTO photoData) {
        try {
            Map<String, Object> wizardData = persistenceService.loadWizardData(wizardId);
            Object tempItemObj = wizardData.get(TEMP_ITEM_KEY);

            if (tempItemObj instanceof TempOrderItemDTO tempItem) {
                List<String> photoIds = photoData.getUploadedPhotos().stream()
                    .map(PhotoInfo::getId)
                    .toList();

                List<String> photoUrls = photoData.getUploadedPhotos().stream()
                    .map(PhotoInfo::getFileUrl)
                    .toList();

                TempOrderItemDTO updatedItem = mapper.updateTempOrderItemWithPhotoData(
                    tempItem, photoData, photoIds, photoUrls);

                persistenceService.saveWizardData(wizardId, TEMP_ITEM_KEY, updatedItem, STAGE_NUMBER, STEP_NUMBER);
            }

        } catch (Exception e) {
            logger.error("Помилка оновлення TempOrderItem для візарда {}: {}", wizardId, e.getMessage(), e);
        }
    }

    /**
     * Створює DTO з помилкою.
     */
    private ItemPhotoDTO createErrorPhotoData(String errorMessage) {
        return ItemPhotoDTO.builder()
            .maxPhotos(DEFAULT_MAX_PHOTOS)
            .maxFileSizeMB(DEFAULT_MAX_FILE_SIZE_MB)
            .hasErrors(true)
            .errorMessage(errorMessage)
            .isLoading(false)
            .build();
    }

    /**
     * Перетворює OrderItemPhotoDTO у PhotoInfo.
     */
    private PhotoInfo convertToPhotoInfo(OrderItemPhotoDTO photoDTO) {
        return PhotoInfo.builder()
            .id(photoDTO.getId().toString())
            .originalFileName("photo_" + photoDTO.getId().toString())
            .fileUrl(photoDTO.getFileUrl())
            .thumbnailUrl(photoDTO.getThumbnailUrl())
            .fileSizeBytes(null)
            .fileSizeMB(null)
            .mimeType("image/jpeg")
            .width(null)
            .height(null)
            .description(photoDTO.getDescription())
            .uploadedAt(photoDTO.getCreatedAt())
            .status(PhotoStatus.UPLOADED)
            .build();
    }

    /**
     * Отримує тимчасовий ID предмета для завантаження фото.
     */
    private UUID getTempItemId(String wizardId) {
        String tempIdString = "temp-item-" + wizardId;
        return UUID.nameUUIDFromBytes(tempIdString.getBytes());
    }
}
