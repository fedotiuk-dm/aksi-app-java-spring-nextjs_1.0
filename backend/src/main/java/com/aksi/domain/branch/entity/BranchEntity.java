package com.aksi.domain.branch.entity;

import java.util.UUID;

import com.aksi.domain.branch.enums.BranchStatus;
import com.aksi.shared.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * Entity для філії хімчистки.
 * Містить базову інформацію, адресу, контакти та статус філії.
 */
@Entity
@Table(name = "branches",
       indexes = {
           @Index(name = "idx_branch_code", columnList = "code", unique = true),
           @Index(name = "idx_branch_uuid", columnList = "uuid"),
           @Index(name = "idx_branch_status", columnList = "status"),
           @Index(name = "idx_branch_coordinates", columnList = "latitude, longitude")
       })
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class BranchEntity extends BaseEntity {

    /**
     * UUID для API сумісності (зовнішній ідентифікатор)
     * Внутрішньо використовуємо Long id з BaseEntity
     */
    @Column(name = "uuid", nullable = false, unique = true, updatable = false)
    @Builder.Default
    private UUID uuid = UUID.randomUUID();

    @Column(name = "code", nullable = false, unique = true, length = 20)
    private String code;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "description", length = 500)
    private String description;

    // Address fields (embedded)
    @Column(name = "country", length = 50)
    private String country;

    @Column(name = "region", length = 100)
    private String region;

    @Column(name = "city", nullable = false, length = 100)
    private String city;

    @Column(name = "district", length = 100)
    private String district;

    @Column(name = "street", nullable = false, length = 200)
    private String street;

    @Column(name = "building_number", nullable = false, length = 20)
    private String buildingNumber;

    @Column(name = "apartment_office", length = 20)
    private String apartmentOffice;

    @Column(name = "postal_code", length = 10)
    private String postalCode;

    // Contact Info (embedded)
    @Embedded
    private ContactInfo contactInfo;

    // Coordinates (embedded)
    @Embedded
    private Coordinates coordinates;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private BranchStatus status = BranchStatus.ACTIVE;

    @Column(name = "receipt_counter", nullable = false)
    @Builder.Default
    private Long receiptCounter = 0L;

    // Business methods

    /**
     * Перевіряє чи філія може приймати нові замовлення
     */
    public boolean canAcceptOrders() {
        return status.canAcceptOrders();
    }

    /**
     * Перевіряє чи філія активна
     */
    public boolean isActive() {
        return status.isActive();
    }

    /**
     * Перевіряє чи філія доступна для клієнтів
     */
    public boolean isAvailableForCustomers() {
        return status.isAvailableForCustomers();
    }

    /**
     * Деактивує філію
     */
    public void deactivate() {
        this.status = BranchStatus.INACTIVE;
    }

    /**
     * Генерує наступний номер квитанції
     */
    public synchronized String generateNextReceiptNumber() {
        this.receiptCounter++;
        return String.format("%s-%d-%06d",
            this.code,
            java.time.Year.now().getValue(),
            this.receiptCounter);
    }

    /**
     * Перевіряє чи філія в межах радіусу від координат
     */
    public boolean isWithinRadius(double latitude, double longitude, double radiusKm) {
        if (coordinates == null) {
            return false;
        }
        return coordinates.calculateDistanceKm(latitude, longitude) <= radiusKm;
    }

    /**
     * Отримує повну адресу як рядок
     */
    public String getFullAddress() {
        StringBuilder address = new StringBuilder();

        if (country != null) address.append(country).append(", ");
        if (region != null) address.append(region).append(", ");
        if (city != null) address.append(city).append(", ");
        if (district != null) address.append(district).append(", ");
        if (street != null) address.append(street).append(", ");
        if (buildingNumber != null) address.append("буд. ").append(buildingNumber);
        if (apartmentOffice != null) address.append(", оф. ").append(apartmentOffice);

        return address.toString().replaceAll(", $", "");
    }

    /**
     * Перевіряє чи філія має контактну інформацію
     */
    public boolean hasContactInfo() {
        return contactInfo != null && contactInfo.hasValidInfo();
    }

    /**
     * Перевіряє чи філія має координати
     */
    public boolean hasCoordinates() {
        return coordinates != null && coordinates.isValid();
    }
}
