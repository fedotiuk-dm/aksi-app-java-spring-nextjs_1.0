package com.aksi.domain.pricing.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.aksi.domain.pricing.entity.ServiceCategoryEntity;

@Repository
public interface ServiceCategoryRepository extends JpaRepository<ServiceCategoryEntity, UUID> {
    Optional<ServiceCategoryEntity> findByCode(String code);
    List<ServiceCategoryEntity> findAllByOrderBySortOrderAsc();
    List<ServiceCategoryEntity> findByActiveIsTrueOrderBySortOrder();

    /**
     * Знаходить максимальне значення поля sortOrder в таблиці категорій послуг.
     * @return Максимальне значення або null, якщо таблиця порожня
     */
    @Query("SELECT MAX(sc.sortOrder) FROM ServiceCategoryEntity sc")
    Optional<Integer> findMaxSortOrder();
}
