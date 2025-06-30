package com.aksi.domain.item.calculator;

import java.util.List;

import com.aksi.api.item.dto.CalculationStep;

import lombok.Builder;
import lombok.Data;

/** Результат розрахунку ціни предмета ВИКОРИСТОВУЄ DTO CalculationStep (OpenAPI First!). */
@Data
@Builder
public class CalculationResult {

  /** Початкова базова ціна. */
  private Double basePrice;

  /** Фінальна ціна після всіх модифікаторів. */
  private Double finalPrice;

  /** Загальна сума модифікацій. */
  private Double totalModification;

  /** Кроки розрахунку (ВИКОРИСТОВУЄМО DTO!). */
  private List<CalculationStep> steps;

  /** Чи був успішний розрахунок. */
  @Builder.Default private Boolean success = true;

  /** Повідомлення про помилку (якщо є). */
  private String errorMessage;

  /** Отримати загальну модифікацію Використовує збережене значення або розраховує за потреби. */
  public Double getTotalModification() {
    if (totalModification != null) {
      return totalModification;
    }
    if (basePrice == null || finalPrice == null) {
      return 0.0;
    }
    return finalPrice - basePrice;
  }

  /** Перевірити чи є позитивною зміною. */
  public boolean isPositiveChange() {
    return getTotalModification() > 0;
  }

  /** Перевірити чи є негативною зміною. */
  public boolean isNegativeChange() {
    return getTotalModification() < 0;
  }
}
