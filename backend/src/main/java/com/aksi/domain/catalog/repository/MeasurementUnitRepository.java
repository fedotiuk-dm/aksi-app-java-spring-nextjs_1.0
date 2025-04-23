package com.aksi.domain.catalog.repository;

import com.aksi.domain.catalog.entity.MeasurementUnit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for {@link MeasurementUnit} entities.
 */
@Repository
public interface MeasurementUnitRepository extends JpaRepository<MeasurementUnit, String> {
    
    /**
     * Find all active measurement units ordered by sort order.
     *
     * @return List of active measurement units
     */
    List<MeasurementUnit> findByIsActiveTrueOrderBySortOrderAsc();
}
