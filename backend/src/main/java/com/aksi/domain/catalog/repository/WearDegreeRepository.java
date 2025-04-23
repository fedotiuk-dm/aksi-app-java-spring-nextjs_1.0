package com.aksi.domain.catalog.repository;

import com.aksi.domain.catalog.entity.WearDegree;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for {@link WearDegree} entities.
 */
@Repository
public interface WearDegreeRepository extends JpaRepository<WearDegree, Integer> {
    
    /**
     * Find all active wear degrees ordered by sort order.
     *
     * @return List of active wear degrees
     */
    List<WearDegree> findByIsActiveTrueOrderBySortOrderAsc();
}
