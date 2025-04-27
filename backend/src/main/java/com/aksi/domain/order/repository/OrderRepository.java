package com.aksi.domain.order.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.order.entity.OrderEntity;
import com.aksi.domain.order.model.OrderStatusEnum;

/**
 * Репозиторій для роботи з замовленнями.
 */
@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, UUID> {
    
    /**
     * Знайти замовлення за статусами для активних замовлень (не чернеток).
     * @param statuses параметр statuses
     * @return список замовлень з вказаними статусами
     */
    List<OrderEntity> findByStatusInAndDraftFalse(List<OrderStatusEnum> statuses);
    
    /**
     * Знайти всі чернетки замовлень.
     * @return список всіх чернеток замовлень
     */
    List<OrderEntity> findByDraftTrue();
    
    /**
     * Знайти максимальний лічильник в номері квитанції за певним префіксом.
     * Наприклад, для номерів формату "202404-KYV-00001", "202404-KYV-00002" тощо,
     * при префіксі "202404-KYV-" метод поверне максимальний лічильник - 2.
     * 
     * @param prefix префікс номера квитанції
     * @return максимальний номер лічильника або null, якщо немає замовлень з таким префіксом
     */
    @Query("SELECT MAX(CAST(SUBSTRING(o.receiptNumber, LENGTH(:prefix) + 1) AS integer)) " +
           "FROM OrderEntity o WHERE o.receiptNumber LIKE :prefix || '%'")
    Integer findMaxCounterByReceiptNumberPrefix(@Param("prefix") String prefix);
    
    /**
     * Знайти замовлення за номером квитанції.
     * @param receiptNumber параметр receiptNumber
     * @return замовлення з вказаним номером квитанції або null
     */
    OrderEntity findByReceiptNumber(String receiptNumber);
    
    /**
     * Знайти замовлення за ID клієнта.
     * @param clientId ідентифікатор
     * @return список всіх замовлень клієнта
     */
    List<OrderEntity> findByClientId(UUID clientId);
    
    /**
     * Знайти замовлення за ID клієнта і статусом.
     * @param clientId ідентифікатор
     * @param status параметр status
     * @return список замовлень клієнта з вказаним статусом
     */
    List<OrderEntity> findByClientIdAndStatus(UUID clientId, OrderStatusEnum status);
}
