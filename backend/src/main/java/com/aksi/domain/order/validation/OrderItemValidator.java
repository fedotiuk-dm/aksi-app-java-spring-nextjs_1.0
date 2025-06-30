package com.aksi.domain.order.validation;

import java.math.BigDecimal;
import java.util.Set;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.entity.OrderEntity;
import com.aksi.domain.order.entity.OrderItemEntity;
import com.aksi.domain.order.enums.DefectType;
import com.aksi.domain.order.enums.ServiceCategory;
import com.aksi.domain.order.enums.StainType;
import com.aksi.domain.order.exception.OrderItemValidationException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Validator для ТІЛЬКИ складних бізнес-правил OrderItem domain.
 *
 * <p>РОЗДІЛЕННЯ ВАЛІДАЦІЇ: - OpenAPI Bean Validation: @NotNull, @Size, @Min, @Max, @Pattern -
 * форматна валідація - Domain Validation: складні бізнес-правила, сумісність, стан системи
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OrderItemValidator {

  /** Валідація складних бізнес-правил при створенні позиції. */
  public void validateForCreate(OrderItemEntity item) {
    log.debug("Валідація бізнес-правил для створення позиції: {}", item.getItemName());

    validateStainMaterialCompatibility(item);
    validateDefectServiceCompatibility(item);
    validatePriceBusinessLogic(item);
  }

  /** Валідація складних бізнес-правил при оновленні позиції. */
  public void validateForUpdate(OrderItemEntity existingItem, OrderItemEntity updatedItem) {
    log.debug("Валідація бізнес-правил для оновлення позиції: {}", existingItem.getId());

    validateUpdatePermissions(existingItem, updatedItem);
    validateForCreate(updatedItem);
  }

  /** Валідація додавання позиції до замовлення. */
  public void validateForAddToOrder(OrderEntity order, OrderItemEntity item) {
    validateOrderAcceptsItems(order);
    validateItemOrderCompatibility(order, item);
    validateCriticalDefectConsentForOrder(order, item);
    validateForCreate(item);
  }

  // === СКЛАДНІ БІЗНЕС-ПРАВИЛА ===

  /** БІЗНЕС-ПРАВИЛО: Сумісність забруднень з матеріалом та категорією. */
  private void validateStainMaterialCompatibility(OrderItemEntity item) {
    if (item.getStains() == null || item.getStains().isEmpty()) {
      return;
    }

    for (StainType stain : item.getStains()) {
      // БІЗНЕС-ПРАВИЛО: Деякі забруднення несумісні з певними матеріалами
      if (!isStainCompatibleWithMaterial(stain, item.getMaterial())) {
        throw OrderItemValidationException.incompatibleStainWithMaterial(
            stain.name(), item.getMaterial());
      }

      // БІЗНЕС-ПРАВИЛО: Деякі забруднення несумісні з категорією обробки
      if (!isStainCompatibleWithCategory(stain, item.getCategory())) {
        throw OrderItemValidationException.incompatibleDefectWithCategory(
            stain.name(), item.getCategory().name());
      }
    }

    // БІЗНЕС-ПРАВИЛО: Деякі комбінації забруднень несумісні
    validateStainCombinations(item.getStains());
  }

  /** БІЗНЕС-ПРАВИЛО: Сумісність дефектів з категорією обслуговування. */
  private void validateDefectServiceCompatibility(OrderItemEntity item) {
    if (item.getDefects() == null || item.getDefects().isEmpty()) {
      return;
    }

    for (DefectType defect : item.getDefects()) {
      // БІЗНЕС-ПРАВИЛО: Не всі категорії можуть обробляти критичні дефекти
      if (defect.name().contains("CRITICAL") && !canHandleCriticalDefects(item.getCategory())) {
        throw OrderItemValidationException.incompatibleDefectWithCategory(
            defect.name(), item.getCategory().name());
      }
    }

    // БІЗНЕС-ПРАВИЛО: Критичні дефекти потребують згоди клієнта
    validateCriticalDefectConsent(item.getDefects());
  }

  /** БІЗНЕС-ПРАВИЛО: Логіка ціноутворення. */
  private void validatePriceBusinessLogic(OrderItemEntity item) {
    // БІЗНЕС-ПРАВИЛО: Фінальна ціна не може бути менше 50% від базової
    BigDecimal minPrice = item.getBasePrice().multiply(BigDecimal.valueOf(0.5));
    if (item.getFinalPrice().compareTo(minPrice) < 0) {
      throw OrderItemValidationException.invalidPrice(
          "Фінальна ціна не може бути менше 50% від базової");
    }

    // БІЗНЕС-ПРАВИЛО: Фінальна ціна не може бути більше 300% від базової без модифікаторів
    if (!item.hasModifiers()) {
      BigDecimal maxPrice = item.getBasePrice().multiply(BigDecimal.valueOf(3.0));
      if (item.getFinalPrice().compareTo(maxPrice) > 0) {
        throw OrderItemValidationException.invalidPrice(
            "Фінальна ціна перевищує максимум без модифікаторів");
      }
    }
  }

  /** БІЗНЕС-ПРАВИЛО: Дозволи на оновлення залежно від стану замовлення. */
  private void validateUpdatePermissions(
      OrderItemEntity existingItem, OrderItemEntity updatedItem) {
    // БІЗНЕС-ПРАВИЛО: Заборона зміни категорії після початку обробки
    if (existingItem.getOrder() != null
        && existingItem.getOrder().getStatus().name().contains("IN_PROGRESS")) {

      if (!existingItem.getCategory().equals(updatedItem.getCategory())) {
        throw OrderItemValidationException.incompatibleMaterialWithCategory(
            "Неможливо змінити категорію", "після початку обробки");
      }
    }
  }

  /** БІЗНЕС-ПРАВИЛО: Замовлення може приймати нові предмети. */
  private void validateOrderAcceptsItems(OrderEntity order) {
    // БІЗНЕС-ПРАВИЛО: Не можна додавати предмети до завершених замовлень
    if (order.getStatus().name().contains("COMPLETED")
        || order.getStatus().name().contains("CANCELLED")) {
      throw new OrderItemValidationException(
          "Неможливо додати предмети до замовлення зі статусом: " + order.getStatus());
    }
  }

  /** БІЗНЕС-ПРАВИЛО: Сумісність предмета з типом замовлення. */
  private void validateItemOrderCompatibility(OrderEntity order, OrderItemEntity item) {
    // БІЗНЕС-ПРАВИЛО: Термінові замовлення мають обмеження категорій
    if (order.getUrgency() != null && order.getUrgency().name().contains("URGENT")) {
      if (!supportsUrgentProcessing(item.getCategory())) {
        throw OrderItemValidationException.incompatibleDefectWithCategory(
            item.getCategory().name(), "термінову обробку");
      }
    }
  }

  // === HELPER МЕТОДИ ДЛЯ БІЗНЕС-ЛОГІКИ ===

  private boolean isStainCompatibleWithMaterial(StainType stain, String material) {
    // БІЗНЕС-ЛОГІКА: наприклад, масляні плями важко виводяти з деякими матеріалами
    return !(stain.name().contains("OIL") && "SILK".equals(material));
  }

  private boolean isStainCompatibleWithCategory(StainType stain, ServiceCategory category) {
    // БІЗНЕС-ЛОГІКА: не всі категорії можуть обробляти всі види забруднень
    return !(stain.name().contains("PAINT") && category.name().contains("DRY_CLEANING_ONLY"));
  }

  private void validateStainCombinations(Set<StainType> stains) {
    // БІЗНЕС-ПРАВИЛО: деякі комбінації забруднень ускладнюють обробку
    if (stains.size() > 3) {
      throw OrderItemValidationException.incompatibleStainWithMaterial(
          "Понад 3 типів забруднень", "потребує спеціальної обробки");
    }
  }

  private boolean canHandleCriticalDefects(ServiceCategory category) {
    // БІЗНЕС-ЛОГІКА: не всі категорії обслуговування можуть працювати з критичними дефектами
    return !category.name().contains("BASIC");
  }

  /** БІЗНЕС-ПРАВИЛО: Перевірка згоди клієнта для замовлення з критичними дефектами. */
  private void validateCriticalDefectConsentForOrder(OrderEntity order, OrderItemEntity item) {
    boolean itemHasCriticalDefects =
        item.getDefects() != null
            && item.getDefects().stream().anyMatch(defect -> defect.name().contains("CRITICAL"));

    if (itemHasCriticalDefects && !order.hasConsentForCriticalDefects()) {
      throw OrderItemValidationException.criticalDefectRequiresConsent(
          "Предмет містить критичні дефекти, але немає згоди клієнта");
    }
  }

  private void validateCriticalDefectConsent(Set<DefectType> defects) {
    boolean hasCriticalDefects =
        defects.stream().anyMatch(defect -> defect.name().contains("CRITICAL"));

    if (hasCriticalDefects) {
      // Логування для інформації - основна перевірка в validateCriticalDefectConsentForOrder
      log.debug("Предмет має критичні дефекти - перевірте згоду клієнта в замовленні");
    }
  }

  private boolean supportsUrgentProcessing(ServiceCategory category) {
    // БІЗНЕС-ЛОГІКА: не всі категорії підтримують термінову обробку
    return !category.name().contains("COMPLEX");
  }
}
