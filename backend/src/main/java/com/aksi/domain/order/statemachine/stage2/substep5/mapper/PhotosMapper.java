package com.aksi.domain.order.statemachine.stage2.substep5.mapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.dto.OrderItemPhotoDTO;
import com.aksi.domain.order.statemachine.stage2.substep5.dto.PhotoDocumentationDTO;
import com.aksi.domain.order.statemachine.stage2.substep5.dto.PhotoMetadataDTO;
import com.aksi.domain.order.statemachine.stage2.substep5.dto.PhotoMetadataDTO.PhotoProcessingStatus;

import lombok.extern.slf4j.Slf4j;

/**
 * Маппер для трансформації даних фотодокументації.
 *
 * Принцип "один файл = одна відповідальність":
 * Тільки трансформація даних між різними представленнями фотографій.
 *
 * Трансформації:
 * - PhotoDocumentationDTO ↔ Map<String, Object> (для State Machine)
 * - PhotoMetadataDTO ↔ OrderItemPhotoDTO (для доменних сутностей)
 * - Безпечне витягування даних з Map
 */
@Slf4j
@Component
public class PhotosMapper {

    // Ключі для збереження в State Machine контексті
    private static final String PHOTOS_LIST_KEY = "photosList";
    private static final String PHOTOS_SKIPPED_KEY = "photosSkipped";
    private static final String SKIP_REASON_KEY = "skipReason";
    private static final String MAX_PHOTOS_KEY = "maxPhotos";
    private static final String MAX_FILE_SIZE_KEY = "maxFileSize";

    /**
     * Трансформувати PhotoDocumentationDTO в Map для збереження в State Machine
     */
    public Map<String, Object> toStateData(PhotoDocumentationDTO photosData) {
        if (photosData == null) {
            log.warn("PhotoDocumentationDTO null, повертаємо порожню Map");
            return Map.of();
        }

        Map<String, Object> stateData = new java.util.HashMap<>();

        try {
            // Зберігаємо список фото
            if (photosData.getPhotos() != null) {
                stateData.put(PHOTOS_LIST_KEY, photosData.getPhotos());
            } else {
                stateData.put(PHOTOS_LIST_KEY, new ArrayList<PhotoMetadataDTO>());
            }

            // Зберігаємо прапор пропуску та причину
            stateData.put(PHOTOS_SKIPPED_KEY, photosData.getPhotosSkipped() != null ? photosData.getPhotosSkipped() : false);
            stateData.put(SKIP_REASON_KEY, photosData.getSkipReason());

            // Зберігаємо налаштування
            stateData.put(MAX_PHOTOS_KEY, photosData.getMaxPhotos() != null ? photosData.getMaxPhotos() : 5);
            stateData.put(MAX_FILE_SIZE_KEY, photosData.getMaxFileSize() != null ? photosData.getMaxFileSize() : 5 * 1024 * 1024L);

            log.debug("PhotoDocumentationDTO трансформовано в State data з {} фото",
                photosData.getPhotosCount());

        } catch (Exception e) {
            log.error("Помилка трансформації PhotoDocumentationDTO в State data", e);
        }

        return stateData;
    }

    /**
     * Відновити PhotoDocumentationDTO з Map State Machine
     */
    @SuppressWarnings("unchecked")
    public PhotoDocumentationDTO fromStateData(Map<String, Object> stateData) {
        if (stateData == null || stateData.isEmpty()) {
            log.debug("State data порожня, створюємо PhotoDocumentationDTO за замовчуванням");
            return PhotoDocumentationDTO.builder().build();
        }

        try {
            // Безпечно витягуємо список фото
            List<PhotoMetadataDTO> photos = new ArrayList<>();
            Object photosObj = stateData.get(PHOTOS_LIST_KEY);
            if (photosObj instanceof List<?> photosList) {
                photos = photosList.stream()
                    .filter(item -> item instanceof PhotoMetadataDTO)
                    .map(item -> (PhotoMetadataDTO) item)
                    .collect(Collectors.toList());
            }

            // Безпечно витягуємо інші поля
            Boolean photosSkipped = safeGetBoolean(stateData, PHOTOS_SKIPPED_KEY, false);
            String skipReason = safeGetString(stateData, SKIP_REASON_KEY, null);
            Integer maxPhotos = safeGetInteger(stateData, MAX_PHOTOS_KEY, 5);
            Long maxFileSize = safeGetLong(stateData, MAX_FILE_SIZE_KEY, 5 * 1024 * 1024L);

            PhotoDocumentationDTO result = PhotoDocumentationDTO.builder()
                .photos(photos)
                .photosSkipped(photosSkipped)
                .skipReason(skipReason)
                .maxPhotos(maxPhotos)
                .maxFileSize(maxFileSize)
                .build();

            log.debug("State data трансформовано в PhotoDocumentationDTO з {} фото",
                result.getPhotosCount());

            return result;

        } catch (Exception e) {
            log.error("Помилка відновлення PhotoDocumentationDTO з State data", e);
            return PhotoDocumentationDTO.builder().build();
        }
    }

    /**
     * Трансформувати PhotoMetadataDTO в OrderItemPhotoDTO для доменних операцій
     */
    public OrderItemPhotoDTO toOrderItemPhotoDTO(PhotoMetadataDTO photoMetadata) {
        if (photoMetadata == null) {
            return null;
        }

        try {
            return OrderItemPhotoDTO.builder()
                .fileUrl(photoMetadata.getFullSizeUrl())
                .thumbnailUrl(photoMetadata.getThumbnailUrl())
                .description(photoMetadata.getDescription())
                .createdAt(photoMetadata.getUploadedAt())
                .build();

        } catch (Exception e) {
            log.error("Помилка трансформації PhotoMetadataDTO в OrderItemPhotoDTO", e);
            return null;
        }
    }

    /**
     * Трансформувати OrderItemPhotoDTO в PhotoMetadataDTO
     */
    public PhotoMetadataDTO fromOrderItemPhotoDTO(OrderItemPhotoDTO orderPhoto) {
        if (orderPhoto == null) {
            return null;
        }

        try {
            return PhotoMetadataDTO.builder()
                .photoId(orderPhoto.getId() != null ? orderPhoto.getId().toString() : null)
                .fullSizeUrl(orderPhoto.getFileUrl())
                .thumbnailUrl(orderPhoto.getThumbnailUrl())
                .description(orderPhoto.getDescription())
                .uploadedAt(orderPhoto.getCreatedAt())
                .processingStatus(PhotoProcessingStatus.PROCESSED)
                .isPrimary(false) // За замовчуванням
                .displayOrder(0)
                .build();

        } catch (Exception e) {
            log.error("Помилка трансформації OrderItemPhotoDTO в PhotoMetadataDTO", e);
            return null;
        }
    }

    /**
     * Трансформувати список PhotoMetadataDTO в список OrderItemPhotoDTO
     */
    public List<OrderItemPhotoDTO> toOrderItemPhotoDTOList(List<PhotoMetadataDTO> photoMetadataList) {
        if (photoMetadataList == null) {
            return new ArrayList<>();
        }

        return photoMetadataList.stream()
            .map(this::toOrderItemPhotoDTO)
            .filter(java.util.Objects::nonNull)
            .collect(Collectors.toList());
    }

    /**
     * Трансформувати список OrderItemPhotoDTO в список PhotoMetadataDTO
     */
    public List<PhotoMetadataDTO> fromOrderItemPhotoDTOList(List<OrderItemPhotoDTO> orderPhotoList) {
        if (orderPhotoList == null) {
            return new ArrayList<>();
        }

        return orderPhotoList.stream()
            .map(this::fromOrderItemPhotoDTO)
            .filter(java.util.Objects::nonNull)
            .collect(Collectors.toList());
    }

    // ===== УТИЛІТИ ДЛЯ БЕЗПЕЧНОГО ВИТЯГУВАННЯ ДАНИХ =====

    private String safeGetString(Map<String, Object> map, String key, String defaultValue) {
        Object value = map.get(key);
        return value instanceof String ? (String) value : defaultValue;
    }

    private Boolean safeGetBoolean(Map<String, Object> map, String key, Boolean defaultValue) {
        Object value = map.get(key);
        return value instanceof Boolean ? (Boolean) value : defaultValue;
    }

    private Integer safeGetInteger(Map<String, Object> map, String key, Integer defaultValue) {
        Object value = map.get(key);
        if (value instanceof Integer) {
            return (Integer) value;
        } else if (value instanceof Number) {
            return ((Number) value).intValue();
        }
        return defaultValue;
    }

    private Long safeGetLong(Map<String, Object> map, String key, Long defaultValue) {
        Object value = map.get(key);
        if (value instanceof Long) {
            return (Long) value;
        } else if (value instanceof Number) {
            return ((Number) value).longValue();
        }
        return defaultValue;
    }
}
