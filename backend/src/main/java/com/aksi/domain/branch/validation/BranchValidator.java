package com.aksi.domain.branch.validation;

import java.util.UUID;

import org.springframework.stereotype.Component;

import com.aksi.domain.branch.entity.BranchEntity;
import com.aksi.domain.branch.exception.BranchAlreadyExistsException;
import com.aksi.domain.branch.exception.BranchValidationException;
import com.aksi.domain.branch.repository.BranchRepository;

import lombok.RequiredArgsConstructor;

/**
 * Validator для бізнес-правил філій.
 * Тільки те що неможливо зробити через Bean Validation.
 */
@Component
@RequiredArgsConstructor
public class BranchValidator {

    private final BranchRepository branchRepository;

    /**
     * Валідація для створення нової філії
     */
    public void validateForCreate(BranchEntity branch) {
        validateUniqueness(branch);
        // Додаткові бізнес-правила для створення
    }

    /**
     * Валідація для оновлення філії
     */
    public void validateForUpdate(BranchEntity branch) {
        validateUniquenessForUpdate(branch);
        // Додаткові бізнес-правила для оновлення
    }

    /**
     * Валідація унікальності для нової філії
     */
    public void validateUniqueness(BranchEntity branch) {
        if (branchRepository.existsByCode(branch.getCode())) {
            throw BranchAlreadyExistsException.forCode(branch.getCode());
        }
    }

    /**
     * Валідація унікальності для оновлення філії
     */
    public void validateUniquenessForUpdate(BranchEntity branch) {
        // Перевірка унікальності коду (виключаючи поточну філію)
        branchRepository.findByCode(branch.getCode())
            .filter(existingBranch -> !existingBranch.getId().equals(branch.getId()))
            .ifPresent(existingBranch -> {
                throw BranchAlreadyExistsException.forCode(branch.getCode());
            });
    }

    /**
     * Бізнес-правило: Валідація можливості видалення філії
     */
    public void validateForDeletion(BranchEntity branch) {
        // Тільки неактивні філії можна видалити
        if (branch.isActive()) {
            throw new BranchValidationException(
                "Неможливо видалити активну філію. Спочатку деактивуйте її."
            );
        }

        // TODO: Додати перевірку на наявність активних замовлень
        // if (hasActiveOrders(branch.getId())) {
        //     throw new BranchValidationException("Неможливо видалити філію з активними замовленнями");
        // }
    }

    /**
     * Бізнес-правило: Валідація можливості приймати замовлення
     */
    public void validateCanAcceptOrders(BranchEntity branch) {
        if (!branch.canAcceptOrders()) {
            throw new BranchValidationException(
                String.format("Філія зі статусом '%s' не може приймати замовлення",
                    branch.getStatus().name())
            );
        }

        if (!branch.hasContactInfo()) {
            throw new BranchValidationException(
                "Філія не може приймати замовлення без контактної інформації"
            );
        }

        // TODO: Перевірити чи є робочий розклад
        // if (!hasWorkingSchedule(branch.getId())) {
        //     throw new BranchValidationException("Філія не може приймати замовлення без робочого розкладу");
        // }
    }

    /**
     * Бізнес-правило: Валідація генерації номера квитанції
     */
    public void validateReceiptNumberGeneration(BranchEntity branch) {
        if (!branch.isActive()) {
            throw new BranchValidationException(
                "Неможливо генерувати номери квитанцій для неактивної філії"
            );
        }

        if (branch.getReceiptCounter() >= 999999L) {
            throw new BranchValidationException(
                "Досягнуто максимальну кількість квитанцій для цього року"
            );
        }
    }

    /**
     * Бізнес-правило: Валідація оновлення лічильника квитанцій
     */
    public void validateReceiptCounterUpdate(UUID branchId, Long newCounter) {
        branchRepository.findById(branchId)
            .filter(BranchEntity::isActive)
            .orElseThrow(() -> new BranchValidationException(
                "Неможливо оновити лічильник для неактивної або неіснуючої філії"
            ));

        if (newCounter < 0) {
            throw new BranchValidationException("Лічильник квитанцій не може бути від'ємним");
        }

        if (newCounter >= 999999L) {
            throw new BranchValidationException("Лічильник квитанцій перевищує максимальне значення");
        }
    }
}
