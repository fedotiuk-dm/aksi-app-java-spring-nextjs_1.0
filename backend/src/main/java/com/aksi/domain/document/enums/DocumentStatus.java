package com.aksi.domain.document.enums;

/**
 * Domain enum для статусів документів з business логікою. Синхронізовано з API enum:
 * com.aksi.api.document.dto.DocumentStatus
 */
public enum DocumentStatus {
  DRAFT("DRAFT", "Чернетка", true, false),
  GENERATED("GENERATED", "Згенеровано", true, false),
  SIGNED("SIGNED", "Підписано", false, true),
  PRINTED("PRINTED", "Роздруковано", false, true),
  ARCHIVED("ARCHIVED", "Заархівовано", false, true);

  private final String code;
  private final String displayName;
  private final boolean canBeModified;
  private final boolean isCompleted;

  DocumentStatus(String code, String displayName, boolean canBeModified, boolean isCompleted) {
    this.code = code;
    this.displayName = displayName;
    this.canBeModified = canBeModified;
    this.isCompleted = isCompleted;
  }

  public String getCode() {
    return code;
  }

  public String getDisplayName() {
    return displayName;
  }

  // Business methods
  public boolean isDraft() {
    return this == DRAFT;
  }

  public boolean isGenerated() {
    return this == GENERATED;
  }

  public boolean isSigned() {
    return this == SIGNED;
  }

  public boolean isPrinted() {
    return this == PRINTED;
  }

  public boolean isArchived() {
    return this == ARCHIVED;
  }

  public boolean canBeModified() {
    return canBeModified;
  }

  public boolean isCompleted() {
    return isCompleted;
  }

  public boolean canBeSignated() {
    return this == GENERATED; // Тільки згенеровані документи можна підписувати
  }

  public boolean canBePrinted() {
    return this == SIGNED || this == GENERATED; // Можна друкувати підписані або згенеровані
  }

  public boolean canBeArchived() {
    return this == PRINTED; // Архівувати тільки роздруковані
  }

  public boolean requiresApproval() {
    return this == DRAFT || this == GENERATED;
  }

  public boolean isReadOnly() {
    return !canBeModified;
  }
}
