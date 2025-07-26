package com.aksi.domain.branch.util;

import java.util.List;

import com.aksi.api.branch.dto.WorkingDayRequest;
import com.aksi.domain.branch.entity.WorkingScheduleEntity;

import lombok.experimental.UtilityClass;

/**
 * Utility class for WorkingSchedule entity operations. Contains helper methods for managing working
 * schedule business logic.
 */
@UtilityClass
public class WorkingScheduleUtils {

  /**
   * Validates that a working schedule is valid. If it's a working day, both open and close times
   * must be set and open < close.
   *
   * @param schedule the working schedule to validate
   * @return true if the schedule is valid
   */
  public static boolean isValidWorkingSchedule(WorkingScheduleEntity schedule) {
    if (schedule == null) {
      return false;
    }

    if (!schedule.isWorkingDay()) {
      return true; // Non-working days don't need time validation
    }

    if (schedule.getOpenTime() == null || schedule.getCloseTime() == null) {
      return false; // Working days must have both times set
    }

    return schedule
        .getOpenTime()
        .isBefore(schedule.getCloseTime()); // Open time must be before close time
  }

  /**
   * Validates that a working schedule is invalid. Helper method to avoid constant inversion of
   * isValidWorkingSchedule.
   *
   * @param schedule the working schedule to validate
   * @return true if the schedule is invalid
   */
  public static boolean isInvalidWorkingSchedule(WorkingScheduleEntity schedule) {
    return !isValidWorkingSchedule(schedule);
  }

  /**
   * Validate a list of working day requests to ensure they cover all 7 days.
   *
   * @param workingDays list of working day requests from API
   * @return true if valid (all 7 days present, no duplicates)
   */
  public static boolean validateScheduleRequests(
      List<WorkingDayRequest> workingDays) {
    if (workingDays == null || workingDays.size() != 7) {
      return false;
    }

    // Check for duplicates by counting unique days
    long uniqueDaysCount =
        workingDays.stream()
            .map(WorkingDayRequest::getDayOfWeek)
            .distinct()
            .count();

    return uniqueDaysCount == 7;
  }
}
