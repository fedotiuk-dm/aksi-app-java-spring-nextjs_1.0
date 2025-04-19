package com.aksi.domain.pricing.repository;

import com.aksi.domain.pricing.entity.ServiceCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ServiceCategoryRepository extends JpaRepository<ServiceCategory, UUID> {
    Optional<ServiceCategory> findByCode(String code);
    List<ServiceCategory> findAllByOrderBySortOrderAsc();
    
    /**
     * Знаходить максимальне значення поля sortOrder в таблиці категорій послуг
     * @return Максимальне значення або null, якщо таблиця порожня
     */
    @Query("SELECT MAX(sc.sortOrder) FROM ServiceCategory sc")
    Optional<Integer> findMaxSortOrder();
}
