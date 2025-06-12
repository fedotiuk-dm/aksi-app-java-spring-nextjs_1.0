package com.aksi.domain.order.statemachine.stage1.adapter;

import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.branch.dto.BranchLocationDTO;
import com.aksi.domain.order.statemachine.adapter.BaseStateMachineAdapter;
import com.aksi.domain.order.statemachine.stage1.dto.BasicOrderInfoDTO;
import com.aksi.domain.order.statemachine.stage1.enums.BasicOrderInfoAdapterMessages;
import com.aksi.domain.order.statemachine.stage1.enums.BasicOrderInfoState;
import com.aksi.domain.order.statemachine.stage1.service.BasicOrderInfoCoordinationService;
import com.aksi.domain.order.statemachine.stage1.util.BasicOrderInfoAdapterHelper;
import com.aksi.domain.order.statemachine.stage1.validator.BasicOrderInfoValidationResult;

/**
 * REST адаптер для базової інформації замовлення в Stage1.
 * Використовує StateMachineService та існуючі сервіси.
 * Базується на документації Spring State Machine Event Service.
 *
 * Рефакторований з використанням енумів для кращої підтримуваності.
 */
@RestController
@RequestMapping("/order-wizard/stage1/basic-order")
public class BasicOrderInfoAdapter extends BaseStateMachineAdapter {

    private static final Logger logger = LoggerFactory.getLogger(BasicOrderInfoAdapter.class);

    private final BasicOrderInfoCoordinationService coordinationService;
    private final BasicOrderInfoAdapterHelper helper;

    public BasicOrderInfoAdapter(BasicOrderInfoCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
        this.helper = new BasicOrderInfoAdapterHelper(coordinationService);

        logger.info("🔥🔥🔥 BasicOrderInfoAdapter ІНІЦІАЛІЗОВАНО! 🔥🔥🔥");
        logger.info("📍 RequestMapping: /v1/order-wizard/stage1/basic-order");
        logger.info("🔧 CoordinationService: {}", coordinationService != null ? "OK" : "NULL");
    }

    /**
     * Ініціалізує новий контекст базової інформації замовлення.
     * Метод для сумісності з контроллером.
     */
    public ResponseEntity<String> initializeContext() {
        logger.info(BasicOrderInfoAdapterMessages.INIT_REQUEST.getMessage());

        try {
        String sessionId = coordinationService.initializeContext();
            logger.info(BasicOrderInfoAdapterMessages.INIT_SUCCESS.getMessage(), sessionId);
        return ResponseEntity.ok(sessionId);
        } catch (Exception e) {
            logger.error(BasicOrderInfoAdapterMessages.INIT_ERROR.getMessage(), e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Запускає workflow базової інформації.
     * Метод для сумісності з контроллером.
     */
    public ResponseEntity<String> startWorkflow() {
        logger.info(BasicOrderInfoAdapterMessages.WORKFLOW_START.getMessage());

        try {
        String sessionId = coordinationService.startWorkflow();
            logger.info(BasicOrderInfoAdapterMessages.WORKFLOW_SUCCESS.getMessage(), sessionId);
        return ResponseEntity.ok(sessionId);
        } catch (Exception e) {
            logger.error(BasicOrderInfoAdapterMessages.WORKFLOW_ERROR.getMessage(), e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Вибирає філію для замовлення.
     * Метод для сумісності з контроллером.
     */
    public ResponseEntity<Void> selectBranch(String sessionId, UUID branchId) {
        logger.info(BasicOrderInfoAdapterMessages.BRANCH_SELECT_REQUEST.getMessage(), branchId, sessionId);

        try {
            helper.ensureContextExists(sessionId);

            if (!helper.isValidBranchId(branchId)) {
                helper.logOperationWarning("selectBranch", sessionId, "Невалідний branchId");
                return ResponseEntity.badRequest().build();
            }

            boolean success = coordinationService.confirmBranchSelection(sessionId, branchId);
            if (success) {
                logger.info(BasicOrderInfoAdapterMessages.BRANCH_SELECT_SUCCESS.getMessage(), sessionId);
                return ResponseEntity.ok().build();
            } else {
                logger.warn(BasicOrderInfoAdapterMessages.BRANCH_SELECT_WARNING.getMessage(), sessionId);
                return ResponseEntity.badRequest().build();
            }
        } catch (Exception e) {
            logger.error(BasicOrderInfoAdapterMessages.BRANCH_SELECT_ERROR.getMessage(), sessionId, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Встановлює унікальну мітку.
     * Метод для сумісності з контроллером.
     */
    public ResponseEntity<Void> setUniqueTag(String sessionId, String uniqueTag) {
        logger.info(BasicOrderInfoAdapterMessages.TAG_SET_REQUEST.getMessage(), uniqueTag, sessionId);

        try {
            helper.ensureContextExists(sessionId);

            if (!helper.isValidUniqueTag(uniqueTag)) {
                logger.warn(BasicOrderInfoAdapterMessages.TAG_SET_WARNING.getMessage(), sessionId);
                return ResponseEntity.badRequest().build();
            }

            boolean success = coordinationService.confirmUniqueTag(sessionId, uniqueTag);
            if (success) {
                logger.info(BasicOrderInfoAdapterMessages.TAG_SET_SUCCESS.getMessage(), sessionId);
                return ResponseEntity.ok().build();
            } else {
                logger.warn(BasicOrderInfoAdapterMessages.TAG_SET_WARNING.getMessage(), sessionId);
                return ResponseEntity.badRequest().build();
            }
        } catch (Exception e) {
            logger.error(BasicOrderInfoAdapterMessages.TAG_SET_ERROR.getMessage(), sessionId, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Валідує дані базової інформації.
     * Метод для сумісності з контроллером.
     */
    public ResponseEntity<Boolean> validateData(String sessionId) {
        logger.info(BasicOrderInfoAdapterMessages.VALIDATE_REQUEST.getMessage(), sessionId);

        try {
            helper.ensureContextExists(sessionId);

            boolean isValid = coordinationService.isBasicOrderInfoValid(sessionId);
            if (isValid) {
                logger.info(BasicOrderInfoAdapterMessages.VALIDATE_SUCCESS.getMessage(), sessionId);
            } else {
                logger.warn(BasicOrderInfoAdapterMessages.VALIDATE_WARNING.getMessage(), sessionId);
            }
            return ResponseEntity.ok(isValid);
        } catch (Exception e) {
            logger.error(BasicOrderInfoAdapterMessages.VALIDATE_ERROR.getMessage(), sessionId, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Отримує поточні дані базової інформації.
     * Метод для сумісності з контроллером.
     */
    public ResponseEntity<BasicOrderInfoDTO> getCurrentData(String sessionId) {
        try {
            helper.ensureContextExists(sessionId);

            BasicOrderInfoDTO data = coordinationService.getCurrentData(sessionId);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            helper.logOperationError("getCurrentData", sessionId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Оновлює базову інформацію замовлення.
     * Метод для сумісності з контроллером.
     */
    public ResponseEntity<Void> updateBasicOrderInfo(String sessionId, BasicOrderInfoDTO basicOrderInfo) {
        logger.info(BasicOrderInfoAdapterMessages.UPDATE_REQUEST.getMessage(), sessionId);

        try {
            helper.ensureContextExists(sessionId);

            boolean success = coordinationService.updateBasicOrderInfo(sessionId, basicOrderInfo);
            if (success) {
                logger.info(BasicOrderInfoAdapterMessages.UPDATE_SUCCESS.getMessage(), sessionId);
                return ResponseEntity.ok().build();
            } else {
                logger.warn(BasicOrderInfoAdapterMessages.UPDATE_WARNING.getMessage(), sessionId);
                return ResponseEntity.badRequest().build();
            }
        } catch (Exception e) {
            logger.error(BasicOrderInfoAdapterMessages.UPDATE_ERROR.getMessage(), sessionId, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Завершує workflow базової інформації.
     * Метод для сумісності з контроллером.
     */
    public ResponseEntity<Void> completeWorkflow(String sessionId) {
        logger.info(BasicOrderInfoAdapterMessages.COMPLETE_REQUEST.getMessage(), sessionId);

        try {
            helper.ensureContextExists(sessionId);

            if (!helper.isReadyForCompletion(sessionId)) {
                logger.warn(BasicOrderInfoAdapterMessages.COMPLETE_WARNING.getMessage(), sessionId);
                return ResponseEntity.badRequest().build();
            }

            boolean success = coordinationService.completeWorkflow(sessionId);
            if (success) {
                logger.info(BasicOrderInfoAdapterMessages.COMPLETE_SUCCESS.getMessage(), sessionId);
                return ResponseEntity.ok().build();
            } else {
                logger.warn(BasicOrderInfoAdapterMessages.COMPLETE_WARNING.getMessage(), sessionId);
                return ResponseEntity.badRequest().build();
            }
        } catch (Exception e) {
            logger.error(BasicOrderInfoAdapterMessages.COMPLETE_ERROR.getMessage(), sessionId, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Скидає workflow базової інформації.
     * Метод для сумісності з контроллером.
     */
    public ResponseEntity<Void> resetWorkflow(String sessionId) {
        logger.info(BasicOrderInfoAdapterMessages.RESET_REQUEST.getMessage(), sessionId);

        try {
            helper.ensureContextExists(sessionId);

            boolean success = coordinationService.resetWorkflow(sessionId);
            if (success) {
                logger.info(BasicOrderInfoAdapterMessages.RESET_SUCCESS.getMessage(), sessionId);
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.badRequest().build();
            }
        } catch (Exception e) {
            logger.error(BasicOrderInfoAdapterMessages.RESET_ERROR.getMessage(), sessionId, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Скасовує workflow базової інформації.
     * Метод для сумісності з контроллером.
     */
    public ResponseEntity<Void> cancelWorkflow(String sessionId) {
        logger.info(BasicOrderInfoAdapterMessages.CANCEL_REQUEST.getMessage(), sessionId);

        try {
            helper.ensureContextExists(sessionId);

            boolean success = coordinationService.cancelWorkflow(sessionId);
            if (success) {
                logger.info(BasicOrderInfoAdapterMessages.CANCEL_SUCCESS.getMessage(), sessionId);
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.badRequest().build();
            }
        } catch (Exception e) {
            logger.error(BasicOrderInfoAdapterMessages.CANCEL_ERROR.getMessage(), sessionId, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Перевіряє чи завантажені філії.
     * Метод для сумісності з контроллером.
     */
    public ResponseEntity<Boolean> areBranchesLoaded(String sessionId) {
        logger.info(BasicOrderInfoAdapterMessages.BRANCHES_CHECK_REQUEST.getMessage(), sessionId);

        try {
            helper.ensureContextExists(sessionId);

            List<BranchLocationDTO> branches = coordinationService.getAllBranches();
            boolean loaded = branches != null && !branches.isEmpty();

            logger.info(BasicOrderInfoAdapterMessages.BRANCHES_CHECK_SUCCESS.getMessage(), sessionId, loaded);
            return ResponseEntity.ok(loaded);
        } catch (Exception e) {
            logger.error(BasicOrderInfoAdapterMessages.BRANCHES_CHECK_ERROR.getMessage(), sessionId, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Очищує помилки.
     * Метод для сумісності з контроллером.
     */
    public ResponseEntity<Void> clearErrors(String sessionId) {
        logger.info(BasicOrderInfoAdapterMessages.CLEAR_ERRORS_REQUEST.getMessage(), sessionId);

        try {
            helper.ensureContextExists(sessionId);

            boolean success = coordinationService.clearErrors(sessionId);
            if (success) {
                logger.info(BasicOrderInfoAdapterMessages.CLEAR_ERRORS_SUCCESS.getMessage(), sessionId);
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.badRequest().build();
            }
        } catch (Exception e) {
            logger.error(BasicOrderInfoAdapterMessages.CLEAR_ERRORS_ERROR.getMessage(), sessionId, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

        /**
     * Отримує доступні філії для сесії.
     * Метод для сумісності з контроллером.
     */
    public ResponseEntity<List<BranchLocationDTO>> getAvailableBranches(String sessionId) {
        logger.info("🔍 [BRANCHES] Запит на отримання доступних філій для sessionId: {}", sessionId);

        try {
            helper.ensureContextExists(sessionId);

            List<BranchLocationDTO> branches = coordinationService.getAllBranches();
            logger.info("✅ [BRANCHES] Успішно отримано {} філій для sessionId: {}",
                       branches.size(), sessionId);
            return ResponseEntity.ok(branches);
        } catch (Exception e) {
            logger.error("❌ [BRANCHES] Помилка при отриманні філій для sessionId: {}, error: {}",
                        sessionId, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }



    // === ІСНУЮЧІ МЕТОДИ (без змін) ===

    /**
     * Отримує поточний стан базової інформації замовлення.
     */
    @GetMapping("/session/{sessionId}/state")
    public ResponseEntity<BasicOrderInfoState> getBasicOrderInfoState(@PathVariable String sessionId) {
        try {
            helper.ensureContextExists(sessionId);
            BasicOrderInfoState state = coordinationService.getCurrentState(sessionId);
            return ResponseEntity.ok(state);
        } catch (Exception e) {
            helper.logOperationError("getBasicOrderInfoState", sessionId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Отримує поточні дані базової інформації замовлення.
     */
    @GetMapping("/session/{sessionId}/data")
    public ResponseEntity<BasicOrderInfoDTO> getBasicOrderInfoData(@PathVariable String sessionId) {
        try {
            helper.ensureContextExists(sessionId);
            BasicOrderInfoDTO data = coordinationService.getCurrentData(sessionId);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            helper.logOperationError("getBasicOrderInfoData", sessionId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Оновлює базову інформацію замовлення.
     */
    @PutMapping("/session/{sessionId}/data")
    public ResponseEntity<Void> updateBasicOrderInfoData(
            @PathVariable String sessionId,
            @RequestBody BasicOrderInfoDTO basicOrderInfo) {

        try {
            helper.ensureContextExists(sessionId);

            boolean success = coordinationService.updateBasicOrderInfo(sessionId, basicOrderInfo);
            if (success) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.badRequest().build();
            }
        } catch (Exception e) {
            helper.logOperationError("updateBasicOrderInfoData", sessionId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Генерує номер квитанції для філії.
     */
    @PostMapping("/session/{sessionId}/generate-receipt")
    public ResponseEntity<String> generateReceiptNumber(
            @PathVariable String sessionId,
            @RequestParam String branchCode) {

        logger.info(BasicOrderInfoAdapterMessages.RECEIPT_GENERATE_REQUEST.getMessage(), sessionId, branchCode);

        try {
            helper.ensureContextExists(sessionId);

        String receiptNumber = coordinationService.generateReceiptNumber(branchCode);
        if (receiptNumber != null) {
                logger.info(BasicOrderInfoAdapterMessages.RECEIPT_GENERATE_SUCCESS.getMessage(), receiptNumber, sessionId);
            return ResponseEntity.ok(receiptNumber);
            } else {
                logger.warn(BasicOrderInfoAdapterMessages.RECEIPT_GENERATE_WARNING.getMessage(), sessionId);
                return ResponseEntity.badRequest().build();
            }
        } catch (Exception e) {
            logger.error(BasicOrderInfoAdapterMessages.RECEIPT_GENERATE_ERROR.getMessage(), sessionId, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Підтверджує номер квитанції.
     */
    @PostMapping("/session/{sessionId}/confirm-receipt")
    public ResponseEntity<Void> confirmReceiptNumber(
            @PathVariable String sessionId,
            @RequestParam String receiptNumber) {

        try {
            helper.ensureContextExists(sessionId);

            boolean success = coordinationService.confirmReceiptGeneration(sessionId, receiptNumber);
            if (success) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.badRequest().build();
            }
        } catch (Exception e) {
            helper.logOperationError("confirmReceiptNumber", sessionId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Вибирає філію для замовлення.
     */
    @PostMapping("/session/{sessionId}/select-branch")
    public ResponseEntity<Void> selectBranchForOrder(
            @PathVariable String sessionId,
            @RequestParam UUID branchId) {

        try {
            helper.ensureContextExists(sessionId);

            boolean success = coordinationService.confirmBranchSelection(sessionId, branchId);
            if (success) {
                return ResponseEntity.ok().build();
            } else {
            return ResponseEntity.badRequest().build();
            }
        } catch (Exception e) {
            helper.logOperationError("selectBranchForOrder", sessionId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Встановлює унікальну мітку замовлення.
     */
    @PostMapping("/session/{sessionId}/set-unique-tag")
    public ResponseEntity<Void> setUniqueTagForOrder(
            @PathVariable String sessionId,
            @RequestParam String uniqueTag) {

        try {
            helper.ensureContextExists(sessionId);

            boolean success = coordinationService.confirmUniqueTag(sessionId, uniqueTag);
            if (success) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.badRequest().build();
            }
        } catch (Exception e) {
            helper.logOperationError("setUniqueTagForOrder", sessionId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Валідує базову інформацію замовлення.
     */
    @GetMapping("/session/{sessionId}/validate")
    public ResponseEntity<BasicOrderInfoValidationResult> validateBasicOrderInfo(@PathVariable String sessionId) {
        try {
            helper.ensureContextExists(sessionId);

            BasicOrderInfoDTO data = coordinationService.getCurrentData(sessionId);
            BasicOrderInfoValidationResult result = coordinationService.validateComplete(data);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            helper.logOperationError("validateBasicOrderInfo", sessionId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Перевіряє готовність до завершення.
     */
    @GetMapping("/session/{sessionId}/ready-for-completion")
    public ResponseEntity<Boolean> isReadyForCompletion(@PathVariable String sessionId) {
        try {
            helper.ensureContextExists(sessionId);

            boolean isReady = coordinationService.isReadyForCompletion(sessionId);
            return ResponseEntity.ok(isReady);
        } catch (Exception e) {
            helper.logOperationError("isReadyForCompletion", sessionId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Завершує базову інформацію замовлення.
     */
    @PostMapping("/session/{sessionId}/complete")
    public ResponseEntity<Void> completeBasicOrderInfo(@PathVariable String sessionId) {
        try {
            helper.ensureContextExists(sessionId);

            boolean success = coordinationService.completeWorkflow(sessionId);
            if (success) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.badRequest().build();
            }
        } catch (Exception e) {
            helper.logOperationError("completeBasicOrderInfo", sessionId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Скидає базову інформацію замовлення.
     */
    @PostMapping("/session/{sessionId}/reset")
    public ResponseEntity<Void> resetBasicOrderInfo(@PathVariable String sessionId) {
        try {
            helper.ensureContextExists(sessionId);

            boolean success = coordinationService.resetWorkflow(sessionId);
            if (success) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.badRequest().build();
            }
        } catch (Exception e) {
            helper.logOperationError("resetBasicOrderInfo", sessionId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Отримує всі доступні філії.
     */
    @GetMapping("/branches")
    public ResponseEntity<List<BranchLocationDTO>> getAllBranches() {
        logger.info("🔍 [BRANCHES] Запит на отримання всіх доступних філій");

        try {
            logger.info("🔍 [BRANCHES] Викликаємо coordinationService.getAllBranches()...");
            List<BranchLocationDTO> branches = coordinationService.getAllBranches();

            logger.info("✅ [BRANCHES] Успішно отримано {} філій", branches != null ? branches.size() : 0);

            if (branches != null && !branches.isEmpty()) {
                logger.info("📋 [BRANCHES] Перші 3 філії:");
                for (int i = 0; i < Math.min(3, branches.size()); i++) {
                    BranchLocationDTO branch = branches.get(i);
                    logger.info("  - {} (ID: {}, Code: {}, Active: {})",
                        branch.getName(), branch.getId(), branch.getCode(), branch.getActive());
                }
            } else {
                logger.warn("⚠️ [BRANCHES] Список філій порожній або null!");
            }

            return ResponseEntity.ok(branches);
        } catch (Exception e) {
            logger.error("❌ [BRANCHES] Помилка отримання філій: {}", e.getMessage(), e);
            logger.error("❌ [BRANCHES] Stack trace:", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Отримує філію за ID.
     */
    @GetMapping("/branches/{branchId}")
    public ResponseEntity<BranchLocationDTO> getBranchById(@PathVariable UUID branchId) {
        try {
            BranchLocationDTO branch = coordinationService.getBranchById(branchId);
            if (branch != null) {
                return ResponseEntity.ok(branch);
            } else {
            return ResponseEntity.notFound().build();
        }
        } catch (Exception e) {
            logger.error("❌ [BASIC-ORDER] Помилка отримання філії {}: {}", branchId, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Видаляє контекст базової інформації.
     */
    @DeleteMapping("/session/{sessionId}")
    public ResponseEntity<Void> deleteBasicOrderInfoContext(@PathVariable String sessionId) {
        try {
            coordinationService.removeContext(sessionId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            helper.logOperationError("deleteBasicOrderInfoContext", sessionId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
