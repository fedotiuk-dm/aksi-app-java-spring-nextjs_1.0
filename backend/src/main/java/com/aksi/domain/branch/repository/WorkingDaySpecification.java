package com.aksi.domain.branch.repository;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import com.aksi.domain.branch.entity.WorkingDayEntity;
import com.aksi.domain.branch.enums.BranchOpenStatus;
import com.aksi.domain.branch.enums.BranchStatus;

/** JPA Specifications для композиційних запитів до WorkingDayEntity. */
public class WorkingDaySpecification {

  /** Робочі дні за днем тижня. */
  public static Specification<WorkingDayEntity> forDayOfWeek(DayOfWeek dayOfWeek) {
    return (root, query, criteriaBuilder) -> {
      if (dayOfWeek == null) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("dayOfWeek"), dayOfWeek);
    };
  }

  /** Робочі дні за кількома днями тижня. */
  public static Specification<WorkingDayEntity> forDaysOfWeek(List<DayOfWeek> daysOfWeek) {
    return (root, query, criteriaBuilder) -> {
      if (daysOfWeek == null || daysOfWeek.isEmpty()) {
        return criteriaBuilder.conjunction();
      }
      return root.get("dayOfWeek").in(daysOfWeek);
    };
  }

  /** Робочі дні за розкладом. */
  public static Specification<WorkingDayEntity> forSchedule(UUID scheduleId) {
    return (root, query, criteriaBuilder) -> {
      if (scheduleId == null) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("workingSchedule").get("id"), scheduleId);
    };
  }

  /** Тільки робочі дні (не вихідні). */
  public static Specification<WorkingDayEntity> isWorkingDay() {
    return (root, query, criteriaBuilder) -> {
      return criteriaBuilder.isTrue(root.get("isWorkingDay"));
    };
  }

  /** Тільки вихідні дні. */
  public static Specification<WorkingDayEntity> isNonWorkingDay() {
    return (root, query, criteriaBuilder) -> {
      return criteriaBuilder.isFalse(root.get("isWorkingDay"));
    };
  }

  /** Робочі дні зі статусом. */
  public static Specification<WorkingDayEntity> hasStatus(BranchOpenStatus status) {
    return (root, query, criteriaBuilder) -> {
      if (status == null) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("status"), status);
    };
  }

  /** Відкриті дні. */
  public static Specification<WorkingDayEntity> isOpen() {
    return hasStatus(BranchOpenStatus.OPEN);
  }

  /** Закриті дні. */
  public static Specification<WorkingDayEntity> isClosed() {
    return hasStatus(BranchOpenStatus.CLOSED);
  }

  /** Святкові дні. */
  public static Specification<WorkingDayEntity> isHoliday() {
    return hasStatus(BranchOpenStatus.HOLIDAY);
  }

  /** Робочі дні з певним часом відкриття. */
  public static Specification<WorkingDayEntity> opensAt(LocalTime openTime) {
    return (root, query, criteriaBuilder) -> {
      if (openTime == null) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("openTime"), openTime);
    };
  }

  /** Робочі дні з певним часом закриття. */
  public static Specification<WorkingDayEntity> closesAt(LocalTime closeTime) {
    return (root, query, criteriaBuilder) -> {
      if (closeTime == null) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("closeTime"), closeTime);
    };
  }

  /** Робочі дні з певним діапазоном часу роботи. */
  public static Specification<WorkingDayEntity> workingHours(
      LocalTime openTime, LocalTime closeTime) {
    return Specification.where(opensAt(openTime)).and(closesAt(closeTime));
  }

  /** Робочі дні з перервою на обід. */
  public static Specification<WorkingDayEntity> hasLunchBreak() {
    return (root, query, criteriaBuilder) -> {
      return criteriaBuilder.and(
          criteriaBuilder.isNotNull(root.get("lunchBreakStart")),
          criteriaBuilder.isNotNull(root.get("lunchBreakEnd")));
    };
  }

  /** Робочі дні без перерви на обід. */
  public static Specification<WorkingDayEntity> hasNoLunchBreak() {
    return (root, query, criteriaBuilder) -> {
      return criteriaBuilder.or(
          criteriaBuilder.isNull(root.get("lunchBreakStart")),
          criteriaBuilder.isNull(root.get("lunchBreakEnd")));
    };
  }

  /** Робочі дні з перервою на обід в певний час. */
  public static Specification<WorkingDayEntity> lunchBreakAt(
      LocalTime lunchStart, LocalTime lunchEnd) {
    return (root, query, criteriaBuilder) -> {
      if (lunchStart == null || lunchEnd == null) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.and(
          criteriaBuilder.equal(root.get("lunchBreakStart"), lunchStart),
          criteriaBuilder.equal(root.get("lunchBreakEnd"), lunchEnd));
    };
  }

  /** Дні для активних філій. */
  public static Specification<WorkingDayEntity> forActiveBranches() {
    return (root, query, criteriaBuilder) -> {
      return criteriaBuilder.equal(
          root.get("workingSchedule").get("branch").get("status"), BranchStatus.ACTIVE);
    };
  }

  /** Будні (понеділок-п'ятниця). */
  public static Specification<WorkingDayEntity> isWeekday() {
    return forDaysOfWeek(
        List.of(
            DayOfWeek.MONDAY,
            DayOfWeek.TUESDAY,
            DayOfWeek.WEDNESDAY,
            DayOfWeek.THURSDAY,
            DayOfWeek.FRIDAY));
  }

  /** Вихідні (субота-неділя). */
  public static Specification<WorkingDayEntity> isWeekend() {
    return forDaysOfWeek(List.of(DayOfWeek.SATURDAY, DayOfWeek.SUNDAY));
  }

  /** Комплексний пошук робочих днів. */
  public static Specification<WorkingDayEntity> searchWorkingDays(
      UUID scheduleId, List<DayOfWeek> daysOfWeek, BranchOpenStatus status, boolean hasLunchBreak) {
    Specification<WorkingDayEntity> spec =
        Specification.where(forSchedule(scheduleId))
            .and(isWorkingDay())
            .and(forDaysOfWeek(daysOfWeek))
            .and(hasStatus(status));

    if (hasLunchBreak) {
      spec = spec.and(hasLunchBreak());
    } else {
      spec = spec.and(hasNoLunchBreak());
    }

    return spec;
  }
}
