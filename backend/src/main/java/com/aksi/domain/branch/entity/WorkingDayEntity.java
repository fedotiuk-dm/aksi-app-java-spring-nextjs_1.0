package com.aksi.domain.branch.entity;

import java.time.LocalTime;
import java.util.UUID;

import com.aksi.shared.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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

/** Entity для робочого дня філії. Зберігає інформацію про час роботи в конкретний день тижня. */
@Entity
@Table(
    name = "working_days",
    indexes = {
      @Index(name = "idx_working_day_schedule", columnList = "working_schedule_id"),
      @Index(name = "idx_working_day_dow", columnList = "day_of_week"),
      @Index(name = "idx_working_day_uuid", columnList = "uuid")
    })
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true, exclude = "workingSchedule")
public class WorkingDayEntity extends BaseEntity {

  /**
   * UUID для API сумісності (зовнішній ідентифікатор) Внутрішньо використовуємо Long id з
   * BaseEntity.
   */
  @Column(name = "uuid", nullable = false, unique = true, updatable = false)
  @Builder.Default
  private UUID uuid = UUID.randomUUID();

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "working_schedule_id", nullable = false)
  private WorkingScheduleEntity workingSchedule;

  @Enumerated(EnumType.STRING)
  @Column(name = "day_of_week", nullable = false)
  private java.time.DayOfWeek dayOfWeek;

  @Column(name = "open_time")
  private LocalTime openTime;

  @Column(name = "close_time")
  private LocalTime closeTime;

  @Column(name = "is_working_day", nullable = false)
  @Builder.Default
  private Boolean isWorkingDay = false;

  @Column(name = "notes", length = 200)
  private String notes;

  // Business methods

  /** Перевіряє чи філія відкрита в заданий час. */
  public boolean isOpenAt(LocalTime time) {
    if (!isWorkingDay || openTime == null || closeTime == null) {
      return false;
    }

    // Обробляємо випадок коли філія працює після півночі
    if (closeTime.isBefore(openTime)) {
      return time.isAfter(openTime) || time.isBefore(closeTime);
    } else {
      return !time.isBefore(openTime) && !time.isAfter(closeTime);
    }
  }

  /** Перевіряє чи день робочий. */
  public boolean isWorkingDay() {
    return Boolean.TRUE.equals(isWorkingDay);
  }

  /** Отримує тривалість робочого дня в годинах. */
  public double getWorkingHours() {
    if (!isWorkingDay() || openTime == null || closeTime == null) {
      return 0.0;
    }

    long minutes;
    if (closeTime.isBefore(openTime)) {
      // Робота через північ
      minutes = (24 * 60) - (openTime.toSecondOfDay() / 60) + (closeTime.toSecondOfDay() / 60);
    } else {
      minutes = (closeTime.toSecondOfDay() - openTime.toSecondOfDay()) / 60;
    }

    return minutes / 60.0;
  }

  /** Отримує час роботи як рядок. */
  public String getWorkingHoursDisplay() {
    if (!isWorkingDay()) {
      return "Вихідний";
    }

    if (openTime == null || closeTime == null) {
      return "Час не встановлено";
    }

    return String.format("%s - %s", openTime, closeTime);
  }

  /** Перевіряє чи час роботи валідний. */
  public boolean hasValidWorkingHours() {
    return isWorkingDay() && openTime != null && closeTime != null;
  }

  /** Отримує назву дня тижня українською. */
  public String getDayDisplayName() {
    return switch (dayOfWeek) {
      case MONDAY -> "Понеділок";
      case TUESDAY -> "Вівторок";
      case WEDNESDAY -> "Середа";
      case THURSDAY -> "Четвер";
      case FRIDAY -> "П'ятниця";
      case SATURDAY -> "Субота";
      case SUNDAY -> "Неділя";
    };
  }
}
