package com.aksi.domain.order.enums;

import java.util.Set;

/** Domain enum для статусу замовлення з business логікою переходів між станами. */
public enum OrderStatus {
  DRAFT("Чернетка"),
  NEW("Нове замовлення"),
  IN_PROGRESS("В роботі"),
  READY("Готове"),
  COMPLETED("Завершене"),
  CANCELLED("Скасоване");

  private final String description;

  OrderStatus(String description) {
    this.description = description;
  }

  public String getDescription() {
    return description;
  }

  /** Перевіряє чи замовлення в активному стані (можна змінювати). */
  public boolean isActive() {
    return this == DRAFT || this == NEW || this == IN_PROGRESS;
  }

  /** Перевіряє чи замовлення завершене (фінальний стан). */
  public boolean isCompleted() {
    return this == COMPLETED || this == CANCELLED;
  }

  /** Перевіряє чи можна додавати/видаляти предмети. */
  public boolean canModifyItems() {
    return this == DRAFT || this == NEW;
  }

  /** Перевіряє чи можна змінювати основну інформацію замовлення. */
  public boolean canModifyOrder() {
    return this == DRAFT || this == NEW || this == IN_PROGRESS;
  }

  /** Перевіряє чи можна скасувати замовлення. */
  public boolean canBeCancelled() {
    return this == DRAFT || this == NEW || this == IN_PROGRESS;
  }

  /** Перевіряє чи потрібна оплата. */
  public boolean requiresPayment() {
    return this == NEW || this == IN_PROGRESS || this == READY;
  }

  /** Отримує наступні доступні статуси для переходу. */
  public Set<OrderStatus> getNextAvailableStatuses() {
    return switch (this) {
      case DRAFT -> Set.of(NEW, CANCELLED);
      case NEW -> Set.of(IN_PROGRESS, CANCELLED);
      case IN_PROGRESS -> Set.of(READY, CANCELLED);
      case READY -> Set.of(COMPLETED);
      case COMPLETED, CANCELLED -> Set.of(); // Фінальні стани
    };
  }

  /** Перевіряє чи можливий перехід до іншого статусу. */
  public boolean canTransitionTo(OrderStatus newStatus) {
    return getNextAvailableStatuses().contains(newStatus);
  }

  /** Перевіряє чи статус потребує підпису клієнта. */
  public boolean requiresClientSignature() {
    return this == COMPLETED;
  }

  /** Перевіряє чи можна змінювати фото предметів. */
  public boolean canModifyPhotos() {
    return this == DRAFT || this == NEW || this == IN_PROGRESS;
  }
}
