package com.aksi.domain.pricing.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aksi.domain.pricing.entity.ItemColorEntity;

/**
 * Репозиторій для роботи з кольорами предметів.
 */
@Repository
public interface ItemColorRepository extends JpaRepository<ItemColorEntity, UUID> {

    /**
     * Знайти колір за кодом.
     */
    Optional<ItemColorEntity> findByCode(String code);

    /**
     * Отримати всі активні кольори відсортовані за порядком.
     */
    List<ItemColorEntity> findByActiveTrueOrderBySortOrderAsc();

    /**
     * Отримати всі кольори відсортовані за порядком.
     */
    List<ItemColorEntity> findAllByOrderBySortOrderAsc();
}
