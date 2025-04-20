package com.aksi.service.client;

import com.aksi.domain.client.entity.Client;
import com.aksi.domain.client.repository.ClientRepository;
import com.aksi.dto.client.*;
import com.aksi.exception.EntityNotFoundException;
import com.aksi.mapper.ClientMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Реалізація сервісу для роботи з клієнтами
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ClientServiceImpl implements ClientService {
    
    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;
    
    @Override
    public Page<ClientResponse> searchClients(ClientSearchRequest request) {
        log.debug("Пошук клієнтів за параметрами: {}", request);
        
        // Створюємо параметри сортування
        Sort sort = "asc".equalsIgnoreCase(request.getSortDirection()) ? 
                Sort.by(request.getSortBy()).ascending() : 
                Sort.by(request.getSortBy()).descending();
        
        // Створюємо параметри пагінації
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize(), sort);
        
        // Виконуємо пошук
        String keyword = request.getSearch() != null ? request.getSearch() : "";
        Page<Client> clientsPage = clientRepository.findByKeyword(keyword, pageable);
        
        // Перетворюємо результати в DTO
        return clientsPage.map(clientMapper::toResponse);
    }
    
    @Override
    public ClientResponse getClientById(UUID id) {
        log.debug("Отримання клієнта за ID: {}", id);
        
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Клієнта з ID " + id + " не знайдено"));
        
        return clientMapper.toResponse(client);
    }
    
    @Override
    @Transactional
    public ClientResponse createClient(ClientCreateRequest request) {
        log.debug("Створення нового клієнта: {} {}", request.getFirstName(), request.getLastName());
        
        // Перевіряємо, чи не існує клієнт з таким телефоном
        if (clientRepository.existsByPhone(request.getPhone())) {
            throw new IllegalArgumentException("Клієнт з телефоном " + request.getPhone() + " вже існує");
        }
        
        // Перевіряємо, чи не існує клієнт з таким email (якщо він вказаний)
        if (request.getEmail() != null && !request.getEmail().isEmpty() && 
                clientRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Клієнт з email " + request.getEmail() + " вже існує");
        }
        
        // Створюємо нового клієнта
        Client client = clientMapper.toEntity(request);
        
        // Встановлюємо початкові значення
        client.setOrderCount(0);
        client.setTotalSpent(new java.math.BigDecimal("0.00"));
        
        // Зберігаємо клієнта
        Client savedClient = clientRepository.save(client);
        
        log.info("Створено нового клієнта з ID: {}", savedClient.getId());
        
        return clientMapper.toResponse(savedClient);
    }
    
    @Override
    @Transactional
    public ClientResponse updateClient(UUID id, ClientUpdateRequest request) {
        log.debug("Оновлення клієнта з ID: {}", id);
        
        // Знаходимо клієнта
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Клієнта з ID " + id + " не знайдено"));
        
        // Перевіряємо унікальність телефону, якщо він змінюється
        if (request.getPhone() != null && !request.getPhone().equals(client.getPhone()) && 
                clientRepository.existsByPhone(request.getPhone())) {
            throw new IllegalArgumentException("Клієнт з телефоном " + request.getPhone() + " вже існує");
        }
        
        // Перевіряємо унікальність email, якщо він змінюється
        if (request.getEmail() != null && !request.getEmail().isEmpty() && 
                !request.getEmail().equals(client.getEmail()) && 
                clientRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Клієнт з email " + request.getEmail() + " вже існує");
        }
        
        // Оновлюємо клієнта
        clientMapper.updateFromRequest(request, client);
        
        // Зберігаємо змінений клієнт
        Client updatedClient = clientRepository.save(client);
        
        log.info("Оновлено клієнта з ID: {}", updatedClient.getId());
        
        return clientMapper.toResponse(updatedClient);
    }
    
    @Override
    @Transactional
    public void deleteClient(UUID id) {
        log.debug("Видалення клієнта з ID: {}", id);
        
        // Перевіряємо існування клієнта
        if (!clientRepository.existsById(id)) {
            throw new EntityNotFoundException("Клієнта з ID " + id + " не знайдено");
        }
        
        // Видаляємо клієнта
        clientRepository.deleteById(id);
        
        log.info("Видалено клієнта з ID: {}", id);
    }
    
    @Override
    public List<ClientResponse> getTopLoyalClients(int limit) {
        log.debug("Отримання {} найбільш лояльних клієнтів", limit);
        
        Pageable pageable = PageRequest.of(0, limit);
        List<Client> topClients = clientRepository.findTopLoyalClients(pageable);
        
        return clientMapper.toResponseList(topClients);
    }
    
    @Override
    public List<ClientResponse> getTopSpendingClients(int limit) {
        log.debug("Отримання {} клієнтів з найбільшою сумою замовлень", limit);
        
        Pageable pageable = PageRequest.of(0, limit);
        List<Client> topClients = clientRepository.findTopSpendingClients(pageable);
        
        return clientMapper.toResponseList(topClients);
    }
} 