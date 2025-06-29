package com.aksi.domain.branch.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Embedded клас для контактної інформації філії.
 */
@Embeddable
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContactInfo {

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "alternative_phone", length = 20)
    private String alternativePhone;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "manager_name", length = 100)
    private String managerName;

    /**
     * Перевіряє чи є валідна контактна інформація
     */
    public boolean hasValidInfo() {
        return (phone != null && !phone.trim().isEmpty()) ||
               (email != null && !email.trim().isEmpty());
    }

    /**
     * Перевіряє чи є основний телефон
     */
    public boolean hasPhone() {
        return phone != null && !phone.trim().isEmpty();
    }

    /**
     * Перевіряє чи є додатковий телефон
     */
    public boolean hasAlternativePhone() {
        return alternativePhone != null && !alternativePhone.trim().isEmpty();
    }

    /**
     * Перевіряє чи є email
     */
    public boolean hasEmail() {
        return email != null && !email.trim().isEmpty();
    }

    /**
     * Перевіряє чи є ім'я менеджера
     */
    public boolean hasManagerName() {
        return managerName != null && !managerName.trim().isEmpty();
    }
}
