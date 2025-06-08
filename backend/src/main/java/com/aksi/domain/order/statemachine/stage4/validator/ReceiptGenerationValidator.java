package com.aksi.domain.order.statemachine.stage4.validator;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage4.dto.ReceiptGenerationDTO;

/**
 * Валідатор для ReceiptGenerationDTO.
 */
@Component
public class ReceiptGenerationValidator {

    /**
     * Валідує дані генерації квитанції.
     */
    public List<String> validate(ReceiptGenerationDTO dto) {
        List<String> errors = new ArrayList<>();

        if (dto == null) {
            errors.add("DTO не може бути null");
            return errors;
        }

        // Базові перевірки
        if (dto.getReceiptData() == null) {
            errors.add("Дані квитанції обов'язкові");
        } else {
            validateReceiptData(dto, errors);
        }

        return errors;
    }

    /**
     * Валідує дані для генерації PDF.
     */
    public List<String> validateForGeneration(ReceiptGenerationDTO dto) {
        List<String> errors = validate(dto);

        if (dto != null && dto.getReceiptData() != null) {
            if (dto.getReceiptData().getReceiptNumber() == null || dto.getReceiptData().getReceiptNumber().trim().isEmpty()) {
                errors.add("Номер квитанції обов'язковий для генерації PDF");
            }

            if (dto.getReceiptData().getClientInfo() == null) {
                errors.add("Інформація про клієнта обов'язкова для генерації PDF");
            }

            if (dto.getReceiptData().getBranchInfo() == null) {
                errors.add("Інформація про філію обов'язкова для генерації PDF");
            }

            if (dto.getReceiptData().getItems() == null || dto.getReceiptData().getItems().isEmpty()) {
                errors.add("Список предметів не може бути порожнім для генерації PDF");
            }
        }

        return errors;
    }

    /**
     * Перевіряє чи можна завершити процес.
     */
    public boolean canProceedToNext(ReceiptGenerationDTO dto) {
        return dto != null &&
               dto.isCompleted() &&
               !dto.isHasErrors() &&
               validate(dto).isEmpty();
    }

    private void validateReceiptData(ReceiptGenerationDTO dto, List<String> errors) {
        if (dto.getReceiptData().getReceiptNumber() == null || dto.getReceiptData().getReceiptNumber().trim().isEmpty()) {
            errors.add("Номер квитанції не може бути порожнім");
        }

        if (dto.getReceiptData().getOrderId() == null) {
            errors.add("ID замовлення обов'язковий");
        }
    }
}
