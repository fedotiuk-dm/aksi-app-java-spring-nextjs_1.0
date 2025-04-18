package com.aksi.domain.client.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

/**
 * Сутність клієнта хімчистки
 */
@Entity
@Table(name = "clients")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Client {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    /**
     * Повне ім'я клієнта
     */
    @Column(name = "full_name", nullable = false)
    private String fullName;
    
    /**
     * Основний телефон клієнта
     */
    @Column(name = "phone", nullable = false, unique = true)
    private String phone;
    
    /**
     * Додатковий телефон клієнта
     */
    @Column(name = "additional_phone")
    private String additionalPhone;
    
    /**
     * Email клієнта
     */
    @Column(name = "email", unique = true)
    private String email;
    
    /**
     * Адреса клієнта
     */
    @Column(name = "address")
    private String address;
    
    /**
     * Примітки про клієнта
     */
    @Column(name = "notes", columnDefinition = "text")
    private String notes;
    
    /**
     * Джерело залучення клієнта
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "source")
    private ClientSource source;
    
    /**
     * Дата народження клієнта
     */
    @Column(name = "birth_date")
    private LocalDate birthDate;
    
    /**
     * Дата останнього замовлення
     */
    @Column(name = "last_order_date")
    private LocalDateTime lastOrderDate;
    
    /**
     * Загальна сума замовлень клієнта
     */
    @Column(name = "total_spent")
    private BigDecimal totalSpent;
    
    /**
     * Кількість замовлень клієнта
     */
    @Column(name = "order_count")
    @Builder.Default
    private Integer orderCount = 0;
    
    /**
     * Статус клієнта
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private ClientStatus status = ClientStatus.ACTIVE;
    
    /**
     * Бонусні бали клієнта
     */
    @Column(name = "loyalty_points")
    @Builder.Default
    private Integer loyaltyPoints = 0;
    
    /**
     * Рівень лояльності клієнта
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "loyalty_level", nullable = false)
    @Builder.Default
    private LoyaltyLevel loyaltyLevel = LoyaltyLevel.STANDARD;
    
    /**
     * Стать клієнта
     */
    @Column(name = "gender")
    private String gender;
    
    /**
     * Дозвіл на SMS-повідомлення
     */
    @Column(name = "allow_sms")
    @Builder.Default
    private Boolean allowSMS = true;
    
    /**
     * Дозвіл на Email-повідомлення
     */
    @Column(name = "allow_email")
    @Builder.Default
    private Boolean allowEmail = true;
    
    /**
     * Дозвіл на телефонні дзвінки
     */
    @Column(name = "allow_calls")
    @Builder.Default
    private Boolean allowCalls = true;
    
    /**
     * Дата наступного контакту з клієнтом
     */
    @Column(name = "next_contact_at")
    private LocalDateTime nextContactAt;
    
    /**
     * Дата останнього контакту з клієнтом
     */
    @Column(name = "last_contact_at")
    private LocalDateTime lastContactAt;
    
    /**
     * Показник частоти замовлень (RFM аналіз)
     */
    @Column(name = "frequency_score")
    @Builder.Default
    private Integer frequencyScore = 0;
    
    /**
     * Показник суми замовлень (RFM аналіз)
     */
    @Column(name = "monetary_score")
    @Builder.Default
    private Integer monetaryScore = 0;
    
    /**
     * Показник недавності замовлень (RFM аналіз)
     */
    @Column(name = "recency_score")
    @Builder.Default
    private Integer recencyScore = 0;
    
    /**
     * Дата м'якого видалення запису
     */
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
    
    /**
     * Теги клієнта
     */
    @ElementCollection
    @CollectionTable(name = "client_tags", joinColumns = @JoinColumn(name = "client_id"))
    @Column(name = "tag")
    @Builder.Default
    private Set<String> tags = new HashSet<>();
    
    /**
     * Дата створення запису
     */
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    /**
     * Дата останнього оновлення запису
     */
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
} 