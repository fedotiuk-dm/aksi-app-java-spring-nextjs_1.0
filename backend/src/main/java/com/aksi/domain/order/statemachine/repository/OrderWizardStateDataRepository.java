package com.aksi.domain.order.statemachine.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.order.statemachine.entity.OrderWizardStateDataEntity;

/**
 * Repository для роботи з даними стану Order Wizard
 */
@Repository
public interface OrderWizardStateDataRepository extends JpaRepository<OrderWizardStateDataEntity, UUID> {

    /**
     * Знайти дані за сесією та ключем
     */
    Optional<OrderWizardStateDataEntity> findByWizardSessionIdAndDataKey(UUID wizardSessionId, String dataKey);

    /**
     * Знайти всі дані для сесії
     */
    List<OrderWizardStateDataEntity> findByWizardSessionIdOrderByStageAscStepAsc(UUID wizardSessionId);

    /**
     * Знайти дані за етапом та кроком
     */
    List<OrderWizardStateDataEntity> findByWizardSessionIdAndStageAndStep(UUID wizardSessionId,
                                                                           Integer stage,
                                                                           Integer step);

    /**
     * Знайти всі дані етапу
     */
    List<OrderWizardStateDataEntity> findByWizardSessionIdAndStageOrderByStepAsc(UUID wizardSessionId,
                                                                                  Integer stage);

    /**
     * Знайти невалідні дані
     */
    List<OrderWizardStateDataEntity> findByWizardSessionIdAndIsValidatedFalse(UUID wizardSessionId);

    /**
     * Перевірити чи всі дані етапу валідні
     */
    @Query("SELECT COUNT(d) = 0 FROM OrderWizardStateDataEntity d " +
           "WHERE d.wizardSession.id = :wizardSessionId " +
           "AND d.stage = :stage " +
           "AND d.isValidated = false")
    boolean isStageDataValid(@Param("wizardSessionId") UUID wizardSessionId, @Param("stage") Integer stage);

    /**
     * Отримати валідні дані за ключем
     */
    @Query("SELECT d FROM OrderWizardStateDataEntity d " +
           "WHERE d.wizardSession.id = :wizardSessionId " +
           "AND d.dataKey = :dataKey " +
           "AND d.isValidated = true")
    Optional<OrderWizardStateDataEntity> findValidDataByKey(@Param("wizardSessionId") UUID wizardSessionId,
                                                             @Param("dataKey") String dataKey);

    /**
     * Видалити всі дані сесії
     */
    void deleteByWizardSessionId(UUID wizardSessionId);

    /**
     * Видалити дані етапу
     */
    void deleteByWizardSessionIdAndStage(UUID wizardSessionId, Integer stage);

    /**
     * Порахувати кількість записів для сесії
     */
    int countByWizardSessionId(UUID wizardSessionId);

    /**
     * Знайти дані за типом
     */
    List<OrderWizardStateDataEntity> findByWizardSessionIdAndDataType(UUID wizardSessionId,
                                                                       OrderWizardStateDataEntity.DataType dataType);
}
