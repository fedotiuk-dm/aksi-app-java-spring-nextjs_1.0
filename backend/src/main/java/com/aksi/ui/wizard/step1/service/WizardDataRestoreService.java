package com.aksi.ui.wizard.step1.service;

import org.springframework.stereotype.Service;

import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.ui.wizard.dto.OrderWizardData;
import com.aksi.ui.wizard.step1.mapper.Step1WizardDataMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для відновлення даних UI компонентів з OrderWizardData.
 * Відповідає за логіку відновлення стану компонентів.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class WizardDataRestoreService {

    private final Step1WizardDataMapper step1WizardDataMapper;

    /**
     * Відновити дані клієнта для відображення в UI.
     */
    public ClientResponse restoreClientResponse(OrderWizardData wizardData) {
        if (wizardData.getSelectedClient() == null) {
            log.debug("No client data to restore");
            return null;
        }

        ClientResponse clientResponse = step1WizardDataMapper.mapClientEntityToResponse(
            wizardData.getSelectedClient());

        log.debug("Restored client data: {} {}",
            clientResponse.getLastName(), clientResponse.getFirstName());

        return clientResponse;
    }

    /**
     * Відновити номер квитанції.
     */
    public String restoreReceiptNumber(OrderWizardData wizardData) {
        String receiptNumber = wizardData.getDraftOrder().getReceiptNumber();

        if (receiptNumber != null) {
            log.debug("Restored receipt number: {}", receiptNumber);
        }

        return receiptNumber;
    }

    /**
     * Відновити номер мітки.
     */
    public String restoreTagNumber(OrderWizardData wizardData) {
        String tagNumber = wizardData.getDraftOrder().getTagNumber();

        if (tagNumber != null) {
            log.debug("Restored tag number: {}", tagNumber);
        }

        return tagNumber;
    }

    /**
     * Перевірити чи є дані для відновлення.
     */
    public boolean hasDataToRestore(OrderWizardData wizardData) {
        return wizardData.getSelectedClient() != null ||
               wizardData.getDraftOrder().getReceiptNumber() != null ||
               wizardData.getDraftOrder().getTagNumber() != null;
    }

    /**
     * Перевірити чи клієнт був новоствореним.
     */
    public boolean wasClientCreated(OrderWizardData wizardData) {
        return wizardData.isNewClient();
    }

    /**
     * Логувати інформацію про відновлення даних.
     */
    public void logRestoredData(OrderWizardData wizardData) {
        if (hasDataToRestore(wizardData)) {
            log.info("Restoring wizard data: client={}, receipt={}, tag={}",
                wizardData.getSelectedClient() != null ? "present" : "null",
                wizardData.getDraftOrder().getReceiptNumber(),
                wizardData.getDraftOrder().getTagNumber());
        } else {
            log.debug("No wizard data to restore");
        }
    }
}
