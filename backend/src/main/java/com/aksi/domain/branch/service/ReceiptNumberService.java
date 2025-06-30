package com.aksi.domain.branch.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.branch.dto.GenerateReceiptNumberRequest;
import com.aksi.api.branch.dto.ParseReceiptNumberRequest;
import com.aksi.api.branch.dto.ReceiptNumberParseResponse;
import com.aksi.api.branch.dto.ReceiptNumberResponse;
import com.aksi.api.branch.dto.ReceiptValidationResponse;
import com.aksi.api.branch.dto.ValidateReceiptNumberRequest;
import com.aksi.domain.branch.entity.BranchEntity;
import com.aksi.domain.branch.mapper.ReceiptNumberMapper;
import com.aksi.domain.branch.repository.BranchRepository;
import com.aksi.domain.branch.validation.BranchValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для управління генерацією номерів квитанцій Відповідальність: використання API DTO через
 * ReceiptNumberMapper
 */
@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ReceiptNumberService {

  private final BranchRepository branchRepository;
  private final BranchValidator branchValidator;
  private final BranchService branchService;
  private final ReceiptNumberMapper receiptNumberMapper;

  // API методи (для контролерів) - працюють з DTO

  /** Генерувати номер квитанції за запитом */
  public ReceiptNumberResponse generateReceiptNumber(GenerateReceiptNumberRequest request) {
    log.debug("Generating receipt number for request: {}", request.getBranchId());

    UUID branchId = request.getBranchId();

    BranchEntity branch = branchService.findEntityById(branchId);
    branchValidator.validateReceiptNumberGeneration(branch);

    String receiptNumber = branch.generateNextReceiptNumber();
    branchRepository.save(branch);

    log.info("Generated receipt number: {} for branch: {}", receiptNumber, branch.getCode());
    return receiptNumberMapper.toReceiptNumberResponse(branch, receiptNumber);
  }

  /** Валідувати номер квитанції */
  @Transactional(readOnly = true)
  public ReceiptValidationResponse validateReceiptNumber(ValidateReceiptNumberRequest request) {
    log.debug("Validating receipt number: {}", request.getReceiptNumber());

    String receiptNumber = request.getReceiptNumber();
    boolean isValid = receiptNumberMapper.isValidReceiptNumberFormat(receiptNumber);

    List<String> errors = new java.util.ArrayList<>();
    String branchCode = null;

    if (!isValid) {
      errors.add("Неправильний формат номера квитанції");
    } else {
      branchCode = receiptNumberMapper.extractBranchCodeFromReceiptNumber(receiptNumber);

      // Перевірка чи існує філія з таким кодом
      if (!branchRepository.existsByCode(branchCode)) {
        isValid = false;
        errors.add("Філія з кодом '" + branchCode + "' не знайдена");
      }
    }

    return receiptNumberMapper.toReceiptValidationResponse(
        receiptNumber, isValid, errors, branchCode);
  }

  /** Розпарсити номер квитанції на компоненти */
  @Transactional(readOnly = true)
  public ReceiptNumberParseResponse parseReceiptNumber(ParseReceiptNumberRequest request) {
    log.debug("Parsing receipt number: {}", request.getReceiptNumber());

    String receiptNumber = request.getReceiptNumber();
    String branchCode = receiptNumberMapper.extractBranchCodeFromReceiptNumber(receiptNumber);
    Integer year = receiptNumberMapper.extractYearFromReceiptNumber(receiptNumber);
    Integer sequenceNumber = receiptNumberMapper.extractSequenceFromReceiptNumber(receiptNumber);

    BranchEntity branch =
        branchRepository
            .findByCode(branchCode)
            .orElse(null); // може бути null якщо філія не знайдена

    return receiptNumberMapper.toReceiptNumberParseResponse(
        receiptNumber, branchCode, year, sequenceNumber, branch);
  }

  /** Отримати поточний лічільник квитанцій філії */
  @Transactional(readOnly = true)
  public Long getCurrentCounter(UUID branchId) {
    log.debug("Getting current counter for branch: {}", branchId);

    BranchEntity branch = branchService.findEntityById(branchId);
    return branch.getReceiptCounter();
  }

  /** Скинути лічільник квитанцій (адміністративна операція) */
  public void resetCounter(UUID branchId) {
    log.debug("Resetting counter for branch: {}", branchId);

    BranchEntity branch = branchService.findEntityById(branchId);
    branch.setReceiptCounter(0L);
    branchRepository.save(branch);

    log.info("Reset receipt counter for branch: {}", branch.getCode());
  }

  /** Оновити лічільник квитанцій (адміністративна операція) */
  public void updateCounter(UUID branchId, Long newCounter) {
    log.debug("Updating counter for branch: {} to {}", branchId, newCounter);

    branchValidator.validateReceiptCounterUpdate(branchId, newCounter);
    branchRepository.updateReceiptCounter(branchId, newCounter);

    log.info("Updated receipt counter for branch: {} to {}", branchId, newCounter);
  }

  /** Генерувати кілька номерів квитанцій для пакетної обробки */
  public List<ReceiptNumberResponse> generateMultipleReceiptNumbers(
      GenerateReceiptNumberRequest request, int count) {
    log.debug("Generating {} receipt numbers for branch: {}", count, request.getBranchId());

    if (count <= 0 || count > 100) {
      throw new IllegalArgumentException(
          "Invalid batch size: " + count + ". Must be between 1 and 100");
    }

    UUID branchId = request.getBranchId();

    BranchEntity branch = branchService.findEntityById(branchId);
    branchValidator.validateReceiptNumberGeneration(branch);

    List<ReceiptNumberResponse> responses = new java.util.ArrayList<>();
    for (int i = 0; i < count; i++) {
      String receiptNumber = branch.generateNextReceiptNumber();
      responses.add(receiptNumberMapper.toReceiptNumberResponse(branch, receiptNumber));
    }

    branchRepository.save(branch);

    log.info("Generated {} receipt numbers for branch: {}", count, branch.getCode());
    return responses;
  }

  // Entity методи (для внутрішньої логіки)

  /** Генерувати номер квитанції для Entity (без DTO) */
  @Transactional
  public String generateReceiptNumberForBranch(BranchEntity branch) {
    log.debug("Generating receipt number for branch entity: {}", branch.getCode());

    branchValidator.validateReceiptNumberGeneration(branch);
    String receiptNumber = branch.generateNextReceiptNumber();
    branchRepository.save(branch);

    log.info("Generated receipt number: {} for branch: {}", receiptNumber, branch.getCode());
    return receiptNumber;
  }

  /** Валідувати формат номера квитанції (Entity метод) */
  @Transactional(readOnly = true)
  public boolean validateReceiptNumberFormat(String receiptNumber) {
    return receiptNumberMapper.isValidReceiptNumberFormat(receiptNumber);
  }

  /** Отримати лічільник для Entity */
  @Transactional(readOnly = true)
  public Long getCounterForBranch(BranchEntity branch) {
    return branch.getReceiptCounter();
  }

  /** Скинути лічільник для Entity */
  @Transactional
  public void resetCounterForBranch(BranchEntity branch) {
    log.debug("Resetting counter for branch entity: {}", branch.getCode());

    branch.setReceiptCounter(0L);
    branchRepository.save(branch);

    log.info("Reset receipt counter for branch: {}", branch.getCode());
  }

  /** Отримати наступний номер квитанції БЕЗ збереження (preview) */
  @Transactional(readOnly = true)
  public String previewNextReceiptNumber(UUID branchId) {
    log.debug("Preview next receipt number for branch: {}", branchId);

    BranchEntity branch = branchService.findEntityById(branchId);
    Long nextCounter = branch.getReceiptCounter() + 1;

    return String.format(
        "%s-%d-%06d", branch.getCode(), java.time.Year.now().getValue(), nextCounter);
  }
}
