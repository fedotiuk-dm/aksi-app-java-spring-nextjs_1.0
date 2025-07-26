package com.aksi.domain.branch.entity;

import java.time.LocalTime;

import com.aksi.shared.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entity representing a working schedule for a specific day of the week for a branch. Each branch
 * should have exactly 7 working schedule records (one for each day).
 */
@Entity
@Table(
    name = "working_schedules",
    uniqueConstraints =
        @UniqueConstraint(
            name = "uk_working_schedules_branch_day",
            columnNames = {"branch_id", "day_of_week"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WorkingScheduleEntity extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "branch_id", nullable = false)
  @NotNull
  private BranchEntity branch;

  @Column(name = "day_of_week", nullable = false)
  @Enumerated(EnumType.STRING)
  @NotNull
  private DayOfWeek dayOfWeek;

  @Column(name = "is_working_day", nullable = false)
  private boolean workingDay = false;

  @Column(name = "open_time")
  private LocalTime openTime;

  @Column(name = "close_time")
  private LocalTime closeTime;
}
