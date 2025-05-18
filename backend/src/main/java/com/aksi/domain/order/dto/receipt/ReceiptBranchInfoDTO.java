package com.aksi.domain.order.dto.receipt;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для інформації про філію у квитанції
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReceiptBranchInfoDTO {
    /**
     * Назва філії
     */
    private String branchName;
    
    /**
     * Адреса філії
     */
    private String address;
    
    /**
     * Телефон філії
     */
    private String phone;
    
    /**
     * ПІБ оператора, який оформив замовлення
     */
    private String operatorName;
} 