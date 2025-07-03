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
    extends JpaRepository<HolidayEntity, UUID>, JpaSpecificationExecutor<HolidayEntity> {

  /** Знаходить святковий день за датою та розкладом. */
  Optional<HolidayEntity> findByDateAndWorkingSchedule_Id(LocalDate date, UUID workingScheduleId);

  /** Знаходить всі святкові дні за розкладом. */
  List<HolidayEntity> findByWorkingSchedule_Id(UUID workingScheduleId);

  /** Знаходить всі святкові дні за датою. */
  List<HolidayEntity> findByDate(LocalDate date);

  /** Знаходить всі повторювані святкові дні. */
  List<HolidayEntity> findByIsRecurring(Boolean isRecurring);

  /** Підраховує кількість святкових днів за розкладом. */
  long countByWorkingSchedule_Id(UUID workingScheduleId);

  /** Підраховує кількість щорічних святкових днів. */
  long countByIsRecurring(boolean isRecurring);

  // СКЛАДНІ ЗАПИТИ ПЕРЕНЕСЕНІ У HolidaySpecification:
  // - findByDateBetween() -> HolidaySpecification.betweenDates()
  // - findUpcomingHolidays() -> HolidaySpecification.upcoming()
  // - findByNameContaining() -> HolidaySpecification.hasName()
  // - findByRecurringAndDateBetween() -> HolidaySpecification.searchHolidays()
}
