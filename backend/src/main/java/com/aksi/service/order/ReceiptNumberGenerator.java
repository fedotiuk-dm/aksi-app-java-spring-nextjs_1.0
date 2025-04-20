package com.aksi.service.order;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Сервіс для генерації номерів квитанцій замовлень
 */
@Service
@Slf4j
public class ReceiptNumberGenerator {
    
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyMMdd");
    private static final int RANDOM_SUFFIX_BOUND = 10000;
    
    /**
     * Генерує новий унікальний номер квитанції
     * у форматі РРММДД-XXXX, де:
     * - РРММДД - поточна дата (рік, місяць, день)
     * - XXXX - випадковий числовий суфікс
     * 
     * @return унікальний номер квитанції
     */
    public String generateReceiptNumber() {
        LocalDateTime now = LocalDateTime.now();
        String datePart = now.format(DATE_FORMAT);
        String randomSuffix = String.format("%04d", generateRandomSuffix());
        
        String receiptNumber = datePart + "-" + randomSuffix;
        log.info("Згенеровано номер квитанції: {}", receiptNumber);
        
        return receiptNumber;
    }
    
    /**
     * Генерує випадкове число для суфіксу номера квитанції
     * 
     * @return випадкове число в межах від 0 до RANDOM_SUFFIX_BOUND-1
     */
    private int generateRandomSuffix() {
        return ThreadLocalRandom.current().nextInt(RANDOM_SUFFIX_BOUND);
    }
}
