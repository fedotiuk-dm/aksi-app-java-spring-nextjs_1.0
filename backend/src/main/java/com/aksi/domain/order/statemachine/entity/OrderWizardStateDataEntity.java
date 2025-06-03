package com.aksi.domain.order.statemachine.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * Entity для збереження детальних даних стану Order Wizard
 * Зберігає дані кожного кроку wizard у вигляді ключ-значення
 */
@Entity
@Table(
    name = "order_wizard_state_data",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_wizard_state_data_unique",
            columnNames = {"wizard_session_id", "data_key"}
        )
    }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"wizardSession"})
@ToString(exclude = {"wizardSession"})
public class OrderWizardStateDataEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wizard_session_id", nullable = false)
    private OrderWizardSessionEntity wizardSession;

    @NotNull
    @Column(name = "stage", nullable = false)
    private Integer stage;

    @NotNull
    @Column(name = "step", nullable = false)
    private Integer step;

    @NotNull
    @Size(max = 100)
    @Column(name = "data_key", nullable = false, length = 100)
    private String dataKey;

    @Column(name = "data_value", columnDefinition = "TEXT")
    private String dataValue;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "data_type", nullable = false, length = 50)
    private DataType dataType = DataType.JSON;

    @NotNull
    @Builder.Default
    @Column(name = "is_validated", nullable = false)
    private Boolean isValidated = false;

    @Column(name = "validation_errors", columnDefinition = "TEXT")
    private String validationErrors;

    @NotNull
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @NotNull
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    /**
     * Типи даних для збереження
     */
    public enum DataType {
        JSON,       // JSON об'єкти
        STRING,     // Прості рядки
        NUMBER,     // Числа
        BOOLEAN,    // Булеві значення
        ARRAY,      // Масиви
        BINARY      // Бінарні дані (для фото)
    }

    /**
     * Позначає дані як валідні
     */
    public void markAsValidated() {
        this.isValidated = true;
        this.validationErrors = null;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Додає помилки валідації
     */
    public void addValidationErrors(String errors) {
        this.isValidated = false;
        this.validationErrors = errors;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Оновлює значення даних
     */
    public void updateValue(String newValue) {
        this.dataValue = newValue;
        this.isValidated = false; // Потрібна повторна валідація
        this.validationErrors = null;
        this.updatedAt = LocalDateTime.now();
    }
}
