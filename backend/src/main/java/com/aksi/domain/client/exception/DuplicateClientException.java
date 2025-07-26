package com.aksi.domain.client.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/** Exception thrown when trying to create a client with an already existing phone number */
@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicateClientException extends RuntimeException {

  public DuplicateClientException(String phone) {
    super("Client with phone number already exists: " + phone);
  }
}
