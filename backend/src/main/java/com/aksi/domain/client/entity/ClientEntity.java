package com.aksi.domain.client.entity;

import java.util.Set;
import java.util.UUID;

import com.aksi.domain.client.enums.ClientSourceType;
import com.aksi.domain.client.enums.CommunicationMethodType;
import com.aksi.shared.BaseEntity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * JPA Entity для клієнта хімчистки
 * Розширює BaseEntity (ID, timestamps, isActive)
 */
@Entity
@Table(name = "clients", indexes = {
    @Index(name = "idx_client_uuid", columnList = "uuid", unique = true),
    @Index(name = "idx_client_phone", columnList = "phone"),
    @Index(name = "idx_client_email", columnList = "email"),
    @Index(name = "idx_client_active", columnList = "isActive"),
    @Index(name = "idx_client_fullname", columnList = "lastName, firstName")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true, of = {"uuid"})
@ToString(callSuper = true, exclude = {"communicationMethods"})
public class ClientEntity extends BaseEntity {

    @Column(name = "uuid", nullable = false, unique = true, updatable = false)
    private UUID uuid;

    @NotBlank(message = "Ім'я є обов'язковим")
    @Size(min = 2, max = 50, message = "Ім'я має бути від 2 до 50 символів")
    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @NotBlank(message = "Прізвище є обов'язковим")
    @Size(min = 2, max = 50, message = "Прізвище має бути від 2 до 50 символів")
    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @NotBlank(message = "Телефон є обов'язковим")
    @Pattern(regexp = "^\\+380\\d{9}$", message = "Телефон має бути в форматі +380XXXXXXXXX")
    @Column(name = "phone", nullable = false, unique = true, length = 13)
    private String phone;

    @Email(message = "Некоректний формат email")
    @Size(max = 100, message = "Email не може перевищувати 100 символів")
    @Column(name = "email", length = 100)
    private String email;

    @Size(max = 500, message = "Адреса не може перевищувати 500 символів")
    @Column(name = "address", length = 500)
    private String address;

    @ElementCollection(targetClass = CommunicationMethodType.class, fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "client_communication_methods",
                    joinColumns = @JoinColumn(name = "client_id"))
    @Column(name = "communication_method")
    @Builder.Default
    private Set<CommunicationMethodType> communicationMethods = Set.of();

    @Enumerated(EnumType.STRING)
    @Column(name = "source_type", length = 20)
    private ClientSourceType sourceType;

    @Size(max = 500, message = "Примітки не можуть перевищувати 500 символів")
    @Column(name = "notes", length = 500)
    private String notes;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    /**
     * Автогенерація UUID перед збереженням
     */
    @PrePersist
    private void generateUuid() {
        if (this.uuid == null) {
            this.uuid = UUID.randomUUID();
        }
    }

    /**
     * Business method: повне ім'я клієнта
     */
    public String getFullName() {
        return String.format("%s %s", lastName, firstName).trim();
    }

    /**
     * Business method: активний клієнт з контактним телефоном
     */
    public boolean hasValidContact() {
        return isActive && phone != null && !phone.trim().isEmpty();
    }

    /**
     * Business method: чи має клієнт email для зв'язку
     */
    public boolean hasEmailCommunication() {
        return email != null &&
               !email.trim().isEmpty() &&
               communicationMethods.contains(CommunicationMethodType.EMAIL);
    }

    /**
     * Business method: м'яке видалення клієнта
     */
    public void deactivate() {
        this.isActive = false;
    }
}
