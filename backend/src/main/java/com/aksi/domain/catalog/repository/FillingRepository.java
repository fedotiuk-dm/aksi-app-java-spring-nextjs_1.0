package com.aksi.domain.catalog.repository;

import com.aksi.domain.catalog.entity.Filling;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Репозиторій для роботи з наповнювачами.
 */
@Repository
public interface FillingRepository extends JpaRepository<Filling, UUID> {
    
    /**
     * Знаходить усі наповнювачі, відсортовані за порядком.
     *
     * @return Список наповнювачів
     */
    List<Filling> findAllByOrderBySortOrderAsc();
    
    /**
     * Знаходить наповнювач за кодом.
     *
     * @param code Код наповнювача
     * @return Наповнювач
     */
    Filling findByCode(String code);
}
