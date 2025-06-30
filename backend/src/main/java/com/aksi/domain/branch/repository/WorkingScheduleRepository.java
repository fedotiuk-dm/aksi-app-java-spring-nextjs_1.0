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
    extends JpaRepository<WorkingScheduleEntity, Long>,
        JpaSpecificationExecutor<WorkingScheduleEntity> {

  /** Знаходить розклад за UUID */
  Optional<WorkingScheduleEntity> findByUuid(UUID uuid);

  /** Знаходить розклад за UUID філії */
  Optional<WorkingScheduleEntity> findByBranchUuid(UUID branchUuid);

  /** Перевіряє чи існує розклад для філії за UUID */
  boolean existsByBranchUuid(UUID branchUuid);

  /** Знаходить всі розклади з певним часовим поясом */
  List<WorkingScheduleEntity> findByTimezone(String timezone);

  /** Підраховує кількість розкладів з часовим поясом */
  long countByTimezone(String timezone);

  // СКЛАДНІ ЗАПИТИ ПЕРЕНЕСЕНІ У WorkingScheduleSpecification:
  // - findByBranchCities() -> WorkingScheduleSpecification.branchInCities()
  // - findByActiveBranches() -> WorkingScheduleSpecification.forActiveBranches()
}
