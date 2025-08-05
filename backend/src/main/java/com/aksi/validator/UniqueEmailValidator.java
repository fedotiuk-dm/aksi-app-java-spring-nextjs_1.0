package com.aksi.validator;

import org.springframework.stereotype.Component;

import com.aksi.service.user.UserQueryService;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.RequiredArgsConstructor;

/** Validator to check if email is unique. */
@Component
@RequiredArgsConstructor
public class UniqueEmailValidator implements ConstraintValidator<UniqueEmail, String> {

  private final UserQueryService userQueryService;

  @Override
  public boolean isValid(String email, ConstraintValidatorContext context) {
    if (email == null || email.isBlank()) {
      return true; // Let @NotBlank/@Email handle this
    }
    return !userQueryService.existsByEmail(email);
  }
}
