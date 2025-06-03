package com.aksi.domain.pricing.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aksi.domain.pricing.entity.ItemMaterialEntity;

/**
 * Репозиторій для роботи з матеріалами предметів.
 */
@Repository
public interface ItemMaterialRepository extends JpaRepository<ItemMaterialEntity, UUID> {

    /**
     * Знайти матеріал за кодом.
     */
    Optional<ItemMaterialEntity> findByCode(String code);

    /**
     * Отримати всі активні матеріали відсортовані за порядком.
     */
    List<ItemMaterialEntity> findByActiveTrueOrderBySortOrderAsc();

    /**
     * Отримати всі матеріали відсортовані за порядком.
     */
    List<ItemMaterialEntity> findAllByOrderBySortOrderAsc();
}
