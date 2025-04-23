package com.aksi.dto.client;

import com.aksi.domain.client.entity.ClientSource;
import com.aksi.domain.client.entity.ClientStatus;
import com.aksi.domain.client.entity.CommunicationChannel;
import com.aksi.domain.client.entity.LoyaltyLevel;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;

/**
 * DTO для запиту на створення клієнта
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientCreateRequest {
    
    /**
     * Ім'я клієнта
     */
    @NotBlank(message = "Ім'я не може бути пустим")
    @Size(min = 2, max = 100, message = "Ім'я повинно бути від 2 до 100 символів")
    private String firstName;
    
    /**
     * Прізвище клієнта
     */
    @NotBlank(message = "Прізвище не може бути пустим")
    @Size(min = 2, max = 100, message = "Прізвище повинно бути від 2 до 100 символів")
    private String lastName;
    
    /**
     * Отримати повне ім'я клієнта (прізвище + ім'я)
     * @return Повне ім'я клієнта
     */
    public String getFullName() {
        if (lastName == null && firstName == null) return "";
        if (lastName == null) return firstName;
        if (firstName == null) return lastName;
        return lastName + " " + firstName;
    }
    
    /**
     * Основний телефон
     */
    @NotBlank(message = "Телефон не може бути пустим")
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Некоректний формат телефону")
    private String phone;
    
    /**
     * Додатковий телефон
     */
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Некоректний формат телефону")
    private String additionalPhone;
    
    /**
     * Email
     */
    @Email(message = "Некоректний формат email")
    private String email;
    
    /**
     * Адреса
     */
    private String address;
    
    /**
     * Примітки
     */
    private String notes;
    
    /**
     * Джерело залучення
     */
    private ClientSource source;
    
    /**
     * Деталізація джерела залучення, коли вибрано "OTHER"
     */
    @Size(max = 255, message = "Деталі джерела не можуть перевищувати 255 символів")
    private String sourceDetails;
    
    /**
     * Дата народження
     */
    private LocalDate birthDate;
    
    /**
     * Статус клієнта
     */
    private ClientStatus status;
    
    /**
     * Рівень лояльності
     */
    private LoyaltyLevel loyaltyLevel;
    
    /**
     * Теги клієнта
     */
    private Set<String> tags;
    
    /**
     * Канали комунікації з клієнтом
     */
    private Set<CommunicationChannel> communicationChannels;
} 