package com.aksi.domain.order.statemachine.stage4.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.dto.CustomerSignatureRequest;
import com.aksi.domain.order.dto.CustomerSignatureResponse;
import com.aksi.domain.order.service.CustomerSignatureService;

import lombok.RequiredArgsConstructor;

/**
 * Сервіс операцій з підписами клієнтів для Stage4.
 * Тонка обгортка навколо domain CustomerSignatureService.
 */
@Service
@RequiredArgsConstructor
public class Stage4SignatureOperationsService {

    private final CustomerSignatureService signatureService;

    /**
     * Зберігає підпис клієнта.
     *
     * @param request запит на збереження підпису
     * @return відповідь з інформацією про збережений підпис
     */
    public CustomerSignatureResponse saveSignature(CustomerSignatureRequest request) {
        return signatureService.saveSignature(request);
    }

    /**
     * Отримує підпис клієнта за ID замовлення та типом підпису.
     *
     * @param orderId ID замовлення
     * @param signatureType тип підпису
     * @return підпис клієнта або null якщо не знайдено
     */
    public CustomerSignatureResponse getSignature(UUID orderId, String signatureType) {
        return signatureService.getSignatureByOrderIdAndType(orderId, signatureType).orElse(null);
    }

    /**
     * Перевіряє чи існує підпис для замовлення.
     *
     * @param orderId ID замовлення
     * @param signatureType тип підпису
     * @return true якщо підпис існує
     */
    public boolean signatureExists(UUID orderId, String signatureType) {
        try {
            CustomerSignatureResponse signature = getSignature(orderId, signatureType);
            return signature != null && signature.getSignatureData() != null;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Перевіряє чи валідний підпис клієнта.
     *
     * @param signatureData дані підпису в base64
     * @return true якщо підпис валідний
     */
    public boolean isSignatureValid(String signatureData) {
        return signatureData != null
            && !signatureData.trim().isEmpty()
            && signatureData.length() > 50  // Мінімальна довжина для валідного підпису
            && signatureData.matches("^[A-Za-z0-9+/]*={0,2}$"); // Базова перевірка base64
    }
}
