package com.aksi.domain.branch.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.aksi.domain.branch.entity.WorkingScheduleEntity;

/**
 * Repository для роботи з робочими розкладами філій. Використовує JpaSpecificationExecutor для
 * композиційних запитів.
 */
@Repository
public interface WorkingScheduleRepository
    extends JpaRepository<WorkingScheduleEntity, UUID>,
        JpaSpecificationExecutor<WorkingScheduleEntity> {

  // findById(UUID) успадкований з JpaRepository

  /** Знаходить розклад за ID філії. */
  Optional<WorkingScheduleEntity> findByBranchId(UUID branchId);

  /** Перевіряє чи існує розклад для філії за ID. */
  boolean existsByBranchId(UUID branchId);

  /** Знаходить всі розклади з певним часовим поясом. */
  List<WorkingScheduleEntity> findByTimezone(String timezone);

  /** Підраховує кількість розкладів з часовим поясом. */
  long countByTimezone(String timezone);

  // СКЛАДНІ ЗАПИТИ ПЕРЕНЕСЕНІ У WorkingScheduleSpecification:
  // - findByBranchCities() -> WorkingScheduleSpecification.branchInCities()
  // - findByActiveBranches() -> WorkingScheduleSpecification.forActiveBranches()
}
