package com.aksi.domain.order.exception;

/** Exception який кидається при порушенні business rules предметів замовлення. */
public class OrderItemValidationException extends RuntimeException {

  public OrderItemValidationException(String message) {
    super(message);
  }

  public OrderItemValidationException(String message, Throwable cause) {
    super(message, cause);
  }

  /** Для помилок сумісності матеріалу з категорією. */
  public static OrderItemValidationException incompatibleMaterialWithCategory(
      String material, String category) {
    return new OrderItemValidationException(
        String.format("Матеріал %s несумісний з категорією послуги %s", material, category));
  }

  /** Для помилок сумісності плям з матеріалом. */
  public static OrderItemValidationException incompatibleStainWithMaterial(
      String stain, String material) {
    return new OrderItemValidationException(
        String.format("Пляма %s несумісна з матеріалом %s", stain, material));
  }

  /** Для помилок сумісності дефектів з категорією. */
  public static OrderItemValidationException incompatibleDefectWithCategory(
      String defect, String category) {
    return new OrderItemValidationException(
        String.format("Дефект %s несумісний з категорією послуги %s", defect, category));
  }

  /** Для помилок критичних дефектів без підтвердження. */
  public static OrderItemValidationException criticalDefectRequiresConsent(String defects) {
    return new OrderItemValidationException(
        "Критичні дефекти потребують підтвердження клієнта: " + defects);
  }

  /** Для помилок некоректних цін. */
  public static OrderItemValidationException invalidPrice(String reason) {
    return new OrderItemValidationException("Некоректна ціна предмету: " + reason);
  }

  /** Для помилок кількості. */
  public static OrderItemValidationException invalidQuantity(int quantity) {
    return new OrderItemValidationException(
        "Некоректна кількість предметів: " + quantity + ". Має бути більше 0");
  }
}
