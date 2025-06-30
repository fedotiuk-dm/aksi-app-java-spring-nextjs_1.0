package com.aksi.domain.branch.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.aksi.domain.branch.entity.HolidayEntity;

/**
 * Repository для роботи зі святковими днями філій. Використовує JpaSpecificationExecutor для
 * композиційних запитів.
 */
@Repository
public interface HolidayRepository
    extends JpaRepository<HolidayEntity, Long>, JpaSpecificationExecutor<HolidayEntity> {

  /** Знаходить святковий день за UUID. */
  Optional<HolidayEntity> findByUuid(UUID uuid);

  /** Знаходить святковий день за датою та розкладом. */
  Optional<HolidayEntity> findByDateAndWorkingSchedule_Id(LocalDate date, Long workingScheduleId);

  /** Знаходить всі святкові дні за розкладом. */
  List<HolidayEntity> findByWorkingSchedule_Id(Long workingScheduleId);

  /** Знаходить святкові дні за датою. */
  List<HolidayEntity> findByDate(LocalDate date);

  /** Знаходить щорічні святкові дні. */
  List<HolidayEntity> findByIsRecurring(boolean isRecurring);

  /** Підраховує кількість святкових днів за розкладом. */
  long countByWorkingSchedule_Id(Long workingScheduleId);

  /** Підраховує кількість щорічних святкових днів. */
  long countByIsRecurring(boolean isRecurring);

  // СКЛАДНІ ЗАПИТИ ПЕРЕНЕСЕНІ У HolidaySpecification:
  // - findByDateBetween() -> HolidaySpecification.betweenDates()
  // - findUpcomingHolidays() -> HolidaySpecification.upcoming()
  // - findByNameContaining() -> HolidaySpecification.hasName()
  // - findByRecurringAndDateBetween() -> HolidaySpecification.searchHolidays()
}
