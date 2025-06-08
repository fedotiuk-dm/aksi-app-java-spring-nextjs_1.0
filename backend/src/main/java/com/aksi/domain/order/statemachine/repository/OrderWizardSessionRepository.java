package com.aksi.domain.order.statemachine.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.entity.OrderWizardSessionEntity;

/**
 * Repository для роботи з Order Wizard сесіями
 */
@Repository
public interface OrderWizardSessionRepository extends JpaRepository<OrderWizardSessionEntity, UUID> {

    /**
     * Знайти активну сесію за wizardId
     */
    Optional<OrderWizardSessionEntity> findByWizardIdAndIsActiveTrue(String wizardId);

    /**
     * Знайти всі активні сесії користувача
     */
    List<OrderWizardSessionEntity> findByUserIdAndIsActiveTrueOrderByCreatedAtDesc(UUID userId);

    /**
     * Знайти сесії що закінчилися
     */
    @Query("SELECT s FROM OrderWizardSessionEntity s WHERE s.expiresAt < :now AND s.isActive = true")
    List<OrderWizardSessionEntity> findExpiredActiveSessions(@Param("now") LocalDateTime now);

    /**
     * Деактивувати закінчені сесії
     */
    @Modifying
    @Query("UPDATE OrderWizardSessionEntity s SET s.isActive = false, s.updatedAt = :now " +
           "WHERE s.expiresAt < :now AND s.isActive = true")
    int deactivateExpiredSessions(@Param("now") LocalDateTime now);

    /**
     * Знайти сесії за станом
     */
    List<OrderWizardSessionEntity> findByCurrentStateAndIsActiveTrue(OrderState currentState);

    /**
     * Порахувати активні сесії користувача
     */
    int countByUserIdAndIsActiveTrue(UUID userId);

    /**
     * Знайти сесії за клієнтом
     */
    List<OrderWizardSessionEntity> findByClientIdAndIsActiveTrueOrderByCreatedAtDesc(UUID clientId);

    /**
     * Знайти сесії за філією
     */
    List<OrderWizardSessionEntity> findByBranchIdAndIsActiveTrueOrderByCreatedAtDesc(UUID branchId);

    /**
     * Знайти сесію за номером квитанції
     */
    Optional<OrderWizardSessionEntity> findByReceiptNumberAndIsActiveTrue(String receiptNumber);

    /**
     * Видалити старі неактивні сесії
     */
    @Modifying
    @Query("DELETE FROM OrderWizardSessionEntity s WHERE s.isActive = false AND s.updatedAt < :cutoffDate")
    int deleteOldInactiveSessions(@Param("cutoffDate") LocalDateTime cutoffDate);

    /**
     * Статистика сесій за період
     */
    @Query("SELECT s.currentState, COUNT(s) FROM OrderWizardSessionEntity s " +
           "WHERE s.createdAt BETWEEN :startDate AND :endDate " +
           "GROUP BY s.currentState")
    List<Object[]> getSessionStatsByPeriod(@Param("startDate") LocalDateTime startDate,
                                           @Param("endDate") LocalDateTime endDate);
}
