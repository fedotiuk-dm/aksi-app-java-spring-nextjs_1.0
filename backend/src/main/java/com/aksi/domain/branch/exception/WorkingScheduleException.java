package com.aksi.domain.branch.exception;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

/** Exception для помилок робочого розкладу. */
public class WorkingScheduleException extends RuntimeException {

  public WorkingScheduleException(String message) {
    super(message);
  }

  public WorkingScheduleException(String message, Throwable cause) {
    super(message, cause);
  }

  public static WorkingScheduleException notFound(UUID branchId) {
    return new WorkingScheduleException(
        String.format("Робочий розклад для філії '%s' не знайдено", branchId));
  }

  public static WorkingScheduleException invalidWorkingHours(
      DayOfWeek dayOfWeek, LocalTime openTime, LocalTime closeTime) {
    return new WorkingScheduleException(
        String.format("Невалідні робочі години для %s: %s - %s", dayOfWeek, openTime, closeTime));
  }

  public static WorkingScheduleException branchClosed(
      UUID branchId, LocalDate date, LocalTime time) {
    return new WorkingScheduleException(
        String.format("Філія '%s' закрита %s о %s", branchId, date, time));
  }

  public static WorkingScheduleException holidayConflict(String holidayName, LocalDate date) {
    return new WorkingScheduleException(
        String.format("Конфлікт з святковим днем '%s' на дату %s", holidayName, date));
  }

  public static WorkingScheduleException invalidTimezone(String timezone) {
    return new WorkingScheduleException(String.format("Невалідний часовий пояс: '%s'", timezone));
  }
}
