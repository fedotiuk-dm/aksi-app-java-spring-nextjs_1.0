package com.aksi.domain.client.entity;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import com.aksi.domain.client.enums.ClientSourceType;
import com.aksi.domain.client.enums.CommunicationMethodType;
import com.aksi.shared.BaseEntity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Сутність клієнта
 * Синхронізовано з OpenAPI схемою ClientResponse
 */
@Entity
@Table(name = "clients", indexes = {
    @Index(name = "idx_client_uuid", columnList = "uuid"),
    @Index(name = "idx_client_phone", columnList = "phone"),
    @Index(name = "idx_client_email", columnList = "email"),
    @Index(name = "idx_client_full_name", columnList = "first_name, last_name"),
    @Index(name = "idx_client_source_type", columnList = "source_type")
})
@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientEntity extends BaseEntity {

    /**
     * UUID для API сумісності (зовнішній ідентифікатор)
     * Внутрішньо використовуємо Long id з BaseEntity
     */
    @Column(name = "uuid", nullable = false, unique = true, updatable = false)
    @Builder.Default
    private UUID uuid = UUID.randomUUID();

    /**
     * Ім'я клієнта
     */
    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    /**
     * Прізвище клієнта
     */
    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    /**
     * Номер телефону в міжнародному форматі
     */
    @Column(name = "phone", nullable = false, unique = true, length = 20)
    private String phone;

    /**
     * Email адреса
     */
    @Column(name = "email", unique = true, length = 100)
    private String email;

    /**
     * Адреса клієнта
     */
    @Embedded
    private Address address;

    /**
     * Бажані способи зв'язку
     */
    @ElementCollection(targetClass = CommunicationMethodType.class)
    @CollectionTable(name = "client_communication_methods",
                    joinColumns = @JoinColumn(name = "client_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "communication_method")
    private Set<CommunicationMethodType> communicationMethods;

    /**
     * Джерело надходження клієнта
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "source_type", length = 30)
    private ClientSourceType sourceType;

    /**
     * Додаткові примітки про клієнта
     */
    @Column(name = "notes", length = 500)
    private String notes;

    // Статистичні поля (будуть розраховуватися через queries)

    /**
     * Загальна кількість замовлень
     */
    @Column(name = "total_orders")
    @Builder.Default
    private Integer totalOrders = 0;

    /**
     * Загальна сума витрат
     */
    @Column(name = "total_spent", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal totalSpent = BigDecimal.ZERO;

    /**
     * Дата останнього замовлення
     */
    @Column(name = "last_order_date")
    private LocalDate lastOrderDate;

    /**
     * Середня вартість замовлення
     */
    @Column(name = "average_order_value", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal averageOrderValue = BigDecimal.ZERO;

    /**
     * Чи є клієнт VIP
     */
    @Column(name = "is_vip")
    @Builder.Default
    private Boolean isVip = false;

    // Domain-specific business methods

    /**
     * Отримання повного імені
     */
    public String getFullName() {
        return firstName + " " + lastName;
    }

    /**
     * Перевірка чи має клієнт email
     */
    public boolean hasEmail() {
        return email != null && !email.trim().isEmpty();
    }

    /**
     * Перевірка чи має клієнт адресу
     */
    public boolean hasAddress() {
        return address != null && address.isComplete();
    }

    /**
     * Перевірка чи підтримує клієнт певний метод зв'язку
     */
    public boolean supportsCommunicationMethod(CommunicationMethodType method) {
        return communicationMethods != null && communicationMethods.contains(method);
    }

    /**
     * Додавання методу зв'язку
     */
    public void addCommunicationMethod(CommunicationMethodType method) {
        if (communicationMethods != null) {
            communicationMethods.add(method);
        }
    }

    /**
     * Видалення методу зв'язку
     */
    public void removeCommunicationMethod(CommunicationMethodType method) {
        if (communicationMethods != null) {
            communicationMethods.remove(method);
        }
    }

    /**
     * Оновлення статистики після нового замовлення
     */
    public void updateStatisticsAfterOrder(BigDecimal orderAmount, LocalDate orderDate) {
        int currentOrders = Optional.ofNullable(this.totalOrders).orElse(0);
        BigDecimal currentSpent = Optional.ofNullable(this.totalSpent).orElse(BigDecimal.ZERO);

        this.totalOrders = currentOrders + 1;
        this.totalSpent = currentSpent.add(orderAmount);
        this.lastOrderDate = orderDate;
        this.averageOrderValue = this.totalSpent.divide(BigDecimal.valueOf(this.totalOrders), 2, RoundingMode.HALF_UP);

        // VIP логіка: понад 10 замовлень або понад 5000 грн
        this.isVip = this.totalOrders >= 10 || this.totalSpent.compareTo(BigDecimal.valueOf(5000)) >= 0;
    }
}
