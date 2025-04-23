package com.aksi.service.order;

import com.aksi.domain.client.entity.Client;
import com.aksi.domain.client.repository.ClientRepository;
import com.aksi.domain.order.entity.OrderDraft;
import com.aksi.domain.order.repository.OrderDraftRepository;
import com.aksi.dto.order.OrderDraftDto;
import com.aksi.dto.order.OrderDraftRequest;
import com.aksi.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Реалізація сервісу для роботи з чернетками замовлень.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class OrderDraftServiceImpl implements OrderDraftService {

    private final OrderDraftRepository orderDraftRepository;
    private final ClientRepository clientRepository;

    @Override
    @Transactional
    public OrderDraftDto createDraft(OrderDraftRequest request, String username) {
        log.info("Створення нової чернетки замовлення користувачем {}", username);
        
        Client client = null;
        if (request.getClientId() != null) {
            client = clientRepository.findById(request.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with id: " + request.getClientId()));
        }
        
        LocalDateTime now = LocalDateTime.now();
        
        OrderDraft draft = OrderDraft.builder()
            .client(client)
            .createdAt(now)
            .updatedAt(now)
            .draftData(request.getDraftData())
            .createdBy(username)
            .convertedToOrder(false)
            .draftName(request.getDraftName() != null ? request.getDraftName() : "Чернетка від " + now)
            .build();
        
        OrderDraft savedDraft = orderDraftRepository.save(draft);
        log.info("Чернетка замовлення збережена з id: {}", savedDraft.getId());
        
        return mapToDto(savedDraft);
    }

    @Override
    @Transactional
    public OrderDraftDto updateDraft(UUID id, OrderDraftRequest request, String username) {
        log.info("Оновлення чернетки замовлення з id: {} користувачем {}", id, username);
        
        OrderDraft draft = orderDraftRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Draft not found with id: " + id));
        
        // Перевірка прав доступу - тільки автор може редагувати чернетку
        if (!draft.getCreatedBy().equals(username)) {
            throw new AccessDeniedException("Ви не можете редагувати цю чернетку");
        }
        
        if (draft.isConvertedToOrder()) {
            throw new IllegalStateException("Неможливо редагувати чернетку, яка вже конвертована в замовлення");
        }
        
        // Оновлення даних
        if (request.getClientId() != null) {
            Client client = clientRepository.findById(request.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with id: " + request.getClientId()));
            draft.setClient(client);
        }
        
        draft.setDraftData(request.getDraftData());
        draft.setUpdatedAt(LocalDateTime.now());
        
        if (request.getDraftName() != null) {
            draft.setDraftName(request.getDraftName());
        }
        
        OrderDraft updatedDraft = orderDraftRepository.save(draft);
        log.info("Чернетка замовлення з id: {} оновлена", updatedDraft.getId());
        
        return mapToDto(updatedDraft);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderDraftDto getDraftById(UUID id) {
        log.info("Отримання чернетки замовлення за id: {}", id);
        
        OrderDraft draft = orderDraftRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Draft not found with id: " + id));
        
        return mapToDto(draft);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderDraftDto> getDraftsByClient(UUID clientId, Pageable pageable) {
        log.info("Отримання чернеток замовлень для клієнта з id: {}", clientId);
        
        Page<OrderDraft> drafts = orderDraftRepository.findByClient_IdAndConvertedToOrder(
            clientId, false, pageable);
        
        return drafts.map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderDraftDto> getDraftsByUser(String username, Pageable pageable) {
        log.info("Отримання чернеток замовлень, створених користувачем: {}", username);
        
        Page<OrderDraft> drafts = orderDraftRepository.findByCreatedByAndConvertedToOrder(
            username, false, pageable);
        
        return drafts.map(this::mapToDto);
    }

    @Override
    @Transactional
    public void deleteDraft(UUID id) {
        log.info("Видалення чернетки замовлення з id: {}", id);
        
        OrderDraft draft = orderDraftRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Draft not found with id: " + id));
        
        orderDraftRepository.delete(draft);
        log.info("Чернетка замовлення з id: {} видалена", id);
    }

    @Override
    @Transactional
    public OrderDraftDto markAsConverted(UUID draftId, UUID orderId) {
        log.info("Позначення чернетки замовлення з id: {} як конвертованої в замовлення з id: {}", draftId, orderId);
        
        OrderDraft draft = orderDraftRepository.findById(draftId)
            .orElseThrow(() -> new ResourceNotFoundException("Draft not found with id: " + draftId));
        
        draft.setConvertedToOrder(true);
        draft.setOrderId(orderId);
        draft.setUpdatedAt(LocalDateTime.now());
        
        OrderDraft updatedDraft = orderDraftRepository.save(draft);
        log.info("Чернетка замовлення з id: {} позначена як конвертована", updatedDraft.getId());
        
        return mapToDto(updatedDraft);
    }
    
    /**
     * Мапінг сутності в DTO.
     *
     * @param draft сутність чернетки
     * @return DTO чернетки
     */
    private OrderDraftDto mapToDto(OrderDraft draft) {
        return OrderDraftDto.builder()
            .id(draft.getId())
            .clientId(draft.getClient() != null ? draft.getClient().getId() : null)
            .clientName(draft.getClient() != null ? draft.getClient().getFullName() : null)
            .createdAt(draft.getCreatedAt())
            .updatedAt(draft.getUpdatedAt())
            .draftData(draft.getDraftData())
            .createdBy(draft.getCreatedBy())
            .convertedToOrder(draft.isConvertedToOrder())
            .orderId(draft.getOrderId())
            .draftName(draft.getDraftName())
            .build();
    }
}
