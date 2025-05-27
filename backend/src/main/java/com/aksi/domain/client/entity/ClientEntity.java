package com.aksi.domain.client.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.aksi.domain.client.enums.ClientSource;
import com.aksi.domain.order.entity.OrderEntity;

import jakarta.persistence.CascadeType;
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
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
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
     * Адреса клієнта як окрема сутність.
     */
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "address_id")
    private AddressEntity address;

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
    private ClientSource source;

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

    /**
     * Категорія клієнта (Стандарт, Постійний, VIP, Корпоративний).
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "category")
    @Builder.Default
    private ClientCategoryEntity category = ClientCategoryEntity.STANDARD;

    /**
     * Історія замовлень клієнта.
     */
    @OneToMany(mappedBy = "client", fetch = FetchType.LAZY)
    @Builder.Default
    private List<OrderEntity> orders = new ArrayList<>();

    /**
     * Переваги клієнта.
     */
    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<ClientPreferenceEntity> preferences = new HashSet<>();
}
