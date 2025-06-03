package com.aksi.domain.order.statemachine.stage2.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.order.dto.OrderItemPhotoDTO;
import com.aksi.domain.order.service.OrderItemPhotoService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для інтеграції фотографій з State Machine Order Wizard.
 *
 * Відповідає за:
 * - Отримання інформації про фото для предметів
 * - Підрахунок кількості фото
 * - Валідацію наявності фото
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PhotoIntegrationService {

    private final OrderItemPhotoService orderItemPhotoService;

    /**
     * Перевіряє, чи має предмет фотографії.
     *
     * @param itemId ID предмета замовлення
     * @return true якщо є фотографії, false якщо немає
     */
    @Transactional(readOnly = true)
    public boolean hasPhotos(UUID itemId) {
        try {
            List<OrderItemPhotoDTO> photos = orderItemPhotoService.getPhotosByItemId(itemId);
            return photos != null && !photos.isEmpty();
        } catch (Exception e) {
            log.warn("Помилка при перевірці наявності фото для предмета {}: {}", itemId, e.getMessage());
            return false;
        }
    }

    /**
     * Отримує кількість фотографій для предмета.
     *
     * @param itemId ID предмета замовлення
     * @return кількість фотографій
     */
    @Transactional(readOnly = true)
    public int getPhotoCount(UUID itemId) {
        try {
            List<OrderItemPhotoDTO> photos = orderItemPhotoService.getPhotosByItemId(itemId);
            return photos != null ? photos.size() : 0;
        } catch (Exception e) {
            log.warn("Помилка при підрахунку фото для предмета {}: {}", itemId, e.getMessage());
            return 0;
        }
    }

    /**
     * Отримує список URL фотографій для предмета.
     *
     * @param itemId ID предмета замовлення
     * @return список URL фотографій
     */
    @Transactional(readOnly = true)
    public List<String> getPhotoUrls(UUID itemId) {
        try {
            List<OrderItemPhotoDTO> photos = orderItemPhotoService.getPhotosByItemId(itemId);
            return photos.stream()
                    .map(OrderItemPhotoDTO::getFileUrl)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.warn("Помилка при отриманні URL фото для предмета {}: {}", itemId, e.getMessage());
            return List.of();
        }
    }

    /**
     * Отримує список ID фотографій для предмета.
     *
     * @param itemId ID предмета замовлення
     * @return список ID фотографій
     */
    @Transactional(readOnly = true)
    public List<String> getPhotoIds(UUID itemId) {
        try {
            List<OrderItemPhotoDTO> photos = orderItemPhotoService.getPhotosByItemId(itemId);
            return photos.stream()
                    .map(photo -> photo.getId().toString())
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.warn("Помилка при отриманні ID фото для предмета {}: {}", itemId, e.getMessage());
            return List.of();
        }
    }

    /**
     * Валідує, чи достатньо фотографій для предмета (опціонально).
     *
     * @param itemId ID предмета замовлення
     * @param minPhotos мінімальна кількість фото (може бути 0)
     * @return true якщо достатньо фото, false якщо ні
     */
    @Transactional(readOnly = true)
    public boolean validatePhotoRequirement(UUID itemId, int minPhotos) {
        if (minPhotos <= 0) {
            return true; // Фото не обов'язкові
        }

        int photoCount = getPhotoCount(itemId);
        return photoCount >= minPhotos;
    }
}
