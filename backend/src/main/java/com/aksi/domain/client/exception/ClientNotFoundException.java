package com.aksi.domain.client.exception;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/** Exception thrown when a client is not found */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ClientNotFoundException extends RuntimeException {

  public ClientNotFoundException(UUID id) {
    super("Client not found with id: " + id);
  }

  public ClientNotFoundException(String message) {
    super(message);
  }
}
