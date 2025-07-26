package com.aksi.shared.embedded;

import com.aksi.shared.validation.ValidationConstants;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Embeddable class representing contact information. Contains phone and email fields with
 * appropriate validation.
 */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ContactInfo {

  @Pattern(
      regexp = ValidationConstants.Patterns.PHONE_PATTERN,
      message = ValidationConstants.Messages.PHONE_INVALID_FORMAT)
  @Size(max = ValidationConstants.Branch.PHONE_MAX_LENGTH)
  private String phone;

  @Email(message = ValidationConstants.Messages.EMAIL_SHOULD_BE_VALID)
  @Size(max = ValidationConstants.Branch.EMAIL_MAX_LENGTH)
  private String email;
}
