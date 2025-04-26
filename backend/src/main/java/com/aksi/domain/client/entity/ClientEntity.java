package com.aksi.domain.client.entity;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Сутність клієнта хімчистки.
 */
@Entity
@Table(name = "clients")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientEntity {

    /**
     * Унікальний ідентифікатор клієнта.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * Прізвище клієнта.
     */
    @NotBlank(message = "Прізвище не може бути пустим")
    @Column(name = "last_name", nullable = false)
    private String lastName;

    /**
     * Ім'я клієнта.
     */
    @NotBlank(message = "Ім'я не може бути пустим")
    @Column(name = "first_name", nullable = false)
    private String firstName;

    /**
     * Основний номер телефону клієнта.
     */
    @NotBlank(message = "Телефон не може бути пустим")
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Некоректний формат телефону")
    @Column(nullable = false, unique = true)
    private String phone;

    /**
     * Email адреса клієнта.
     */
    @Email(message = "Некоректний формат email")
    @Column(unique = true)
    private String email;

    /**
     * Адреса клієнта.
     */
    @Column(length = 500)
    private String address;

    /**
     * Набір каналів комунікації, які обрав клієнт.
     */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "client_communication_channels", 
            joinColumns = @JoinColumn(name = "client_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "channel")
    @Builder.Default
    private Set<CommunicationChannelEntity> communicationChannels = new HashSet<>();

    /**
     * Джерело, звідки клієнт дізнався про хімчистку.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "source")
    private ClientSourceEntity source;

    /**
     * Уточнення джерела, якщо вибрано "Інше".
     */
    @Column(name = "source_details", length = 255)
    private String sourceDetails;

    /**
     * Дата та час створення запису.
     */
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    /**
     * Дата та час останнього оновлення запису.
     */
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
