package com.aksi.domain.client.enums;

/** Джерело надходження клієнта Синхронізовано з OpenAPI enum ClientSourceType */
public enum ClientSourceType {

  /** Рекомендація */
  REFERRAL("Рекомендація"),

  /** Реклама */
  ADVERTISING("Реклама"),

  /** Соціальні мережі */
  SOCIAL_MEDIA("Соціальні мережі"),

  /** Веб-сайт */
  WEBSITE("Веб-сайт"),

  /** Проходив повз */
  WALKING_BY("Проходив повз"),

  /** Постійний клієнт */
  REPEAT_CUSTOMER("Постійний клієнт"),

  /** Інше */
  OTHER("Інше");

  private final String description;

  ClientSourceType(String description) {
    this.description = description;
  }

  public String getDescription() {
    return description;
  }

  /** Domain-specific метод для перевірки чи є джерело онлайн */
  public boolean isOnlineSource() {
    return this == SOCIAL_MEDIA || this == WEBSITE;
  }

  /** Domain-specific метод для перевірки чи є джерело персональним */
  public boolean isPersonalSource() {
    return this == REFERRAL || this == REPEAT_CUSTOMER;
  }

  /** Domain-specific метод для перевірки чи є джерело випадковим */
  public boolean isRandomSource() {
    return this == WALKING_BY || this == OTHER;
  }
}
