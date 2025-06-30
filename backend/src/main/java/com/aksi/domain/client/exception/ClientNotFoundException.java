package com.aksi.domain.client.exception;

import java.util.UUID;

/** Виняток, що виникає коли клієнт не знайдений */
public class ClientNotFoundException extends RuntimeException {

  public ClientNotFoundException(String message) {
    super(message);
  }

  public ClientNotFoundException(String message, Throwable cause) {
    super(message, cause);
  }

  public static ClientNotFoundException byId(Long id) {
    return new ClientNotFoundException("Клієнт з ID " + id + " не знайдений");
  }

  public static ClientNotFoundException byUuid(UUID uuid) {
    return new ClientNotFoundException("Клієнт з UUID " + uuid + " не знайдений");
  }

  public static ClientNotFoundException byPhone(String phone) {
    return new ClientNotFoundException("Клієнт з телефоном " + phone + " не знайдений");
  }

  public static ClientNotFoundException byEmail(String email) {
    return new ClientNotFoundException("Клієнт з email " + email + " не знайдений");
  }
}
