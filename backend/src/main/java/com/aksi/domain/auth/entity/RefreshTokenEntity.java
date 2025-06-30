package com.aksi.domain.auth.entity;

import java.time.LocalDateTime;

import com.aksi.shared.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/** Сутність для зберігання refresh токенів Для безпечного керування сесіями користувачів */
@Entity
@Table(
    name = "refresh_tokens",
    indexes = {
      @Index(name = "idx_refresh_token", columnList = "token", unique = true),
      @Index(name = "idx_refresh_token_user", columnList = "userId"),
      @Index(name = "idx_refresh_token_expires", columnList = "expiresAt"),
      @Index(name = "idx_refresh_token_active", columnList = "isActive")
    })
@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefreshTokenEntity extends BaseEntity {

  @Column(name = "token", nullable = false, unique = true, length = 500)
  private String token;

  @Column(name = "user_id", nullable = false)
  private Long userId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", insertable = false, updatable = false)
  private UserEntity user;

  @Column(name = "expires_at", nullable = false)
  private LocalDateTime expiresAt;

  @Column(name = "is_active", nullable = false)
  @Builder.Default
  private Boolean isActive = true;

  @Column(name = "device_info", length = 255)
  private String deviceInfo;

  @Column(name = "ip_address", length = 45)
  private String ipAddress;

  @Column(name = "last_used_at")
  private LocalDateTime lastUsedAt;

  // Business Methods

  /** Перевірка чи токен ще дійсний */
  public boolean isValid() {
    return Boolean.TRUE.equals(isActive) && expiresAt.isAfter(LocalDateTime.now());
  }

  /** Перевірка чи токен закінчився */
  public boolean isExpired() {
    return expiresAt.isBefore(LocalDateTime.now());
  }

  /** Відзначення використання токену */
  public void markAsUsed() {
    this.lastUsedAt = LocalDateTime.now();
  }

  /** Інвалідація токену */
  public void invalidate() {
    this.isActive = false;
  }

  /** Продовження терміну дії токену */
  public void extendExpiration(int daysToAdd) {
    this.expiresAt = LocalDateTime.now().plusDays(daysToAdd);
    this.lastUsedAt = LocalDateTime.now();
  }

  /** Оновлення інформації про пристрій */
  public void updateDeviceInfo(String deviceInfo, String ipAddress) {
    this.deviceInfo = deviceInfo;
    this.ipAddress = ipAddress;
  }
}
