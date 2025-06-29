package com.aksi.domain.branch.entity;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.aksi.shared.BaseEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * Entity для робочого розкладу філії.
 */
@Entity
@Table(name = "working_schedules",
       indexes = {
           @Index(name = "idx_working_schedule_branch", columnList = "branch_id"),
           @Index(name = "idx_working_schedule_uuid", columnList = "uuid")
       })
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true, exclude = {"workingDays", "holidays"})
public class WorkingScheduleEntity extends BaseEntity {

    /**
     * UUID для API сумісності (зовнішній ідентифікатор)
     * Внутрішньо використовуємо Long id з BaseEntity
     */
    @Column(name = "uuid", nullable = false, unique = true, updatable = false)
    @Builder.Default
    private UUID uuid = UUID.randomUUID();

    @OneToOne
    @JoinColumn(name = "branch_id", nullable = false)
    private BranchEntity branch;

    @Column(name = "timezone", nullable = false, length = 50)
    @Builder.Default
    private String timezone = "Europe/Kyiv";

    @OneToMany(mappedBy = "workingSchedule", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<WorkingDayEntity> workingDays = new ArrayList<>();

    @OneToMany(mappedBy = "workingSchedule", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<HolidayEntity> holidays = new ArrayList<>();

    // Business methods

    /**
     * Перевіряє чи філія працює в заданий час
     */
    public boolean isOpenAt(LocalDate date, LocalTime time) {
        // Перевіряємо чи це святковий день
        if (isHoliday(date)) {
            return false;
        }

        // Знаходимо робочий день
        WorkingDayEntity workingDay = getWorkingDayFor(date.getDayOfWeek());
        if (workingDay == null || !workingDay.isWorkingDay()) {
            return false;
        }

        return workingDay.isOpenAt(time);
    }

    /**
     * Перевіряє чи заданий день є святковим
     */
    public boolean isHoliday(LocalDate date) {
        return holidays.stream()
            .anyMatch(holiday -> holiday.isHolidayOn(date));
    }

    /**
     * Знаходить робочий день для заданого дня тижня
     */
    public WorkingDayEntity getWorkingDayFor(java.time.DayOfWeek dayOfWeek) {
        return workingDays.stream()
            .filter(day -> day.getDayOfWeek().name().equals(dayOfWeek.name()))
            .findFirst()
            .orElse(null);
    }

    /**
     * Отримує наступний робочий день після заданої дати
     */
    public LocalDate getNextWorkingDate(LocalDate fromDate) {
        LocalDate checkDate = fromDate.plusDays(1);
        int maxDaysToCheck = 14; // Перевіряємо максимум 2 тижні

        for (int i = 0; i < maxDaysToCheck; i++) {
            if (!isHoliday(checkDate)) {
                WorkingDayEntity workingDay = getWorkingDayFor(checkDate.getDayOfWeek());
                if (workingDay != null && workingDay.isWorkingDay()) {
                    return checkDate;
                }
            }
            checkDate = checkDate.plusDays(1);
        }

        return null; // Не знайшли робочий день впродовж 2 тижнів
    }

    /**
     * Отримує часовий пояс як ZoneId
     */
    public ZoneId getZoneId() {
        return ZoneId.of(timezone);
    }

    /**
     * Додає робочий день
     */
    public void addWorkingDay(WorkingDayEntity workingDay) {
        workingDay.setWorkingSchedule(this);
        this.workingDays.add(workingDay);
    }

    /**
     * Додає святковий день
     */
    public void addHoliday(HolidayEntity holiday) {
        holiday.setWorkingSchedule(this);
        this.holidays.add(holiday);
    }
}
