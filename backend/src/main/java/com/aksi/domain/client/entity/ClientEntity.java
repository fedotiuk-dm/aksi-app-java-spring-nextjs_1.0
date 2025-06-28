package com.aksi.domain.client.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Сутність клієнта хімчистки.
 * Представляє доменну модель клієнта з повною бізнес-логікою.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "clients", indexes = {
    @Index(name = "idx_client_phone", columnList = "phone"),
    @Index(name = "idx_client_email", columnList = "email"),
    @Index(name = "idx_client_last_name", columnList = "lastName"),
    @Index(name = "idx_client_full_name", columnList = "lastName, firstName")
})
public class ClientEntity extends BaseEntity {

    @Column(name = "first_name", nullable = false, length = 50)
    @NotBlank(message = "Ім'я клієнта обов'язкове")
    @Size(min = 2, max = 50, message = "Ім'я повинно містити від 2 до 50 символів")
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    @NotBlank(message = "Прізвище клієнта обов'язкове")
    @Size(min = 2, max = 50, message = "Прізвище повинно містити від 2 до 50 символів")
    private String lastName;

    @Column(name = "phone", nullable = false, unique = true, length = 13)
    @NotBlank(message = "Номер телефону обов'язковий")
    @Pattern(regexp = "^\\+380\\d{9}$", message = "Номер телефону повинен бути у форматі +380XXXXXXXXX")
    private String phone;

    @Column(name = "email", length = 100)
    @Email(message = "Некоректний формат email")
    @Size(max = 100, message = "Email не може перевищувати 100 символів")
    private String email;

    @Valid
    @Embedded
    private Address address;

    @ElementCollection(targetClass = CommunicationMethodType.class)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "client_communication_methods",
                    joinColumns = @JoinColumn(name = "client_id"))
    @Column(name = "communication_method")
    private List<CommunicationMethodType> communicationMethods = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "source_type", length = 20)
    private ClientSourceType sourceType;

    @Column(name = "notes", length = 500)
    @Size(max = 500, message = "Примітки не можуть перевищувати 500 символів")
    private String notes;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "registration_date", nullable = false)
    private LocalDateTime registrationDate;

    // Business fields для статистики (можуть бути оновлені через events)
    @Column(name = "total_orders")
    private Integer totalOrders = 0;

    @Column(name = "total_spent")
    private Double totalSpent = 0.0;

    @Column(name = "last_order_date")
    private LocalDateTime lastOrderDate;



    @PrePersist
    protected void onCreate() {
        if (registrationDate == null) {
            registrationDate = LocalDateTime.now();
        }
        if (address == null) {
            address = Address.empty();
        }
    }

    // Business methods

    /**
     * Повне ім'я клієнта
     */
    public String getFullName() {
        return firstName + " " + lastName;
    }

    /**
     * Перевірка чи клієнт VIP (більше 10 замовлень або витратив більше 5000 грн)
     */
    public boolean isVip() {
        return (totalOrders != null && totalOrders >= 10) ||
               (totalSpent != null && totalSpent >= 5000.0);
    }

    /**
     * Оновлення контактної інформації
     */
    public void updateContactInfo(String phone, String email, Address address,
                                 List<CommunicationMethodType> communicationMethods) {
        if (phone != null && !phone.equals(this.phone)) {
            this.phone = phone;
        }
        this.email = email;
        this.address = address != null ? address : Address.empty();
        this.communicationMethods = communicationMethods != null ?
            new ArrayList<>(communicationMethods) : new ArrayList<>();
    }

    /**
     * Оновлення статистики замовлень
     */
    public void updateOrderStatistics(int orderCount, double totalAmount, LocalDateTime lastOrderDate) {
        this.totalOrders = orderCount;
        this.totalSpent = totalAmount;
        this.lastOrderDate = lastOrderDate;
    }

    /**
     * Деактивація клієнта (м'яке видалення)
     */
    public void deactivate() {
        this.isActive = false;
    }

    /**
     * Активація клієнта
     */
    public void activate() {
        this.isActive = true;
    }

    /**
     * Перевірка чи клієнт має певний спосіб зв'язку
     */
    public boolean hasCommunicationMethod(CommunicationMethodType method) {
        return communicationMethods.contains(method);
    }

    /**
     * Додавання способу зв'язку
     */
    public void addCommunicationMethod(CommunicationMethodType method) {
        if (!communicationMethods.contains(method)) {
            communicationMethods.add(method);
        }
    }

    /**
     * Видалення способу зв'язку
     */
    public void removeCommunicationMethod(CommunicationMethodType method) {
        communicationMethods.remove(method);
    }

    /**
     * Середня вартість замовлення
     */
    public Double getAverageOrderValue() {
        if (totalOrders == null || totalOrders == 0 || totalSpent == null) {
            return 0.0;
        }
        return totalSpent / totalOrders;
    }

    /**
     * Перевірка чи клієнт давно не робив замовлення (більше року)
     */
    public boolean isInactive() {
        return lastOrderDate == null ||
               lastOrderDate.isBefore(LocalDateTime.now().minusYears(1));
    }


}
