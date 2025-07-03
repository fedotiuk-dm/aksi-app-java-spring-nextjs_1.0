package com.aksi.domain.branch.entity;

import java.time.LocalDate;
import java.time.MonthDay;

import com.aksi.shared.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/** Entity для святкових днів філії. Підтримує як одноразові, так і щорічні святкові дні. */
@Entity
@Table(
    name = "holidays",
    indexes = {
      @Index(name = "idx_holiday_schedule", columnList = "working_schedule_id"),
      @Index(name = "idx_holiday_date", columnList = "date")
    })
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true, exclude = "workingSchedule")
public class HolidayEntity extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "working_schedule_id", nullable = false)
  private WorkingScheduleEntity workingSchedule;

  @Column(name = "date", nullable = false)
  private LocalDate date;

  @Column(name = "name", nullable = false, length = 100)
  private String name;

  @Column(name = "is_recurring", nullable = false)
  @Builder.Default
  private Boolean isRecurring = false;

  // Business methods

  /** Перевіряє чи заданий день є цим святковим днем. */
  public boolean isHolidayOn(LocalDate checkDate) {
    if (isRecurring()) {
      // Для щорічних свят порівнюємо тільки місяць і день
      MonthDay holidayMonthDay = MonthDay.from(this.date);
      MonthDay checkMonthDay = MonthDay.from(checkDate);
      return holidayMonthDay.equals(checkMonthDay);
    } else {
      // Для одноразових свят порівнюємо повну дату
      return this.date.equals(checkDate);
    }
  }

  /** Перевіряє чи свято повторюється щороку. */
  public boolean isRecurring() {
    return Boolean.TRUE.equals(isRecurring);
  }

  /** Отримує наступну дату цього свята. */
  public LocalDate getNextOccurrence(LocalDate fromDate) {
    if (!isRecurring()) {
      // Для одноразових свят повертаємо дату тільки якщо вона в майбутньому
      return date.isAfter(fromDate) ? date : null;
    }

    // Для щорічних свят знаходимо наступне повторення
    MonthDay holidayMonthDay = MonthDay.from(date);
    LocalDate thisYearDate = holidayMonthDay.atYear(fromDate.getYear());

    if (thisYearDate.isAfter(fromDate)) {
      return thisYearDate;
    } else {
      return holidayMonthDay.atYear(fromDate.getYear() + 1);
    }
  }

  /** Отримує опис свята з типом повторення. */
  public String getHolidayDescription() {
    String type = isRecurring() ? "щорічне" : "одноразове";
    return String.format("%s (%s)", name, type);
  }

  /** Перевіряє чи дата свята валідна. */
  public boolean hasValidDate() {
    return date != null;
  }

  /** Перевіряє чи свято вже минуло (тільки для одноразових). */
  public boolean isPast(LocalDate currentDate) {
    if (isRecurring()) {
      return false; // Щорічні свята ніколи не минають
    }
    return date.isBefore(currentDate);
  }
}
