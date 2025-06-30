package com.aksi.domain.order.enums;

import java.util.Set;

/** Domain enum для типів плям з business логікою обробки. */
public enum StainType {
  FAT("Жир", "fatty"),
  BLOOD("Кров", "protein"),
  PROTEIN("Білок", "protein"),
  WINE("Вино", "tannin"),
  COFFEE("Кава", "tannin"),
  GRASS("Трава", "chlorophyll"),
  INK("Чорнило", "dye"),
  COSMETICS("Косметика", "mixed"),
  OTHER("Інше", "unknown");

  private final String description;
  private final String chemicalGroup;

  StainType(String description, String chemicalGroup) {
    this.description = description;
    this.chemicalGroup = chemicalGroup;
  }

  public String getDescription() {
    return description;
  }

  public String getChemicalGroup() {
    return chemicalGroup;
  }

  /** Перевіряє чи пляма потребує спеціальної обробки. */
  public boolean requiresSpecialTreatment() {
    return this == BLOOD || this == WINE || this == INK;
  }

  /** Перевіряє чи пляма може бути видалена стандартними засобами. */
  public boolean isRemovableWithStandardTreatment() {
    return this == FAT || this == GRASS || this == COFFEE;
  }

  /** Перевіряє чи пляма потребує попередньої обробки. */
  public boolean requiresPreTreatment() {
    return this == BLOOD || this == PROTEIN || this == WINE;
  }

  /** Перевіряє чи пляма може залишити постійний слід. */
  public boolean canCausePermanentDamage() {
    return this == INK || this == WINE || this == OTHER;
  }

  /** Отримує рекомендовану температуру обробки. */
  public int getRecommendedTemperature() {
    return switch (this) {
      case BLOOD, PROTEIN -> 30; // Низька температура для білків
      case FAT -> 60; // Висока температура для жирів
      case WINE, COFFEE -> 40; // Середня температура для танінів
      case GRASS -> 50; // Середня-висока для хлорофілу
      case INK, COSMETICS -> 20; // Холодна вода
      case OTHER -> 30; // Безпечна температура
    };
  }

  /** Перевіряє сумісність з типом тканини. */
  public boolean isCompatibleWithMaterial(String material) {
    if (material == null) return true;

    String materialLower = material.toLowerCase();

    // Шовк і делікатні тканини не переносять агресивну обробку
    if (materialLower.contains("шовк") || materialLower.contains("шифон")) {
      return !requiresSpecialTreatment();
    }

    return true;
  }

  /** Отримує плями що потребують негайної обробки. */
  public static Set<StainType> getUrgentTreatmentStains() {
    return Set.of(BLOOD, WINE, INK);
  }

  /** Отримує плями що можуть взаємодіяти з іншими плямами. */
  public static Set<StainType> getInteractiveStains() {
    return Set.of(INK, COSMETICS, OTHER);
  }

  /** Перевіряє чи плями можуть взаємодіяти між собою. */
  public boolean canInteractWith(StainType other) {
    if (this == other) return false;

    // Чорнило може взаємодіяти майже з усім
    if (this == INK || other == INK) {
      return true;
    }

    // Білкові плями можуть реагувати з кислотними
    return (this == BLOOD || this == PROTEIN) && (other == WINE || other == COFFEE);
  }

  /** Отримує рівень складності видалення (1-5). */
  public int getDifficultyLevel() {
    return switch (this) {
      case FAT, GRASS -> 2; // Легко
      case COFFEE, COSMETICS -> 3; // Середньо
      case PROTEIN, BLOOD -> 4; // Складно
      case WINE, INK -> 5; // Дуже складно
      case OTHER -> 3; // Невідомо, середній рівень
    };
  }
}
