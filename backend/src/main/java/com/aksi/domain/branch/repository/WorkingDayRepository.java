package com.aksi.domain.branch.repository;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.aksi.domain.branch.entity.WorkingDayEntity;

/**
 * Repository для роботи з робочими днями філій. Використовує JpaSpecificationExecutor для
 * композиційних запитів.
 */
@Repository
public interface WorkingDayRepository
    extends JpaRepository<WorkingDayEntity, Long>, JpaSpecificationExecutor<WorkingDayEntity> {

  /** Знаходить робочий день за UUID. */
  Optional<WorkingDayEntity> findByUuid(UUID uuid);

  /** Знаходить робочий день за розкладом та днем тижня. */
  Optional<WorkingDayEntity> findByWorkingSchedule_IdAndDayOfWeek(
      Long workingScheduleId, DayOfWeek dayOfWeek);

  /** Знаходить всі робочі дні за розкладом. */
  List<WorkingDayEntity> findByWorkingSchedule_Id(Long workingScheduleId);

  /** Підраховує кількість робочих днів за розкладом. */
  long countByWorkingSchedule_Id(Long workingScheduleId);

  /** Знаходить дні за статусом робочого дня. */
  List<WorkingDayEntity> findByIsWorkingDay(Boolean isWorkingDay);

  /** Підраховує кількість днів за статусом робочого дня. */
  long countByIsWorkingDay(Boolean isWorkingDay);

  /** Знаходить дні за днем тижня. */
  List<WorkingDayEntity> findByDayOfWeek(DayOfWeek dayOfWeek);

  /** Підраховує кількість днів за днем тижня. */
  long countByDayOfWeek(DayOfWeek dayOfWeek);

  // СКЛАДНІ ЗАПИТИ ПЕРЕНЕСЕНІ У WorkingDaySpecification:
  // - findWorkingDaysByScheduleId() -> WorkingDaySpecification.forSchedule() + isWorkingDay()
  // - findWeekdaysByScheduleId() -> WorkingDaySpecification.forSchedule() + isWeekday()
  // - findWeekendsByScheduleId() -> WorkingDaySpecification.forSchedule() + isWeekend()
  // - findOpenDaysByScheduleId() -> WorkingDaySpecification.forSchedule() + isOpen()
  // - findDaysWithLunchBreak() -> WorkingDaySpecification.hasLunchBreak()
  // - findWorkingDaysByBranchIds() -> WorkingDaySpecification.forActiveBranches() + isWorkingDay()
}
