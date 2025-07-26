package com.aksi.domain.branch.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.branch.entity.WorkingScheduleEntity;

/**
 * Repository interface for WorkingSchedule entities. Provides methods for managing branch working
 * schedules.
 */
@Repository
public interface WorkingScheduleRepository extends JpaRepository<WorkingScheduleEntity, UUID> {

  /**
   * Find all working schedules for a specific branch, ordered by day of week. Returns all 7 days
   * for the branch.
   */
  List<WorkingScheduleEntity> findByBranchIdOrderByDayOfWeek(UUID branchId);

  /**
   * Delete all working schedules for a specific branch. Used when updating the entire working
   * schedule.
   */
  @Modifying
  @Query("DELETE FROM WorkingScheduleEntity ws WHERE ws.branch.id = :branchId")
  void deleteByBranchId(@Param("branchId") UUID branchId);
}
