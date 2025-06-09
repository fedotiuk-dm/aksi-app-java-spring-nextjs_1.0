package com.aksi.domain.order.statemachine.stage1.dto;

import java.util.Set;

import com.aksi.domain.client.entity.CommunicationChannelEntity;
import com.aksi.domain.client.enums.ClientSource;
import com.aksi.domain.order.statemachine.stage1.enums.NewClientFormStatus;

/**
 * DTO для форми створення нового клієнта в Stage1.
 * Спеціалізований для потреб користувацького інтерфейсу Order Wizard.
 */
public class NewClientFormDTO {

    // Обов'язкові поля
    private String firstName;           // Ім'я (обов'язкове)
    private String lastName;            // Прізвище (обов'язкове)
    private String phone;              // Телефон (обов'язкове)

    // Необов'язкові поля
    private String email;              // Email
    private String address;            // Адреса

    // Мультивибір каналів зв'язку
    private Set<CommunicationChannelEntity> communicationChannels;

    // Джерело інформації
    private ClientSource informationSource;
    private String sourceDetails;      // Деталі для "Інше" джерело

    // Статус форми
    private NewClientFormStatus status;

    // Конструктори
    public NewClientFormDTO() {
        this.status = NewClientFormStatus.EMPTY;
    }

    public NewClientFormDTO(String firstName, String lastName, String phone) {
        this();
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
    }

    // Геттери та сеттери
    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Set<CommunicationChannelEntity> getCommunicationChannels() {
        return communicationChannels;
    }

    public void setCommunicationChannels(Set<CommunicationChannelEntity> communicationChannels) {
        this.communicationChannels = communicationChannels;
    }

    public ClientSource getInformationSource() {
        return informationSource;
    }

    public void setInformationSource(ClientSource informationSource) {
        this.informationSource = informationSource;
    }

    public String getSourceDetails() {
        return sourceDetails;
    }

    public void setSourceDetails(String sourceDetails) {
        this.sourceDetails = sourceDetails;
    }

    public NewClientFormStatus getStatus() {
        return status;
    }

    public void setStatus(NewClientFormStatus status) {
        this.status = status;
    }

    // Утилітарні методи
    public boolean hasRequiredFields() {
        return firstName != null && !firstName.trim().isEmpty() &&
               lastName != null && !lastName.trim().isEmpty() &&
               phone != null && !phone.trim().isEmpty();
    }

    public String getFullName() {
        return lastName + " " + firstName;
    }

    public boolean isOtherInformationSource() {
        return informationSource == ClientSource.OTHER;
    }

    public boolean needsSourceDetails() {
        return isOtherInformationSource() &&
               (sourceDetails == null || sourceDetails.trim().isEmpty());
    }

    public boolean hasEmail() {
        return email != null && !email.trim().isEmpty();
    }

    public boolean hasAddress() {
        return address != null && !address.trim().isEmpty();
    }

    public boolean hasCommunicationChannels() {
        return communicationChannels != null && !communicationChannels.isEmpty();
    }

    @Override
    public String toString() {
        return "NewClientFormDTO{" +
                "firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", phone='" + phone + '\'' +
                ", email='" + email + '\'' +
                ", address='" + address + '\'' +
                ", communicationChannels=" + communicationChannels +
                ", informationSource=" + informationSource +
                ", sourceDetails='" + sourceDetails + '\'' +
                ", status=" + status +
                '}';
    }
}
