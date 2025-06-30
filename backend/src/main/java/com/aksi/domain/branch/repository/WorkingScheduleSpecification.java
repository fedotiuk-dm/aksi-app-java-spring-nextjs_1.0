package com.aksi.domain.branch.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import com.aksi.domain.branch.entity.WorkingScheduleEntity;
import com.aksi.domain.branch.enums.BranchStatus;

/** JPA Specifications для композиційних запитів до WorkingScheduleEntity. */
public class WorkingScheduleSpecification {

  /** Розклади за часовим поясом. */
  public static Specification<WorkingScheduleEntity> hasTimezone(String timezone) {
    return (root, query, criteriaBuilder) -> {
      if (timezone == null || timezone.trim().isEmpty()) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("timezone"), timezone);
    };
  }

  /** Розклади філій з певним статусом. */
  public static Specification<WorkingScheduleEntity> branchHasStatus(BranchStatus status) {
    return (root, query, criteriaBuilder) -> {
      if (status == null) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("branch").get("status"), status);
    };
  }

  /** Розклади активних філій. */
  public static Specification<WorkingScheduleEntity> forActiveBranches() {
    return branchHasStatus(BranchStatus.ACTIVE);
  }

  /** Розклади філій в певних містах. */
  public static Specification<WorkingScheduleEntity> branchInCities(List<String> cities) {
    return (root, query, criteriaBuilder) -> {
      if (cities == null || cities.isEmpty()) {
        return criteriaBuilder.conjunction();
      }

      // Конвертуємо в нижній регістр для порівняння
      List<String> lowerCaseCities = cities.stream().map(String::toLowerCase).toList();

      return criteriaBuilder.lower(root.get("branch").get("city")).in(lowerCaseCities);
    };
  }

  /** Розклади філій в конкретному місті. */
  public static Specification<WorkingScheduleEntity> branchInCity(String city) {
    return (root, query, criteriaBuilder) -> {
      if (city == null || city.trim().isEmpty()) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(
          criteriaBuilder.lower(root.get("branch").get("city")), city.toLowerCase());
    };
  }

  /** Розклади за ID філії. */
  public static Specification<WorkingScheduleEntity> forBranch(UUID branchId) {
    return (root, query, criteriaBuilder) -> {
      if (branchId == null) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("branch").get("id"), branchId);
    };
  }

  /** Розклади з робочими днями. */
  public static Specification<WorkingScheduleEntity> hasWorkingDays() {
    return (root, query, criteriaBuilder) -> {
      if (query == null) {
        return criteriaBuilder.conjunction();
      }
      var subquery = query.subquery(Long.class);
      var workingDayRoot = subquery.from(com.aksi.domain.branch.entity.WorkingDayEntity.class);

      subquery
          .select(criteriaBuilder.count(workingDayRoot))
          .where(
              criteriaBuilder.equal(workingDayRoot.get("workingSchedule"), root),
              criteriaBuilder.isTrue(workingDayRoot.get("isWorkingDay")));

      return criteriaBuilder.greaterThan(subquery, 0L);
    };
  }

  /** Розклади зі святковими днями. */
  public static Specification<WorkingScheduleEntity> hasHolidays() {
    return (root, query, criteriaBuilder) -> {
      if (query == null) {
        return criteriaBuilder.conjunction();
      }
      var subquery = query.subquery(Long.class);
      var holidayRoot = subquery.from(com.aksi.domain.branch.entity.HolidayEntity.class);

      subquery
          .select(criteriaBuilder.count(holidayRoot))
          .where(criteriaBuilder.equal(holidayRoot.get("workingSchedule"), root));

      return criteriaBuilder.greaterThan(subquery, 0L);
    };
  }

  /** Повні розклади (з робочими днями та святковими днями). */
  public static Specification<WorkingScheduleEntity> isComplete() {
    return Specification.where(hasWorkingDays()).and(hasHolidays());
  }

  /** Базові розклади (тільки з робочими днями). */
  public static Specification<WorkingScheduleEntity> isBasic() {
    return Specification.where(hasWorkingDays()).and(Specification.not(hasHolidays()));
  }

  /** Пошук з фільтрами. */
  public static Specification<WorkingScheduleEntity> searchWithFilters(
      String timezone, BranchStatus branchStatus, String city) {
    return Specification.where(hasTimezone(timezone))
        .and(branchHasStatus(branchStatus))
        .and(branchInCity(city));
  }
}
