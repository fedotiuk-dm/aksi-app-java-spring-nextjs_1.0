package com.aksi.service.order;

import com.aksi.domain.order.entity.ReceptionPoint;
import com.aksi.domain.order.repository.ReceptionPointRepository;
import com.aksi.dto.order.ReceptionPointDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Сервіс для роботи з пунктами прийому замовлень
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ReceptionPointService {
    
    private final ReceptionPointRepository receptionPointRepository;
    
    /**
     * Отримати всі активні пункти прийому
     * @return список DTO активних пунктів прийому
     */
    @Transactional(readOnly = true)
    public List<ReceptionPointDTO> getActiveReceptionPoints() {
        log.info("Отримання списку активних пунктів прийому");
        return receptionPointRepository.findByActiveTrue().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Отримати всі пункти прийому
     * @return список DTO всіх пунктів прийому
     */
    @Transactional(readOnly = true)
    public List<ReceptionPointDTO> getAllReceptionPoints() {
        log.info("Отримання списку всіх пунктів прийому");
        return receptionPointRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Отримати пункт прийому за ідентифікатором
     * @param id ідентифікатор пункту прийому
     * @return DTO пункту прийому
     */
    @Transactional(readOnly = true)
    public ReceptionPointDTO getReceptionPointById(UUID id) {
        log.info("Отримання пункту прийому за ідентифікатором: {}", id);
        return receptionPointRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Пункт прийому не знайдено"));
    }
    
    /**
     * Створити новий пункт прийому
     * @param dto DTO пункту прийому
     * @return DTO створеного пункту прийому
     */
    @Transactional
    public ReceptionPointDTO createReceptionPoint(ReceptionPointDTO dto) {
        log.info("Створення нового пункту прийому: {}", dto.getName());
        
        ReceptionPoint entity = ReceptionPoint.builder()
                .name(dto.getName())
                .address(dto.getAddress())
                .phone(dto.getPhone())
                .active(dto.getActive() != null && dto.getActive())
                .build();
        
        ReceptionPoint saved = receptionPointRepository.save(entity);
        return mapToDTO(saved);
    }
    
    /**
     * Оновити існуючий пункт прийому
     * @param id ідентифікатор пункту прийому
     * @param dto DTO пункту прийому
     * @return DTO оновленого пункту прийому
     */
    @Transactional
    public ReceptionPointDTO updateReceptionPoint(UUID id, ReceptionPointDTO dto) {
        log.info("Оновлення пункту прийому з ідентифікатором: {}", id);
        
        ReceptionPoint entity = receptionPointRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Пункт прийому не знайдено"));
        
        entity.setName(dto.getName());
        entity.setAddress(dto.getAddress());
        entity.setPhone(dto.getPhone());
        entity.setActive(dto.getActive());
        
        ReceptionPoint saved = receptionPointRepository.save(entity);
        return mapToDTO(saved);
    }
    
    /**
     * Змінити статус активності пункту прийому
     * @param id ідентифікатор пункту прийому
     * @param active новий статус активності
     * @return DTO оновленого пункту прийому
     */
    @Transactional
    public ReceptionPointDTO setReceptionPointStatus(UUID id, boolean active) {
        log.info("Зміна статусу активності пункту прийому з ідентифікатором: {} на {}", id, active);
        
        ReceptionPoint entity = receptionPointRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Пункт прийому не знайдено"));
        
        entity.setActive(active);
        
        ReceptionPoint saved = receptionPointRepository.save(entity);
        return mapToDTO(saved);
    }
    
    /**
     * Конвертувати сутність в DTO
     * @param entity сутність пункту прийому
     * @return DTO пункту прийому
     */
    private ReceptionPointDTO mapToDTO(ReceptionPoint entity) {
        return ReceptionPointDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .address(entity.getAddress())
                .phone(entity.getPhone())
                .active(entity.getActive())
                .build();
    }
}
