package com.aksi.domain.order.dto.receipt;

import java.util.UUID;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для запиту відправки квитанції на email.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailReceiptRequest {
    /**
     * ID замовлення, для якого потрібно відправити квитанцію.
     */
    @NotNull(message = "ID замовлення обов'язкове")
    private UUID orderId;

    /**
     * Email отримувача.
     */
    @NotBlank(message = "Email отримувача обов'язковий")
    @Email(message = "Некоректний формат email")
    private String recipientEmail;

    /**
     * Тема листа.
     */
    @Builder.Default
    private String subject = "Квитанція замовлення хімчистки AKSI";

    /**
     * Текст повідомлення.
     */
    private String message;

    /**
     * Чи включати цифровий підпис у PDF.
     */
    @Builder.Default
    private boolean includeSignature = false;
}
