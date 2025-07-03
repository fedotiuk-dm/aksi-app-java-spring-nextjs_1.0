package com.aksi.domain.item.entity;

import com.aksi.shared.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/** Entity для довідника кольорів предметів Відповідає таблиці item_colors */
@Entity
@Table(name = "item_colors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
public class ItemColorEntity extends BaseEntity {

  /** Код кольору (відповідає ItemColor enum з OpenAPI) Приклади: BLACK, WHITE, RED, BLUE, OTHER */
  @Column(name = "code", nullable = false, unique = true, length = 20)
  private String code;

  /** Українська назва кольору Приклади: "Чорний", "Білий", "Червоний" */
  @Column(name = "name_uk", nullable = false, length = 50)
  private String nameUk;

  /** Англійська назва кольору Приклади: "Black", "White", "Red" */
  @Column(name = "name_en", nullable = false, length = 50)
  private String nameEn;

  /**
   * HEX код кольору для відображення в UI Приклади: "#000000", "#FFFFFF", "#FF0000" NULL для
   * MULTICOLOR та OTHER
   */
  @Column(name = "hex_color", length = 7)
  private String hexColor;

  /** Чи впливає цей колір на ціну TRUE для BLACK та MULTICOLOR (мають спеціальне ціноутворення) */
  @Column(name = "affects_price", nullable = false)
  @Builder.Default
  private Boolean affectsPrice = false;

  /** Порядок сортування для відображення в UI */
  @Column(name = "sort_order", nullable = false)
  @Builder.Default
  private Integer sortOrder = 1;

  /** Чи активний цей колір Дозволяє приховувати кольори без видалення з БД */
  @Column(name = "is_active", nullable = false)
  @Builder.Default
  private Boolean isActive = true;

  // Business методи

  /** Перевіряє чи це чорний колір (має спеціальну ціну) */
  public boolean isBlackColor() {
    return "BLACK".equals(code);
  }

  /** Перевіряє чи це кольоровий предмет (не чорний і не білий) */
  public boolean isColoredItem() {
    return !isBlackColor() && !"WHITE".equals(code);
  }

  /** Перевіряє чи це спеціальний колір (різнокольоровий або інший) */
  public boolean isSpecialColor() {
    return "MULTICOLOR".equals(code) || "OTHER".equals(code);
  }

  /** Отримує відображувану назву для заданої мови */
  public String getDisplayName(String language) {
    if ("uk".equals(language) || "ua".equals(language)) {
      return nameUk;
    }
    return nameEn;
  }

  /** Перевіряє чи можна використовувати цей колір */
  public boolean isUsable() {
    return isActive != null && isActive;
  }
}
