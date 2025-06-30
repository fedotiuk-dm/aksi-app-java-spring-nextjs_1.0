package com.aksi.domain.client.validation;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.client.enums.CommunicationMethodType;
import com.aksi.domain.client.exception.ClientAlreadyExistsException;
import com.aksi.domain.client.exception.ClientValidationException;
import com.aksi.domain.client.repository.ClientRepository;

import lombok.RequiredArgsConstructor;

/** Validator для бізнес-правил клієнтів Тільки те що неможливо зробити через Bean Validation. */
@Component
@RequiredArgsConstructor
public class ClientValidator {

  private final ClientRepository clientRepository;

  /** Валідація унікальності для нового клієнта. */
  public void validateUniqueness(ClientEntity client) {
    // Перевірка унікальності телефону
    if (clientRepository.existsByPhone(client.getPhone())) {
      throw ClientAlreadyExistsException.byPhone(client.getPhone());
    }

    // Перевірка унікальності email (якщо вказаний)
    if (StringUtils.hasText(client.getEmail())
        && clientRepository.existsByEmail(client.getEmail())) {
      throw ClientAlreadyExistsException.byEmail(client.getEmail());
    }
  }

  /** Валідація унікальності для оновлення клієнта. */
  public void validateUniquenessForUpdate(ClientEntity client) {
    // Перевірка унікальності телефону (виключаючи поточного клієнта)
    clientRepository
        .findByPhone(client.getPhone())
        .filter(existingClient -> !existingClient.getId().equals(client.getId()))
        .ifPresent(
            existingClient -> {
              throw ClientAlreadyExistsException.byPhone(client.getPhone());
            });

    // Перевірка унікальності email (якщо вказаний, виключаючи поточного клієнта)
    if (StringUtils.hasText(client.getEmail())) {
      clientRepository
          .findByEmail(client.getEmail())
          .filter(existingClient -> !existingClient.getId().equals(client.getId()))
          .ifPresent(
              existingClient -> {
                throw ClientAlreadyExistsException.byEmail(client.getEmail());
              });
    }
  }

  /** Бізнес-правило: Валідація можливості видалення клієнта. */
  public void validateForDeletion(ClientEntity client) {
    // Перевірка чи має клієнт активні замовлення
    if (client.getTotalOrders() != null && client.getTotalOrders() > 0) {
      throw new ClientValidationException(
          "Неможливо видалити клієнта з існуючими замовленнями. "
              + "Клієнт має "
              + client.getTotalOrders()
              + " замовлень");
    }
  }

  /** Бізнес-правило: Валідація контактної інформації. */
  public void validateContactInfo(ClientEntity client) {
    // Якщо вибрано EMAIL як спосіб зв'язку, email має бути вказаний
    if (client.getCommunicationMethods() != null
        && client.getCommunicationMethods().contains(CommunicationMethodType.EMAIL)
        && !StringUtils.hasText(client.getEmail())) {
      throw new ClientValidationException(
          "Email має бути вказаний якщо вибрано EMAIL як спосіб зв'язку");
    }
  }

  /** Бізнес-правило: Валідація VIP статусу. */
  public void validateVipStatus(ClientEntity client) {
    if (client.getIsVip() != null && client.getIsVip()) {
      // VIP клієнт повинен мати принаймні одне замовлення або значну суму витрат
      boolean hasEnoughOrders = client.getTotalOrders() != null && client.getTotalOrders() >= 5;
      boolean hasEnoughSpending =
          client.getTotalSpent() != null
              && client.getTotalSpent().compareTo(java.math.BigDecimal.valueOf(1000)) >= 0;

      if (!hasEnoughOrders && !hasEnoughSpending) {
        throw new ClientValidationException(
            "VIP статус надається клієнтам з мінімум 5 замовленнями або витратами понад 1000 грн");
      }
    }
  }
}
