package com.aksi.validator;

import org.springframework.stereotype.Component;

import com.aksi.service.user.UserQueryService;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.RequiredArgsConstructor;

/** Validator to check if username is unique. */
@Component
@RequiredArgsConstructor
public class UniqueUsernameValidator implements ConstraintValidator<UniqueUsername, String> {

  private final UserQueryService userQueryService;

  @Override
  public boolean isValid(String username, ConstraintValidatorContext context) {
    if (username == null || username.isBlank()) {
      return true; // Let @NotBlank handle this
    }
    return !userQueryService.existsByUsername(username);
  }
}
