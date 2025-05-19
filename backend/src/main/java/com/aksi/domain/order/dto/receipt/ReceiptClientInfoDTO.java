package com.aksi.domain.order.dto.receipt;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для інформації про клієнта у квитанції
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReceiptClientInfoDTO {
    /**
     * Прізвище клієнта
     */
    private String lastName;

    /**
     * Ім'я клієнта
     */
    private String firstName;

    /**
     * Телефон клієнта
     */
    private String phone;

    /**
     * Email клієнта
     */
    private String email;

    /**
     * Адреса клієнта
     */
    private String address;

    /**
     * Обрані способи зв'язку
     */
    private List<String> communicationChannels;
}
