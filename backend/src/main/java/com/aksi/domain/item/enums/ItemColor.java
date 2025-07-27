package com.aksi.domain.item.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/** Item colors for price calculation. Different colors may have different pricing. */
@Getter
@RequiredArgsConstructor
public enum ItemColor {
  BLACK("Чорний", true),
  WHITE("Білий", false),
  GRAY("Сірий", false),
  BROWN("Коричневий", false),
  NAVY("Темно-синій", false),
  BLUE("Синій", false),
  GREEN("Зелений", false),
  RED("Червоний", false),
  BEIGE("Бежевий", false),
  CREAM("Кремовий", false),
  PINK("Рожевий", false),
  YELLOW("Жовтий", false),
  PURPLE("Фіолетовий", false),
  MULTICOLOR("Різнокольоровий", false),
  OTHER("Інший", false);

  private final String displayName;
  private final boolean isBlack;

  /**
   * Check if this is a base color (not black or colored)
   *
   * @return true if this is considered a base color
   */
  public boolean isBaseColor() {
    return this == WHITE || this == GRAY || this == BEIGE || this == CREAM;
  }

  /**
   * Check if this color requires special pricing
   *
   * @return true if this color has special pricing (black or colored)
   */
  public boolean hasSpecialPricing() {
    return isBlack || (!isBaseColor() && this != OTHER);
  }
}
