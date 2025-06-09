package com.aksi.domain.order.statemachine.stage1.dto;

/**
 * DTO для критеріїв пошуку клієнта в етапі 1.1.
 * Пошук за прізвищем, ім'ям, телефоном, email, адресою.
 */
public class ClientSearchCriteriaDTO {

    /**
     * Прізвище клієнта.
     */
    private String lastName;

    /**
     * Ім'я клієнта.
     */
    private String firstName;

    /**
     * Телефон клієнта.
     */
    private String phone;

    /**
     * Email клієнта.
     */
    private String email;

    /**
     * Адреса клієнта.
     */
    private String address;

    /**
     * Загальний пошуковий термін (пошук по всіх полях).
     */
    private String generalSearchTerm;

    // Конструктори
    public ClientSearchCriteriaDTO() {}

    public ClientSearchCriteriaDTO(String generalSearchTerm) {
        this.generalSearchTerm = generalSearchTerm;
    }

    public ClientSearchCriteriaDTO(String lastName, String firstName, String phone, String email, String address) {
        this.lastName = lastName;
        this.firstName = firstName;
        this.phone = phone;
        this.email = email;
        this.address = address;
    }

    // Геттери та сеттери
    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
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

    public String getGeneralSearchTerm() {
        return generalSearchTerm;
    }

    public void setGeneralSearchTerm(String generalSearchTerm) {
        this.generalSearchTerm = generalSearchTerm;
    }

    /**
     * Перевіряє чи є хоча б один критерій пошуку.
     */
    public boolean hasSearchCriteria() {
        return hasText(lastName) || hasText(firstName) || hasText(phone) ||
               hasText(email) || hasText(address) || hasText(generalSearchTerm);
    }

    /**
     * Перевіряє чи є специфічні критерії (не загальний пошук).
     */
    public boolean hasSpecificCriteria() {
        return hasText(lastName) || hasText(firstName) || hasText(phone) ||
               hasText(email) || hasText(address);
    }

    private boolean hasText(String text) {
        return text != null && !text.trim().isEmpty();
    }

    @Override
    public String toString() {
        return "ClientSearchCriteriaDTO{" +
                "lastName='" + lastName + '\'' +
                ", firstName='" + firstName + '\'' +
                ", phone='" + phone + '\'' +
                ", email='" + email + '\'' +
                ", address='" + address + '\'' +
                ", generalSearchTerm='" + generalSearchTerm + '\'' +
                '}';
    }
}
