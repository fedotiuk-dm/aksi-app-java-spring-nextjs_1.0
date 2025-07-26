package com.aksi.domain.auth.entity;

import java.time.Instant;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import com.aksi.shared.validation.ValidationConstants;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Entity for storing refresh tokens */
@Entity
@Table(name = "refresh_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshTokenEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(
      nullable = false,
      unique = true,
      length = ValidationConstants.RefreshToken.TOKEN_MAX_LENGTH)
  private String token;

  @Column(nullable = false, length = ValidationConstants.RefreshToken.USERNAME_MAX_LENGTH)
  private String username;

  @Column(nullable = false)
  private Instant expiryDate;

  @Column(nullable = false)
  private boolean revoked;

  @Column private String deviceInfo; // Hibernate auto-converts to device_info, default length 255

  @Column(length = ValidationConstants.RefreshToken.IP_ADDRESS_MAX_LENGTH)
  private String ipAddress; // Hibernate auto-converts to ip_address

  @CreationTimestamp
  @Column(updatable = false)
  private Instant createdAt;

  @Column(name = "revoked_at")
  private Instant revokedAt;
}
