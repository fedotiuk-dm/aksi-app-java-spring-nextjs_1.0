package com.aksi.domain.order.repository;

import com.aksi.domain.order.entity.ReceptionPoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Репозиторій для роботи з пунктами прийому замовлень
 */
@Repository
public interface ReceptionPointRepository extends JpaRepository<ReceptionPoint, UUID> {
    
    /**
     * Знайти всі активні пункти прийому
     * @return список активних пунктів прийому
     */
    List<ReceptionPoint> findByActiveTrue();
    
    /**
     * Знайти пункт прийому за назвою
     * @param name назва пункту прийому
     * @return пункт прийому з даною назвою
     */
    ReceptionPoint findByName(String name);
}
