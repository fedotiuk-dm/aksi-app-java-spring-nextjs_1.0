package com.aksi.domain.order.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aksi.domain.order.entity.OrderItemPhotoEntity;

/**
 * Репозиторій для доступу до фотографій предметів замовлення.
 */
@Repository
public interface OrderItemPhotoRepository extends JpaRepository<OrderItemPhotoEntity, UUID> {

    /**
     * Знайти всі фотографії для вказаного предмета замовлення.
     *
     * @param itemId ID предмета замовлення
     * @return список фотографій
     */
    List<OrderItemPhotoEntity> findByOrderItemId(UUID itemId);

    /**
     * Видалити всі фотографії для вказаного предмета замовлення.
     *
     * @param itemId ID предмета замовлення
     */
    void deleteByOrderItemId(UUID itemId);

    /**
     * Підрахувати кількість фотографій для вказаного предмета замовлення.
     *
     * @param itemId ID предмета замовлення
     * @return кількість фотографій
     */
    int countByOrderItemId(UUID itemId);
}
