package com.aksi.domain.order.dto;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для предмету замовлення.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDTO {
    
    private UUID id;
    
    @NotBlank(message = "Назва предмету обов'язкова")
    @Size(max = 255, message = "Назва предмету не може перевищувати 255 символів")
    private String name;
    
    @Size(max = 1000, message = "Опис не може перевищувати 1000 символів")
    private String description;
    
    @NotNull(message = "Кількість обов'язкова")
    @Min(value = 1, message = "Кількість має бути не менше 1")
    private Integer quantity;
    
    @NotNull(message = "Ціна за одиницю обов'язкова")
    private BigDecimal unitPrice;
    
    private BigDecimal totalPrice;
    
    private String category;
    
    private String color;
    
    private String material;
    
    private String unitOfMeasure;
    
    private String defects;
    
    @Size(max = 500, message = "Спеціальні інструкції не можуть перевищувати 500 символів")
    private String specialInstructions;
}
