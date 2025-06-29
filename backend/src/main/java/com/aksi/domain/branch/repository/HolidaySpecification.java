package com.aksi.domain.branch.repository;

import java.time.LocalDate;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import com.aksi.domain.branch.entity.HolidayEntity;
import com.aksi.domain.branch.enums.BranchStatus;

/**
 * JPA Specifications для композиційних запитів до HolidayEntity.
 */
public class HolidaySpecification {

    /**
     * Святкові дні за конкретною датою
     */
    public static Specification<HolidayEntity> onDate(LocalDate date) {
        return (root, query, criteriaBuilder) -> {
            if (date == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("date"), date);
        };
    }

    /**
     * Святкові дні в діапазоні дат
     */
    public static Specification<HolidayEntity> betweenDates(LocalDate startDate, LocalDate endDate) {
        return (root, query, criteriaBuilder) -> {
            if (startDate == null && endDate == null) {
                return criteriaBuilder.conjunction();
            }

            if (startDate != null && endDate != null) {
                return criteriaBuilder.between(root.get("date"), startDate, endDate);
            } else if (startDate != null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("date"), startDate);
            } else {
                return criteriaBuilder.lessThanOrEqualTo(root.get("date"), endDate);
            }
        };
    }

    /**
     * Святкові дні після певної дати
     */
    public static Specification<HolidayEntity> afterDate(LocalDate date) {
        return (root, query, criteriaBuilder) -> {
            if (date == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.greaterThan(root.get("date"), date);
        };
    }

    /**
     * Святкові дні до певної дати
     */
    public static Specification<HolidayEntity> beforeDate(LocalDate date) {
        return (root, query, criteriaBuilder) -> {
            if (date == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.lessThan(root.get("date"), date);
        };
    }

    /**
     * Майбутні святкові дні
     */
    public static Specification<HolidayEntity> upcoming() {
        return afterDate(LocalDate.now());
    }

    /**
     * Минулі святкові дні
     */
    public static Specification<HolidayEntity> past() {
        return beforeDate(LocalDate.now());
    }

    /**
     * Сьогоднішні святкові дні
     */
    public static Specification<HolidayEntity> today() {
        return onDate(LocalDate.now());
    }

    /**
     * Святкові дні за розкладом
     */
    public static Specification<HolidayEntity> forSchedule(UUID scheduleId) {
        return (root, query, criteriaBuilder) -> {
            if (scheduleId == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("workingSchedule").get("id"), scheduleId);
        };
    }

    /**
     * Святкові дні з назвою
     */
    public static Specification<HolidayEntity> hasName(String name) {
        return (root, query, criteriaBuilder) -> {
            if (name == null || name.trim().isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.like(
                criteriaBuilder.lower(root.get("name")),
                "%" + name.toLowerCase() + "%"
            );
        };
    }

    /**
     * Щорічні святкові дні
     */
    public static Specification<HolidayEntity> isRecurring() {
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.isTrue(root.get("isRecurring"));
        };
    }

    /**
     * Одноразові святкові дні
     */
    public static Specification<HolidayEntity> isOneTime() {
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.isFalse(root.get("isRecurring"));
        };
    }

    /**
     * Святкові дні з описом
     */
    public static Specification<HolidayEntity> hasDescription() {
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.isNotNull(root.get("description"));
        };
    }

    /**
     * Пошук у описі
     */
    public static Specification<HolidayEntity> descriptionContains(String text) {
        return (root, query, criteriaBuilder) -> {
            if (text == null || text.trim().isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.like(
                criteriaBuilder.lower(root.get("description")),
                "%" + text.toLowerCase() + "%"
            );
        };
    }

    /**
     * Святкові дні для активних філій
     */
    public static Specification<HolidayEntity> forActiveBranches() {
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.equal(
                root.get("workingSchedule").get("branch").get("status"),
                BranchStatus.ACTIVE
            );
        };
    }

    /**
     * Святкові дні філії за ID
     */
    public static Specification<HolidayEntity> forBranch(UUID branchId) {
        return (root, query, criteriaBuilder) -> {
            if (branchId == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(
                root.get("workingSchedule").get("branch").get("id"),
                branchId
            );
        };
    }

    /**
     * Найближчі святкові дні (в наступні N днів)
     */
    public static Specification<HolidayEntity> upcomingInDays(int days) {
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusDays(days);
        return betweenDates(startDate, endDate);
    }

    /**
     * Святкові дні в поточному році
     */
    public static Specification<HolidayEntity> thisYear() {
        LocalDate startOfYear = LocalDate.of(LocalDate.now().getYear(), 1, 1);
        LocalDate endOfYear = LocalDate.of(LocalDate.now().getYear(), 12, 31);
        return betweenDates(startOfYear, endOfYear);
    }

    /**
     * Святкові дні в певному році
     */
    public static Specification<HolidayEntity> inYear(int year) {
        LocalDate startOfYear = LocalDate.of(year, 1, 1);
        LocalDate endOfYear = LocalDate.of(year, 12, 31);
        return betweenDates(startOfYear, endOfYear);
    }

    /**
     * Комплексний пошук святкових днів
     */
    public static Specification<HolidayEntity> searchHolidays(String name,
                                                            LocalDate startDate,
                                                            LocalDate endDate,
                                                            Boolean isRecurring,
                                                            UUID branchId) {
        Specification<HolidayEntity> spec = Specification.where(hasName(name))
            .and(betweenDates(startDate, endDate))
            .and(forBranch(branchId));

        if (isRecurring != null) {
            if (isRecurring) {
                spec = spec.and(isRecurring());
            } else {
                spec = spec.and(isOneTime());
            }
        }

        return spec;
    }

    /**
     * Актуальні щорічні святкові дні
     */
    public static Specification<HolidayEntity> activeRecurringHolidays() {
        return Specification.where(isRecurring())
            .and(forActiveBranches());
    }
}
