package com.aksi.domain.auth.exception;

import java.time.LocalDateTime;

/**
 * Виняток для заблокованих користувачів
 * Domain-specific RuntimeException
 */
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

    public UserBlockedException(String message, Throwable cause) {
        super(message, cause);
        this.lockedUntil = null;
    }

    public LocalDateTime getLockedUntil() {
        return lockedUntil;
    }
}
