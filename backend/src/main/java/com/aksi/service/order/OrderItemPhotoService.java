package com.aksi.service.order;

import com.aksi.dto.order.OrderItemPhotoDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

/**
 * Сервіс для роботи з фотографіями предметів замовлень.
 */
public interface OrderItemPhotoService {
    
    /**
     * Завантажити нову фотографію для предмета замовлення.
     *
     * @param itemId ID предмета замовлення
     * @param file файл зображення для завантаження
     * @param description опис фотографії (опціонально)
     * @return DTO завантаженої фотографії
     * @throws IOException при помилці читання або збереження файлу
     */
    OrderItemPhotoDto uploadPhoto(UUID itemId, MultipartFile file, String description) throws IOException;
    
    /**
     * Отримати всі фотографії для конкретного предмета замовлення.
     *
     * @param itemId ID предмета замовлення
     * @return список DTO фотографій
     */
    List<OrderItemPhotoDto> getPhotosForOrderItem(UUID itemId);
    
    /**
     * Отримати конкретну фотографію за її ID.
     *
     * @param photoId ID фотографії
     * @return DTO фотографії або null, якщо фотографія не знайдена
     */
    OrderItemPhotoDto getPhoto(UUID photoId);
    
    /**
     * Оновити деталі фотографії (опис та/або анотації).
     *
     * @param photoId ID фотографії для оновлення
     * @param description новий опис фотографії (або null, якщо не потрібно змінювати)
     * @param annotationData нові дані анотацій у форматі JSON (або null, якщо не потрібно змінювати)
     * @return оновлене DTO фотографії
     */
    OrderItemPhotoDto updatePhotoDetails(UUID photoId, String description, String annotationData);
    
    /**
     * Видалити фотографію.
     *
     * @param photoId ID фотографії для видалення
     */
    void deletePhoto(UUID photoId);
}
