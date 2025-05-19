package com.aksi.domain.order.service;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.aksi.domain.order.dto.OrderItemPhotoDTO;
import com.aksi.domain.order.entity.OrderItemEntity;
import com.aksi.domain.order.entity.OrderItemPhotoEntity;
import com.aksi.domain.order.repository.OrderItemPhotoRepository;
import com.aksi.domain.order.repository.OrderItemRepository;
import com.aksi.exception.EntityNotFoundException;
import com.aksi.service.file.FileStorageService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Реалізація сервісу для роботи з фотографіями предметів замовлення.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderItemPhotoServiceImpl implements OrderItemPhotoService {

    private final OrderItemPhotoRepository orderItemPhotoRepository;
    private final OrderItemRepository orderItemRepository;
    private final FileStorageService fileStorageService;

    @Override
    @Transactional(readOnly = true)
    public List<OrderItemPhotoDTO> getPhotosByItemId(UUID itemId) {
        List<OrderItemPhotoEntity> photos = orderItemPhotoRepository.findByOrderItemId(itemId);

        return photos.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderItemPhotoDTO uploadPhoto(UUID itemId, MultipartFile file, String description) throws IOException {
        OrderItemEntity orderItem = orderItemRepository.findById(itemId)
                .orElseThrow(() -> EntityNotFoundException.withMessage("Предмет замовлення з ID " + itemId + " не знайдено"));

        // Зберігаємо файл
        String filePath = fileStorageService.storeFile(file);

        // Створюємо запис у БД
        OrderItemPhotoEntity photo = OrderItemPhotoEntity.builder()
                .orderItem(orderItem)
                .filePath(filePath)
                .description(StringUtils.hasText(description) ? description : null)
                .build();

        OrderItemPhotoEntity savedPhoto = orderItemPhotoRepository.save(photo);

        log.info("Завантажено фото для предмета замовлення {}: {}", itemId, savedPhoto.getId());

        return mapToDTO(savedPhoto);
    }

    @Override
    @Transactional
    public OrderItemPhotoDTO updatePhotoAnnotations(UUID photoId, String annotations, String description) {
        OrderItemPhotoEntity photo = orderItemPhotoRepository.findById(photoId)
                .orElseThrow(() -> EntityNotFoundException.withMessage("Фотографію з ID " + photoId + " не знайдено"));

        photo.setAnnotations(annotations);

        if (StringUtils.hasText(description)) {
            photo.setDescription(description);
        }

        OrderItemPhotoEntity updatedPhoto = orderItemPhotoRepository.save(photo);

        log.info("Оновлено анотації для фото {}", photoId);

        return mapToDTO(updatedPhoto);
    }

    @Override
    @Transactional
    public boolean deletePhoto(UUID photoId) {
        OrderItemPhotoEntity photo = orderItemPhotoRepository.findById(photoId)
                .orElseThrow(() -> EntityNotFoundException.withMessage("Фотографію з ID " + photoId + " не знайдено"));

        // Видаляємо файл зі сховища
        boolean fileDeleted = fileStorageService.deleteFile(photo.getFilePath());

        if (!fileDeleted) {
            log.warn("Не вдалося видалити файл фотографії з шляху: {}", photo.getFilePath());
        }

        // Видаляємо запис з БД
        orderItemPhotoRepository.delete(photo);

        log.info("Видалено фото {} для предмета замовлення {}", photoId, photo.getOrderItem().getId());

        return true;
    }

    @Override
    @Transactional(readOnly = true)
    public OrderItemPhotoDTO getPhotoById(UUID photoId) {
        OrderItemPhotoEntity photo = orderItemPhotoRepository.findById(photoId)
                .orElseThrow(() -> EntityNotFoundException.withMessage("Фотографію з ID " + photoId + " не знайдено"));

        return mapToDTO(photo);
    }

    /**
     * Перетворює сутність фотографії в DTO.
     *
     * @param entity сутність фотографії
     * @return DTO фотографії
     */
    private OrderItemPhotoDTO mapToDTO(OrderItemPhotoEntity entity) {
        return OrderItemPhotoDTO.builder()
                .id(entity.getId())
                .itemId(entity.getOrderItem().getId())
                .fileUrl(fileStorageService.getFileUrl(entity.getFilePath()))
                .thumbnailUrl(entity.getThumbnailPath() != null
                        ? fileStorageService.getFileUrl(entity.getThumbnailPath())
                        : null)
                .annotations(entity.getAnnotations())
                .description(entity.getDescription())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
