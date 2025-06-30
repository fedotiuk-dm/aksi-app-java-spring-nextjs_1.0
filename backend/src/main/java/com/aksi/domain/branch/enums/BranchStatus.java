package com.aksi.domain.branch.enums;

/** Статус філії з business методами. Domain версія для внутрішньої бізнес-логіки. */
public enum BranchStatus {
  ACTIVE("Активна"),
  INACTIVE("Неактивна"),
  TEMPORARILY_CLOSED("Тимчасово закрита"),
  UNDER_RENOVATION("На ремонті");

  private final String displayName;

  BranchStatus(String displayName) {
    this.displayName = displayName;
  }

  public String getDisplayName() {
    return displayName;
  }

  /** Перевіряє чи філія активна та приймає замовлення. */
  public boolean isActive() {
    return this == ACTIVE;
  }

  /** Перевіряє чи філія доступна для клієнтів (не на ремонті та не неактивна). */
  public boolean isAvailableForCustomers() {
    return this == ACTIVE || this == TEMPORARILY_CLOSED;
  }

  /** Перевіряє чи філія може приймати нові замовлення. */
  public boolean canAcceptOrders() {
    return this == ACTIVE;
  }

  /** Перевіряє чи філія потребує обслуговування. */
  public boolean requiresMaintenance() {
    return this == UNDER_RENOVATION;
  }

  /** Перевіряє чи статус тимчасовий. */
  public boolean isTemporary() {
    return this == TEMPORARILY_CLOSED || this == UNDER_RENOVATION;
  }
}
