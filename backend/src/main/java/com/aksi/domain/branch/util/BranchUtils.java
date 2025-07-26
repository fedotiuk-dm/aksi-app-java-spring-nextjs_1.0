package com.aksi.domain.branch.util;

import com.aksi.domain.branch.entity.BranchEntity;
import com.aksi.domain.branch.entity.WorkingScheduleEntity;

import lombok.experimental.UtilityClass;

/**
 * Utility class for Branch entity operations. Contains helper methods for managing branch-related
 * business logic.
 */
@UtilityClass
public class BranchUtils {

  /**
   * Helper method to add a working schedule to a branch. Maintains bidirectional relationship.
   *
   * @param branch the branch entity
   * @param workingSchedule the working schedule to add
   */
  public static void addWorkingSchedule(
      BranchEntity branch, WorkingScheduleEntity workingSchedule) {
    if (branch == null || workingSchedule == null) {
      throw new IllegalArgumentException("Branch and WorkingSchedule cannot be null");
    }

    branch.getWorkingSchedules().add(workingSchedule);
    workingSchedule.setBranch(branch);
  }

  /**
   * Helper method to clear all working schedules from a branch. Maintains bidirectional
   * relationship.
   *
   * @param branch the branch entity
   */
  public static void clearWorkingSchedules(BranchEntity branch) {
    if (branch == null) {
      return;
    }

    branch.getWorkingSchedules().forEach(schedule -> schedule.setBranch(null));
    branch.getWorkingSchedules().clear();
  }

  /**
   * Get the display name for a branch (for use in dropdowns, etc.).
   *
   * @param branch the branch entity
   * @return formatted display name
   */
  public static String getDisplayName(BranchEntity branch) {
    if (branch == null) {
      return "";
    }

    return String.format("%s (%s)", branch.getName(), branch.getReceiptPrefix());
  }
}
