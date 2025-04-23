package com.aksi.domain.catalog.repository;

import com.aksi.domain.catalog.entity.Color;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for {@link Color} entities.
 */
@Repository
public interface ColorRepository extends JpaRepository<Color, String> {
    
    /**
     * Find all active colors ordered by sort order.
     *
     * @return List of active colors
     */
    List<Color> findByIsActiveTrueOrderBySortOrderAsc();
}
