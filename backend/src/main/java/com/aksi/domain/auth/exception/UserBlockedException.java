package com.aksi.domain.auth.exception;

import java.time.LocalDateTime;

import lombok.Getter;

/** Виняток для заблокованих користувачів. */
@Getter
public class UserBlockedException extends RuntimeException {

  private final LocalDateTime lockedUntil;

  public UserBlockedException(String message) {
    super(message);
    this.lockedUntil = null;
  }

  public UserBlockedException(String username, LocalDateTime lockedUntil) {
    super("Користувач " + username + " заблокований до " + lockedUntil);
    this.lockedUntil = lockedUntil;
  }
}
