package com.aksi.domain.order.statemachine.stage2.mapper;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.dto.OrderItemPhotoDTO;
import com.aksi.domain.order.statemachine.stage2.dto.ItemPhotoDTO;
import com.aksi.domain.order.statemachine.stage2.dto.ItemPhotoDTO.PhotoInfo;
import com.aksi.domain.order.statemachine.stage2.dto.ItemPhotoDTO.PhotoStatus;
import com.aksi.domain.order.statemachine.stage2.dto.TempOrderItemDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Маппер для підетапу 2.5 "Фотодокументація".
 *
 * Відповідає за:
 * - Конвертацію між ItemPhotoDTO та TempOrderItemDTO
 * - Перетворення OrderItemPhotoDTO у PhotoInfo
 * - Серіалізацію/десеріалізацію JSON даних
 * - Оновлення TempOrderItemDTO з даними фотодокументації
 */
@Component
public class ItemPhotoMapper {

    private static final Logger logger = LoggerFactory.getLogger(ItemPhotoMapper.class);

    private final ObjectMapper objectMapper;

    public ItemPhotoMapper(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    /**
     * Перетворює TempOrderItemDTO у ItemPhotoDTO.
     */
    public ItemPhotoDTO toItemPhotoDTO(TempOrderItemDTO tempItem) {
        if (tempItem == null) {
            logger.debug("TempOrderItemDTO є null, повертаємо порожній ItemPhotoDTO");
            return createEmptyPhotoDTO();
        }

        try {
            List<PhotoInfo> photoInfos = new ArrayList<>();

            // Якщо є дані про фото - завантажуємо їх
            if (tempItem.getPhotoIds() != null && tempItem.getPhotoUrls() != null) {
                photoInfos = convertToPhotoInfoList(tempItem.getPhotoIds(), tempItem.getPhotoUrls());
            }

            ItemPhotoDTO photoDTO = ItemPhotoDTO.builder()
                .uploadedPhotos(photoInfos)
                .maxPhotos(5) // За замовчуванням
                .maxFileSizeMB(5) // За замовчуванням
                .photosRequired(false) // За замовчуванням фото не обов'язкові
                .showCameraButton(true)
                .showUploadButton(true)
                .showPreviews(true)
                .compressionEnabled(true)
                .compressionQuality(80)
                .isLoading(false)
                .hasErrors(false)
                .build();

            // Оновлюємо статистику
            photoDTO.updateTotalPhotos();
            photoDTO.updateTotalSize();

            logger.debug("Перетворено TempOrderItemDTO у ItemPhotoDTO з {} фото", photoInfos.size());
            return photoDTO;

        } catch (Exception e) {
            logger.error("Помилка перетворення TempOrderItemDTO у ItemPhotoDTO: {}", e.getMessage(), e);
            return createErrorPhotoDTO("Помилка завантаження даних фото");
        }
    }

    /**
     * Оновлює TempOrderItemDTO з даними фотодокументації.
     */
    public TempOrderItemDTO updateTempOrderItemWithPhotoData(
            TempOrderItemDTO tempItem,
            ItemPhotoDTO photoData,
            List<String> photoIds,
            List<String> photoUrls) {

        if (tempItem == null) {
            logger.warn("TempOrderItemDTO є null, неможливо оновити");
            return null;
        }

        try {
            // Створюємо копію TempOrderItemDTO з оновленими даними фото
            TempOrderItemDTO.TempOrderItemDTOBuilder builder = TempOrderItemDTO.builder();

            // Копіюємо всі існуючі дані
            builder.category(tempItem.getCategory())
                   .name(tempItem.getName())
                   .unitOfMeasure(tempItem.getUnitOfMeasure())
                   .quantity(tempItem.getQuantity())
                   .description(tempItem.getDescription())
                   .material(tempItem.getMaterial())
                   .color(tempItem.getColor())
                   .fillerType(tempItem.getFillerType())
                   .fillerCompressed(tempItem.getFillerCompressed())
                   .wearDegree(tempItem.getWearDegree())
                   .stains(tempItem.getStains())
                   .otherStains(tempItem.getOtherStains())
                   .defectsAndRisks(tempItem.getDefectsAndRisks())
                   .defectsNotes(tempItem.getDefectsNotes())
                   .noGuaranteeReason(tempItem.getNoGuaranteeReason())
                   .unitPrice(tempItem.getUnitPrice())
                   .totalPrice(tempItem.getTotalPrice())
                   .appliedModifiers(tempItem.getAppliedModifiers())
                   .priceCalculationDetails(tempItem.getPriceCalculationDetails())
                   .specialInstructions(tempItem.getSpecialInstructions())
                   .defects(tempItem.getDefects())
                   .isValid(tempItem.getIsValid())
                   .validationErrors(tempItem.getValidationErrors());

            // Оновлюємо дані про фото
            builder.photoIds(photoIds != null ? new ArrayList<>(photoIds) : new ArrayList<>())
                   .photoUrls(photoUrls != null ? new ArrayList<>(photoUrls) : new ArrayList<>())
                   .hasPhotos(photoData != null && photoData.hasPhotos());

            // Встановлюємо крок візарда на 5 (фотодокументація)
            builder.wizardStep(5);

            TempOrderItemDTO updatedItem = builder.build();

            logger.debug("TempOrderItemDTO оновлено з {} фото",
                photoIds != null ? photoIds.size() : 0);

            return updatedItem;

        } catch (Exception e) {
            logger.error("Помилка оновлення TempOrderItemDTO з даними фото: {}", e.getMessage(), e);
            return tempItem; // Повертаємо оригінальний об'єкт при помилці
        }
    }

        /**
     * Перетворює OrderItemPhotoDTO у PhotoInfo.
     */
    public PhotoInfo toPhotoInfo(OrderItemPhotoDTO photoDTO) {
        if (photoDTO == null) {
            return null;
        }

        try {
            return PhotoInfo.builder()
                .id(photoDTO.getId().toString())
                .originalFileName("photo_" + photoDTO.getId().toString()) // Генеруємо назву файлу
                .fileUrl(photoDTO.getFileUrl())
                .thumbnailUrl(photoDTO.getThumbnailUrl())
                .fileSizeBytes(null) // Розмір не доступний в поточному DTO
                .fileSizeMB(null) // Розмір не доступний в поточному DTO
                .mimeType("image/jpeg") // За замовчуванням
                .width(null) // Розміри не доступні в поточному DTO
                .height(null) // Розміри не доступні в поточному DTO
                .description(photoDTO.getDescription())
                .uploadedAt(photoDTO.getCreatedAt())
                .status(PhotoStatus.UPLOADED)
                .build();

        } catch (Exception e) {
            logger.error("Помилка перетворення OrderItemPhotoDTO у PhotoInfo: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * Перетворює список OrderItemPhotoDTO у список PhotoInfo.
     */
    public List<PhotoInfo> toPhotoInfoList(List<OrderItemPhotoDTO> photoDTOs) {
        if (photoDTOs == null || photoDTOs.isEmpty()) {
            return new ArrayList<>();
        }

        return photoDTOs.stream()
            .map(this::toPhotoInfo)
            .filter(photoInfo -> photoInfo != null)
            .collect(Collectors.toList());
    }

    /**
     * Серіалізує список PhotoInfo у JSON.
     */
    public String serializePhotoInfoList(List<PhotoInfo> photoInfos) {
        if (photoInfos == null || photoInfos.isEmpty()) {
            return "[]";
        }

        try {
            return objectMapper.writeValueAsString(photoInfos);
        } catch (JsonProcessingException e) {
            logger.error("Помилка серіалізації списку PhotoInfo: {}", e.getMessage(), e);
            return "[]";
        }
    }

    /**
     * Десеріалізує JSON у список PhotoInfo.
     */
    public List<PhotoInfo> deserializePhotoInfoList(String json) {
        if (json == null || json.trim().isEmpty() || "null".equals(json)) {
            return new ArrayList<>();
        }

        try {
            PhotoInfo[] photoArray = objectMapper.readValue(json, PhotoInfo[].class);
            return photoArray != null ? List.of(photoArray) : new ArrayList<>();
        } catch (JsonProcessingException e) {
            logger.error("Помилка десеріалізації JSON у список PhotoInfo: {}", e.getMessage(), e);
            return new ArrayList<>();
        }
    }

    /**
     * Серіалізує список рядків у JSON.
     */
    public String serializeStringList(List<String> strings) {
        if (strings == null || strings.isEmpty()) {
            return "[]";
        }

        try {
            return objectMapper.writeValueAsString(strings);
        } catch (JsonProcessingException e) {
            logger.error("Помилка серіалізації списку рядків: {}", e.getMessage(), e);
            return "[]";
        }
    }

    /**
     * Десеріалізує JSON у список рядків.
     */
    public List<String> deserializeStringList(String json) {
        if (json == null || json.trim().isEmpty() || "null".equals(json)) {
            return new ArrayList<>();
        }

        try {
            String[] stringArray = objectMapper.readValue(json, String[].class);
            return stringArray != null ? List.of(stringArray) : new ArrayList<>();
        } catch (JsonProcessingException e) {
            logger.error("Помилка десеріалізації JSON у список рядків: {}", e.getMessage(), e);
            return new ArrayList<>();
        }
    }

    /**
     * Перевіряє, чи мають зміни в фотодокументації.
     */
    public boolean hasChanges(TempOrderItemDTO originalItem, ItemPhotoDTO newPhotoData) {
        if (originalItem == null && newPhotoData == null) {
            return false;
        }

        if (originalItem == null || newPhotoData == null) {
            return true;
        }

        try {
            // Порівнюємо кількість фото
            int originalPhotoCount = originalItem.getPhotoIds() != null ? originalItem.getPhotoIds().size() : 0;
            int newPhotoCount = newPhotoData.getTotalPhotos();

            if (originalPhotoCount != newPhotoCount) {
                return true;
            }

            // Порівнюємо ID фото
            List<String> originalIds = originalItem.getPhotoIds() != null ?
                originalItem.getPhotoIds() : new ArrayList<>();

            List<String> newIds = newPhotoData.getUploadedPhotos() != null ?
                newPhotoData.getUploadedPhotos().stream()
                    .map(PhotoInfo::getId)
                    .collect(Collectors.toList()) : new ArrayList<>();

            return !originalIds.equals(newIds);

        } catch (Exception e) {
            logger.error("Помилка порівняння змін фотодокументації: {}", e.getMessage(), e);
            return true; // При помилці вважаємо, що є зміни
        }
    }

    // === Приватні допоміжні методи ===

    /**
     * Створює порожній ItemPhotoDTO.
     */
    private ItemPhotoDTO createEmptyPhotoDTO() {
        return ItemPhotoDTO.builder()
            .uploadedPhotos(new ArrayList<>())
            .totalPhotos(0)
            .maxPhotos(5)
            .maxFileSizeMB(5)
            .photosRequired(false)
            .showCameraButton(true)
            .showUploadButton(true)
            .showPreviews(true)
            .compressionEnabled(true)
            .compressionQuality(80)
            .isLoading(false)
            .hasErrors(false)
            .totalSizeMB(0.0)
            .isCompleted(false)
            .build();
    }

    /**
     * Створює ItemPhotoDTO з помилкою.
     */
    private ItemPhotoDTO createErrorPhotoDTO(String errorMessage) {
        ItemPhotoDTO errorDTO = createEmptyPhotoDTO();
        errorDTO.addError(errorMessage);
        return errorDTO;
    }

    /**
     * Перетворює списки ID та URL у список PhotoInfo.
     */
    private List<PhotoInfo> convertToPhotoInfoList(List<String> photoIds, List<String> photoUrls) {
        List<PhotoInfo> photoInfos = new ArrayList<>();

        if (photoIds == null || photoUrls == null) {
            return photoInfos;
        }

        int minSize = Math.min(photoIds.size(), photoUrls.size());

        for (int i = 0; i < minSize; i++) {
            try {
                String id = photoIds.get(i);
                String url = photoUrls.get(i);

                if (id != null && !id.trim().isEmpty() && url != null && !url.trim().isEmpty()) {
                    PhotoInfo photoInfo = PhotoInfo.builder()
                        .id(id)
                        .fileUrl(url)
                        .status(PhotoStatus.UPLOADED)
                        .build();

                    photoInfos.add(photoInfo);
                }
            } catch (Exception e) {
                logger.warn("Помилка створення PhotoInfo для індексу {}: {}", i, e.getMessage());
            }
        }

        return photoInfos;
    }
}
