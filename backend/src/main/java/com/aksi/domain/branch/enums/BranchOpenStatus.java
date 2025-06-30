package com.aksi.domain.branch.enums;

/** Статус роботи філії з business методами. Domain версія для внутрішньої бізнес-логіки. */
public enum BranchOpenStatus {
  OPEN("Відкрита"),
  CLOSED("Закрита"),
  HOLIDAY("Вихідний день");

  private final String displayName;

  BranchOpenStatus(String displayName) {
    this.displayName = displayName;
  }

  public String getDisplayName() {
    return displayName;
  }

  /** Перевіряє чи філія відкрита для обслуговування. */
  public boolean isOpen() {
    return this == OPEN;
  }

  /** Перевіряє чи філія закрита. */
  public boolean isClosed() {
    return this == CLOSED || this == HOLIDAY;
  }

  /** Перевіряє чи зараз вихідний день. */
  public boolean isHoliday() {
    return this == HOLIDAY;
  }

  /** Перевіряє чи клієнти можуть відвідувати філію. */
  public boolean isAccessibleToCustomers() {
    return this == OPEN;
  }
}
