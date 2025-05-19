package com.aksi.domain.order.service;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import com.aksi.domain.order.dto.OrderItemPhotoDTO;

/**
 * Сервіс для роботи з фотографіями предметів замовлення.
 */
public interface OrderItemPhotoService {

    /**
     * Отримати всі фотографії для вказаного предмета замовлення.
     *
     * @param itemId ID предмета замовлення
     * @return список фотографій
     */
    List<OrderItemPhotoDTO> getPhotosByItemId(UUID itemId);

    /**
     * Завантажити фотографію для предмета замовлення.
     *
     * @param itemId ID предмета замовлення
     * @param file файл фотографії
     * @param description опис фотографії (опціонально)
     * @return завантажена фотографія
     * @throws IOException при помилці завантаження файлу
     */
    OrderItemPhotoDTO uploadPhoto(UUID itemId, MultipartFile file, String description) throws IOException;

    /**
     * Оновити анотації та опис для фотографії.
     *
     * @param photoId ID фотографії
     * @param annotations JSON з анотаціями (координатами позначок)
     * @param description новий опис фотографії
     * @return оновлена фотографія
     */
    OrderItemPhotoDTO updatePhotoAnnotations(UUID photoId, String annotations, String description);

    /**
     * Видалити фотографію.
     *
     * @param photoId ID фотографії
     * @return true, якщо фотографія успішно видалена
     */
    boolean deletePhoto(UUID photoId);

    /**
     * Отримати інформацію про фотографію за її ID.
     *
     * @param photoId ID фотографії
     * @return інформація про фотографію
     */
    OrderItemPhotoDTO getPhotoById(UUID photoId);
}
