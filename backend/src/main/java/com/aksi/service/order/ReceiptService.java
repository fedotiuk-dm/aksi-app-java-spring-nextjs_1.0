package com.aksi.service.order;

import java.io.ByteArrayOutputStream;
import java.util.UUID;

/**
 * Сервіс для роботи з квитанціями замовлень
 */
public interface ReceiptService {

    /**
     * Генерувати PDF-квитанцію для замовлення
     * @param orderId ідентифікатор замовлення
     * @return PDF-документ як масив байтів
     */
    ByteArrayOutputStream generateReceipt(UUID orderId);
    
    /**
     * Відправити PDF-квитанцію на email клієнта
     * @param orderId ідентифікатор замовлення
     * @param email адреса електронної пошти (якщо не вказана, використовується email з профілю клієнта)
     * @return true якщо відправлено успішно
     */
    boolean sendReceiptByEmail(UUID orderId, String email);
}
